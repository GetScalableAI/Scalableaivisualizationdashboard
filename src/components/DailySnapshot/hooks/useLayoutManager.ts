import { useState, useEffect, useCallback } from 'react';
import { Layout, Layouts } from 'react-grid-layout';
import { Report, ReportFilters } from '../types/report';
import { WidgetConfig } from '../types/widgetConfig';

export interface Widget {
  id: string;
  type: string;
  title: string;
  category: 'metrics' | 'charts' | 'analytics' | 'insights';
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  defaultSize: { w: number; h: number };
  isResizable?: boolean;
  isDraggable?: boolean;
  isVisible?: boolean;
}

export interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  layouts: Layouts;
  widgets: string[];
}

const STORAGE_KEY = 'daily-snapshot-layout';
const WIDGETS_KEY = 'daily-snapshot-widgets';

// Define all available widgets
export const AVAILABLE_WIDGETS: Widget[] = [
  {
    id: 'production-target',
    type: 'metric',
    title: 'Production vs Target',
    category: 'metrics',
    minW: 1,
    minH: 2,
    defaultSize: { w: 3, h: 3 },
    isResizable: true,
    isDraggable: true,
  },
  {
    id: 'oee',
    type: 'metric',
    title: 'OEE',
    category: 'metrics',
    minW: 1,
    minH: 2,
    defaultSize: { w: 3, h: 3 },
    isResizable: true,
    isDraggable: true,
  },
  {
    id: 'scrap-rate',
    type: 'metric',
    title: 'Scrap Rate',
    category: 'metrics',
    minW: 1,
    minH: 2,
    defaultSize: { w: 3, h: 3 },
    isResizable: true,
    isDraggable: true,
  },
  {
    id: 'uptime',
    type: 'metric',
    title: 'Uptime',
    category: 'metrics',
    minW: 1,
    minH: 2,
    defaultSize: { w: 3, h: 3 },
    isResizable: true,
    isDraggable: true,
  },
  {
    id: 'production-trend',
    type: 'chart',
    title: 'Production Trend',
    category: 'charts',
    minW: 3,
    minH: 3,
    defaultSize: { w: 8, h: 4 },
    isResizable: true,
    isDraggable: true,
  },
  {
    id: 'schedule-analysis',
    type: 'chart',
    title: 'Behind/Ahead Analysis',
    category: 'charts',
    minW: 3,
    minH: 3,
    defaultSize: { w: 8, h: 4 },
    isResizable: true,
    isDraggable: true,
  },
  {
    id: 'quality-metrics',
    type: 'chart',
    title: 'Quality Metrics',
    category: 'analytics',
    minW: 2,
    minH: 3,
    defaultSize: { w: 4, h: 5 },
    isResizable: true,
    isDraggable: true,
  },
  {
    id: 'sales-performance',
    type: 'info',
    title: 'Sales Performance',
    category: 'analytics',
    minW: 2,
    minH: 3,
    defaultSize: { w: 4, h: 5 },
    isResizable: true,
    isDraggable: true,
  },
  {
    id: 'quick-insights',
    type: 'ai',
    title: 'Quick Insights',
    category: 'insights',
    minW: 4,
    minH: 2,
    defaultSize: { w: 12, h: 3 },
    isResizable: true,
    isDraggable: true,
  },
  {
    id: 'utilization',
    type: 'metric',
    title: 'Utilization Rate',
    category: 'metrics',
    minW: 1,
    minH: 2,
    defaultSize: { w: 3, h: 4 },
    isResizable: true,
    isDraggable: true,
  },
  {
    id: 'machine-performance',
    type: 'chart',
    title: 'Machine Performance',
    category: 'analytics',
    minW: 3,
    minH: 3,
    defaultSize: { w: 6, h: 4 },
    isResizable: true,
    isDraggable: true,
  },
  {
    id: 'per-machine-metrics',
    type: 'list',
    title: 'Per Machine Metrics',
    category: 'analytics',
    minW: 2,
    minH: 3,
    defaultSize: { w: 4, h: 5 },
    isResizable: true,
    isDraggable: true,
  },
  {
    id: 'environmental-data',
    type: 'chart',
    title: 'Environmental Data',
    category: 'analytics',
    minW: 3,
    minH: 3,
    defaultSize: { w: 6, h: 4 },
    isResizable: true,
    isDraggable: true,
  },
  {
    id: 'ghg-emissions',
    type: 'chart',
    title: 'Greenhouse Gas Emissions',
    category: 'analytics',
    minW: 3,
    minH: 3,
    defaultSize: { w: 6, h: 4 },
    isResizable: true,
    isDraggable: true,
  },
  {
    id: 'debt-to-equity',
    type: 'metric',
    title: 'Debt-to-Equity Ratio',
    category: 'metrics',
    minW: 2,
    minH: 3,
    defaultSize: { w: 4, h: 4 },
    isResizable: true,
    isDraggable: true,
  },
  {
    id: 'custom-metric',
    type: 'custom',
    title: 'Custom Metric',
    category: 'metrics',
    minW: 1,
    minH: 2,
    defaultSize: { w: 3, h: 3 },
    isResizable: true,
    isDraggable: true,
  },
];

