import GridLayout from 'react-grid-layout';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, X, Maximize2, Minimize2, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import './DashboardLayout.css';
import { WidgetConfig } from './types/widgetConfig';
import WidgetConfigDialog from './widgets/WidgetConfigDialog';

// Import all widgets
import ProductionWidget from './widgets/ProductionWidget';
import OEEWidget from './widgets/OEEWidget';
import ScrapRateWidget from './widgets/ScrapRateWidget';
import UptimeWidget from './widgets/UptimeWidget';
import ProductionTrendWidget from './widgets/ProductionTrendWidget';
import ScheduleAnalysisWidget from './widgets/ScheduleAnalysisWidget';
import QualityMetricsWidget from './widgets/QualityMetricsWidget';
import SalesWidget from './widgets/SalesWidget';
import QuickInsightsWidget from './widgets/QuickInsightsWidget';
import UtilizationWidget from './widgets/UtilizationWidget';
import MachinePerformanceWidget from './widgets/MachinePerformanceWidget';
import PerMachineMetricsWidget from './widgets/PerMachineMetricsWidget';
import EnvironmentalDataWidget from './widgets/EnvironmentalDataWidget';
import GHGEmissionsWidget from './widgets/GHGEmissionsWidget';
import DebtToEquityWidget from './widgets/DebtToEquityWidget';
import CustomMetricWidget from './widgets/CustomMetricWidget';

// @ts-ignore - react-grid-layout types issue
const ResponsiveGridLayout = GridLayout.Responsive || GridLayout;

interface DashboardLayoutProps {
  layouts: any;
  activeWidgets: string[];
  isEditMode: boolean;
  onLayoutChange: (layout: any, layouts: any) => void;
  onRemoveWidget: (widgetId: string) => void;
  onOpenChat: () => void;
  widgetConfigs?: Record<string, WidgetConfig>;
  onWidgetConfigChange?: (widgetId: string, config: WidgetConfig) => void;
}

// Widget component mapping
const WIDGET_COMPONENTS: { [key: string]: React.ComponentType<any> } = {
  'production-target': ProductionWidget,
  'oee': OEEWidget,
  'scrap-rate': ScrapRateWidget,
  'uptime': UptimeWidget,
  'production-trend': ProductionTrendWidget,
  'schedule-analysis': ScheduleAnalysisWidget,
  'quality-metrics': QualityMetricsWidget,
  'sales-performance': SalesWidget,
  'quick-insights': QuickInsightsWidget,
  'utilization': UtilizationWidget,
  'machine-performance': MachinePerformanceWidget,
  'per-machine-metrics': PerMachineMetricsWidget,
  'environmental-data': EnvironmentalDataWidget,
  'ghg-emissions': GHGEmissionsWidget,
  'debt-to-equity': DebtToEquityWidget,
  'custom-metric': CustomMetricWidget,
};

export default function DashboardLayout({
  layouts,
  activeWidgets,
  isEditMode,
  onLayoutChange,
  onRemoveWidget,
  onOpenChat,
  widgetConfigs = {},
  onWidgetConfigChange,
}: DashboardLayoutProps) {
  const [fullscreenWidget, setFullscreenWidget] = useState<string | null>(null);
  const [configDialogWidget, setConfigDialogWidget] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const renderWidget = (widgetId: string) => {
    const WidgetComponent = WIDGET_COMPONENTS[widgetId];
    if (!WidgetComponent) return null;

    const widgetProps: any = {
      config: widgetConfigs[widgetId],
    };
    if (widgetId === 'quick-insights' || widgetId === 'production-trend' || widgetId === 'schedule-analysis') {
      widgetProps.onOpenChat = onOpenChat;
    }

    return <WidgetComponent {...widgetProps} />;
  };

  const handleConfigSave = (config: WidgetConfig) => {
    if (configDialogWidget && onWidgetConfigChange) {
      onWidgetConfigChange(configDialogWidget, config);
    }
    setConfigDialogWidget(null);
  };

  // Use the layout for large screens
  const layout = layouts.lg || [];

  return (
    <>
      <div ref={containerRef} style={{ width: '100%' }}>
        <GridLayout
          className="layout"
          layout={layout}
          onLayoutChange={(newLayout) => onLayoutChange(newLayout, { lg: newLayout })}
          cols={12}
          rowHeight={80}
          width={containerWidth}
          isDraggable={isEditMode}
          isResizable={isEditMode}
          margin={[16, 16]}
          containerPadding={[0, 0]}
          useCSSTransforms={true}
          draggableHandle=".drag-handle"
        >
        {activeWidgets.map((widgetId) => (
          <div
            key={widgetId}
            className={`widget-container ${isEditMode ? 'edit-mode' : ''}`}
          >
            <AnimatePresence>
              {isEditMode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="widget-toolbar"
                >
                  <div className="drag-handle">
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                  </div>
                  <div className="widget-actions">
                    <button
                      onClick={() => setConfigDialogWidget(widgetId)}
                      className="widget-action-btn"
                      title="Configure"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setFullscreenWidget(widgetId)}
                      className="widget-action-btn"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveWidget(widgetId)}
                      className="widget-action-btn widget-action-remove"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="widget-content">
              {renderWidget(widgetId)}
            </div>
          </div>
        ))}
      </GridLayout>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence mode="wait">
        {fullscreenWidget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setFullscreenWidget(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl w-full h-full max-w-6xl max-h-[90vh] p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setFullscreenWidget(null)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Minimize2 className="w-5 h-5 text-gray-600" />
              </button>
              <div className="h-full overflow-auto">
                {renderWidget(fullscreenWidget)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget Config Dialog */}
      <AnimatePresence mode="wait">
        {configDialogWidget && (
          <WidgetConfigDialog
            widgetId={configDialogWidget}
            widgetType={configDialogWidget}
            currentConfig={widgetConfigs[configDialogWidget]}
            onSave={handleConfigSave}
            onClose={() => setConfigDialogWidget(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}