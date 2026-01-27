// Report Context - Specialized context for report operations
import React, { createContext, useContext, useCallback, useReducer, useEffect, ReactNode } from 'react';
import { Report, ReportMetadata } from '../types/report';
import { reportService } from '../services/reportService';

interface ReportState {
  reports: Report[];
  currentReportId: string | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  sortBy: 'name' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
}

type ReportAction =
  | { type: 'SET_REPORTS'; reports: Report[] }
  | { type: 'SET_CURRENT_REPORT_ID'; id: string | null }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'SET_SEARCH_QUERY'; query: string }
  | { type: 'SET_SORT'; sortBy: ReportState['sortBy']; sortOrder: ReportState['sortOrder'] }
  | { type: 'ADD_REPORT'; report: Report }
  | { type: 'UPDATE_REPORT'; report: Report }
  | { type: 'REMOVE_REPORT'; id: string };

const initialState: ReportState = {
  reports: [],
  currentReportId: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  sortBy: 'updatedAt',
  sortOrder: 'desc',
};

function reportReducer(state: ReportState, action: ReportAction): ReportState {
  switch (action.type) {
    case 'SET_REPORTS':
      return { ...state, reports: action.reports };
    case 'SET_CURRENT_REPORT_ID':
      return { ...state, currentReportId: action.id };
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.query };
    case 'SET_SORT':
      return { ...state, sortBy: action.sortBy, sortOrder: action.sortOrder };
    case 'ADD_REPORT':
      return { ...state, reports: [...state.reports, action.report] };
    case 'UPDATE_REPORT':
      return {
        ...state,
        reports: state.reports.map(r => r.id === action.report.id ? action.report : r),
      };
    case 'REMOVE_REPORT':
      return {
        ...state,
        reports: state.reports.filter(r => r.id !== action.id),
        currentReportId: state.currentReportId === action.id ? null : state.currentReportId,
      };
    default:
      return state;
  }
}

interface ReportContextType {
  state: ReportState;

  // Report CRUD operations
  refreshReports: () => void;
  createReport: (name: string, description?: string) => Promise<Report>;
  updateReport: (id: string, changes: Partial<Report>) => Promise<Report | null>;
  deleteReport: (id: string) => Promise<boolean>;
  duplicateReport: (id: string, newName: string) => Promise<Report | null>;
  setDefaultReport: (id: string) => Promise<boolean>;

  // Current report
  setCurrentReport: (id: string | null) => void;
  getCurrentReport: () => Report | null;

  // Filtering and sorting
  setSearchQuery: (query: string) => void;
  setSortOptions: (sortBy: ReportState['sortBy'], sortOrder: ReportState['sortOrder']) => void;

  // Computed values
  filteredReports: ReportMetadata[];
  sortedReports: ReportMetadata[];

