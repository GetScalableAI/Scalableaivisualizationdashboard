import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import { WorkflowNode, isWorkflowStep, isWorkflowCondition } from '../types/workflow';
import { useWorkflow } from '../context/WorkflowContext';
import WorkflowStep from './WorkflowStep';
import { LineConnector } from './WorkflowConnector';

interface ConditionBranchProps {
  conditionId: string;
  branchPath: 'true' | 'false';
  nodes: WorkflowNode[];
  onEditStep: (stepId: string) => void;
}

export default function ConditionBranch({
  conditionId,
  branchPath,
  nodes,
  onEditStep,
}: ConditionBranchProps) {
  const { state, selectNode, removeNode } = useWorkflow();

  const droppableId = `branch-${conditionId}-${branchPath}`;
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
    data: {
      type: 'branch',
      conditionId,
      branchPath,
    },
  });

  const nodeIds = nodes.map(n => n.id);
  const isTrue = branchPath === 'true';

  return (
    <div className="flex-1 min-w-[200px]">
      {/* Branch header */}
      <div
        className={`
          flex items-center justify-center gap-2 py-2 px-3 rounded-t-lg font-medium text-sm
          ${isTrue ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
        `}
      >
        {isTrue ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>TRUE</span>
          </>
        ) : (
          <>
            <XCircle className="w-4 h-4" />
            <span>FALSE</span>
          </>
        )}
      </div>

      {/* Branch content */}
      <div
        ref={setNodeRef}
        className={`
          min-h-[120px] p-3 rounded-b-lg border-2 border-t-0 transition-colors
          ${isTrue ? 'border-green-200' : 'border-red-200'}
          ${isOver ? (isTrue ? 'bg-green-50' : 'bg-red-50') : 'bg-white'}
        `}
      >
        {nodes.length === 0 ? (
          <div
            className={`
              flex flex-col items-center justify-center py-8 rounded-lg border-2 border-dashed
              ${isTrue ? 'border-green-300' : 'border-red-300'}
              ${isOver ? 'opacity-50' : ''}
            `}
          >
            <Plus className={`w-6 h-6 ${isTrue ? 'text-green-400' : 'text-red-400'}`} />
            <span className="text-xs text-gray-500 mt-2">Drop step here</span>
          </div>
        ) : (
          <SortableContext items={nodeIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {nodes.map((node, index) => (
                  <div key={node.id}>
                    {index > 0 && <LineConnector />}
                    {isWorkflowStep(node) && (
                      <WorkflowStep
                        step={node}
                        isSelected={state.selectedNodeId === node.id}
                        onSelect={() => selectNode(node.id)}
                        onEdit={() => onEditStep(node.id)}
                        onDelete={() => removeNode(node.id)}
                      />
                    )}
                    {/* Nested conditions not supported for simplicity */}
                    {isWorkflowCondition(node) && (
                      <div className="p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
                        Nested conditions not supported
                      </div>
                    )}
                  </div>
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        )}

        {/* Drop indicator */}
        {isOver && nodes.length > 0 && (
          <div
            className={`
              mt-2 py-2 rounded-lg border-2 border-dashed flex items-center justify-center
              ${isTrue ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}
            `}
          >
            <span className={`text-xs font-medium ${isTrue ? 'text-green-600' : 'text-red-600'}`}>
              Drop here
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
