import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import {
  WorkflowConfiguration,
  WorkflowNode,
  WorkflowStep,
  WorkflowCondition,
  isWorkflowCondition,
} from '../types/workflow';
import { workflowService } from '../services/workflowService';

// State interface
interface WorkflowState {
  workflows: WorkflowConfiguration[];
  currentWorkflow: WorkflowConfiguration | null;
  isDirty: boolean;
  selectedNodeId: string | null;
  isLoading: boolean;
}

// Action types
type WorkflowAction =
  | { type: 'SET_WORKFLOWS'; workflows: WorkflowConfiguration[] }
  | { type: 'SET_CURRENT_WORKFLOW'; workflow: WorkflowConfiguration | null }
  | { type: 'SET_DIRTY'; isDirty: boolean }
  | { type: 'SET_SELECTED_NODE'; nodeId: string | null }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'ADD_NODE'; node: WorkflowNode; parentId?: string; branchPath?: 'true' | 'false' }
  | { type: 'UPDATE_NODE'; nodeId: string; updates: Partial<WorkflowNode> }
  | { type: 'REMOVE_NODE'; nodeId: string }
  | { type: 'REORDER_NODES'; nodes: WorkflowNode[] }
  | { type: 'MOVE_NODE_TO_BRANCH'; nodeId: string; conditionId: string; branchPath: 'true' | 'false'; index: number }
  | { type: 'MOVE_NODE_TO_MAIN'; nodeId: string; index: number }
  | { type: 'ADD_NODE_TO_BRANCH'; conditionId: string; branchPath: 'true' | 'false'; node: WorkflowNode }
  | { type: 'REORDER_BRANCH'; conditionId: string; branchPath: 'true' | 'false'; nodes: WorkflowNode[] };

// Initial state
const initialState: WorkflowState = {
  workflows: [],
  currentWorkflow: null,
  isDirty: false,
  selectedNodeId: null,
  isLoading: true,
};

// Helper to find and update a node deeply in the tree
function updateNodeInTree(nodes: WorkflowNode[], nodeId: string, updates: Partial<WorkflowNode>): WorkflowNode[] {
  return nodes.map(node => {
    if (node.id === nodeId) {
      return { ...node, ...updates } as WorkflowNode;
    }
    if (isWorkflowCondition(node)) {
      return {
        ...node,
        trueBranch: updateNodeInTree(node.trueBranch, nodeId, updates),
        falseBranch: updateNodeInTree(node.falseBranch, nodeId, updates),
      };
    }
    return node;
  });
}

// Helper to remove a node from the tree
function removeNodeFromTree(nodes: WorkflowNode[], nodeId: string): WorkflowNode[] {
  return nodes
    .filter(node => node.id !== nodeId)
    .map(node => {
      if (isWorkflowCondition(node)) {
        return {
          ...node,
          trueBranch: removeNodeFromTree(node.trueBranch, nodeId),
          falseBranch: removeNodeFromTree(node.falseBranch, nodeId),
        };
      }
      return node;
    });
}

// Helper to find a node in the tree
function findNodeInTree(nodes: WorkflowNode[], nodeId: string): WorkflowNode | null {
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    if (isWorkflowCondition(node)) {
      const found = findNodeInTree(node.trueBranch, nodeId) || findNodeInTree(node.falseBranch, nodeId);
      if (found) return found;
    }
  }
  return null;
}

