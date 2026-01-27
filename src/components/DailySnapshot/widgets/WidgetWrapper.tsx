// WidgetWrapper - HOC providing config context and safe drill-down to widgets
import { ReactNode, createContext, useContext } from 'react';
import { WidgetConfig, mergeWidgetConfig } from '../types/widgetConfig';

interface WidgetContextType {
  config: WidgetConfig;
  widgetId: string;
  isConfigurable: boolean;
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

interface WidgetWrapperProps {
  widgetId: string;
  widgetType: string;
  config?: Partial<WidgetConfig>;
  isConfigurable?: boolean;
  children: ReactNode;
}

export function WidgetWrapper({
  widgetId,
  widgetType,
  config,
  isConfigurable = true,
  children,
}: WidgetWrapperProps) {
  // Merge default config with custom config
  const mergedConfig = mergeWidgetConfig(widgetType, {
    ...config,
    id: widgetId,
  });

  return (
    <WidgetContext.Provider
      value={{
        config: mergedConfig,
        widgetId,
        isConfigurable,
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
}

// Hook to access widget config from within a widget
export function useWidgetConfig(): WidgetContextType {
  const context = useContext(WidgetContext);
  if (context === undefined) {
    // Return default config if used outside wrapper
    return {
      config: {
        id: 'default',
        widgetType: 'default',
      },
      widgetId: 'default',
      isConfigurable: false,
    };
  }
  return context;
}

// Safe hook that returns undefined if outside context
export function useWidgetConfigSafe(): WidgetContextType | undefined {
  return useContext(WidgetContext);
}

// Helper to get threshold status based on value and config
export function getThresholdStatus(
  value: number,
  config?: WidgetConfig
): 'normal' | 'warning' | 'critical' | 'success' {
  if (!config?.thresholds) return 'normal';

  const { warning, critical, target, direction } = config.thresholds;

  if (direction === 'higher-is-better') {
    // Higher values are better (e.g., OEE, uptime)
    if (critical !== undefined && value < critical) return 'critical';
    if (warning !== undefined && value < warning) return 'warning';
    if (target !== undefined && value >= target) return 'success';
    return 'normal';
  } else {
    // Lower values are better (e.g., scrap rate)
    if (critical !== undefined && value > critical) return 'critical';
    if (warning !== undefined && value > warning) return 'warning';
    if (target !== undefined && value <= target) return 'success';
    return 'normal';
  }
}

// Helper to format value based on display options
export function formatValue(
  value: number,
  config?: WidgetConfig
): string {
  if (!config?.displayOptions) return value.toString();

  const { decimalPlaces, showPercentage, compactNumbers } = config.displayOptions;

  let formatted = value;

  if (decimalPlaces !== undefined) {
    formatted = Number(formatted.toFixed(decimalPlaces));
  }

  if (compactNumbers && formatted >= 1000) {
    if (formatted >= 1000000) {
      return `${(formatted / 1000000).toFixed(1)}M${showPercentage ? '%' : ''}`;
    }
    return `${(formatted / 1000).toFixed(1)}K${showPercentage ? '%' : ''}`;
  }

  return `${formatted.toLocaleString()}${showPercentage ? '%' : ''}`;
}

// Helper to get color based on threshold status
export function getStatusColor(
  status: 'normal' | 'warning' | 'critical' | 'success',
  config?: WidgetConfig
): string {
  const customColors = config?.displayOptions?.customColors;

  switch (status) {
    case 'critical':
      return customColors?.error || '#EF4444';
    case 'warning':
      return customColors?.warning || '#F59E0B';
    case 'success':
      return customColors?.success || '#10B981';
    default:
      return customColors?.primary || '#3B82F6';
  }
}

export default WidgetWrapper;
