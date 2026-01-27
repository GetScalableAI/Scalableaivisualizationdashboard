// Unified Dashboard Context - combines layout, report, and chat state management
import React, { createContext, useContext, useCallback, useReducer, useEffect, ReactNode } from 'react';
import { Layouts, Layout } from 'react-grid-layout';
import { Report, ReportFilters, ChatMessage, ChatAction } from '../types/report';
import { WidgetConfig } from '../types/widgetConfig';
import { reportService } from '../services/reportService';
import { LAYOUT_PRESETS, AVAILABLE_WIDGETS, Widget, LayoutPreset } from '../hooks/useLayoutManager';

// State types
interface DashboardState {
  // Layout state
  layouts: Layouts;
  activeWidgets: string[];
  currentPreset: string;
  isEditMode: boolean;
  showWidgetLibrary: boolean;

  // Report state
  currentReport: Report | null;
  isDirty: boolean;
  savedReports: Report[];

  // Filter state
  filters: ReportFilters;

  // Chat state
  chatMessages: ChatMessage[];
  isChatOpen: boolean;
  pendingAction: ChatAction | null;

  // Widget configs
  widgetConfigs: Record<string, WidgetConfig>;

  // UI state
  isSidebarCollapsed: boolean;
}

// Action types
type DashboardAction =
  | { type: 'SET_LAYOUTS'; layouts: Layouts }
  | { type: 'SET_ACTIVE_WIDGETS'; widgets: string[] }
  | { type: 'ADD_WIDGET'; widgetId: string }
  | { type: 'REMOVE_WIDGET'; widgetId: string }
  | { type: 'SET_PRESET'; presetId: string }
  | { type: 'TOGGLE_EDIT_MODE' }
  | { type: 'SET_EDIT_MODE'; isEditMode: boolean }
  | { type: 'TOGGLE_WIDGET_LIBRARY' }
  | { type: 'LOAD_REPORT'; report: Report }
  | { type: 'SET_CURRENT_REPORT'; report: Report | null }
  | { type: 'SET_DIRTY'; isDirty: boolean }
  | { type: 'SET_SAVED_REPORTS'; reports: Report[] }
  | { type: 'SET_FILTERS'; filters: Partial<ReportFilters> }
  | { type: 'ADD_CHAT_MESSAGE'; message: ChatMessage }
  | { type: 'CLEAR_CHAT' }
  | { type: 'SET_CHAT_OPEN'; isOpen: boolean }
  | { type: 'SET_PENDING_ACTION'; action: ChatAction | null }
  | { type: 'SET_WIDGET_CONFIG'; widgetId: string; config: Partial<WidgetConfig> }
  | { type: 'SET_SIDEBAR_COLLAPSED'; isCollapsed: boolean }
  | { type: 'RESET_TO_DEFAULT' };

// Initial state
const initialState: DashboardState = {
  layouts: LAYOUT_PRESETS[0].layouts,
  activeWidgets: AVAILABLE_WIDGETS.map(w => w.id),
  currentPreset: 'default',
  isEditMode: false,
  showWidgetLibrary: false,
  currentReport: null,
  isDirty: false,
  savedReports: [],
  filters: {
    dateRange: { type: 'today' },
    productLine: 'all',
    shift: 'all',
  },
  chatMessages: [],
  isChatOpen: false,
  pendingAction: null,
  widgetConfigs: {},
  isSidebarCollapsed: false,
};

