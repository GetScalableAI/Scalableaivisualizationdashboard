import { RFQ, DivisionDistribution, DistributionSettings } from '../RFQListView/types';

const DISTRIBUTION_SETTINGS_KEY = 'rfq-distribution-settings';
const DISTRIBUTION_HISTORY_KEY = 'rfq-distribution-history';

// Distribution history entry
export interface DistributionHistoryEntry {
  id: string;
  date: string; // ISO date
  rfqs: string[]; // RFQ IDs
  distributions: DivisionDistribution[];
}

// Get distribution settings from localStorage
export function getDistributionSettings(): DistributionSettings {
  try {
    const stored = localStorage.getItem(DISTRIBUTION_SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load distribution settings:', error);
  }

  // Default settings
  return {
    enabled: true,
    rfqsPerDay: 5,
    distributionTime: '09:00',
  };
}

// Save distribution settings to localStorage
export function saveDistributionSettings(settings: DistributionSettings): void {
  try {
    localStorage.setItem(DISTRIBUTION_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save distribution settings:', error);
  }
}

// Get distribution history
export function getDistributionHistory(): DistributionHistoryEntry[] {
  try {
    const stored = localStorage.getItem(DISTRIBUTION_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load distribution history:', error);
    return [];
  }
}

// Save distribution history entry
export function saveDistributionHistoryEntry(entry: DistributionHistoryEntry): void {
  try {
    const history = getDistributionHistory();
    history.push(entry);

    // Keep only last 30 days of history
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const filtered = history.filter(h => new Date(h.date) >= thirtyDaysAgo);

    localStorage.setItem(DISTRIBUTION_HISTORY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to save distribution history:', error);
  }
}

// Get today's distributions
export function getTodaysDistributions(): DivisionDistribution[] {
  const history = getDistributionHistory();
  const today = new Date().toISOString().split('T')[0];
  const todayEntry = history.find(h => h.date.startsWith(today));
  return todayEntry?.distributions || [];
}

// Sort RFQs by revenue (highest first) and fit score (excellent first)
export function sortRFQsByPriority(rfqs: RFQ[]): RFQ[] {
  const fitScoreValues = {
    excellent: 4,
    good: 3,
    fair: 2,
    poor: 1,
  };

  return [...rfqs].sort((a, b) => {
    // Primary sort: Revenue (descending)
    const revenueDiff = b.value - a.value;
    if (revenueDiff !== 0) return revenueDiff;

    // Secondary sort: Fit score (descending)
    const aFit = a.fit ? fitScoreValues[a.fit] : 0;
    const bFit = b.fit ? fitScoreValues[b.fit] : 0;
    return bFit - aFit;
  });
}

// Round-robin distribution algorithm
export function distributeRoundRobin(
  rfqs: RFQ[],
  divisions: Array<{ name: string; managerName: string; managerEmail: string }>,
  count: number
): DivisionDistribution[] {
  if (divisions.length === 0 || rfqs.length === 0) return [];

  const sorted = sortRFQsByPriority(rfqs);
  const selected = sorted.slice(0, Math.min(count, sorted.length));

  const distributions: DivisionDistribution[] = divisions.map(div => ({
    divisionName: div.name,
    managerName: div.managerName,
    rfqCount: 0,
    rfqs: [],
  }));

  // Distribute in round-robin fashion
  selected.forEach((rfq, index) => {
    const divisionIndex = index % divisions.length;
    distributions[divisionIndex].rfqs.push(rfq);
    distributions[divisionIndex].rfqCount++;
  });

  // Filter out divisions with no RFQs
  return distributions.filter(d => d.rfqCount > 0);
}

// Location-based distribution (assigns based on RFQ building field)
export function distributeByLocation(
  rfqs: RFQ[],
  divisions: Array<{ name: string; managerName: string; managerEmail: string; location?: string }>,
  count: number
): DivisionDistribution[] {
  if (divisions.length === 0 || rfqs.length === 0) return [];

  const sorted = sortRFQsByPriority(rfqs);
  const selected = sorted.slice(0, Math.min(count, sorted.length));

  const distributions: DivisionDistribution[] = divisions.map(div => ({
    divisionName: div.name,
    managerName: div.managerName,
    rfqCount: 0,
    rfqs: [],
  }));

  // Create location mapping (simple string matching)
  const locationMap = new Map<string, number>();
  divisions.forEach((div, index) => {
    if (div.location) {
      locationMap.set(div.location.toLowerCase(), index);
    }
  });

  // Distribute based on building/location match, fallback to round-robin
  let roundRobinIndex = 0;
  selected.forEach((rfq) => {
    let divisionIndex = -1;

    if (rfq.building) {
      const building = rfq.building.toLowerCase();
      divisionIndex = locationMap.get(building) ?? -1;
    }

    // Fallback to round-robin if no match
    if (divisionIndex === -1) {
      divisionIndex = roundRobinIndex % divisions.length;
      roundRobinIndex++;
    }

    distributions[divisionIndex].rfqs.push(rfq);
    distributions[divisionIndex].rfqCount++;
  });

  return distributions.filter(d => d.rfqCount > 0);
}

// Get available (unassigned) RFQs for distribution
export function getAvailableRFQsForDistribution(allRFQs: RFQ[]): RFQ[] {
  // Filter for RFQs that are ready for distribution
  // Typically: status is 'sent' or 'processing', and not already distributed today
  const todayDistributions = getTodaysDistributions();
  const distributedIds = new Set(
    todayDistributions.flatMap(d => d.rfqs.map(rfq => rfq.id))
  );

  return allRFQs.filter(rfq => {
    // Not already distributed today
    if (distributedIds.has(rfq.id)) return false;

    // Only distribute RFQs that are sent or in early processing
    return rfq.status === 'sent' || rfq.status === 'processing';
  });
}

// Execute distribution
export function executeDistribution(
  availableRFQs: RFQ[],
  divisions: Array<{ name: string; managerName: string; managerEmail: string }>,
  settings: DistributionSettings,
  algorithm: 'roundRobin' | 'byLocation' = 'roundRobin'
): DivisionDistribution[] {
  const eligible = getAvailableRFQsForDistribution(availableRFQs);

  let distributions: DivisionDistribution[];
  if (algorithm === 'byLocation') {
    distributions = distributeByLocation(eligible, divisions, settings.rfqsPerDay);
  } else {
    distributions = distributeRoundRobin(eligible, divisions, settings.rfqsPerDay);
  }

  // Save to history
  if (distributions.length > 0) {
    const entry: DistributionHistoryEntry = {
      id: `dist-${Date.now()}`,
      date: new Date().toISOString(),
      rfqs: distributions.flatMap(d => d.rfqs.map(rfq => rfq.id)),
      distributions,
    };
    saveDistributionHistoryEntry(entry);

    // Update settings with last distribution time
    saveDistributionSettings({
      ...settings,
      lastDistribution: entry.date,
    });
  }

  return distributions;
}

// Check if it's time for automatic distribution
export function shouldAutoDistribute(settings: DistributionSettings): boolean {
  if (!settings.enabled) return false;

  const now = new Date();
  const [hours, minutes] = settings.distributionTime.split(':').map(Number);

  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);

  // Check if we're within 5 minutes of scheduled time
  const timeDiff = Math.abs(now.getTime() - scheduledTime.getTime());
  const fiveMinutes = 5 * 60 * 1000;

  if (timeDiff > fiveMinutes) return false;

  // Check if we already distributed today
  const todayDistributions = getTodaysDistributions();
  return todayDistributions.length === 0;
}

// Get distribution statistics
export function getDistributionStats() {
  const history = getDistributionHistory();
  const todayDistributions = getTodaysDistributions();

  const totalDistributed = todayDistributions.reduce((sum, d) => sum + d.rfqCount, 0);
  const totalValue = todayDistributions.reduce(
    (sum, d) => sum + d.rfqs.reduce((s, rfq) => s + rfq.value, 0),
    0
  );

  return {
    todayCount: totalDistributed,
    todayValue: totalValue,
    historyCount: history.length,
    lastDistribution: history.length > 0 ? history[history.length - 1].date : null,
  };
}

// Export service object
export const distributionService = {
  getDistributionSettings,
  saveDistributionSettings,
  getDistributionHistory,
  getTodaysDistributions,
  sortRFQsByPriority,
  distributeRoundRobin,
  distributeByLocation,
  getAvailableRFQsForDistribution,
  executeDistribution,
  shouldAutoDistribute,
  getDistributionStats,
};
