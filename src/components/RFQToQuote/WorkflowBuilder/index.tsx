import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { Save, RotateCcw, FolderOpen, Plus, Loader2 } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';
import {
  WorkflowNode,
  WorkflowStep,
  WorkflowCondition,
  StackedFilterNode as StackedFilterNodeType,
  SortNode as SortNodeType,
  DistributeByDivisionNode as DistributeNodeType,
  isWorkflowStep,
  isWorkflowCondition,
  isStackedFilterNode,
  isSortNode,
  isDistributeNode,
  StepTemplate,
  ConditionTemplate,
  StackedFilterTemplate,
  SortTemplate,
  DistributeTemplate,
} from '../types/workflow';
import { workflowService } from '../services/workflowService';
import StepTemplatesSidebar, {
  STEP_TEMPLATES,
  CONDITION_TEMPLATES,
  STACKED_FILTER_TEMPLATES,
  SORT_TEMPLATES,
  DISTRIBUTE_TEMPLATES,
} from './StepTemplatesSidebar';
import WorkflowCanvas from './WorkflowCanvas';
import StepConfigDialog from './StepConfigDialog';
import ConditionConfigDialog from './ConditionConfigDialog';
import StackedFilterDialog from './dialogs/StackedFilterDialog';
import SortConfigDialog from './dialogs/SortConfigDialog';
import DistributionDialog from './dialogs/DistributionDialog';
import { WorkflowStepOverlay } from './WorkflowStep';
import { WorkflowConditionOverlay } from './WorkflowCondition';
import { StackedFilterNodeOverlay } from './nodes/StackedFilterNode';
import { SortNodeOverlay } from './nodes/SortNode';
import { DistributeNodeOverlay } from './nodes/DistributeNode';

interface ActiveDragItem {
  type: 'template' | 'node';
  nodeType: 'step' | 'condition' | 'stackedFilter' | 'sort' | 'distribute';
  data:
    | StepTemplate
    | ConditionTemplate
    | StackedFilterTemplate
    | SortTemplate
    | DistributeTemplate
    | WorkflowNode;
}

