import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Edit2, Filter, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';
import { StackedFilterNode as StackedFilterNodeType } from '../../types/workflow';
import { fieldLabels, operatorLabels } from '../../types/workflow';

interface StackedFilterNodeProps {
  filter: StackedFilterNodeType;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
}

export default function StackedFilterNode({
  filter,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  isDragging,
}: StackedFilterNodeProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: filter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`
        group relative flex items-stretch gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer
        bg-indigo-50 border-indigo-200
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:shadow-md'}
        ${isDragging ? 'shadow-lg' : ''}
      `}
      onClick={onSelect}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-indigo-100">
              <Filter className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{filter.name}</h3>
              {filter.description && (
                <p className="text-xs text-gray-500 mt-0.5">{filter.description}</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1.5 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4 text-indigo-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        {/* Conditions display */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
              {filter.logicOperator}
            </span>
            <span className="text-xs text-gray-500">
              {filter.conditions.length} condition{filter.conditions.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filter.conditions.slice(0, 3).map((condition, index) => (
            <div key={condition.id} className="flex items-center gap-2 text-xs">
              <span className="text-gray-600">
                {fieldLabels[condition.field]} {operatorLabels[condition.operator]}{' '}
                <span className="font-medium text-gray-900">{condition.value}</span>
              </span>
            </div>
          ))}

          {filter.conditions.length > 3 && (
            <div className="text-xs text-gray-500 italic">
              +{filter.conditions.length - 3} more...
            </div>
          )}
        </div>

        {/* Branch indicators */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-indigo-200">
          <div className="flex items-center gap-1.5 text-xs">
            <GitBranch className="w-3 h-3 text-green-600" />
            <span className="text-green-600 font-medium">
              Pass: {filter.passBranch.length} step{filter.passBranch.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <GitBranch className="w-3 h-3 text-red-600" />
            <span className="text-red-600 font-medium">
              Fail: {filter.failBranch.length} step{filter.failBranch.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Overlay component for drag preview
export function StackedFilterNodeOverlay({ filter }: { filter: StackedFilterNodeType }) {
  return (
    <div className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-xl shadow-xl opacity-90">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-indigo-600" />
        <span className="font-medium text-indigo-700">{filter.name}</span>
      </div>
    </div>
  );
}