// Layout presets
export const LAYOUT_PRESETS: LayoutPreset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard dashboard layout with all widgets',
    layouts: {
      lg: [
        { i: 'production-target', x: 0, y: 0, w: 3, h: 3 },
        { i: 'oee', x: 3, y: 0, w: 3, h: 3 },
        { i: 'scrap-rate', x: 6, y: 0, w: 3, h: 3 },
        { i: 'uptime', x: 9, y: 0, w: 3, h: 3 },
        { i: 'schedule-analysis', x: 0, y: 3, w: 8, h: 4 },
        { i: 'production-trend', x: 0, y: 7, w: 8, h: 4 },
        { i: 'quality-metrics', x: 8, y: 3, w: 4, h: 5 },
        { i: 'sales-performance', x: 8, y: 8, w: 4, h: 5 },
        { i: 'quick-insights', x: 0, y: 11, w: 12, h: 3 },
      ],
    },
    widgets: AVAILABLE_WIDGETS.map(w => w.id),
  },
  {
    id: 'plant-manager',
    name: 'Plant Manager',
    description: 'Executive view focused on overall plant performance, OEE, and production efficiency',
    layouts: {
      lg: [
        { i: 'oee', x: 0, y: 0, w: 4, h: 4 },
        { i: 'production-target', x: 4, y: 0, w: 4, h: 4 },
        { i: 'uptime', x: 8, y: 0, w: 4, h: 4 },
        { i: 'production-trend', x: 0, y: 4, w: 8, h: 5 },
        { i: 'machine-performance', x: 8, y: 4, w: 4, h: 5 },
        { i: 'schedule-analysis', x: 0, y: 9, w: 6, h: 4 },
        { i: 'quality-metrics', x: 6, y: 9, w: 6, h: 4 },
        { i: 'quick-insights', x: 0, y: 13, w: 12, h: 3 },
      ],
    },
    widgets: ['oee', 'production-target', 'uptime', 'production-trend', 'machine-performance', 'schedule-analysis', 'quality-metrics', 'quick-insights'],
  },
  {
    id: 'cfo',
    name: 'CFO',
    description: 'Financial focus with cost analysis, scrap value, sales performance, and efficiency metrics',
    layouts: {
      lg: [
        { i: 'sales-performance', x: 0, y: 0, w: 4, h: 5 },
        { i: 'scrap-rate', x: 4, y: 0, w: 4, h: 4 },
        { i: 'debt-to-equity', x: 8, y: 0, w: 4, h: 4 },
        { i: 'production-target', x: 4, y: 4, w: 4, h: 3 },
        { i: 'utilization', x: 8, y: 4, w: 4, h: 4 },
        { i: 'production-trend', x: 0, y: 5, w: 4, h: 4 },
        { i: 'oee', x: 0, y: 9, w: 4, h: 3 },
        { i: 'schedule-analysis', x: 4, y: 7, w: 8, h: 5 },
        { i: 'quick-insights', x: 0, y: 12, w: 12, h: 3 },
      ],
    },
    widgets: ['sales-performance', 'scrap-rate', 'debt-to-equity', 'production-target', 'utilization', 'production-trend', 'oee', 'schedule-analysis', 'quick-insights'],
  },
  {
    id: 'shop-floor',
    name: 'Shop Floor',
    description: 'Real-time operational view for production teams with machine status and schedule tracking',
    layouts: {
      lg: [
        { i: 'production-target', x: 0, y: 0, w: 3, h: 3 },
        { i: 'uptime', x: 3, y: 0, w: 3, h: 3 },
        { i: 'scrap-rate', x: 6, y: 0, w: 3, h: 3 },
        { i: 'quality-metrics', x: 9, y: 0, w: 3, h: 3 },
        { i: 'schedule-analysis', x: 0, y: 3, w: 6, h: 5 },
        { i: 'machine-performance', x: 6, y: 3, w: 6, h: 5 },
        { i: 'per-machine-metrics', x: 0, y: 8, w: 4, h: 5 },
        { i: 'production-trend', x: 4, y: 8, w: 8, h: 5 },
      ],
    },
    widgets: ['production-target', 'uptime', 'scrap-rate', 'quality-metrics', 'schedule-analysis', 'machine-performance', 'per-machine-metrics', 'production-trend'],
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Condensed view with key metrics only',
    layouts: {
      lg: [
        { i: 'production-target', x: 0, y: 0, w: 3, h: 2 },
        { i: 'oee', x: 3, y: 0, w: 3, h: 2 },
        { i: 'scrap-rate', x: 6, y: 0, w: 3, h: 2 },
        { i: 'uptime', x: 9, y: 0, w: 3, h: 2 },
        { i: 'production-trend', x: 0, y: 2, w: 12, h: 3 },
        { i: 'quick-insights', x: 0, y: 5, w: 12, h: 2 },
      ],
    },
    widgets: ['production-target', 'oee', 'scrap-rate', 'uptime', 'production-trend', 'quick-insights'],
  },
  {
    id: 'analytics',
    name: 'Analytics Focus',
    description: 'Emphasizes charts and data visualization',
    layouts: {
      lg: [
        { i: 'production-trend', x: 0, y: 0, w: 6, h: 5 },
        { i: 'schedule-analysis', x: 6, y: 0, w: 6, h: 5 },
        { i: 'quality-metrics', x: 0, y: 5, w: 6, h: 5 },
        { i: 'sales-performance', x: 6, y: 5, w: 6, h: 5 },
        { i: 'quick-insights', x: 0, y: 10, w: 12, h: 3 },
      ],
    },
    widgets: ['production-trend', 'schedule-analysis', 'quality-metrics', 'sales-performance', 'quick-insights'],
  },
];

