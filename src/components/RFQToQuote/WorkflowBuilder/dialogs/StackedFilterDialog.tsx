import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Filter, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import {
  StackedFilterNode,
  FilterCondition,
  ConditionField,
  ConditionOperator,
  fieldLabels,
  operatorLabels,
} from '../../types/workflow';

interface StackedFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filter: StackedFilterNode | null;
  onSave: (updates: Partial<StackedFilterNode>) => void;
}

const FIELD_OPTIONS: { value: ConditionField; label: string; group: string }[] = [
  // Basic Fields
  { value: 'value', label: fieldLabels.value, group: 'Basic' },
  { value: 'priority', label: fieldLabels.priority, group: 'Basic' },
  { value: 'category', label: fieldLabels.category, group: 'Basic' },
  { value: 'items', label: fieldLabels.items, group: 'Basic' },
  // Technical Specifications
  { value: 'material', label: fieldLabels.material, group: 'Technical Specs' },
  { value: 'size', label: fieldLabels.size, group: 'Technical Specs' },
  { value: 'contractLength', label: fieldLabels.contractLength, group: 'Technical Specs' },
  { value: 'building', label: fieldLabels.building, group: 'Technical Specs' },
  // Quote Filters
  { value: 'difficulty', label: fieldLabels.difficulty, group: 'Quote Filters' },
  { value: 'fit', label: fieldLabels.fit, group: 'Quote Filters' },
  { value: 'leadTime', label: fieldLabels.leadTime, group: 'Quote Filters' },
];

const OPERATOR_OPTIONS: { value: ConditionOperator; label: string }[] = [
  { value: 'equals', label: operatorLabels.equals },
  { value: 'notEquals', label: operatorLabels.notEquals },
  { value: 'greaterThan', label: operatorLabels.greaterThan },
  { value: 'lessThan', label: operatorLabels.lessThan },
  { value: 'contains', label: operatorLabels.contains },
];

const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'urgent'];
const DIFFICULTY_OPTIONS = ['low', 'medium', 'high', 'very high'];
const MATERIAL_OPTIONS = ['Steel', 'Aluminum', 'Copper', 'Plastic', 'Composite', 'Other'];
const BUILDING_OPTIONS = ['Building A', 'Building B', 'Building C', 'Warehouse', 'Main Plant', 'Annex'];

export default function StackedFilterDialog({
  open,
  onOpenChange,
  filter,
  onSave,
}: StackedFilterDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logicOperator, setLogicOperator] = useState<'AND' | 'OR'>('AND');
  const [conditions, setConditions] = useState<FilterCondition[]>([]);

  useEffect(() => {
    if (filter) {
      setName(filter.name);
      setDescription(filter.description || '');
      setLogicOperator(filter.logicOperator);
      setConditions(filter.conditions);
    } else {
      setName('');
      setDescription('');
      setLogicOperator('AND');
      setConditions([{
        id: crypto.randomUUID(),
        field: 'material',
        operator: 'equals',
        value: '',
      }]);
    }
  }, [filter, open]);

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        id: crypto.randomUUID(),
        field: 'material',
        operator: 'equals',
        value: '',
      },
    ]);
  };

  const removeCondition = (id: string) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter(c => c.id !== id));
    }
  };

  const updateCondition = (id: string, updates: Partial<FilterCondition>) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const getValueInput = (condition: FilterCondition) => {
    // Priority dropdown
    if (condition.field === 'priority') {
      return (
        <select
          value={String(condition.value)}
          onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
        >
          <option value="">Select priority</option>
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>
      );
    }

    // Difficulty dropdown
    if (condition.field === 'difficulty') {
      return (
        <select
          value={String(condition.value)}
          onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
        >
          <option value="">Select difficulty</option>
          {DIFFICULTY_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </option>
          ))}
        </select>
      );
    }

    // Material dropdown
    if (condition.field === 'material') {
      return (
        <select
          value={String(condition.value)}
          onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
        >
          <option value="">Select material</option>
          {MATERIAL_OPTIONS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      );
    }

    // Building dropdown
    if (condition.field === 'building') {
      return (
        <select
          value={String(condition.value)}
          onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
        >
          <option value="">Select building</option>
          {BUILDING_OPTIONS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      );
    }

    // Value with dollar sign
    if (condition.field === 'value') {
      return (
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={condition.value}
            onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
            placeholder="50000"
            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
      );
    }

    // Numeric fields
    if (['items', 'contractLength', 'fit', 'leadTime'].includes(condition.field)) {
      const placeholders: Record<string, string> = {
        items: '100',
        contractLength: '12',
        fit: '80',
        leadTime: '30',
      };
      return (
        <input
          type="number"
          value={condition.value}
          onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
          placeholder={placeholders[condition.field] || '0'}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      );
    }

    // Default text input
    return (
      <input
        type="text"
        value={String(condition.value)}
        onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
        placeholder="Enter value"
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
      />
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (conditions.length === 0) return;

    // Convert numeric fields
    const numericFields = ['value', 'items', 'contractLength', 'fit', 'leadTime'];
    const finalConditions = conditions.map(c => ({
      ...c,
      value: numericFields.includes(c.field) ? Number(c.value) || 0 : String(c.value),
    }));

    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      logicOperator,
      conditions: finalConditions,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-indigo-600" />
            Configure Stacked Filter
          </DialogTitle>
          <DialogDescription>
            Combine multiple conditions to filter RFQs. Use AND for all conditions to pass, OR for any condition to pass.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Qualification Filters"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Logic operator */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logic Operator
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setLogicOperator('AND')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  logicOperator === 'AND'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {logicOperator === 'AND' ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                <span className="font-medium">AND (All must pass)</span>
              </button>
              <button
                onClick={() => setLogicOperator('OR')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  logicOperator === 'OR'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {logicOperator === 'OR' ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                <span className="font-medium">OR (Any can pass)</span>
              </button>
            </div>
          </div>

          {/* Conditions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Conditions *
              </label>
              <button
                onClick={addCondition}
                className="flex items-center gap-1 px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add Condition
              </button>
            </div>

            <div className="space-y-3">
              {conditions.map((condition, index) => (
                <div key={condition.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-medium text-gray-500 mt-2.5">
                      {index + 1}.
                    </span>
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {/* Field */}
                        <div>
                          <select
                            value={condition.field}
                            onChange={(e) => updateCondition(condition.id, { field: e.target.value as ConditionField })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
                          >
                            {FIELD_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Operator */}
                        <div>
                          <select
                            value={condition.operator}
                            onChange={(e) => updateCondition(condition.id, { operator: e.target.value as ConditionOperator })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
                          >
                            {OPERATOR_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Value */}
                      <div className="flex gap-2">
                        {getValueInput(condition)}
                      </div>
                    </div>

                    {/* Remove button */}
                    {conditions.length > 1 && (
                      <button
                        onClick={() => removeCondition(condition.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-sm text-indigo-700">
              <strong>Filter Preview:</strong>
              <br />
              {conditions.map((c, idx) => (
                <span key={c.id}>
                  {idx > 0 && <span className="font-bold mx-1">{logicOperator}</span>}
                  {fieldLabels[c.field]} {operatorLabels[c.operator]}{' '}
                  {c.field === 'value' ? `$${Number(c.value || 0).toLocaleString()}` : String(c.value || '?')}
                </span>
              ))}
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
            disabled={!name.trim() || conditions.length === 0}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save Filter
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