// Reducer function
function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case 'SET_WORKFLOWS':
      return { ...state, workflows: action.workflows };

    case 'SET_CURRENT_WORKFLOW':
      return { ...state, currentWorkflow: action.workflow, isDirty: false };

    case 'SET_DIRTY':
      return { ...state, isDirty: action.isDirty };

    case 'SET_SELECTED_NODE':
      return { ...state, selectedNodeId: action.nodeId };

    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };

    case 'ADD_NODE': {
      if (!state.currentWorkflow) return state;

      let newNodes: WorkflowNode[];

      if (action.parentId && action.branchPath) {
        // Adding to a condition branch
        newNodes = state.currentWorkflow.nodes.map(node => {
          if (node.id === action.parentId && isWorkflowCondition(node)) {
            const branchKey = action.branchPath === 'true' ? 'trueBranch' : 'falseBranch';
            return {
              ...node,
              [branchKey]: [...node[branchKey], { ...action.node, parentId: action.parentId, branchPath: action.branchPath }],
            };
          }
          return node;
        });
      } else {
        // Adding to main workflow
        newNodes = [...state.currentWorkflow.nodes, action.node];
      }

      // Recompute order
      newNodes = newNodes.map((node, index) => ({ ...node, order: index }));

      return {
        ...state,
        currentWorkflow: { ...state.currentWorkflow, nodes: newNodes },
        isDirty: true,
      };
    }

    case 'UPDATE_NODE': {
      if (!state.currentWorkflow) return state;

      const updatedNodes = updateNodeInTree(state.currentWorkflow.nodes, action.nodeId, action.updates);

      return {
        ...state,
        currentWorkflow: { ...state.currentWorkflow, nodes: updatedNodes },
        isDirty: true,
      };
    }

    case 'REMOVE_NODE': {
      if (!state.currentWorkflow) return state;

      const filteredNodes = removeNodeFromTree(state.currentWorkflow.nodes, action.nodeId);
      // Recompute order
      const reorderedNodes = filteredNodes.map((node, index) => ({ ...node, order: index }));

      return {
        ...state,
        currentWorkflow: { ...state.currentWorkflow, nodes: reorderedNodes },
        isDirty: true,
        selectedNodeId: state.selectedNodeId === action.nodeId ? null : state.selectedNodeId,
      };
    }

    case 'REORDER_NODES': {
      if (!state.currentWorkflow) return state;

      const reorderedNodes = action.nodes.map((node, index) => ({ ...node, order: index }));

      return {
        ...state,
        currentWorkflow: { ...state.currentWorkflow, nodes: reorderedNodes },
        isDirty: true,
      };
    }

    case 'ADD_NODE_TO_BRANCH': {
      if (!state.currentWorkflow) return state;

      const newNodes = state.currentWorkflow.nodes.map(node => {
        if (node.id === action.conditionId && isWorkflowCondition(node)) {
          const branchKey = action.branchPath === 'true' ? 'trueBranch' : 'falseBranch';
          const newNode = {
            ...action.node,
            parentId: action.conditionId,
            branchPath: action.branchPath,
          };
          return {
            ...node,
            [branchKey]: [...node[branchKey], newNode],
          };
        }
        return node;
      });

      return {
        ...state,
        currentWorkflow: { ...state.currentWorkflow, nodes: newNodes },
        isDirty: true,
      };
    }

    case 'REORDER_BRANCH': {
      if (!state.currentWorkflow) return state;

      const newNodes = state.currentWorkflow.nodes.map(node => {
        if (node.id === action.conditionId && isWorkflowCondition(node)) {
          const branchKey = action.branchPath === 'true' ? 'trueBranch' : 'falseBranch';
          const reorderedBranch = action.nodes.map((n, index) => ({ ...n, order: index }));
          return {
            ...node,
            [branchKey]: reorderedBranch,
          };
        }
        return node;
      });

      return {
        ...state,
        currentWorkflow: { ...state.currentWorkflow, nodes: newNodes },
        isDirty: true,
      };
    }

    case 'MOVE_NODE_TO_BRANCH': {
      if (!state.currentWorkflow) return state;

      // Find the node to move
      const nodeToMove = findNodeInTree(state.currentWorkflow.nodes, action.nodeId);
      if (!nodeToMove) return state;

      // Remove from current location
      let newNodes = removeNodeFromTree(state.currentWorkflow.nodes, action.nodeId);

      // Add to the target branch
      newNodes = newNodes.map(node => {
        if (node.id === action.conditionId && isWorkflowCondition(node)) {
          const branchKey = action.branchPath === 'true' ? 'trueBranch' : 'falseBranch';
          const branch = [...node[branchKey]];
          const movedNode = {
            ...nodeToMove,
            parentId: action.conditionId,
            branchPath: action.branchPath,
          };
          branch.splice(action.index, 0, movedNode);
          return {
            ...node,
            [branchKey]: branch.map((n, i) => ({ ...n, order: i })),
          };
        }
        return node;
      });

      return {
        ...state,
        currentWorkflow: { ...state.currentWorkflow, nodes: newNodes },
        isDirty: true,
      };
    }

    case 'MOVE_NODE_TO_MAIN': {
      if (!state.currentWorkflow) return state;

      // Find the node to move
      const nodeToMove = findNodeInTree(state.currentWorkflow.nodes, action.nodeId);
      if (!nodeToMove) return state;

      // Remove from current location
      let newNodes = removeNodeFromTree(state.currentWorkflow.nodes, action.nodeId);

      // Add to main workflow at index
      const movedNode = { ...nodeToMove, parentId: undefined, branchPath: undefined };
      newNodes.splice(action.index, 0, movedNode);

      // Recompute order
      newNodes = newNodes.map((node, index) => ({ ...node, order: index }));

      return {
        ...state,
        currentWorkflow: { ...state.currentWorkflow, nodes: newNodes },
        isDirty: true,
      };
    }

    default:
      return state;
  }
}

