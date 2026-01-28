import { LucideIcon } from 'lucide-react';

// Team types used for workflow step assignments
export type TeamType = 'Engineering' | 'Procurement' | 'Finance' | 'Operations' | 'Quality' | 'Vendor';

// Base node type discriminator
export type WorkflowNodeType = 'step' | 'condition' | 'stackedFilter' | 'sort' | 'distribute';

// Contact information for user notifications
export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

// API Credentials for RFQ Received node
export interface InboxCredentials {
  clientId: string;
  clientSecret: string;
  endpoint?: string;
}

// Individual filter condition for stacked filters
export interface FilterCondition {
  id: string;
  field: ConditionField;
  operator: ConditionOperator;
  value: string | number;
}

// Division configuration for distribution
export interface DivisionConfig {
  id: string;
  name: string;
  managerName: string;
  managerEmail: string;
  fallbackEmail?: string;
}

// Workflow step - represents a single action in the workflow
export interface WorkflowStep {
  id: string;
  type: 'step';
  name: string;
  description: string;
  assignedTeam: TeamType;
  estimatedDuration: number; // hours
  isRequired: boolean;
  order: number;
  parentId?: string; // For steps inside condition branches
  branchPath?: 'true' | 'false'; // Which branch this step belongs to
  // For "Send to Users" step type
  contacts?: ContactInfo[];
  notificationType?: 'email' | 'sms' | 'both';
  // For "RFQ Received" step type
  inboxCredentials?: InboxCredentials;
}

// Condition operators for branching logic
export type ConditionOperator = 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains';

// Fields that can be evaluated in conditions
export type ConditionField =
  | 'value'
  | 'priority'
  | 'category'
  | 'items'
  // Technical specifications
  | 'material'
  | 'size'
  | 'contractLength'
  | 'building'
  // Quote filters
  | 'difficulty'
  | 'fit'
  | 'leadTime';

// Workflow condition - represents a branching point
export interface WorkflowCondition {
  id: string;
  type: 'condition';
  name: string; // e.g., "Value Check"
  field: ConditionField;
  operator: ConditionOperator;
  value: string | number;
  order: number;
  trueBranch: WorkflowNode[]; // Steps if condition is true
  falseBranch: WorkflowNode[]; // Steps if condition is false
}

// Stacked filter node - combine multiple conditions with AND/OR logic
export interface StackedFilterNode {
  id: string;
  type: 'stackedFilter';
  name: string;
  description?: string;
  logicOperator: 'AND' | 'OR';
  conditions: FilterCondition[];
  order: number;
  passBranch: WorkflowNode[]; // Steps if all/any conditions pass
  failBranch: WorkflowNode[]; // Steps if conditions fail
}

// Sort node - reorder RFQs by specified field
export interface SortNode {
  id: string;
  type: 'sort';
  name: string;
  description?: string;
  sortField: 'value' | 'fit' | 'leadTime' | 'priority';
  sortOrder: 'asc' | 'desc';
  order: number;
}

// Distribution node - route RFQs to division managers
export interface DistributeByDivisionNode {
  id: string;
  type: 'distribute';
  name: string;
  description?: string;
  divisions: DivisionConfig[];
  distributionRule: 'roundRobin' | 'byLocation' | 'manual';
  notificationType: 'email' | 'sms' | 'both';
  order: number;
}

// Union type for all workflow nodes
export type WorkflowNode =
  | WorkflowStep
  | WorkflowCondition
  | StackedFilterNode
  | SortNode
  | DistributeByDivisionNode;

// Saved workflow configuration
export interface WorkflowConfiguration {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[]; // Main workflow sequence
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Template category for sidebar organization
export type TemplateCategory = 'review' | 'approval' | 'processing' | 'notification' | 'condition';

// Step template for the sidebar
export interface StepTemplate {
  id: string;
  name: string;
  icon: LucideIcon;
  category: TemplateCategory;
  defaultTeam?: TeamType; // Optional for conditions
  defaultDuration?: number; // hours
  defaultDescription?: string;
  isStartNode?: boolean; // Marks this as a workflow starting point
}

// Condition template for the sidebar
export interface ConditionTemplate {
  id: string;
  name: string;
  icon: LucideIcon;
  category: 'condition';
  field: ConditionField;
  operator: ConditionOperator;
  defaultValue: string | number;
}

// Type guards for distinguishing node types
export function isWorkflowStep(node: WorkflowNode): node is WorkflowStep {
  return node.type === 'step';
}

export function isWorkflowCondition(node: WorkflowNode): node is WorkflowCondition {
  return node.type === 'condition';
}

export function isStackedFilterNode(node: WorkflowNode): node is StackedFilterNode {
  return node.type === 'stackedFilter';
}

export function isSortNode(node: WorkflowNode): node is SortNode {
  return node.type === 'sort';
}

export function isDistributeNode(node: WorkflowNode): node is DistributeByDivisionNode {
  return node.type === 'distribute';
}

// Helper type for drag and drop operations
export interface DragItem {
  id: string;
  type: 'template' | 'node';
  nodeType: WorkflowNodeType;
  templateId?: string;
  index?: number;
  parentId?: string;
  branchPath?: 'true' | 'false';
}

// Operator display labels
export const operatorLabels: Record<ConditionOperator, string> = {
  equals: 'equals',
  notEquals: 'does not equal',
  greaterThan: 'is greater than',
  lessThan: 'is less than',
  contains: 'contains',
};

// Field display labels
export const fieldLabels: Record<ConditionField, string> = {
  value: 'RFQ Value ($)',
  priority: 'Priority',
  category: 'Category',
  items: 'Number of Items',
  // Technical specifications
  material: 'Material Type',
  size: 'Size/Dimensions',
  contractLength: 'Contract Length',
  building: 'Building/Location',
  // Quote filters
  difficulty: 'Difficulty Level',
  fit: 'Fit Score',
  leadTime: 'Lead Time (days)',
};
