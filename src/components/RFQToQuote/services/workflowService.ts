import {
  WorkflowConfiguration,
  WorkflowNode,
  WorkflowStep,
  WorkflowCondition,
  StackedFilterNode,
  SortNode,
  DistributeByDivisionNode,
} from '../types/workflow';

const WORKFLOWS_STORAGE_KEY = 'rfq-workflow-configurations';
const ACTIVE_WORKFLOW_KEY = 'rfq-active-workflow';

// Generate unique IDs
export function generateId(prefix: string = 'wf'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Get all saved workflows
export function getWorkflows(): WorkflowConfiguration[] {
  try {
    const stored = localStorage.getItem(WORKFLOWS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load workflows:', error);
    return [];
  }
}

// Get a single workflow by ID
export function getWorkflow(id: string): WorkflowConfiguration | null {
  const workflows = getWorkflows();
  return workflows.find(w => w.id === id) || null;
}

// Save all workflows
function saveWorkflows(workflows: WorkflowConfiguration[]): void {
  try {
    localStorage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(workflows));
  } catch (error) {
    console.error('Failed to save workflows:', error);
  }
}

// Create a new workflow
export function createWorkflow(data: Omit<WorkflowConfiguration, 'id' | 'createdAt' | 'updatedAt'>): WorkflowConfiguration {
  const workflows = getWorkflows();
  const now = new Date().toISOString();

  const newWorkflow: WorkflowConfiguration = {
    ...data,
    id: generateId('workflow'),
    createdAt: now,
    updatedAt: now,
  };

  workflows.push(newWorkflow);
  saveWorkflows(workflows);
  return newWorkflow;
}

// Update an existing workflow
export function updateWorkflow(
  id: string,
  updates: Partial<Omit<WorkflowConfiguration, 'id' | 'createdAt'>>
): WorkflowConfiguration | null {
  const workflows = getWorkflows();
  const index = workflows.findIndex(w => w.id === id);

  if (index === -1) return null;

  workflows[index] = {
    ...workflows[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveWorkflows(workflows);
  return workflows[index];
}

// Delete a workflow
export function deleteWorkflow(id: string): boolean {
  const workflows = getWorkflows();
  const filtered = workflows.filter(w => w.id !== id);

  if (filtered.length === workflows.length) return false;

  saveWorkflows(filtered);

  // Clear active workflow if it was the deleted one
  if (getActiveWorkflowId() === id) {
    setActiveWorkflowId(null);
  }

  return true;
}

// Duplicate a workflow
export function duplicateWorkflow(id: string, newName: string): WorkflowConfiguration | null {
  const original = getWorkflow(id);
  if (!original) return null;

  // Deep clone nodes to avoid reference issues
  const clonedNodes = JSON.parse(JSON.stringify(original.nodes)) as WorkflowNode[];

  // Generate new IDs for all nodes
  const idMap = new Map<string, string>();

  function regenerateIds(nodes: WorkflowNode[]): WorkflowNode[] {
    return nodes.map(node => {
      const newId = generateId(node.type);
      idMap.set(node.id, newId);

      if (node.type === 'condition') {
        return {
          ...node,
          id: newId,
          trueBranch: regenerateIds(node.trueBranch),
          falseBranch: regenerateIds(node.falseBranch),
        };
      }

      return {
        ...node,
        id: newId,
        parentId: node.parentId ? idMap.get(node.parentId) || node.parentId : undefined,
      };
    });
  }

  const newNodes = regenerateIds(clonedNodes);

  return createWorkflow({
    name: newName,
    description: original.description,
    nodes: newNodes,
    isDefault: false,
  });
}

// Get/Set active workflow ID
export function getActiveWorkflowId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_WORKFLOW_KEY);
  } catch {
    return null;
  }
}

export function setActiveWorkflowId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(ACTIVE_WORKFLOW_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_WORKFLOW_KEY);
    }
  } catch (error) {
    console.error('Failed to set active workflow:', error);
  }
}

// Get the default workflow
export function getDefaultWorkflow(): WorkflowConfiguration | null {
  const workflows = getWorkflows();
  return workflows.find(w => w.isDefault) || workflows[0] || null;
}

// Set a workflow as default
export function setDefaultWorkflow(id: string): boolean {
  const workflows = getWorkflows();
  const index = workflows.findIndex(w => w.id === id);

  if (index === -1) return false;

  // Remove default flag from all others
  workflows.forEach(w => { w.isDefault = false; });
  workflows[index].isDefault = true;

  saveWorkflows(workflows);
  return true;
}

