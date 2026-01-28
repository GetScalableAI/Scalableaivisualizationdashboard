// Shared types for RFQ List View components

export type RFQStatus = 'draft' | 'sent' | 'processing' | 'quoted' | 'accepted' | 'rejected' | 'expired';
export type TeamType = 'Engineering' | 'Procurement' | 'Finance' | 'Operations' | 'Quality' | 'Vendor';
export type DifficultyLevel = 'low' | 'medium' | 'high' | 'very high';
export type FitScore = 'poor' | 'fair' | 'good' | 'excellent';
export type ContractLength = 'short' | 'medium' | 'long' | 'multi-year';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface RFQ {
  id: string;
  title: string;
  vendor: string;
  category: string;
  value: number;
  items: number;
  status: RFQStatus;
  assignedTo: TeamType;
  createdDate: string;
  dueDate: string;
  responseDate?: string;
  quoteAmount?: number;
  processingProgress?: number;
  priority: Priority;
  difficulty?: DifficultyLevel;
  fit?: FitScore;
  contractLength?: ContractLength;
  leadTime?: number; // days
  material?: string;
  size?: string;
  building?: string;
}

export interface DivisionDistribution {
  divisionName: string;
  managerName: string;
  rfqCount: number;
  rfqs: RFQ[];
}

export interface DistributionSettings {
  enabled: boolean;
  rfqsPerDay: number;
  distributionTime: string; // e.g., "09:00"
  lastDistribution?: string; // ISO date
}
