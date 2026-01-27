// Drill-down types for Daily Snapshot widgets

export type WidgetType = 'production' | 'oee' | 'scrap' | 'uptime';

export type DrillDownLevel = 1 | 2 | 3;

export interface DrillDownPath {
  level: DrillDownLevel;
  label: string;
  id: string;
}

export interface DrillDownState {
  isOpen: boolean;
  widgetType: WidgetType | null;
  currentLevel: DrillDownLevel;
  path: DrillDownPath[];
  selectedId: string | null;
}

// Production drill-down data types
export interface ShiftData {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  actual: number;
  target: number;
  efficiency: number;
}

export interface MachineProductionData {
  id: string;
  name: string;
  actual: number;
  target: number;
  status: 'running' | 'idle' | 'maintenance' | 'down';
  operator: string;
}

export interface HourlyProductionData {
  hour: string;
  actual: number;
  target: number;
  cumulative: number;
  cumulativeTarget: number;
}

// OEE drill-down data types
export interface OEEBreakdown {
  availability: number;
  performance: number;
  quality: number;
  oee: number;
}

export interface MachineOEEData {
  id: string;
  name: string;
  availability: number;
  performance: number;
  quality: number;
  oee: number;
  status: 'running' | 'idle' | 'maintenance' | 'down';
}

export interface OEETimelineData {
  time: string;
  availability: number;
  performance: number;
  quality: number;
  oee: number;
  event?: string;
}

// Scrap drill-down data types
export interface DefectTypeData {
  id: string;
  name: string;
  count: number;
  percentage: number;
  cost: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface MachineScrapData {
  id: string;
  name: string;
  scrapRate: number;
  scrapCount: number;
  totalProduced: number;
  cost: number;
}

export interface ProductScrapData {
  id: string;
  name: string;
  defectType: string;
  count: number;
  batchId: string;
  timestamp: string;
}

// Uptime drill-down data types
export interface MachineUptimeData {
  id: string;
  name: string;
  uptime: number;
  totalHours: number;
  productiveHours: number;
  status: 'running' | 'idle' | 'maintenance' | 'down';
  lastDowntime?: string;
}

export interface DowntimeEventData {
  id: string;
  machineId: string;
  machineName: string;
  reason: 'breakdown' | 'maintenance' | 'changeover' | 'material' | 'quality' | 'other';
  startTime: string;
  endTime: string | null;
  duration: number;
  description: string;
  resolved: boolean;
}

export interface DowntimeEventDetail {
  id: string;
  machineId: string;
  machineName: string;
  reason: string;
  rootCause: string;
  startTime: string;
  endTime: string | null;
  duration: number;
  technician: string;
  partsReplaced: string[];
  notes: string;
  cost: number;
}

// Aggregated data for drill-down views
export interface ProductionDrillDownData {
  byShift: ShiftData[];
  byMachine: MachineProductionData[];
  hourlyDetail: HourlyProductionData[];
}

export interface OEEDrillDownData {
  breakdown: OEEBreakdown;
  byMachine: MachineOEEData[];
  timeline: OEETimelineData[];
}

export interface ScrapDrillDownData {
  byDefectType: DefectTypeData[];
  byMachine: MachineScrapData[];
  byProduct: ProductScrapData[];
}

export interface UptimeDrillDownData {
  byMachine: MachineUptimeData[];
  downtimeEvents: DowntimeEventData[];
  eventDetail: DowntimeEventDetail | null;
}
