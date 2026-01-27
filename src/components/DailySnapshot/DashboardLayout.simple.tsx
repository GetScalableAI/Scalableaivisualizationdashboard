import RGL, { WidthProvider } from 'react-grid-layout';
import ProductionWidget from './widgets/ProductionWidget';
import OEEWidget from './widgets/OEEWidget';
import ScrapRateWidget from './widgets/ScrapRateWidget';
import UptimeWidget from './widgets/UptimeWidget';
import ProductionTrendWidget from './widgets/ProductionTrendWidget';
import ScheduleAnalysisWidget from './widgets/ScheduleAnalysisWidget';
import QualityMetricsWidget from './widgets/QualityMetricsWidget';
import SalesWidget from './widgets/SalesWidget';
import QuickInsightsWidget from './widgets/QuickInsightsWidget';

const ResponsiveGridLayout = WidthProvider(RGL.Responsive);

interface DashboardLayoutProps {
  layouts: any;
  activeWidgets: string[];
  isEditMode: boolean;
  onLayoutChange: (layout: any, layouts: any) => void;
  onRemoveWidget: (widgetId: string) => void;
  onOpenChat: () => void;
}

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
};

export default function DashboardLayout({
  layouts,
  activeWidgets,
  isEditMode,
  onLayoutChange,
  onRemoveWidget,
  onOpenChat,
}: DashboardLayoutProps) {

  const renderWidget = (widgetId: string) => {
    const WidgetComponent = WIDGET_COMPONENTS[widgetId];
    if (!WidgetComponent) return <div>Widget not found: {widgetId}</div>;

    const widgetProps: any = {};
    if (widgetId === 'quick-insights' || widgetId === 'production-trend' || widgetId === 'schedule-analysis') {
      widgetProps.onOpenChat = onOpenChat;
    }

    return <WidgetComponent {...widgetProps} />;
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      onLayoutChange={onLayoutChange}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={80}
      isDraggable={isEditMode}
      isResizable={isEditMode}
      margin={[16, 16]}
      containerPadding={[0, 0]}
    >
      {activeWidgets.map((widgetId) => (
        <div key={widgetId} className="bg-transparent">
          {renderWidget(widgetId)}
        </div>
      ))}
    </ResponsiveGridLayout>
  );
}