// Context type
interface WorkflowContextType {
  state: WorkflowState;
  dispatch: React.Dispatch<WorkflowAction>;

  // Workflow CRUD actions
  loadWorkflows: () => void;
  loadWorkflow: (id: string) => void;
  createWorkflow: (name: string, description?: string) => WorkflowConfiguration;
  saveWorkflow: () => WorkflowConfiguration | null;
  deleteWorkflow: (id: string) => void;
  duplicateWorkflow: (id: string, newName: string) => WorkflowConfiguration | null;

  // Node actions
  addNode: (node: WorkflowNode, parentId?: string, branchPath?: 'true' | 'false') => void;
  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  removeNode: (nodeId: string) => void;
  reorderNodes: (nodes: WorkflowNode[]) => void;
  selectNode: (nodeId: string | null) => void;

  // Branch-specific actions
  addNodeToBranch: (conditionId: string, branchPath: 'true' | 'false', node: WorkflowNode) => void;
  reorderBranch: (conditionId: string, branchPath: 'true' | 'false', nodes: WorkflowNode[]) => void;
  moveNodeToBranch: (nodeId: string, conditionId: string, branchPath: 'true' | 'false', index: number) => void;
  moveNodeToMain: (nodeId: string, index: number) => void;

  // Utilities
  getSelectedNode: () => WorkflowNode | null;
  resetWorkflow: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

// Provider component
export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  // Initialize workflows on mount
  useEffect(() => {
    workflowService.initializeDefaultWorkflows();
    const workflows = workflowService.getWorkflows();
    dispatch({ type: 'SET_WORKFLOWS', workflows });

    // Load active workflow or default
    const activeId = workflowService.getActiveWorkflowId();
    const toLoad = activeId
      ? workflowService.getWorkflow(activeId)
      : workflowService.getDefaultWorkflow();

    if (toLoad) {
      dispatch({ type: 'SET_CURRENT_WORKFLOW', workflow: toLoad });
    }

    dispatch({ type: 'SET_LOADING', isLoading: false });
  }, []);

  // Workflow CRUD actions
  const loadWorkflows = useCallback(() => {
    const workflows = workflowService.getWorkflows();
    dispatch({ type: 'SET_WORKFLOWS', workflows });
  }, []);

  const loadWorkflow = useCallback((id: string) => {
    const workflow = workflowService.getWorkflow(id);
    if (workflow) {
      dispatch({ type: 'SET_CURRENT_WORKFLOW', workflow });
      workflowService.setActiveWorkflowId(id);
    }
  }, []);

  const createWorkflow = useCallback((name: string, description?: string): WorkflowConfiguration => {
    const newWorkflow = workflowService.createWorkflow({
      name,
      description,
      nodes: [],
    });
    loadWorkflows();
    dispatch({ type: 'SET_CURRENT_WORKFLOW', workflow: newWorkflow });
    workflowService.setActiveWorkflowId(newWorkflow.id);
    return newWorkflow;
  }, [loadWorkflows]);

  const saveWorkflow = useCallback((): WorkflowConfiguration | null => {
    if (!state.currentWorkflow) return null;

    const updated = workflowService.updateWorkflow(state.currentWorkflow.id, {
      name: state.currentWorkflow.name,
      description: state.currentWorkflow.description,
      nodes: state.currentWorkflow.nodes,
    });

    if (updated) {
      dispatch({ type: 'SET_DIRTY', isDirty: false });
      loadWorkflows();
    }

    return updated;
  }, [state.currentWorkflow, loadWorkflows]);