// Create a default step node
export function createStepNode(
  templateId: string,
  name: string,
  team: WorkflowStep['assignedTeam'],
  duration: number,
  order: number,
  options?: {
    description?: string;
    isRequired?: boolean;
    parentId?: string;
    branchPath?: 'true' | 'false';
  }
): WorkflowStep {
  return {
    id: generateId('step'),
    type: 'step',
    name,
    description: options?.description || '',
    assignedTeam: team,
    estimatedDuration: duration,
    isRequired: options?.isRequired ?? true,
    order,
    parentId: options?.parentId,
    branchPath: options?.branchPath,
  };
}

// Create a default condition node
export function createConditionNode(
  name: string,
  field: WorkflowCondition['field'],
  operator: WorkflowCondition['operator'],
  value: string | number,
  order: number
): WorkflowCondition {
  return {
    id: generateId('condition'),
    type: 'condition',
    name,
    field,
    operator,
    value,
    order,
    trueBranch: [],
    falseBranch: [],
  };
}

// Create a stacked filter node
export function createStackedFilterNode(
  name: string,
  order: number,
  options?: {
    description?: string;
  }
): StackedFilterNode {
  return {
    id: generateId('filter'),
    type: 'stackedFilter',
    name,
    description: options?.description,
    logicOperator: 'AND',
    conditions: [
      {
        id: generateId('cond'),
        field: 'material',
        operator: 'equals',
        value: '',
      },
    ],
    order,
    passBranch: [],
    failBranch: [],
  };
}

// Create a sort node
export function createSortNode(
  name: string,
  order: number,
  options?: {
    description?: string;
  }
): SortNode {
  return {
    id: generateId('sort'),
    type: 'sort',
    name,
    description: options?.description,
    sortField: 'value',
    sortOrder: 'desc',
    order,
  };
}

// Create a distribute node
export function createDistributeNode(
  name: string,
  order: number,
  options?: {
    description?: string;
  }
): DistributeByDivisionNode {
  return {
    id: generateId('distribute'),
    type: 'distribute',
    name,
    description: options?.description,
    divisions: [
      {
        id: generateId('div'),
        name: '',
        managerName: '',
        managerEmail: '',
        fallbackEmail: '',
      },
    ],
    distributionRule: 'roundRobin',
    notificationType: 'email',
    order,
  };
}

// Initialize with sample workflow if none exist
export function initializeDefaultWorkflows(): void {
  const existing = getWorkflows();
  if (existing.length > 0) return;

  const defaultWorkflow: Omit<WorkflowConfiguration, 'id' | 'createdAt' | 'updatedAt'> = {
    name: 'Standard RFQ Process',
    description: 'Default workflow for processing RFQ requests',
    isDefault: true,
    nodes: [
      createStepNode('eng-review', 'Engineering Review', 'Engineering', 24, 0, {
        description: 'Technical review of requirements and specifications',
        isRequired: true,
      }),
      createConditionNode('Value Check', 'value', 'greaterThan', 50000, 1),
      createStepNode('submit-vendor', 'Submit to Vendor', 'Vendor', 48, 2, {
        description: 'Send RFQ to vendor for quote',
        isRequired: true,
      }),
    ],
  };

  // Add steps to the condition branches
  const conditionNode = defaultWorkflow.nodes[1] as WorkflowCondition;
  conditionNode.trueBranch = [
    createStepNode('finance-approval', 'Finance Approval', 'Finance', 8, 0, {
      description: 'Finance review required for high-value RFQs',
      isRequired: true,
      parentId: conditionNode.id,
      branchPath: 'true',
    }),
  ];
  conditionNode.falseBranch = [
    createStepNode('direct-approval', 'Direct Approval', 'Operations', 4, 0, {
      description: 'Standard approval for lower-value RFQs',
      isRequired: true,
      parentId: conditionNode.id,
      branchPath: 'false',
    }),
  ];

  createWorkflow(defaultWorkflow);
}

// Export the service as default object
export const workflowService = {
  getWorkflows,
  getWorkflow,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  duplicateWorkflow,
  getActiveWorkflowId,
  setActiveWorkflowId,
  getDefaultWorkflow,
  setDefaultWorkflow,
  createStepNode,
  createConditionNode,
  createStackedFilterNode,
  createSortNode,
  createDistributeNode,
  initializeDefaultWorkflows,
  generateId,
};