// Reducer function
function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SET_LAYOUTS':
      return { ...state, layouts: action.layouts, isDirty: true };

    case 'SET_ACTIVE_WIDGETS':
      return { ...state, activeWidgets: action.widgets, isDirty: true };

    case 'ADD_WIDGET': {
      if (state.activeWidgets.includes(action.widgetId)) return state;

      const widget = AVAILABLE_WIDGETS.find(w => w.id === action.widgetId);
      if (!widget) return state;

      // Find a good position for the new widget
      const currentLayout = state.layouts.lg || [];
      let y = 0;
      currentLayout.forEach(item => {
        if (item.y + item.h > y) {
          y = item.y + item.h;
        }
      });

      const newLayout: Layout = {
        i: action.widgetId,
        x: 0,
        y,
        w: widget.defaultSize.w,
        h: widget.defaultSize.h,
      };

      return {
        ...state,
        layouts: {
          ...state.layouts,
          lg: [...currentLayout, newLayout],
        },
        activeWidgets: [...state.activeWidgets, action.widgetId],
        isDirty: true,
      };
    }

    case 'REMOVE_WIDGET':
      return {
        ...state,
        layouts: {
          ...state.layouts,
          lg: (state.layouts.lg || []).filter(item => item.i !== action.widgetId),
        },
        activeWidgets: state.activeWidgets.filter(id => id !== action.widgetId),
        isDirty: true,
      };

    case 'SET_PRESET': {
      const preset = LAYOUT_PRESETS.find(p => p.id === action.presetId);
      if (!preset) return state;

      return {
        ...state,
        layouts: preset.layouts,
        activeWidgets: preset.widgets,
        currentPreset: action.presetId,
        isDirty: true,
      };
    }

    case 'TOGGLE_EDIT_MODE':
      return { ...state, isEditMode: !state.isEditMode };

    case 'SET_EDIT_MODE':
      return { ...state, isEditMode: action.isEditMode };

    case 'TOGGLE_WIDGET_LIBRARY':
      return { ...state, showWidgetLibrary: !state.showWidgetLibrary };

    case 'LOAD_REPORT':
      return {
        ...state,
        layouts: action.report.layouts,
        activeWidgets: action.report.activeWidgets,
        widgetConfigs: action.report.widgetConfigs || {},
        filters: action.report.filters,
        currentReport: action.report,
        isDirty: false,
      };

    case 'SET_CURRENT_REPORT':
      return { ...state, currentReport: action.report };

    case 'SET_DIRTY':
      return { ...state, isDirty: action.isDirty };

    case 'SET_SAVED_REPORTS':
      return { ...state, savedReports: action.reports };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.filters },
        isDirty: true,
      };

    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.message],
      };

    case 'CLEAR_CHAT':
      return { ...state, chatMessages: [] };

    case 'SET_CHAT_OPEN':
      return { ...state, isChatOpen: action.isOpen };

    case 'SET_PENDING_ACTION':
      return { ...state, pendingAction: action.action };

    case 'SET_WIDGET_CONFIG':
      return {
        ...state,
        widgetConfigs: {
          ...state.widgetConfigs,
          [action.widgetId]: {
            ...state.widgetConfigs[action.widgetId],
            ...action.config,
            id: action.widgetId,
            widgetType: action.widgetId,
          },
        },
        isDirty: true,
      };

    case 'SET_SIDEBAR_COLLAPSED':
      return { ...state, isSidebarCollapsed: action.isCollapsed };

    case 'RESET_TO_DEFAULT':
      return {
        ...initialState,
        savedReports: state.savedReports,
      };

    default:
      return state;
  }
}

// Context type
interface DashboardContextType {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;

  // Layout actions
  handleLayoutChange: (newLayout: Layout[], allLayouts: Layouts) => void;
  addWidget: (widgetId: string) => void;
  removeWidget: (widgetId: string) => void;
  loadPreset: (presetId: string) => void;
  resetLayout: () => void;
  toggleEditMode: () => void;
  toggleWidgetLibrary: () => void;
  exportLayout: () => void;
  importLayout: (file: File) => void;

  // Report actions
  saveReport: (name?: string) => Report | null;
  loadReport: (reportId: string) => void;
  deleteReport: (reportId: string) => void;
  createNewReport: (name: string) => Report;
  duplicateReport: (reportId: string, newName: string) => Report | null;

  // Filter actions
  setDateRangeFilter: (type: ReportFilters['dateRange']['type']) => void;
  setProductLineFilter: (productLine: string) => void;
  setShiftFilter: (shift: string) => void;

  // Chat actions
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  toggleChat: () => void;
  executeAction: (action: ChatAction) => void;

  // Widget config actions
  setWidgetConfig: (widgetId: string, config: Partial<WidgetConfig>) => void;
  getWidgetConfig: (widgetId: string) => WidgetConfig | undefined;

