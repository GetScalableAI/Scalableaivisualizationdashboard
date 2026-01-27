// Widget configuration types for customizable widgets

export interface WidgetConfig {
  id: string;
  widgetType: string;

  // Custom display settings
  title?: string;
  subtitle?: string;

  // Thresholds for visual indicators
  thresholds?: ThresholdConfig;

  // Display options
  displayOptions?: DisplayOptions;

  // Data source configuration
  dataSource?: DataSourceConfig;

  // Alert settings
  alerts?: AlertConfig;
}

export interface ThresholdConfig {
  warning?: number;
  critical?: number;
  target?: number;

  // For percentage-based metrics
  warningPercentage?: number;
  criticalPercentage?: number;
  targetPercentage?: number;

  // Comparison direction
  direction?: 'higher-is-better' | 'lower-is-better';
}

export interface DisplayOptions {
  // Chart display options
  showTrend?: boolean;
  showSparkline?: boolean;
  showLegend?: boolean;
  showGrid?: boolean;

  // Color scheme
  colorScheme?: 'default' | 'traffic' | 'monochrome' | 'custom';
  customColors?: {
    primary?: string;
    secondary?: string;
    success?: string;
    warning?: string;
    error?: string;
  };

  // Number formatting
  decimalPlaces?: number;
  showPercentage?: boolean;
  compactNumbers?: boolean;

  // Size and layout
  compactMode?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;

  // Animation
  animationsEnabled?: boolean;
}

export interface DataSourceConfig {
  // Metric selection
  metric?: string;
  secondaryMetric?: string;

  // Aggregation
  aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'latest';

  // Time range
  timeRange?: 'hour' | 'shift' | 'day' | 'week' | 'month' | 'custom';
  customTimeRange?: {
    start: string;
    end: string;
  };

  // Filtering
  machineFilter?: string[];
  productLineFilter?: string;
  shiftFilter?: string;

  // Comparison
  compareWith?: 'previous-period' | 'target' | 'baseline' | 'none';

  // Real-time updates
  refreshInterval?: number; // in seconds, 0 = manual refresh only
}

export interface AlertConfig {
  enabled: boolean;
  conditions: AlertCondition[];
  notificationMethod?: 'toast' | 'sound' | 'both' | 'none';
}

export interface AlertCondition {
  id: string;
  field: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'ne';
  value: number;
  severity: 'info' | 'warning' | 'critical';
  message?: string;
}

// Default configurations for each widget type
export const DEFAULT_WIDGET_CONFIGS: Record<string, Partial<WidgetConfig>> = {
  'production-target': {
    thresholds: {
      warning: 85,
      critical: 70,
      target: 100,
      direction: 'higher-is-better',
    },
    displayOptions: {
      showTrend: true,
      showSparkline: true,
      decimalPlaces: 0,
      colorScheme: 'default',
    },
    dataSource: {
      metric: 'production_count',
      aggregation: 'sum',
      timeRange: 'day',
      compareWith: 'target',
    },
  },
  'oee': {
    thresholds: {
      warning: 75,
      critical: 60,
      target: 85,
      direction: 'higher-is-better',
    },
    displayOptions: {
      showTrend: true,
      decimalPlaces: 1,
      showPercentage: true,
      colorScheme: 'default',
    },
    dataSource: {
      metric: 'oee',
      aggregation: 'avg',
      timeRange: 'day',
    },
  },
  'scrap-rate': {
    thresholds: {
      warning: 3,
      critical: 5,
      target: 2,
      direction: 'lower-is-better',
    },
    displayOptions: {
      showTrend: true,
      decimalPlaces: 1,
      showPercentage: true,
      colorScheme: 'default',
    },
    dataSource: {
      metric: 'scrap_rate',
      aggregation: 'avg',
      timeRange: 'day',
    },
  },
  'uptime': {
    thresholds: {
      warning: 90,
      critical: 80,
      target: 95,
      direction: 'higher-is-better',
    },
    displayOptions: {
      showTrend: true,
      decimalPlaces: 1,
      showPercentage: true,
      colorScheme: 'default',
    },
    dataSource: {
      metric: 'uptime_percentage',
      aggregation: 'avg',
      timeRange: 'day',
    },
  },
  'production-trend': {
    displayOptions: {
      showTrend: true,
      showGrid: true,
      showLegend: true,
      colorScheme: 'default',
    },
    dataSource: {
      metric: 'production_count',
      aggregation: 'sum',
      timeRange: 'week',
    },
  },
  'quality-metrics': {
    thresholds: {
      warning: 95,
      critical: 90,
      target: 99,
      direction: 'higher-is-better',
    },
    displayOptions: {
      showTrend: true,
      decimalPlaces: 2,
      showPercentage: true,
    },
    dataSource: {
      metric: 'quality_rate',
      aggregation: 'avg',
      timeRange: 'day',
    },
  },
  'quick-insights': {
    displayOptions: {
      compactMode: false,
      animationsEnabled: true,
    },
    dataSource: {
      refreshInterval: 300, // 5 minutes
    },
  },
};

// Helper function to merge default config with custom config
export function mergeWidgetConfig(
  widgetType: string,
  customConfig?: Partial<WidgetConfig>
): WidgetConfig {
  const defaultConfig = DEFAULT_WIDGET_CONFIGS[widgetType] || {};

  return {
    id: customConfig?.id || `${widgetType}-${Date.now()}`,
    widgetType,
    ...defaultConfig,
    ...customConfig,
    thresholds: {
      ...defaultConfig.thresholds,
      ...customConfig?.thresholds,
    },
    displayOptions: {
      ...defaultConfig.displayOptions,
      ...customConfig?.displayOptions,
    },
    dataSource: {
      ...defaultConfig.dataSource,
      ...customConfig?.dataSource,
    },
  } as WidgetConfig;
}

// Validate widget configuration
export function validateWidgetConfig(config: WidgetConfig): string[] {
  const errors: string[] = [];

  if (!config.id) {
    errors.push('Widget config must have an id');
  }

  if (!config.widgetType) {
    errors.push('Widget config must have a widgetType');
  }

  if (config.thresholds) {
    const { warning, critical, target, direction } = config.thresholds;

    if (direction === 'higher-is-better') {
      if (warning !== undefined && critical !== undefined && warning < critical) {
        errors.push('For higher-is-better metrics, warning threshold should be >= critical');
      }
    } else if (direction === 'lower-is-better') {
      if (warning !== undefined && critical !== undefined && warning > critical) {
        errors.push('For lower-is-better metrics, warning threshold should be <= critical');
      }
    }
  }

  if (config.dataSource?.refreshInterval !== undefined) {
    if (config.dataSource.refreshInterval < 0) {
      errors.push('Refresh interval must be non-negative');
    }
  }

  return errors;
}
