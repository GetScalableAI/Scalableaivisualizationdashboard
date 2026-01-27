// Mock data service for Daily Snapshot drill-down functionality

import {
  ShiftData,
  MachineProductionData,
  HourlyProductionData,
  OEEBreakdown,
  MachineOEEData,
  OEETimelineData,
  DefectTypeData,
  MachineScrapData,
  ProductScrapData,
  MachineUptimeData,
  DowntimeEventData,
  DowntimeEventDetail,
} from '../types/drillDown';

// Shifts: 6AM-2PM, 2PM-10PM, 10PM-6AM
export const shifts: ShiftData[] = [
  {
    id: 'shift-1',
    name: 'Morning Shift',
    startTime: '06:00',
    endTime: '14:00',
    actual: 1050,
    target: 1000,
    efficiency: 105,
  },
  {
    id: 'shift-2',
    name: 'Afternoon Shift',
    startTime: '14:00',
    endTime: '22:00',
    actual: 920,
    target: 1000,
    efficiency: 92,
  },
  {
    id: 'shift-3',
    name: 'Night Shift',
    startTime: '22:00',
    endTime: '06:00',
    actual: 877,
    target: 1000,
    efficiency: 87.7,
  },
];

// Machines configuration
const machineNames = [
  'CNC-01', 'CNC-02', 'CNC-03', 'CNC-04',
  'Press-01', 'Press-02', 'Press-03',
  'Lathe-01', 'Lathe-02',
  'Mill-01', 'Mill-02', 'Mill-03',
];

export const machineProduction: MachineProductionData[] = machineNames.map((name, index) => {
  const statuses: ('running' | 'idle' | 'maintenance' | 'down')[] = ['running', 'running', 'running', 'running', 'running', 'running', 'running', 'idle', 'maintenance', 'down', 'running', 'running'];
  const target = 250 + Math.floor(Math.random() * 100);
  const variability = statuses[index] === 'down' ? 0.3 : statuses[index] === 'maintenance' ? 0.6 : statuses[index] === 'idle' ? 0.8 : 0.95;
  const actual = Math.floor(target * variability * (0.85 + Math.random() * 0.3));

  const operators = ['J. Smith', 'M. Johnson', 'R. Williams', 'K. Brown', 'A. Davis', 'P. Miller'];

  return {
    id: `machine-${index + 1}`,
    name,
    actual,
    target,
    status: statuses[index],
    operator: operators[index % operators.length],
  };
});

// Generate hourly production data (24 hours)
export const hourlyProduction: HourlyProductionData[] = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0') + ':00';
  const isNightShift = i >= 22 || i < 6;
  const isMorningShift = i >= 6 && i < 14;

  // Lower production during night shift, higher during morning
  const baseTarget = 125;
  const target = baseTarget;
  const efficiency = isNightShift ? 0.85 : isMorningShift ? 1.05 : 0.95;
  const randomVariance = 0.9 + Math.random() * 0.2;
  const actual = Math.floor(target * efficiency * randomVariance);

  return {
    hour,
    actual,
    target,
    cumulative: 0, // Will be calculated after array creation
    cumulativeTarget: 0, // Will be calculated after array creation
  };
});

// Fix cumulative calculation after array is created
let cumActual = 0;
let cumTarget = 0;
hourlyProduction.forEach((item) => {
  cumActual += item.actual;
  cumTarget += item.target;
  item.cumulative = cumActual;
  item.cumulativeTarget = cumTarget;
});

// OEE data
export const oeeBreakdown: OEEBreakdown = {
  availability: 92,
  performance: 89,
  quality: 95,
  oee: Math.round(0.92 * 0.89 * 0.95 * 100 * 10) / 10,
};

