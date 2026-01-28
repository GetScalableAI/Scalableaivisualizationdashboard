import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Edit2, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { SortNode as SortNodeType } from '../../types/workflow';

interface SortNodeProps {
  sort: SortNodeType;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
}

const sortFieldLabels: Record<string, string> = {
  value: 'Revenue/Value',
  fit: 'Fit Score',
  leadTime: 'Lead Time',
  priority: 'Priority',
};

export default function SortNode({
  sort,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  isDragging,
}: SortNodeProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: sort.id });

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
        bg-cyan-50 border-cyan-200
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
            <div className="p-1.5 rounded-md bg-cyan-100">
              <TrendingUp className="w-4 h-4 text-cyan-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{sort.name}</h3>
              {sort.description && (
                <p className="text-xs text-gray-500 mt-0.5">{sort.description}</p>
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
              className="p-1.5 hover:bg-cyan-100 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4 text-cyan-600" />
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

        {/* Sort details */}
        <div className="flex items-center gap-2 p-3 bg-cyan-100/50 rounded-lg">
          <span className="text-sm text-gray-700">
            Sort by: <span className="font-semibold text-cyan-700">{sortFieldLabels[sort.sortField]}</span>
          </span>
          <div className="flex items-center gap-1 ml-auto">
            {sort.sortOrder === 'asc' ? (
              <>
                <ArrowUp className="w-4 h-4 text-cyan-600" />
                <span className="text-xs font-medium text-cyan-600">Ascending</span>
              </>
            ) : (
              <>
                <ArrowDown className="w-4 h-4 text-cyan-600" />
                <span className="text-xs font-medium text-cyan-600">Descending</span>
              </>
            )}
          </div>
        </div>

        {/* Helper text */}
        <p className="text-xs text-gray-500 mt-2">
          {sort.sortOrder === 'desc' ? 'Highest' : 'Lowest'} {sortFieldLabels[sort.sortField].toLowerCase()} first
        </p>
      </div>
    </motion.div>
  );
}

// Overlay component for drag preview
export function SortNodeOverlay({ sort }: { sort: SortNodeType }) {
  return (
    <div className="p-4 bg-cyan-50 border-2 border-cyan-200 rounded-xl shadow-xl opacity-90">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-cyan-600" />
        <span className="font-medium text-cyan-700">{sort.name}</span>
      </div>
    </div>
  );
}
