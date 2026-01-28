import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Edit2, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';
import { WorkflowCondition as WorkflowConditionType, fieldLabels, operatorLabels } from '../types/workflow';
import ConditionBranch from './ConditionBranch';
import { BranchConnector, MergeConnector } from './WorkflowConnector';

interface WorkflowConditionProps {
  condition: WorkflowConditionType;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onEditStep: (stepId: string) => void;
  isDragging?: boolean;
}

export default function WorkflowCondition({
  condition,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onEditStep,
  isDragging,
}: WorkflowConditionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: condition.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatConditionText = () => {
    const fieldLabel = fieldLabels[condition.field];
    const operatorLabel = operatorLabels[condition.operator];
    const value = condition.field === 'value'
      ? `$${Number(condition.value).toLocaleString()}`
      : String(condition.value);

    return `${fieldLabel} ${operatorLabel} ${value}`;
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={isDragging ? 'shadow-lg' : ''}
    >
      {/* Condition header (diamond shape effect) */}
      <div
        className={`
          group relative bg-orange-50 border-2 border-orange-200 rounded-xl p-4 cursor-pointer
          ${isSelected ? 'ring-2 ring-orange-500 ring-offset-2' : 'hover:shadow-md'}
        `}
        onClick={onSelect}
      >
        {/* Drag handle */}
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>

          {/* Condition icon */}
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center transform rotate-45">
            <GitBranch className="w-5 h-5 text-orange-600 -rotate-45" />
          </div>

          {/* Condition content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-orange-700">{condition.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              If {formatConditionText()}
            </p>
          </div>

          {/* Action buttons */}
          <div className={`flex items-center gap-1 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
              title="Edit condition"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
              title="Delete condition"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>

        {/* Diamond indicator */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-orange-300 transform rotate-45 flex items-center justify-center">
          <span className="text-orange-500 text-xs font-bold -rotate-45">?</span>
        </div>
      </div>

      {/* Branch connector */}
      <BranchConnector />

      {/* True/False branches */}
      <div className="flex gap-4 px-4">
        <ConditionBranch
          conditionId={condition.id}
          branchPath="true"
          nodes={condition.trueBranch}
          onEditStep={onEditStep}
        />
        <ConditionBranch
          conditionId={condition.id}
          branchPath="false"
          nodes={condition.falseBranch}
          onEditStep={onEditStep}
        />
      </div>

      {/* Merge connector */}
      <MergeConnector />
    </motion.div>
  );
}

// Overlay component for drag preview
export function WorkflowConditionOverlay({ condition }: { condition: WorkflowConditionType }) {
  return (
    <div className="p-4 rounded-xl border-2 bg-orange-50 border-orange-200 shadow-xl opacity-90">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center transform rotate-45">
          <GitBranch className="w-4 h-4 text-orange-600 -rotate-45" />
        </div>
        <h3 className="font-semibold text-orange-700">{condition.name}</h3>
      </div>
    </div>
  );
}
