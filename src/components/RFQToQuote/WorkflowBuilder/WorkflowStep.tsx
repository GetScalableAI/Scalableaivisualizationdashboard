import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Edit2, Clock, Users, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { WorkflowStep as WorkflowStepType, TeamType } from '../types/workflow';

interface WorkflowStepProps {
  step: WorkflowStepType;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
}

const teamColors: Record<TeamType, { bg: string; text: string; border: string }> = {
  Engineering: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Procurement: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Finance: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  Operations: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  Quality: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  Vendor: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};

export default function WorkflowStep({
  step,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  isDragging,
}: WorkflowStepProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const colors = teamColors[step.assignedTeam];

  const formatDuration = (hours: number) => {
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
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
        ${colors.bg} ${colors.border}
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
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${colors.text}`}>{step.name}</h3>
            {step.isRequired && (
              <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-medium rounded">
                Required
              </span>
            )}
          </div>

          {/* Action buttons - visible on hover or when selected */}
          <div className={`flex items-center gap-1 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
              title="Edit step"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
              title="Delete step"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>

        {step.description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{step.description}</p>
        )}

        {/* Meta info */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span className={`font-medium ${colors.text}`}>{step.assignedTeam}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(step.estimatedDuration)}</span>
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
        <CheckCircle2 className="w-4 h-4 text-gray-400" />
      </div>
    </motion.div>
  );
}

// Overlay component for drag preview
export function WorkflowStepOverlay({ step }: { step: WorkflowStepType }) {
  const colors = teamColors[step.assignedTeam];

  return (
    <div className={`p-4 rounded-xl border-2 ${colors.bg} ${colors.border} shadow-xl opacity-90`}>
      <h3 className={`font-semibold ${colors.text}`}>{step.name}</h3>
      <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-2">
        <Users className="w-4 h-4" />
        <span className={`font-medium ${colors.text}`}>{step.assignedTeam}</span>
      </div>
    </div>
  );
}
