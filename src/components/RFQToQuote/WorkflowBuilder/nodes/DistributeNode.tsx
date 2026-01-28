import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Edit2, Network, Mail, Users, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { DistributeByDivisionNode as DistributeNodeType } from '../../types/workflow';

interface DistributeNodeProps {
  distribute: DistributeNodeType;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
}

const ruleLabels: Record<string, string> = {
  roundRobin: 'Round Robin',
  byLocation: 'By Location',
  manual: 'Manual Assignment',
};

export default function DistributeNode({
  distribute,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  isDragging,
}: DistributeNodeProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: distribute.id });

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
        bg-rose-50 border-rose-200
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
            <div className="p-1.5 rounded-md bg-rose-100">
              <Network className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{distribute.name}</h3>
              {distribute.description && (
                <p className="text-xs text-gray-500 mt-0.5">{distribute.description}</p>
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
              className="p-1.5 hover:bg-rose-100 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4 text-rose-600" />
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

        {/* Distribution rule */}
        <div className="flex items-center gap-2 p-2.5 bg-rose-100/50 rounded-lg mb-3">
          <span className="text-xs text-gray-600">
            Rule: <span className="font-medium text-rose-700">{ruleLabels[distribute.distributionRule]}</span>
          </span>
          <div className="flex items-center gap-1 ml-auto">
            <Mail className="w-3 h-3 text-rose-600" />
            <span className="text-xs font-medium text-rose-600 capitalize">{distribute.notificationType}</span>
          </div>
        </div>

        {/* Divisions summary */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 mb-1">
            <Building className="w-3 h-3 text-gray-500" />
            <span className="text-xs font-medium text-gray-700">
              {distribute.divisions.length} division{distribute.divisions.length !== 1 ? 's' : ''} configured
            </span>
          </div>

          <div className="space-y-1">
            {distribute.divisions.slice(0, 3).map((division) => (
              <div key={division.id} className="flex items-center gap-2 text-xs pl-5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span className="font-medium text-gray-700">{division.name}</span>
                <span className="text-gray-500">→</span>
                <span className="text-gray-600">{division.managerName}</span>
              </div>
            ))}

            {distribute.divisions.length > 3 && (
              <div className="text-xs text-gray-500 italic pl-5">
                +{distribute.divisions.length - 3} more...
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Overlay component for drag preview
export function DistributeNodeOverlay({ distribute }: { distribute: DistributeNodeType }) {
  return (
    <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-xl shadow-xl opacity-90">
      <div className="flex items-center gap-2">
        <Network className="w-4 h-4 text-rose-600" />
        <span className="font-medium text-rose-700">{distribute.name}</span>
      </div>
    </div>
  );
}