  const deleteWorkflowAction = useCallback((id: string) => {
    workflowService.deleteWorkflow(id);
    loadWorkflows();

    if (state.currentWorkflow?.id === id) {
      const defaultWorkflow = workflowService.getDefaultWorkflow();
      dispatch({ type: 'SET_CURRENT_WORKFLOW', workflow: defaultWorkflow });
      if (defaultWorkflow) {
        workflowService.setActiveWorkflowId(defaultWorkflow.id);
      }
    }
  }, [state.currentWorkflow, loadWorkflows]);

  const duplicateWorkflowAction = useCallback((id: string, newName: string): WorkflowConfiguration | null => {
    const duplicated = workflowService.duplicateWorkflow(id, newName);
    if (duplicated) {
      loadWorkflows();
    }
    return duplicated;
  }, [loadWorkflows]);

  // Node actions
  const addNode = useCallback((node: WorkflowNode, parentId?: string, branchPath?: 'true' | 'false') => {
    dispatch({ type: 'ADD_NODE', node, parentId, branchPath });
  }, []);

  const updateNode = useCallback((nodeId: string, updates: Partial<WorkflowNode>) => {
    dispatch({ type: 'UPDATE_NODE', nodeId, updates });
  }, []);

  const removeNode = useCallback((nodeId: string) => {
    dispatch({ type: 'REMOVE_NODE', nodeId });
  }, []);

  const reorderNodes = useCallback((nodes: WorkflowNode[]) => {
    dispatch({ type: 'REORDER_NODES', nodes });
  }, []);

  const selectNode = useCallback((nodeId: string | null) => {
    dispatch({ type: 'SET_SELECTED_NODE', nodeId });
  }, []);

  // Branch-specific actions
  const addNodeToBranch = useCallback((conditionId: string, branchPath: 'true' | 'false', node: WorkflowNode) => {
    dispatch({ type: 'ADD_NODE_TO_BRANCH', conditionId, branchPath, node });
  }, []);

  const reorderBranch = useCallback((conditionId: string, branchPath: 'true' | 'false', nodes: WorkflowNode[]) => {
    dispatch({ type: 'REORDER_BRANCH', conditionId, branchPath, nodes });
  }, []);

  const moveNodeToBranch = useCallback((nodeId: string, conditionId: string, branchPath: 'true' | 'false', index: number) => {
    dispatch({ type: 'MOVE_NODE_TO_BRANCH', nodeId, conditionId, branchPath, index });
  }, []);

  const moveNodeToMain = useCallback((nodeId: string, index: number) => {
    dispatch({ type: 'MOVE_NODE_TO_MAIN', nodeId, index });
  }, []);

  // Utilities
  const getSelectedNode = useCallback((): WorkflowNode | null => {
    if (!state.selectedNodeId || !state.currentWorkflow) return null;
    return findNodeInTree(state.currentWorkflow.nodes, state.selectedNodeId);
  }, [state.selectedNodeId, state.currentWorkflow]);

  const resetWorkflow = useCallback(() => {
    if (state.currentWorkflow) {
      const original = workflowService.getWorkflow(state.currentWorkflow.id);
      if (original) {
        dispatch({ type: 'SET_CURRENT_WORKFLOW', workflow: original });
      }
    }
  }, [state.currentWorkflow]);

  const contextValue: WorkflowContextType = {
    state,
    dispatch,
    loadWorkflows,
    loadWorkflow,
    createWorkflow,
    saveWorkflow,
    deleteWorkflow: deleteWorkflowAction,
    duplicateWorkflow: duplicateWorkflowAction,
    addNode,
    updateNode,
    removeNode,
    reorderNodes,
    selectNode,
    addNodeToBranch,
    reorderBranch,
    moveNodeToBranch,
    moveNodeToMain,
    getSelectedNode,
    resetWorkflow,
  };

  return (
    <WorkflowContext.Provider value={contextValue}>
      {children}
    </WorkflowContext.Provider>
  );
}

// Hook to use workflow context
export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}

// Safe hook for use in components that might not be wrapped in provider
export function useWorkflowSafe() {
  return useContext(WorkflowContext);
}
