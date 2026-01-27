// useReports hook - Provides report management functionality
import { useCallback, useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { Report, ReportMetadata, ReportFilters } from '../types/report';
import { Layouts } from 'react-grid-layout';
import { WidgetConfig } from '../types/widgetConfig';

interface UseReportsOptions {
  autoLoad?: boolean;
}

interface UseReportsReturn {
  // State
  reports: ReportMetadata[];
  currentReport: Report | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  createReport: (name: string, description?: string) => Report;
  saveReport: (
    name: string,
    layouts: Layouts,
    activeWidgets: string[],
    widgetConfigs: Record<string, WidgetConfig>,
    filters: ReportFilters
  ) => Report;
  loadReport: (id: string) => Report | null;
  updateReport: (id: string, changes: Partial<Report>) => Report | null;
  deleteReport: (id: string) => boolean;
  duplicateReport: (id: string, newName: string) => Report | null;
  setDefaultReport: (id: string) => boolean;
  refreshReports: () => void;

  // Export/Import
  exportReport: (id: string) => string | null;
  importReport: (json: string) => Report | null;
}

export function useReports(options: UseReportsOptions = {}): UseReportsReturn {
  const { autoLoad = true } = options;

  const [reports, setReports] = useState<ReportMetadata[]>([]);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load reports on mount
  useEffect(() => {
    if (autoLoad) {
      refreshReports();
    }
  }, [autoLoad]);

  const refreshReports = useCallback(() => {
    setIsLoading(true);
    try {
      const metadata = reportService.getReportMetadata();
      setReports(metadata);
      setError(null);
    } catch (e) {
      setError('Failed to load reports');
      console.error('Failed to load reports:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createReport = useCallback((name: string, description?: string): Report => {
    const report = reportService.createReport({ name, description });
    refreshReports();
    return report;
  }, [refreshReports]);

  const saveReport = useCallback((
    name: string,
    layouts: Layouts,
    activeWidgets: string[],
    widgetConfigs: Record<string, WidgetConfig>,
    filters: ReportFilters
  ): Report => {
    const report = reportService.createReport({
      name,
      layouts,
      activeWidgets,
      widgetConfigs,
      filters,
    });
    setCurrentReport(report);
    refreshReports();
    return report;
  }, [refreshReports]);

  const loadReport = useCallback((id: string): Report | null => {
    setIsLoading(true);
    try {
      const report = reportService.getReport(id);
      setCurrentReport(report);
      reportService.setCurrentDashboard({ reportId: id });
      return report;
    } catch (e) {
      setError('Failed to load report');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateReportFn = useCallback((id: string, changes: Partial<Report>): Report | null => {
    const updated = reportService.updateReport(id, changes);
    if (updated && currentReport?.id === id) {
      setCurrentReport(updated);
    }
    refreshReports();
    return updated;
  }, [currentReport, refreshReports]);

  const deleteReportFn = useCallback((id: string): boolean => {
    const success = reportService.deleteReport(id);
    if (success && currentReport?.id === id) {
      setCurrentReport(null);
    }
    refreshReports();
    return success;
  }, [currentReport, refreshReports]);

  const duplicateReportFn = useCallback((id: string, newName: string): Report | null => {
    const duplicated = reportService.duplicateReport(id, newName);
    refreshReports();
    return duplicated;
  }, [refreshReports]);

  const setDefaultReportFn = useCallback((id: string): boolean => {
    const success = reportService.setDefaultReport(id);
    refreshReports();
    return success;
  }, [refreshReports]);

  const exportReportFn = useCallback((id: string): string | null => {
    return reportService.exportReport(id);
  }, []);

  const importReportFn = useCallback((json: string): Report | null => {
    const imported = reportService.importReport(json);
    if (imported) {
      refreshReports();
    }
    return imported;
  }, [refreshReports]);

  return {
    reports,
    currentReport,
    isLoading,
    error,
    createReport,
    saveReport,
    loadReport,
    updateReport: updateReportFn,
    deleteReport: deleteReportFn,
    duplicateReport: duplicateReportFn,
    setDefaultReport: setDefaultReportFn,
    refreshReports,
    exportReport: exportReportFn,
    importReport: importReportFn,
  };
}

export default useReports;