export const machineOEE: MachineOEEData[] = machineNames.map((name, index) => {
  const statuses: ('running' | 'idle' | 'maintenance' | 'down')[] = ['running', 'running', 'running', 'running', 'running', 'running', 'running', 'idle', 'maintenance', 'down', 'running', 'running'];
  const status = statuses[index];

  const availability = status === 'down' ? 45 + Math.random() * 20 : status === 'maintenance' ? 70 + Math.random() * 15 : 85 + Math.random() * 13;
  const performance = status === 'down' ? 60 + Math.random() * 20 : 80 + Math.random() * 18;
  const quality = 90 + Math.random() * 9;
  const oee = (availability / 100) * (performance / 100) * (quality / 100) * 100;

  return {
    id: `machine-${index + 1}`,
    name,
    availability: Math.round(availability * 10) / 10,
    performance: Math.round(performance * 10) / 10,
    quality: Math.round(quality * 10) / 10,
    oee: Math.round(oee * 10) / 10,
    status,
  };
});

// OEE timeline (hourly)
export const oeeTimeline: OEETimelineData[] = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0') + ':00';
  const baseAvailability = 90 + Math.random() * 8;
  const basePerformance = 85 + Math.random() * 12;
  const baseQuality = 93 + Math.random() * 6;

  // Simulate some events affecting OEE
  let event: string | undefined;
  let availability = baseAvailability;
  let performance = basePerformance;

  if (i === 7) {
    event = 'Changeover on CNC-03';
    availability -= 15;
  } else if (i === 14) {
    event = 'Scheduled maintenance';
    availability -= 20;
  } else if (i === 19) {
    event = 'Material shortage';
    performance -= 25;
  }

  const oee = (availability / 100) * (performance / 100) * (baseQuality / 100) * 100;

  return {
    time: hour,
    availability: Math.round(availability * 10) / 10,
    performance: Math.round(performance * 10) / 10,
    quality: Math.round(baseQuality * 10) / 10,
    oee: Math.round(oee * 10) / 10,
    event,
  };
});

// Scrap data
export const defectTypes: DefectTypeData[] = [
  {
    id: 'defect-1',
    name: 'Dimensional Error',
    count: 45,
    percentage: 35,
    cost: 1350,
    severity: 'high',
  },
  {
    id: 'defect-2',
    name: 'Surface Defect',
    count: 32,
    percentage: 25,
    cost: 640,
    severity: 'medium',
  },
  {
    id: 'defect-3',
    name: 'Material Flaw',
    count: 25,
    percentage: 19,
    cost: 875,
    severity: 'high',
  },
  {
    id: 'defect-4',
    name: 'Assembly Error',
    count: 15,
    percentage: 12,
    cost: 450,
    severity: 'medium',
  },
  {
    id: 'defect-5',
    name: 'Contamination',
    count: 8,
    percentage: 6,
    cost: 320,
    severity: 'low',
  },
  {
    id: 'defect-6',
    name: 'Other',
    count: 4,
    percentage: 3,
    cost: 120,
    severity: 'low',
  },
];

export const machineScrap: MachineScrapData[] = machineNames.map((name, index) => {
  const totalProduced = 200 + Math.floor(Math.random() * 150);
  const scrapCount = Math.floor(totalProduced * (0.01 + Math.random() * 0.04));
  const scrapRate = (scrapCount / totalProduced) * 100;
  const costPerUnit = 20 + Math.random() * 30;

  return {
    id: `machine-${index + 1}`,
    name,
    scrapRate: Math.round(scrapRate * 10) / 10,
    scrapCount,
    totalProduced,
    cost: Math.round(scrapCount * costPerUnit),
  };
});

