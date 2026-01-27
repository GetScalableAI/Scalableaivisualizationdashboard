// Report types for Daily Snapshot dashboard
import { Layouts } from 'react-grid-layout';
import { WidgetConfig } from './widgetConfig';

export interface Report {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;

  // Layout configuration
  layouts: Layouts;
  activeWidgets: string[];

  // Widget-specific configurations
  widgetConfigs: Record<string, WidgetConfig>;

  // Global filters
  filters: ReportFilters;
}

export interface ReportFilters {
  dateRange: DateRangeFilter;
  productLine: string;
  shift: string;
  customFilters?: Record<string, string | number | boolean>;
}

export interface DateRangeFilter {
  type: 'today' | 'week' | 'month' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface ReportMetadata {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
  widgetCount: number;
}

// Storage schema for localStorage
export interface StoredReports {
  reports: Report[];
  lastModified: string;
}

export interface CurrentDashboard {
  reportId: string | null;
  unsavedChanges: Partial<Report> | null;
}

export interface ChatConversation {
  id: string;
  reportId: string | null;
  messages: ChatMessage[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  action?: ChatAction;
}

export interface ChatAction {
  type: 'add_widget' | 'remove_widget' | 'configure_widget' |
        'open_drill_down' | 'save_report' | 'load_report' | 'analyze_data';
  params: Record<string, unknown>;
  executed: boolean;
  result?: string;
}

export interface ChatHistory {
  conversations: ChatConversation[];
}

// Report operations
export type ReportOperation =
  | { type: 'create'; report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'update'; reportId: string; changes: Partial<Report> }
  | { type: 'delete'; reportId: string }
  | { type: 'duplicate'; reportId: string; newName: string }
  | { type: 'setDefault'; reportId: string };