  // Utility
  availableWidgets: Widget[];
  presets: LayoutPreset[];
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Provider component
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState, (initial) => {
    // Load saved reports on initialization
    const reports = reportService.getReports();
    const currentDashboard = reportService.getCurrentDashboard();

    // Try to load the current report or default
    let loadedReport: Report | null = null;
    if (currentDashboard.reportId) {
      loadedReport = reportService.getReport(currentDashboard.reportId);
    }
    if (!loadedReport && reports.length > 0) {
      loadedReport = reports.find(r => r.isDefault) || reports[0];
    }

    // Load layouts from localStorage if no report
    const savedLayouts = localStorage.getItem('daily-snapshot-layout');
    const savedWidgets = localStorage.getItem('daily-snapshot-widgets');

    return {
      ...initial,
      savedReports: reports,
      currentReport: loadedReport,
      layouts: loadedReport?.layouts || (savedLayouts ? JSON.parse(savedLayouts) : initial.layouts),
      activeWidgets: loadedReport?.activeWidgets || (savedWidgets ? JSON.parse(savedWidgets) : initial.activeWidgets),
      widgetConfigs: loadedReport?.widgetConfigs || {},
      filters: loadedReport?.filters || initial.filters,
    };
  });

  // Save layouts to localStorage when they change
  useEffect(() => {
    localStorage.setItem('daily-snapshot-layout', JSON.stringify(state.layouts));
  }, [state.layouts]);

  useEffect(() => {
    localStorage.setItem('daily-snapshot-widgets', JSON.stringify(state.activeWidgets));
  }, [state.activeWidgets]);

  // Layout actions
  const handleLayoutChange = useCallback((newLayout: Layout[], allLayouts: Layouts) => {
    dispatch({ type: 'SET_LAYOUTS', layouts: allLayouts });
  }, []);

  const addWidget = useCallback((widgetId: string) => {
    dispatch({ type: 'ADD_WIDGET', widgetId });
  }, []);

  const removeWidget = useCallback((widgetId: string) => {
    dispatch({ type: 'REMOVE_WIDGET', widgetId });
  }, []);

  const loadPreset = useCallback((presetId: string) => {
    dispatch({ type: 'SET_PRESET', presetId });
  }, []);

  const resetLayout = useCallback(() => {
    dispatch({ type: 'RESET_TO_DEFAULT' });
  }, []);

  const toggleEditMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_EDIT_MODE' });
  }, []);

  const toggleWidgetLibrary = useCallback(() => {
    dispatch({ type: 'TOGGLE_WIDGET_LIBRARY' });
  }, []);

  const exportLayout = useCallback(() => {
    const config = {
      layouts: state.layouts,
      widgets: state.activeWidgets,
      widgetConfigs: state.widgetConfigs,
      filters: state.filters,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-layout-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state.layouts, state.activeWidgets, state.widgetConfigs, state.filters]);

  const importLayout = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        if (config.layouts) dispatch({ type: 'SET_LAYOUTS', layouts: config.layouts });
        if (config.widgets) dispatch({ type: 'SET_ACTIVE_WIDGETS', widgets: config.widgets });
        if (config.filters) dispatch({ type: 'SET_FILTERS', filters: config.filters });
      } catch (error) {
        console.error('Failed to import layout:', error);
        alert('Failed to import layout. Please check the file format.');
      }
    };
    reader.readAsText(file);
  }, []);

  // Report actions
  const saveReport = useCallback((name?: string): Report | null => {
    const reportName = name || state.currentReport?.name || `Report - ${new Date().toLocaleString()}`;

    if (state.currentReport) {
      // Update existing report
      const updated = reportService.updateReport(state.currentReport.id, {
        name: reportName,
        layouts: state.layouts,
        activeWidgets: state.activeWidgets,
        widgetConfigs: state.widgetConfigs,
        filters: state.filters,
      });

      if (updated) {
        dispatch({ type: 'SET_CURRENT_REPORT', report: updated });
        dispatch({ type: 'SET_DIRTY', isDirty: false });
        dispatch({ type: 'SET_SAVED_REPORTS', reports: reportService.getReports() });
      }
      return updated;
    } else {
      // Create new report
      const newReport = reportService.createReport({
        name: reportName,
        layouts: state.layouts,
        activeWidgets: state.activeWidgets,
        widgetConfigs: state.widgetConfigs,
        filters: state.filters,
      });

      dispatch({ type: 'SET_CURRENT_REPORT', report: newReport });
      dispatch({ type: 'SET_DIRTY', isDirty: false });
      dispatch({ type: 'SET_SAVED_REPORTS', reports: reportService.getReports() });
      reportService.setCurrentDashboard({ reportId: newReport.id });
      return newReport;
    }
  }, [state.currentReport, state.layouts, state.activeWidgets, state.widgetConfigs, state.filters]);

  const loadReport = useCallback((reportId: string) => {
    const report = reportService.getReport(reportId);
    if (report) {
      dispatch({ type: 'LOAD_REPORT', report });
      reportService.setCurrentDashboard({ reportId });
    }
  }, []);

  const deleteReport = useCallback((reportId: string) => {
    reportService.deleteReport(reportId);
    dispatch({ type: 'SET_SAVED_REPORTS', reports: reportService.getReports() });

    // If we deleted the current report, clear it
    if (state.currentReport?.id === reportId) {
      const reports = reportService.getReports();
      if (reports.length > 0) {
        loadReport(reports[0].id);
      } else {
        dispatch({ type: 'SET_CURRENT_REPORT', report: null });
      }
    }
  }, [state.currentReport, loadReport]);

  const createNewReport = useCallback((name: string): Report => {
    const newReport = reportService.createReport({
      name,
      layouts: LAYOUT_PRESETS[0].layouts,
      activeWidgets: AVAILABLE_WIDGETS.map(w => w.id),
    });

    dispatch({ type: 'LOAD_REPORT', report: newReport });
    dispatch({ type: 'SET_SAVED_REPORTS', reports: reportService.getReports() });
    reportService.setCurrentDashboard({ reportId: newReport.id });
    return newReport;
  }, []);

  const duplicateReport = useCallback((reportId: string, newName: string): Report | null => {
    const duplicated = reportService.duplicateReport(reportId, newName);
    if (duplicated) {
      dispatch({ type: 'SET_SAVED_REPORTS', reports: reportService.getReports() });
    }
    return duplicated;
  }, []);

  // Filter actions
  const setDateRangeFilter = useCallback((type: ReportFilters['dateRange']['type']) => {
    dispatch({ type: 'SET_FILTERS', filters: { dateRange: { type } } });
  }, []);

  const setProductLineFilter = useCallback((productLine: string) => {
    dispatch({ type: 'SET_FILTERS', filters: { productLine } });
  }, []);

  const setShiftFilter = useCallback((shift: string) => {
    dispatch({ type: 'SET_FILTERS', filters: { shift } });
  }, []);

  // Chat actions
  const addChatMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const fullMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', message: fullMessage });
  }, []);

  const clearChat = useCallback(() => {
    dispatch({ type: 'CLEAR_CHAT' });
  }, []);

  const toggleChat = useCallback(() => {
    dispatch({ type: 'SET_CHAT_OPEN', isOpen: !state.isChatOpen });
  }, [state.isChatOpen]);

  const executeAction = useCallback((action: ChatAction) => {
    dispatch({ type: 'SET_PENDING_ACTION', action });

    // Execute the action based on type
    switch (action.type) {
      case 'add_widget':
        if (typeof action.params.widgetType === 'string') {
          addWidget(action.params.widgetType);
        }
        break;
      case 'remove_widget':
        if (typeof action.params.widgetId === 'string') {
          removeWidget(action.params.widgetId);
        }
        break;
      case 'save_report':
        if (typeof action.params.name === 'string') {
          saveReport(action.params.name);
        }
        break;
      case 'load_report':
        if (typeof action.params.reportId === 'string') {
          loadReport(action.params.reportId);
        }
        break;
      case 'configure_widget':
        if (typeof action.params.widgetId === 'string' && action.params.config) {
          dispatch({
            type: 'SET_WIDGET_CONFIG',
            widgetId: action.params.widgetId,
            config: action.params.config as Partial<WidgetConfig>,
          });
        }
        break;
      default:
        break;
    }

    dispatch({ type: 'SET_PENDING_ACTION', action: { ...action, executed: true } });
  }, [addWidget, removeWidget, saveReport, loadReport]);

  // Widget config actions
  const setWidgetConfig = useCallback((widgetId: string, config: Partial<WidgetConfig>) => {
    dispatch({ type: 'SET_WIDGET_CONFIG', widgetId, config });
  }, []);

  const getWidgetConfig = useCallback((widgetId: string): WidgetConfig | undefined => {
    return state.widgetConfigs[widgetId];
  }, [state.widgetConfigs]);

  const contextValue: DashboardContextType = {
    state,
    dispatch,
    handleLayoutChange,
    addWidget,
    removeWidget,
    loadPreset,
    resetLayout,
    toggleEditMode,
    toggleWidgetLibrary,
    exportLayout,
    importLayout,
    saveReport,
    loadReport,
    deleteReport,
    createNewReport,
    duplicateReport,
    setDateRangeFilter,
    setProductLineFilter,
    setShiftFilter,
    addChatMessage,
    clearChat,
    toggleChat,
    executeAction,
    setWidgetConfig,
    getWidgetConfig,
    availableWidgets: AVAILABLE_WIDGETS,
    presets: LAYOUT_PRESETS,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
}

// Hook to use dashboard context
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

// Safe hook for use in components that might not be wrapped in provider
export function useDashboardSafe() {
  const context = useContext(DashboardContext);
  return context;
}