export const productScrap: ProductScrapData[] = [
  { id: 'scrap-1', name: 'Part A-100', defectType: 'Dimensional Error', count: 12, batchId: 'B-2026-0111-001', timestamp: '08:15' },
  { id: 'scrap-2', name: 'Part B-200', defectType: 'Surface Defect', count: 8, batchId: 'B-2026-0111-002', timestamp: '09:30' },
  { id: 'scrap-3', name: 'Part A-100', defectType: 'Material Flaw', count: 5, batchId: 'B-2026-0111-003', timestamp: '10:45' },
  { id: 'scrap-4', name: 'Part C-300', defectType: 'Dimensional Error', count: 15, batchId: 'B-2026-0111-004', timestamp: '12:00' },
  { id: 'scrap-5', name: 'Part B-200', defectType: 'Assembly Error', count: 7, batchId: 'B-2026-0111-005', timestamp: '13:20' },
  { id: 'scrap-6', name: 'Part D-400', defectType: 'Contamination', count: 4, batchId: 'B-2026-0111-006', timestamp: '15:45' },
  { id: 'scrap-7', name: 'Part A-100', defectType: 'Surface Defect', count: 9, batchId: 'B-2026-0111-007', timestamp: '17:30' },
  { id: 'scrap-8', name: 'Part C-300', defectType: 'Material Flaw', count: 6, batchId: 'B-2026-0111-008', timestamp: '19:00' },
];

// Uptime data
export const machineUptime: MachineUptimeData[] = machineNames.map((name, index) => {
  const statuses: ('running' | 'idle' | 'maintenance' | 'down')[] = ['running', 'running', 'running', 'running', 'running', 'running', 'running', 'idle', 'maintenance', 'down', 'running', 'running'];
  const status = statuses[index];
  const totalHours = 24;

  let productiveHours: number;
  let lastDowntime: string | undefined;

  switch (status) {
    case 'down':
      productiveHours = 18 + Math.random() * 3;
      lastDowntime = '2 hours ago';
      break;
    case 'maintenance':
      productiveHours = 20 + Math.random() * 2;
      lastDowntime = '45 minutes ago';
      break;
    case 'idle':
      productiveHours = 21 + Math.random() * 2;
      lastDowntime = '3 hours ago';
      break;
    default:
      productiveHours = 22 + Math.random() * 2;
      break;
  }

  const uptime = (productiveHours / totalHours) * 100;

  return {
    id: `machine-${index + 1}`,
    name,
    uptime: Math.round(uptime * 10) / 10,
    totalHours,
    productiveHours: Math.round(productiveHours * 10) / 10,
    status,
    lastDowntime,
  };
});

export const downtimeEvents: DowntimeEventData[] = [
  {
    id: 'event-1',
    machineId: 'machine-3',
    machineName: 'CNC-03',
    reason: 'breakdown',
    startTime: '07:15',
    endTime: '08:45',
    duration: 90,
    description: 'Spindle motor failure',
    resolved: true,
  },
  {
    id: 'event-2',
    machineId: 'machine-10',
    machineName: 'Mill-02',
    reason: 'maintenance',
    startTime: '10:00',
    endTime: '11:30',
    duration: 90,
    description: 'Scheduled preventive maintenance',
    resolved: true,
  },
  {
    id: 'event-3',
    machineId: 'machine-5',
    machineName: 'Press-01',
    reason: 'changeover',
    startTime: '13:00',
    endTime: '13:45',
    duration: 45,
    description: 'Product changeover - Part A to Part B',
    resolved: true,
  },
  {
    id: 'event-4',
    machineId: 'machine-8',
    machineName: 'Lathe-02',
    reason: 'material',
    startTime: '15:30',
    endTime: '16:15',
    duration: 45,
    description: 'Waiting for material delivery',
    resolved: true,
  },
  {
    id: 'event-5',
    machineId: 'machine-10',
    machineName: 'Mill-02',
    reason: 'breakdown',
    startTime: '18:00',
    endTime: null,
    duration: 120,
    description: 'Coolant system malfunction',
    resolved: false,
  },
  {
    id: 'event-6',
    machineId: 'machine-12',
    machineName: 'Mill-03',
    reason: 'quality',
    startTime: '14:30',
    endTime: '15:00',
    duration: 30,
    description: 'Quality hold - dimensional inspection',
    resolved: true,
  },
];