export const useLayoutManager = () => {
  const [layouts, setLayouts] = useState<Layouts>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved layout:', e);
      }
    }
    return LAYOUT_PRESETS[0].layouts;
  });

  const [activeWidgets, setActiveWidgets] = useState<string[]>(() => {
    const saved = localStorage.getItem(WIDGETS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved widgets:', e);
      }
    }
    return AVAILABLE_WIDGETS.map(w => w.id);
  });

  const [currentPreset, setCurrentPreset] = useState<string>('default');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);

  // Save layout to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
  }, [layouts]);

  // Save active widgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(WIDGETS_KEY, JSON.stringify(activeWidgets));
  }, [activeWidgets]);

  const handleLayoutChange = useCallback((newLayout: Layout[], allLayouts: Layouts) => {
    setLayouts(allLayouts);
  }, []);

  const addWidget = useCallback((widgetId: string) => {
    if (activeWidgets.includes(widgetId)) return;

    const widget = AVAILABLE_WIDGETS.find(w => w.id === widgetId);
    if (!widget) return;

    // Find a good position for the new widget
    const currentLayout = layouts.lg || [];
    let y = 0;
    currentLayout.forEach(item => {
      if (item.y + item.h > y) {
        y = item.y + item.h;
      }
    });

    const newLayout = {
      i: widgetId,
      x: 0,
      y,
      w: widget.defaultSize.w,
      h: widget.defaultSize.h,
    };

    setLayouts({
      ...layouts,
      lg: [...currentLayout, newLayout],
    });
    setActiveWidgets([...activeWidgets, widgetId]);
  }, [activeWidgets, layouts]);

  const removeWidget = useCallback((widgetId: string) => {
    setLayouts({
      ...layouts,
      lg: (layouts.lg || []).filter(item => item.i !== widgetId),
    });
    setActiveWidgets(activeWidgets.filter(id => id !== widgetId));
  }, [activeWidgets, layouts]);

  const loadPreset = useCallback((presetId: string) => {
    const preset = LAYOUT_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setLayouts(preset.layouts);
    setActiveWidgets(preset.widgets);
    setCurrentPreset(presetId);
  }, []);

  const resetLayout = useCallback(() => {
    loadPreset('default');
  }, [loadPreset]);

  const toggleEditMode = useCallback(() => {
    setIsEditMode(!isEditMode);
  }, [isEditMode]);

  const toggleWidgetLibrary = useCallback(() => {
    setShowWidgetLibrary(!showWidgetLibrary);
  }, [showWidgetLibrary]);

  const exportLayout = useCallback(() => {
    const config = {
      layouts,
      widgets: activeWidgets,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-layout-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [layouts, activeWidgets]);

  const importLayout = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        if (config.layouts) setLayouts(config.layouts);
        if (config.widgets) setActiveWidgets(config.widgets);
      } catch (error) {
        console.error('Failed to import layout:', error);
        alert('Failed to import layout. Please check the file format.');
      }
    };
    reader.readAsText(file);
  }, []);

  // Load layout from a saved report
  const loadFromReport = useCallback((report: Report) => {
    setLayouts(report.layouts);
    setActiveWidgets(report.activeWidgets);
    setCurrentPreset('custom'); // Mark as custom since it's from a report
  }, []);

  // Convert current layout state to report config format
  const toReportConfig = useCallback((): {
    layouts: Layouts;
    activeWidgets: string[];
    widgetConfigs: Record<string, WidgetConfig>;
    filters: ReportFilters;
  } => {
    return {
      layouts,
      activeWidgets,
      widgetConfigs: {}, // Widget configs would be managed separately
      filters: {
        dateRange: { type: 'today' },
        productLine: 'all',
        shift: 'all',
      },
    };
  }, [layouts, activeWidgets]);

  // Check if current layout matches any preset
  const getCurrentPresetId = useCallback((): string | null => {
    for (const preset of LAYOUT_PRESETS) {
      const presetWidgets = new Set(preset.widgets);
      const currentWidgets = new Set(activeWidgets);

      if (presetWidgets.size !== currentWidgets.size) continue;

      let matches = true;
      for (const widget of presetWidgets) {
        if (!currentWidgets.has(widget)) {
          matches = false;
          break;
        }
      }

      if (matches) return preset.id;
    }
    return null;
  }, [activeWidgets]);

  return {
    layouts,
    activeWidgets,
    currentPreset,
    isEditMode,
    showWidgetLibrary,
    availableWidgets: AVAILABLE_WIDGETS,
    presets: LAYOUT_PRESETS,
    handleLayoutChange,
    addWidget,
    removeWidget,
    loadPreset,
    resetLayout,
    toggleEditMode,
    toggleWidgetLibrary,
    exportLayout,
    importLayout,
    loadFromReport,
    toReportConfig,
    getCurrentPresetId,
  };
};