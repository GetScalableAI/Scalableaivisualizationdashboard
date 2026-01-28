import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { GitBranch } from 'lucide-react';
import {
  WorkflowCondition,
  ConditionField,
  ConditionOperator,
  fieldLabels,
  operatorLabels,
} from '../types/workflow';

interface ConditionConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  condition: WorkflowCondition | null;
  onSave: (updates: Partial<WorkflowCondition>) => void;
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

export default function ConditionConfigDialog({
  open,
  onOpenChange,
  condition,
  onSave,
}: ConditionConfigDialogProps) {
  const [name, setName] = useState('');
  const [field, setField] = useState<ConditionField>('value');
  const [operator, setOperator] = useState<ConditionOperator>('greaterThan');
  const [value, setValue] = useState<string | number>('');

  useEffect(() => {
    if (condition) {
      setName(condition.name);
      setField(condition.field);
      setOperator(condition.operator);
      setValue(condition.value);
    } else {
      setName('');
      setField('value');
      setOperator('greaterThan');
      setValue('');
    }
  }, [condition, open]);

  const handleSave = () => {
    if (!name.trim()) return;

    const numericFields = ['value', 'items', 'contractLength', 'fit', 'leadTime'];
    const finalValue = numericFields.includes(field)
      ? Number(value) || 0
      : String(value);

    onSave({
      name: name.trim(),
      field,
      operator,
      value: finalValue,
    });
    onOpenChange(false);
  };

  const getValueInput = () => {
    // Priority dropdown
    if (field === 'priority') {
      return (
        <select
          value={String(value)}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
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
    if (field === 'difficulty') {
      return (
        <select
          value={String(value)}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
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
    if (field === 'material') {
      return (
        <select
          value={String(value)}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
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
    if (field === 'building') {
      return (
        <select
          value={String(value)}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
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
    if (field === 'value') {
      return (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="50000"
            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      );
    }

    // Numeric fields
    if (['items', 'contractLength', 'fit', 'leadTime'].includes(field)) {
      const placeholders: Record<string, string> = {
        items: '100',
        contractLength: '12 (months)',
        fit: '80 (percentage)',
        leadTime: '30 (days)',
      };
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholders[field] || '0'}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      );
    }

    // Default text input
    return (
      <input
        type="text"
        value={String(value)}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter value"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-orange-600" />
            Configure Condition
          </DialogTitle>
          <DialogDescription>
            Set up the branching logic for this condition node.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., High Value RFQ"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Field selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field to Check
            </label>
            <select
              value={field}
              onChange={(e) => setField(e.target.value as ConditionField)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <optgroup label="Basic">
                {FIELD_OPTIONS.filter(o => o.group === 'Basic').map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Technical Specs">
                {FIELD_OPTIONS.filter(o => o.group === 'Technical Specs').map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Quote Filters">
                {FIELD_OPTIONS.filter(o => o.group === 'Quote Filters').map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Operator selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Operator
            </label>
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value as ConditionOperator)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              {OPERATOR_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value
            </label>
            {getValueInput()}
          </div>

          {/* Preview */}
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-700">
              <strong>Condition Preview:</strong>
              <br />
              If {fieldLabels[field]} {operatorLabels[operator]}{' '}
              {field === 'value' ? `$${Number(value || 0).toLocaleString()}` : String(value || '?')}
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
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save Condition
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