export default function WorkflowBuilder() {
  const {
    state,
    addNode,
    updateNode,
    reorderNodes,
    saveWorkflow,
    resetWorkflow,
    createWorkflow,
    loadWorkflow,
    addNodeToBranch,
    reorderBranch,
  } = useWorkflow();

  const [activeDrag, setActiveDrag] = useState<ActiveDragItem | null>(null);
  const [stepDialogOpen, setStepDialogOpen] = useState(false);
  const [conditionDialogOpen, setConditionDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [sortDialogOpen, setSortDialogOpen] = useState(false);
  const [distributeDialogOpen, setDistributeDialogOpen] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [showWorkflowSelector, setShowWorkflowSelector] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;

    if (data?.type === 'template') {
      setActiveDrag({
        type: 'template',
        nodeType: data.nodeType,
        data: data.template,
      });
    } else if (data) {
      // It's an existing node being reordered
      const node = state.currentWorkflow?.nodes.find(n => n.id === active.id);
      if (node) {
        setActiveDrag({
          type: 'node',
          nodeType: node.type,
          data: node,
        });
      }
    }
  }, [state.currentWorkflow]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Handle drag over for visual feedback
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDrag(null);

    if (!over || !state.currentWorkflow) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Dropping a template
    if (activeData?.type === 'template') {
      const template = activeData.template as StepTemplate | ConditionTemplate;

      // Check if dropping on a branch
      if (overData?.type === 'branch') {
        const { conditionId, branchPath } = overData as { conditionId: string; branchPath: 'true' | 'false' };

        if (activeData.nodeType === 'step') {
          const stepTemplate = template as StepTemplate;
          const newStep: WorkflowStep = workflowService.createStepNode(
            stepTemplate.id,
            stepTemplate.name,
            stepTemplate.defaultTeam || 'Engineering',
            stepTemplate.defaultDuration || 24,
            0,
            {
              description: stepTemplate.defaultDescription,
              isRequired: true,
              parentId: conditionId,
              branchPath,
            }
          );
          addNodeToBranch(conditionId, branchPath, newStep);
        }
        // Conditions can't be added to branches
        return;
      }

      // Dropping on canvas
      if (overData?.type === 'canvas' || over.id === 'canvas-drop-zone') {
        if (activeData.nodeType === 'step') {
          const stepTemplate = template as StepTemplate;
          const newStep: WorkflowStep = workflowService.createStepNode(
            stepTemplate.id,
            stepTemplate.name,
            stepTemplate.defaultTeam || 'Engineering',
            stepTemplate.defaultDuration || 24,
            state.currentWorkflow.nodes.length,
            {
              description: stepTemplate.defaultDescription,
              isRequired: true,
            }
          );
          addNode(newStep);
        } else if (activeData.nodeType === 'condition') {
          const condTemplate = template as ConditionTemplate;
          const newCondition: WorkflowCondition = workflowService.createConditionNode(
            condTemplate.name,
            condTemplate.field,
            condTemplate.operator,
            condTemplate.defaultValue,
            state.currentWorkflow.nodes.length
          );
          addNode(newCondition);
        } else if (activeData.nodeType === 'stackedFilter') {
          const filterTemplate = template as StackedFilterTemplate;
          const newFilter: StackedFilterNodeType = workflowService.createStackedFilterNode(
            filterTemplate.name,
            state.currentWorkflow.nodes.length,
            { description: filterTemplate.defaultDescription }
          );
          addNode(newFilter);
        } else if (activeData.nodeType === 'sort') {
          const sortTemplate = template as SortTemplate;
          const newSort: SortNodeType = workflowService.createSortNode(
            sortTemplate.name,
            state.currentWorkflow.nodes.length,
            { description: sortTemplate.defaultDescription }
          );
          addNode(newSort);
        } else if (activeData.nodeType === 'distribute') {
          const distributeTemplate = template as DistributeTemplate;
          const newDistribute: DistributeNodeType = workflowService.createDistributeNode(
            distributeTemplate.name,
            state.currentWorkflow.nodes.length,
            { description: distributeTemplate.defaultDescription }
          );
          addNode(newDistribute);
        }
        return;
      }
    }

    // Reordering existing nodes in main workflow
    if (active.id !== over.id && !activeData?.type) {
      const nodes = state.currentWorkflow.nodes;
      const oldIndex = nodes.findIndex(n => n.id === active.id);
      const newIndex = nodes.findIndex(n => n.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newNodes = arrayMove(nodes, oldIndex, newIndex);
        reorderNodes(newNodes);
      }
    }
  }, [state.currentWorkflow, addNode, addNodeToBranch, reorderNodes]);

  const handleEditStep = useCallback((stepId: string) => {
    setEditingNodeId(stepId);
    setStepDialogOpen(true);
  }, []);

  const handleEditCondition = useCallback((conditionId: string) => {
    setEditingNodeId(conditionId);
    setConditionDialogOpen(true);
  }, []);

  const handleEditFilter = useCallback((filterId: string) => {
    setEditingNodeId(filterId);
    setFilterDialogOpen(true);
  }, []);

  const handleEditSort = useCallback((sortId: string) => {
    setEditingNodeId(sortId);
    setSortDialogOpen(true);
  }, []);

  const handleEditDistribute = useCallback((distributeId: string) => {
    setEditingNodeId(distributeId);
    setDistributeDialogOpen(true);
  }, []);

  const handleSaveStep = useCallback((updates: Partial<WorkflowStep>) => {
    if (editingNodeId) {
      updateNode(editingNodeId, updates);
    }
    setEditingNodeId(null);
  }, [editingNodeId, updateNode]);

  const handleSaveCondition = useCallback((updates: Partial<WorkflowCondition>) => {
    if (editingNodeId) {
      updateNode(editingNodeId, updates);
    }
    setEditingNodeId(null);
  }, [editingNodeId, updateNode]);

  const handleSaveFilter = useCallback((updates: Partial<StackedFilterNodeType>) => {
    if (editingNodeId) {
      updateNode(editingNodeId, updates);
    }
    setEditingNodeId(null);
  }, [editingNodeId, updateNode]);

  const handleSaveSort = useCallback((updates: Partial<SortNodeType>) => {
    if (editingNodeId) {
      updateNode(editingNodeId, updates);
    }
    setEditingNodeId(null);
  }, [editingNodeId, updateNode]);

  const handleSaveDistribute = useCallback((updates: Partial<DistributeNodeType>) => {
    if (editingNodeId) {
      updateNode(editingNodeId, updates);
    }
    setEditingNodeId(null);
  }, [editingNodeId, updateNode]);

  const getEditingStep = (): WorkflowStep | null => {
    if (!editingNodeId || !state.currentWorkflow) return null;
    const node = findNodeById(state.currentWorkflow.nodes, editingNodeId);
    return node && isWorkflowStep(node) ? node : null;
  };

  const getEditingCondition = (): WorkflowCondition | null => {
    if (!editingNodeId || !state.currentWorkflow) return null;
    const node = findNodeById(state.currentWorkflow.nodes, editingNodeId);
    return node && isWorkflowCondition(node) ? node : null;
  };

  const getEditingFilter = (): StackedFilterNodeType | null => {
    if (!editingNodeId || !state.currentWorkflow) return null;
    const node = findNodeById(state.currentWorkflow.nodes, editingNodeId);
    return node && isStackedFilterNode(node) ? node : null;
  };

  const getEditingSort = (): SortNodeType | null => {
    if (!editingNodeId || !state.currentWorkflow) return null;
    const node = findNodeById(state.currentWorkflow.nodes, editingNodeId);
    return node && isSortNode(node) ? node : null;
  };

  const getEditingDistribute = (): DistributeNodeType | null => {
    if (!editingNodeId || !state.currentWorkflow) return null;
    const node = findNodeById(state.currentWorkflow.nodes, editingNodeId);
    return node && isDistributeNode(node) ? node : null;
  };

  const handleCreateWorkflow = () => {
    if (newWorkflowName.trim()) {
      createWorkflow(newWorkflowName.trim());
      setNewWorkflowName('');
      setShowWorkflowSelector(false);
    }
  };

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-100 rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-gray-900">
            {state.currentWorkflow?.name || 'No Workflow Selected'}
          </h2>
          {state.isDirty && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
              Unsaved changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Workflow selector */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowWorkflowSelector(!showWorkflowSelector)}
              className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              Load
            </motion.button>

            {showWorkflowSelector && (
              <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-3">
                <div className="mb-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newWorkflowName}
                      onChange={(e) => setNewWorkflowName(e.target.value)}
                      placeholder="New workflow name..."
                      className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleCreateWorkflow}
                      disabled={!newWorkflowName.trim()}
                      className="px-2 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-2 max-h-48 overflow-y-auto">
                  {state.workflows.map((wf) => (
                    <button
                      key={wf.id}
                      onClick={() => {
                        loadWorkflow(wf.id);
                        setShowWorkflowSelector(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        state.currentWorkflow?.id === wf.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="font-medium text-sm">{wf.name}</div>
                      <div className="text-xs text-gray-500">
                        {wf.nodes.length} steps
                      </div>
                    </button>
                  ))}
                  {state.workflows.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-2">
                      No workflows saved yet
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetWorkflow}
            disabled={!state.isDirty}
            className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => saveWorkflow()}
            disabled={!state.isDirty || !state.currentWorkflow}
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Save Workflow
          </motion.button>
        </div>
      </div>

      {/* Main content */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <StepTemplatesSidebar />

          {/* Canvas */}
          <WorkflowCanvas
            nodes={state.currentWorkflow?.nodes || []}
            onEditStep={handleEditStep}
            onEditCondition={handleEditCondition}
            onEditFilter={handleEditFilter}
            onEditSort={handleEditSort}
            onEditDistribute={handleEditDistribute}
          />
        </div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeDrag && (() => {
            if (activeDrag.type === 'template') {
              // Template overlays
              if (activeDrag.nodeType === 'step') {
                return (
                  <div className="p-3 bg-blue-50 border-2 border-blue-200 rounded-xl shadow-xl opacity-90">
                    <span className="font-medium text-blue-700">
                      {(activeDrag.data as StepTemplate).name}
                    </span>
                  </div>
                );
              } else if (activeDrag.nodeType === 'condition') {
                return (
                  <div className="p-3 bg-orange-50 border-2 border-orange-200 rounded-xl shadow-xl opacity-90">
                    <span className="font-medium text-orange-700">
                      {(activeDrag.data as ConditionTemplate).name}
                    </span>
                  </div>
                );
              } else if (activeDrag.nodeType === 'stackedFilter') {
                return (
                  <div className="p-3 bg-indigo-50 border-2 border-indigo-200 rounded-xl shadow-xl opacity-90">
                    <span className="font-medium text-indigo-700">
                      {(activeDrag.data as StackedFilterTemplate).name}
                    </span>
                  </div>
                );
              } else if (activeDrag.nodeType === 'sort') {
                return (
                  <div className="p-3 bg-cyan-50 border-2 border-cyan-200 rounded-xl shadow-xl opacity-90">
                    <span className="font-medium text-cyan-700">
                      {(activeDrag.data as SortTemplate).name}
                    </span>
                  </div>
                );
              } else if (activeDrag.nodeType === 'distribute') {
                return (
                  <div className="p-3 bg-rose-50 border-2 border-rose-200 rounded-xl shadow-xl opacity-90">
                    <span className="font-medium text-rose-700">
                      {(activeDrag.data as DistributeTemplate).name}
                    </span>
                  </div>
                );
              }
            } else {
              // Node overlays
              if (activeDrag.nodeType === 'step') {
                return <WorkflowStepOverlay step={activeDrag.data as WorkflowStep} />;
              } else if (activeDrag.nodeType === 'condition') {
                return <WorkflowConditionOverlay condition={activeDrag.data as WorkflowCondition} />;
              } else if (activeDrag.nodeType === 'stackedFilter') {
                return <StackedFilterNodeOverlay filter={activeDrag.data as StackedFilterNodeType} />;
              } else if (activeDrag.nodeType === 'sort') {
                return <SortNodeOverlay sort={activeDrag.data as SortNodeType} />;
              } else if (activeDrag.nodeType === 'distribute') {
                return <DistributeNodeOverlay distribute={activeDrag.data as DistributeNodeType} />;
              }
            }
            return null;
          })()}
        </DragOverlay>
      </DndContext>

      {/* Step config dialog */}
      <StepConfigDialog
        open={stepDialogOpen}
        onOpenChange={setStepDialogOpen}
        step={getEditingStep()}
        onSave={handleSaveStep}
      />

      {/* Condition config dialog */}
      <ConditionConfigDialog
        open={conditionDialogOpen}
        onOpenChange={setConditionDialogOpen}
        condition={getEditingCondition()}
        onSave={handleSaveCondition}
      />

      {/* Stacked filter config dialog */}
      <StackedFilterDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        filter={getEditingFilter()}
        onSave={handleSaveFilter}
      />

      {/* Sort config dialog */}
      <SortConfigDialog
        open={sortDialogOpen}
        onOpenChange={setSortDialogOpen}
        sort={getEditingSort()}
        onSave={handleSaveSort}
      />

      {/* Distribution config dialog */}
      <DistributionDialog
        open={distributeDialogOpen}
        onOpenChange={setDistributeDialogOpen}
        distribute={getEditingDistribute()}
        onSave={handleSaveDistribute}
      />
    </div>
  );
}

// Helper function to find a node by ID in the tree
function findNodeById(nodes: WorkflowNode[], id: string): WorkflowNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (isWorkflowCondition(node)) {
      const found = findNodeById(node.trueBranch, id) || findNodeById(node.falseBranch, id);
      if (found) return found;
    }
  }
  return null;
}
