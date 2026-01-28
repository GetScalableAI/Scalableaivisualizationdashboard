import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';
import { Plus, Workflow } from 'lucide-react';
import {
  WorkflowNode,
  isWorkflowStep,
  isWorkflowCondition,
  isStackedFilterNode,
  isSortNode,
  isDistributeNode,
} from '../types/workflow';
import { useWorkflow } from '../context/WorkflowContext';
import WorkflowStep from './WorkflowStep';
import WorkflowCondition from './WorkflowCondition';
import WorkflowConnector from './WorkflowConnector';
import StackedFilterNode from './nodes/StackedFilterNode';
import SortNode from './nodes/SortNode';
import DistributeNode from './nodes/DistributeNode';

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  onEditStep: (stepId: string) => void;
  onEditCondition: (conditionId: string) => void;
  onEditFilter: (filterId: string) => void;
  onEditSort: (sortId: string) => void;
  onEditDistribute: (distributeId: string) => void;
  className?: string;
}

export default function WorkflowCanvas({
  nodes,
  onEditStep,
  onEditCondition,
  onEditFilter,
  onEditSort,
  onEditDistribute,
  className = '',
}: WorkflowCanvasProps) {
  const { state, selectNode, removeNode } = useWorkflow();

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
    data: {
      type: 'canvas',
    },
  });

  const nodeIds = nodes.map(n => n.id);

  return (
    <div
      ref={setNodeRef}
      className={`
        flex-1 p-6 overflow-y-auto
        ${isOver ? 'bg-blue-100/80' : 'bg-slate-200'}
        transition-colors
        ${className}
      `}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-lg px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <Workflow className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Workflow Steps</h2>
          </div>
          <div className="text-sm text-gray-500">
            {nodes.length} {nodes.length === 1 ? 'step' : 'steps'}
          </div>
        </div>

        {/* Empty state */}
        {nodes.length === 0 && (
          <div
            className={`
              flex flex-col items-center justify-center py-16 px-8 rounded-xl border-2 border-dashed shadow-sm
              ${isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-400 bg-white'}
              transition-colors
            `}
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Workflow</h3>
            <p className="text-gray-500 text-center max-w-sm">
              Drag step templates from the sidebar and drop them here to create your custom RFQ workflow.
            </p>
          </div>
        )}

        {/* Workflow nodes */}
        {nodes.length > 0 && (
          <SortableContext items={nodeIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-0">
              <AnimatePresence mode="popLayout">
                {nodes.map((node, index) => (
                  <div key={node.id}>
                    {/* Connector between nodes */}
                    {index > 0 && <WorkflowConnector />}

                    {/* Render step or condition */}
                    {isWorkflowStep(node) && (
                      <WorkflowStep
                        step={node}
                        isSelected={state.selectedNodeId === node.id}
                        onSelect={() => selectNode(node.id)}
                        onEdit={() => onEditStep(node.id)}
                        onDelete={() => removeNode(node.id)}
                      />
                    )}

                    {isWorkflowCondition(node) && (
                      <WorkflowCondition
                        condition={node}
                        isSelected={state.selectedNodeId === node.id}
                        onSelect={() => selectNode(node.id)}
                        onEdit={() => onEditCondition(node.id)}
                        onDelete={() => removeNode(node.id)}
                        onEditStep={onEditStep}
                      />
                    )}

                    {isStackedFilterNode(node) && (
                      <StackedFilterNode
                        filter={node}
                        isSelected={state.selectedNodeId === node.id}
                        onSelect={() => selectNode(node.id)}
                        onEdit={() => onEditFilter(node.id)}
                        onDelete={() => removeNode(node.id)}
                      />
                    )}

                    {isSortNode(node) && (
                      <SortNode
                        sort={node}
                        isSelected={state.selectedNodeId === node.id}
                        onSelect={() => selectNode(node.id)}
                        onEdit={() => onEditSort(node.id)}
                        onDelete={() => removeNode(node.id)}
                      />
                    )}

                    {isDistributeNode(node) && (
                      <DistributeNode
                        distribute={node}
                        isSelected={state.selectedNodeId === node.id}
                        onSelect={() => selectNode(node.id)}
                        onEdit={() => onEditDistribute(node.id)}
                        onDelete={() => removeNode(node.id)}
                      />
                    )}
                  </div>
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        )}

        {/* Drop indicator at the end */}
        {nodes.length > 0 && isOver && (
          <div className="mt-4 py-4 rounded-xl border-2 border-dashed border-blue-400 bg-blue-50 flex items-center justify-center">
            <span className="text-sm text-blue-600 font-medium">Drop here to add step</span>
          </div>
        )}
      </div>
    </div>
  );
}
