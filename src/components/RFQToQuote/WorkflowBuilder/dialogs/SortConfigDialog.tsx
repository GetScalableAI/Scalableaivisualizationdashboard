import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { SortNode } from '../../types/workflow';

interface SortConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sort: SortNode | null;
  onSave: (updates: Partial<SortNode>) => void;
}

const SORT_FIELD_OPTIONS = [
  { value: 'value', label: 'Revenue/Value', description: 'Sort by total RFQ value' },
  { value: 'fit', label: 'Fit Score', description: 'Sort by how well the RFQ fits customer capabilities' },
  { value: 'leadTime', label: 'Lead Time', description: 'Sort by expected turnaround time' },
  { value: 'priority', label: 'Priority', description: 'Sort by urgency level' },
];

export default function SortConfigDialog({
  open,
  onOpenChange,
  sort,
  onSave,
}: SortConfigDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sortField, setSortField] = useState<'value' | 'fit' | 'leadTime' | 'priority'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (sort) {
      setName(sort.name);
      setDescription(sort.description || '');
      setSortField(sort.sortField);
      setSortOrder(sort.sortOrder);
    } else {
      setName('Sort by Revenue');
      setDescription('');
      setSortField('value');
      setSortOrder('desc');
    }
  }, [sort, open]);

  const handleSave = () => {
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      sortField,
      sortOrder,
    });
    onOpenChange(false);
  };

  const selectedFieldOption = SORT_FIELD_OPTIONS.find(opt => opt.value === sortField);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-600" />
            Configure Sort
          </DialogTitle>
          <DialogDescription>
            Define how RFQs should be ordered before distribution.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Sort by Revenue"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Sort Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By *
            </label>
            <div className="space-y-2">
              {SORT_FIELD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortField(option.value as typeof sortField)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    sortField === option.value
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort Order *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSortOrder('desc')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  sortOrder === 'desc'
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <ArrowDown className="w-4 h-4" />
                <span className="font-medium">Descending</span>
              </button>
              <button
                onClick={() => setSortOrder('asc')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  sortOrder === 'asc'
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <ArrowUp className="w-4 h-4" />
                <span className="font-medium">Ascending</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {sortOrder === 'desc' ? 'Highest' : 'Lowest'} values first
            </p>
          </div>

          {/* Preview */}
          <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
            <p className="text-sm text-cyan-700">
              <strong>Sort Preview:</strong>
              <br />
              Sort RFQs by <span className="font-semibold">{selectedFieldOption?.label}</span>{' '}
              in <span className="font-semibold">{sortOrder === 'desc' ? 'descending' : 'ascending'}</span> order
              <br />
              <span className="text-xs">({sortOrder === 'desc' ? 'Highest' : 'Lowest'} → {sortOrder === 'desc' ? 'Lowest' : 'Highest'})</span>
            </p>
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save Sort
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