export const getDowntimeEventDetail = (eventId: string): DowntimeEventDetail | null => {
  const event = downtimeEvents.find((e) => e.id === eventId);
  if (!event) return null;

  const details: Record<string, Partial<DowntimeEventDetail>> = {
    'event-1': {
      rootCause: 'Bearing wear causing motor overload',
      technician: 'John Smith',
      partsReplaced: ['Spindle bearing', 'Drive belt'],
      notes: 'Motor operating temperature was elevated. Recommended full motor inspection in next PM cycle.',
      cost: 2500,
    },
    'event-2': {
      rootCause: 'Scheduled PM - 500 hour interval',
      technician: 'Mike Johnson',
      partsReplaced: ['Oil filter', 'Air filter', 'Coolant'],
      notes: 'All systems nominal after maintenance. Next PM due at 1000 hours.',
      cost: 450,
    },
    'event-3': {
      rootCause: 'Product changeover as per schedule',
      technician: 'Rob Williams',
      partsReplaced: [],
      notes: 'Changeover completed within target time. New tooling verified.',
      cost: 0,
    },
    'event-4': {
      rootCause: 'Supplier delivery delay',
      technician: 'N/A',
      partsReplaced: [],
      notes: 'Material arrived at 16:10. Supplier notified of delay impact.',
      cost: 800,
    },
    'event-5': {
      rootCause: 'Coolant pump failure - under investigation',
      technician: 'Alex Davis',
      partsReplaced: [],
      notes: 'Pump ordered. Expected delivery: 2 hours. Temporary bypass being evaluated.',
      cost: 3200,
    },
    'event-6': {
      rootCause: 'Out-of-spec parts detected in QC sampling',
      technician: 'Quality Team',
      partsReplaced: [],
      notes: 'Root cause: tool wear. Tool replaced and process re-verified.',
      cost: 150,
    },
  };

  return {
    id: event.id,
    machineId: event.machineId,
    machineName: event.machineName,
    reason: event.reason,
    rootCause: details[event.id]?.rootCause || 'Under investigation',
    startTime: event.startTime,
    endTime: event.endTime,
    duration: event.duration,
    technician: details[event.id]?.technician || 'Unassigned',
    partsReplaced: details[event.id]?.partsReplaced || [],
    notes: details[event.id]?.notes || '',
    cost: details[event.id]?.cost || 0,
  };
};

// Summary data functions
export const getProductionSummary = () => ({
  totalActual: shifts.reduce((sum, s) => sum + s.actual, 0),
  totalTarget: shifts.reduce((sum, s) => sum + s.target, 0),
  bestShift: shifts.reduce((best, s) => (s.efficiency > best.efficiency ? s : best), shifts[0]),
  machinesRunning: machineProduction.filter((m) => m.status === 'running').length,
  machinesDown: machineProduction.filter((m) => m.status === 'down').length,
});

export const getOEESummary = () => ({
  overall: oeeBreakdown.oee,
  availability: oeeBreakdown.availability,
  performance: oeeBreakdown.performance,
  quality: oeeBreakdown.quality,
  topMachine: machineOEE.reduce((best, m) => (m.oee > best.oee ? m : best), machineOEE[0]),
  bottomMachine: machineOEE.reduce((worst, m) => (m.oee < worst.oee ? m : worst), machineOEE[0]),
});

export const getScrapSummary = () => ({
  totalScrap: defectTypes.reduce((sum, d) => sum + d.count, 0),
  totalCost: defectTypes.reduce((sum, d) => sum + d.cost, 0),
  topDefect: defectTypes.reduce((top, d) => (d.count > top.count ? d : top), defectTypes[0]),
  worstMachine: machineScrap.reduce((worst, m) => (m.scrapRate > worst.scrapRate ? m : worst), machineScrap[0]),
});

export const getUptimeSummary = () => ({
  averageUptime: machineUptime.reduce((sum, m) => sum + m.uptime, 0) / machineUptime.length,
  totalDowntimeMinutes: downtimeEvents.reduce((sum, e) => sum + e.duration, 0),
  unresolvedEvents: downtimeEvents.filter((e) => !e.resolved).length,
  machinesDown: machineUptime.filter((m) => m.status === 'down').length,
});
