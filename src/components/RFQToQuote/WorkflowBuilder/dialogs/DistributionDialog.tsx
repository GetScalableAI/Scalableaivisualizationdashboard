import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Network, Plus, Trash2, Mail, Building, User } from 'lucide-react';
import { DistributeByDivisionNode, DivisionConfig } from '../../types/workflow';

interface DistributionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  distribute: DistributeByDivisionNode | null;
  onSave: (updates: Partial<DistributeByDivisionNode>) => void;
}

const DISTRIBUTION_RULES = [
  { value: 'roundRobin', label: 'Round Robin', description: 'Distribute evenly across divisions in rotation' },
  { value: 'byLocation', label: 'By Location', description: 'Route based on RFQ building/location field' },
  { value: 'manual', label: 'Manual', description: 'Require manual assignment for each RFQ' },
];

export default function DistributionDialog({
  open,
  onOpenChange,
  distribute,
  onSave,
}: DistributionDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [divisions, setDivisions] = useState<DivisionConfig[]>([]);
  const [distributionRule, setDistributionRule] = useState<'roundRobin' | 'byLocation' | 'manual'>('roundRobin');
  const [notificationType, setNotificationType] = useState<'email' | 'sms' | 'both'>('email');

  useEffect(() => {
    if (distribute) {
      setName(distribute.name);
      setDescription(distribute.description || '');
      setDivisions(distribute.divisions);
      setDistributionRule(distribute.distributionRule);
      setNotificationType(distribute.notificationType);
    } else {
      setName('Distribute by Division');
      setDescription('');
      setDivisions([
        {
          id: crypto.randomUUID(),
          name: '',
          managerName: '',
          managerEmail: '',
          fallbackEmail: '',
        },
      ]);
      setDistributionRule('roundRobin');
      setNotificationType('email');
    }
  }, [distribute, open]);

  const addDivision = () => {
    setDivisions([
      ...divisions,
      {
        id: crypto.randomUUID(),
        name: '',
        managerName: '',
        managerEmail: '',
        fallbackEmail: '',
      },
    ]);
  };

  const removeDivision = (id: string) => {
    if (divisions.length > 1) {
      setDivisions(divisions.filter(d => d.id !== id));
    }
  };

  const updateDivision = (id: string, updates: Partial<DivisionConfig>) => {
    setDivisions(divisions.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (divisions.length === 0) return;

    // Validate that at least one division has required fields
    const hasValidDivision = divisions.some(d => d.name && d.managerName && d.managerEmail);
    if (!hasValidDivision) return;

    // Filter out incomplete divisions
    const validDivisions = divisions.filter(d => d.name && d.managerName && d.managerEmail);

    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      divisions: validDivisions,
      distributionRule,
      notificationType,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Network className="w-5 h-5 text-rose-600" />
            Configure Distribution
          </DialogTitle>
          <DialogDescription>
            Set up divisions and manager contacts for routing RFQs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Distribution Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Distribute by Division"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Distribution Rule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distribution Rule *
            </label>
            <div className="space-y-2">
              {DISTRIBUTION_RULES.map((rule) => (
                <button
                  key={rule.value}
                  onClick={() => setDistributionRule(rule.value as typeof distributionRule)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    distributionRule === rule.value
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium text-gray-900">{rule.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{rule.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Notification Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Method *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setNotificationType('email')}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                  notificationType === 'email'
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">Email</span>
              </button>
              <button
                onClick={() => setNotificationType('sms')}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                  notificationType === 'sms'
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <span className="text-sm font-medium">SMS</span>
              </button>
              <button
                onClick={() => setNotificationType('both')}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                  notificationType === 'both'
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <span className="text-sm font-medium">Both</span>
              </button>
            </div>
          </div>

          {/* Divisions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Divisions *
              </label>
              <button
                onClick={addDivision}
                className="flex items-center gap-1 px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add Division
              </button>
            </div>

            <div className="space-y-3">
              {divisions.map((division, index) => (
                <div key={division.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mt-2.5">
                      <Building className="w-3 h-3" />
                      {index + 1}.
                    </div>

                    <div className="flex-1 space-y-3">
                      {/* Division Name */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Division Name *
                        </label>
                        <input
                          type="text"
                          value={division.name}
                          onChange={(e) => updateDivision(division.id, { name: e.target.value })}
                          placeholder="e.g., North Region, Building A"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Manager Name */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            Manager Name *
                          </label>
                          <input
                            type="text"
                            value={division.managerName}
                            onChange={(e) => updateDivision(division.id, { managerName: e.target.value })}
                            placeholder="John Smith"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                          />
                        </div>

                        {/* Manager Email */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            Manager Email *
                          </label>
                          <input
                            type="email"
                            value={division.managerEmail}
                            onChange={(e) => updateDivision(division.id, { managerEmail: e.target.value })}
                            placeholder="john.smith@company.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                          />
                        </div>
                      </div>

                      {/* Fallback Email */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Fallback Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={division.fallbackEmail}
                          onChange={(e) => updateDivision(division.id, { fallbackEmail: e.target.value })}
                          placeholder="backup@company.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                        />
                      </div>
                    </div>

                    {/* Remove button */}
                    {divisions.length > 1 && (
                      <button
                        onClick={() => removeDivision(division.id)}
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

          {/* Summary */}
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
            <p className="text-sm text-rose-700">
              <strong>Distribution Summary:</strong>
              <br />
              {divisions.filter(d => d.name).length} division{divisions.filter(d => d.name).length !== 1 ? 's' : ''} configured with{' '}
              <span className="font-semibold capitalize">{distributionRule.replace(/([A-Z])/g, ' $1').toLowerCase()}</span> rule
              <br />
              Notifications via: <span className="font-semibold capitalize">{notificationType}</span>
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
            disabled={!name.trim() || divisions.filter(d => d.name && d.managerName && d.managerEmail).length === 0}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save Distribution
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
