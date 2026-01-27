// Report Service - localStorage CRUD operations for dashboard reports
import {
  Report,
  ReportMetadata,
  StoredReports,
  CurrentDashboard,
  ChatHistory,
  ReportFilters,
} from '../types/report';
import { WidgetConfig, DEFAULT_WIDGET_CONFIGS } from '../types/widgetConfig';

// Storage keys
const STORAGE_KEYS = {
  REPORTS: 'dashboard-reports',
  CURRENT: 'dashboard-current',
  CHAT_HISTORY: 'dashboard-chat-history',
} as const;

// Default report configuration
const DEFAULT_LAYOUTS = {
  lg: [
    { i: 'production-target', x: 0, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
    { i: 'oee', x: 3, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
    { i: 'scrap-rate', x: 6, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
    { i: 'uptime', x: 9, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
    { i: 'production-trend', x: 0, y: 4, w: 8, h: 4, minW: 4, minH: 3 },
    { i: 'quick-insights', x: 8, y: 4, w: 4, h: 4, minW: 3, minH: 3 },
  ],
};

const DEFAULT_ACTIVE_WIDGETS = [
  'production-target',
  'oee',
  'scrap-rate',
  'uptime',
  'production-trend',
  'quick-insights',
];

const DEFAULT_FILTERS: ReportFilters = {
  dateRange: { type: 'today' },
  productLine: 'all',
  shift: 'all',
};

// Generate unique ID
function generateId(): string {
  return `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Get current timestamp
function getTimestamp(): string {
  return new Date().toISOString();
}

// Parse JSON safely
function safeJSONParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// Report Service class
class ReportService {
  // Get all reports
  getReports(): Report[] {
    const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
    const data = safeJSONParse<StoredReports>(stored, { reports: [], lastModified: '' });
    return data.reports;
  }

  // Get report metadata (lighter version for lists)
  getReportMetadata(): ReportMetadata[] {
    return this.getReports().map((report) => ({
      id: report.id,
      name: report.name,
      description: report.description,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      isDefault: report.isDefault,
      widgetCount: report.activeWidgets.length,
    }));
  }

  // Get a single report by ID
  getReport(id: string): Report | null {
    const reports = this.getReports();
    return reports.find((r) => r.id === id) || null;
  }

  // Get the default report
  getDefaultReport(): Report | null {
    const reports = this.getReports();
    return reports.find((r) => r.isDefault) || reports[0] || null;
  }

  // Create a new report
  createReport(data: {
    name: string;
    description?: string;
    layouts?: typeof DEFAULT_LAYOUTS;
    activeWidgets?: string[];
    widgetConfigs?: Record<string, WidgetConfig>;
    filters?: ReportFilters;
  }): Report {
    const reports = this.getReports();
    const now = getTimestamp();

    const newReport: Report = {
      id: generateId(),
      name: data.name,
      description: data.description,
      createdAt: now,
      updatedAt: now,
      isDefault: reports.length === 0, // First report is default
      layouts: data.layouts || DEFAULT_LAYOUTS,
      activeWidgets: data.activeWidgets || DEFAULT_ACTIVE_WIDGETS,
      widgetConfigs: data.widgetConfigs || this.getDefaultWidgetConfigs(data.activeWidgets || DEFAULT_ACTIVE_WIDGETS),
      filters: data.filters || DEFAULT_FILTERS,
    };

    this.saveReports([...reports, newReport]);
    return newReport;
  }

  // Update an existing report
  updateReport(id: string, changes: Partial<Report>): Report | null {
    const reports = this.getReports();
    const index = reports.findIndex((r) => r.id === id);

    if (index === -1) return null;

    const updatedReport: Report = {
      ...reports[index],
      ...changes,
      id: reports[index].id, // Prevent ID change
      createdAt: reports[index].createdAt, // Prevent creation date change
      updatedAt: getTimestamp(),
    };

    reports[index] = updatedReport;
    this.saveReports(reports);
    return updatedReport;
  }

  // Delete a report
  deleteReport(id: string): boolean {
    const reports = this.getReports();
    const filtered = reports.filter((r) => r.id !== id);

    if (filtered.length === reports.length) return false;

    // If we deleted the default, make the first remaining report default
    if (filtered.length > 0 && !filtered.some((r) => r.isDefault)) {
      filtered[0].isDefault = true;
    }

    this.saveReports(filtered);
    return true;
  }

  // Duplicate a report
  duplicateReport(id: string, newName: string): Report | null {
    const original = this.getReport(id);
    if (!original) return null;

    return this.createReport({
      name: newName,
      description: original.description ? `Copy of: ${original.description}` : undefined,
      layouts: JSON.parse(JSON.stringify(original.layouts)),
      activeWidgets: [...original.activeWidgets],
      widgetConfigs: JSON.parse(JSON.stringify(original.widgetConfigs)),
      filters: JSON.parse(JSON.stringify(original.filters)),
    });
  }

  // Set a report as default
  setDefaultReport(id: string): boolean {
    const reports = this.getReports();
    const report = reports.find((r) => r.id === id);

    if (!report) return false;

    reports.forEach((r) => {
      r.isDefault = r.id === id;
    });

    this.saveReports(reports);
    return true;
  }

  // Get current dashboard state
  getCurrentDashboard(): CurrentDashboard {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT);
    return safeJSONParse<CurrentDashboard>(stored, {
      reportId: null,
      unsavedChanges: null,
    });
  }

  // Set current dashboard state
  setCurrentDashboard(data: Partial<CurrentDashboard>): void {
    const current = this.getCurrentDashboard();
    localStorage.setItem(
      STORAGE_KEYS.CURRENT,
      JSON.stringify({ ...current, ...data })
    );
  }

  // Check if there are unsaved changes
  hasUnsavedChanges(): boolean {
    const current = this.getCurrentDashboard();
    return current.unsavedChanges !== null;
  }

  // Clear unsaved changes
  clearUnsavedChanges(): void {
    this.setCurrentDashboard({ unsavedChanges: null });
  }

  // Get chat history
  getChatHistory(): ChatHistory {
    const stored = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    return safeJSONParse<ChatHistory>(stored, { conversations: [] });
  }

  // Save chat history
  saveChatHistory(history: ChatHistory): void {
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(history));
  }

  // Export report to JSON
  exportReport(id: string): string | null {
    const report = this.getReport(id);
    if (!report) return null;

    return JSON.stringify(report, null, 2);
  }

  // Import report from JSON
  importReport(json: string): Report | null {
    try {
      const data = JSON.parse(json) as Report;

      // Validate required fields
      if (!data.name || !data.layouts || !data.activeWidgets) {
        throw new Error('Invalid report format');
      }

      // Create new report with imported data
      return this.createReport({
        name: `${data.name} (Imported)`,
        description: data.description,
        layouts: data.layouts,
        activeWidgets: data.activeWidgets,
        widgetConfigs: data.widgetConfigs,
        filters: data.filters,
      });
    } catch {
      return null;
    }
  }

  // Export all reports
  exportAllReports(): string {
    const reports = this.getReports();
    return JSON.stringify({ reports, exportedAt: getTimestamp() }, null, 2);
  }

  // Get default widget configs for a set of widgets
  private getDefaultWidgetConfigs(widgetIds: string[]): Record<string, WidgetConfig> {
    const configs: Record<string, WidgetConfig> = {};

    widgetIds.forEach((widgetId) => {
      const defaultConfig = DEFAULT_WIDGET_CONFIGS[widgetId];
      configs[widgetId] = {
        id: widgetId,
        widgetType: widgetId,
        ...defaultConfig,
      } as WidgetConfig;
    });

    return configs;
  }

  // Save reports to localStorage
  private saveReports(reports: Report[]): void {
    const data: StoredReports = {
      reports,
      lastModified: getTimestamp(),
    };
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(data));
  }

  // Initialize with default report if none exist
  initializeIfEmpty(): Report {
    const reports = this.getReports();

    if (reports.length === 0) {
      return this.createReport({
        name: 'Default Dashboard',
        description: 'Your default daily snapshot dashboard',
      });
    }

    return reports[0];
  }

  // Create a quick report from current state
  createQuickReport(
    name: string,
    layouts: typeof DEFAULT_LAYOUTS,
    activeWidgets: string[],
    filters: ReportFilters
  ): Report {
    return this.createReport({
      name,
      layouts,
      activeWidgets,
      filters,
    });
  }
}

// Export singleton instance
export const reportService = new ReportService();

// Export types for external use
export type { Report, ReportMetadata, ReportFilters, CurrentDashboard };