  // Import/Export
  exportReport: (id: string) => string | null;
  importReport: (json: string) => Promise<Report | null>;
  exportAllReports: () => string;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export function ReportProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reportReducer, initialState);

  // Initialize reports
  useEffect(() => {
    const reports = reportService.getReports();
    dispatch({ type: 'SET_REPORTS', reports });

    // Set current report from storage
    const currentDashboard = reportService.getCurrentDashboard();
    if (currentDashboard.reportId) {
      dispatch({ type: 'SET_CURRENT_REPORT_ID', id: currentDashboard.reportId });
    }
  }, []);

  const refreshReports = useCallback(() => {
    const reports = reportService.getReports();
    dispatch({ type: 'SET_REPORTS', reports });
  }, []);

  const createReport = useCallback(async (name: string, description?: string): Promise<Report> => {
    dispatch({ type: 'SET_LOADING', isLoading: true });
    try {
      const report = reportService.createReport({ name, description });
      dispatch({ type: 'ADD_REPORT', report });
      dispatch({ type: 'SET_LOADING', isLoading: false });
      return report;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Failed to create report' });
      dispatch({ type: 'SET_LOADING', isLoading: false });
      throw error;
    }
  }, []);

  const updateReport = useCallback(async (id: string, changes: Partial<Report>): Promise<Report | null> => {
    dispatch({ type: 'SET_LOADING', isLoading: true });
    try {
      const updated = reportService.updateReport(id, changes);
      if (updated) {
        dispatch({ type: 'UPDATE_REPORT', report: updated });
      }
      dispatch({ type: 'SET_LOADING', isLoading: false });
      return updated;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Failed to update report' });
      dispatch({ type: 'SET_LOADING', isLoading: false });
      return null;
    }
  }, []);

  const deleteReportHandler = useCallback(async (id: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', isLoading: true });
    try {
      const success = reportService.deleteReport(id);
      if (success) {
        dispatch({ type: 'REMOVE_REPORT', id });
      }
      dispatch({ type: 'SET_LOADING', isLoading: false });
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Failed to delete report' });
      dispatch({ type: 'SET_LOADING', isLoading: false });
      return false;
    }
  }, []);

  const duplicateReport = useCallback(async (id: string, newName: string): Promise<Report | null> => {
    dispatch({ type: 'SET_LOADING', isLoading: true });
    try {
      const duplicated = reportService.duplicateReport(id, newName);
      if (duplicated) {
        dispatch({ type: 'ADD_REPORT', report: duplicated });
      }
      dispatch({ type: 'SET_LOADING', isLoading: false });
      return duplicated;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Failed to duplicate report' });
      dispatch({ type: 'SET_LOADING', isLoading: false });
      return null;
    }
  }, []);

  const setDefaultReport = useCallback(async (id: string): Promise<boolean> => {
    const success = reportService.setDefaultReport(id);
    if (success) {
      refreshReports();
    }
    return success;
  }, [refreshReports]);

  const setCurrentReport = useCallback((id: string | null) => {
    dispatch({ type: 'SET_CURRENT_REPORT_ID', id });
    reportService.setCurrentDashboard({ reportId: id });
  }, []);

  const getCurrentReport = useCallback((): Report | null => {
    if (!state.currentReportId) return null;
    return state.reports.find(r => r.id === state.currentReportId) || null;
  }, [state.currentReportId, state.reports]);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', query });
  }, []);

  const setSortOptions = useCallback((sortBy: ReportState['sortBy'], sortOrder: ReportState['sortOrder']) => {
    dispatch({ type: 'SET_SORT', sortBy, sortOrder });
  }, []);

  // Computed: filtered reports
  const filteredReports: ReportMetadata[] = state.reports
    .filter(r => {
      if (!state.searchQuery) return true;
      const query = state.searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query)
      );
    })
    .map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      isDefault: r.isDefault,
      widgetCount: r.activeWidgets.length,
    }));

  // Computed: sorted reports
  const sortedReports = [...filteredReports].sort((a, b) => {
    let comparison = 0;

    switch (state.sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
    }

    return state.sortOrder === 'asc' ? comparison : -comparison;
  });

  const exportReport = useCallback((id: string): string | null => {
    return reportService.exportReport(id);
  }, []);

  const importReport = useCallback(async (json: string): Promise<Report | null> => {
    const imported = reportService.importReport(json);
    if (imported) {
      dispatch({ type: 'ADD_REPORT', report: imported });
    }
    return imported;
  }, []);

  const exportAllReports = useCallback((): string => {
    return reportService.exportAllReports();
  }, []);

  const contextValue: ReportContextType = {
    state,
    refreshReports,
    createReport,
    updateReport,
    deleteReport: deleteReportHandler,
    duplicateReport,
    setDefaultReport,
    setCurrentReport,
    getCurrentReport,
    setSearchQuery,
    setSortOptions,
    filteredReports,
    sortedReports,
    exportReport,
    importReport,
    exportAllReports,
  };

  return (
    <ReportContext.Provider value={contextValue}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
}

export function useReportsSafe() {
  return useContext(ReportContext);
}
