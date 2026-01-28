import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Settings, Clock, Users, ToggleLeft, ToggleRight, Info } from 'lucide-react';
import { DistributionSettings } from './types';

interface DistributionConfigProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: DistributionSettings;
  onSave: (settings: DistributionSettings) => void;
}

export default function DistributionConfig({
  open,
  onOpenChange,
  settings,
  onSave,
}: DistributionConfigProps) {
  const [enabled, setEnabled] = useState(settings.enabled);
  const [rfqsPerDay, setRfqsPerDay] = useState(settings.rfqsPerDay);
  const [distributionTime, setDistributionTime] = useState(settings.distributionTime);

  useEffect(() => {
    if (open) {
      setEnabled(settings.enabled);
      setRfqsPerDay(settings.rfqsPerDay);
      setDistributionTime(settings.distributionTime);
    }
  }, [settings, open]);

  const handleSave = () => {
    onSave({
      enabled,
      rfqsPerDay: Math.max(1, Math.min(20, rfqsPerDay)), // Clamp between 1-20
      distributionTime,
      lastDistribution: settings.lastDistribution,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Distribution Settings
          </DialogTitle>
          <DialogDescription>
            Configure automatic daily RFQ distribution to your teams.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-medium text-gray-900">Auto-Distribution</div>
                <div className="text-sm text-gray-500">
                  {enabled ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`p-1 rounded-lg transition-colors ${
                enabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'
              }`}
            >
              {enabled ? (
                <ToggleRight className="w-8 h-8" />
              ) : (
                <ToggleLeft className="w-8 h-8" />
              )}
            </button>
          </div>

          {/* RFQs Per Day */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RFQs Per Day
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="20"
                value={rfqsPerDay}
                onChange={(e) => setRfqsPerDay(parseInt(e.target.value))}
                disabled={!enabled}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed accent-blue-600"
              />
              <div className="w-12 text-center">
                <span className="text-2xl font-bold text-blue-600">{rfqsPerDay}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Number of RFQs to distribute to divisions each day
            </p>
          </div>

          {/* Distribution Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Distribution Time
            </label>
            <input
              type="time"
              value={distributionTime}
              onChange={(e) => setDistributionTime(e.target.value)}
              disabled={!enabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-2">
              Time when daily distribution will occur automatically
            </p>
          </div>

          {/* Info Box */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">How Distribution Works:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>RFQs are selected based on revenue and fit score</li>
                <li>Distribution follows the configured workflow rules</li>
                <li>Managers receive email notifications</li>
                <li>Manual distribution is always available</li>
              </ul>
            </div>
          </div>

          {/* Preview */}
          {enabled && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>Preview:</strong> {rfqsPerDay} RFQ{rfqsPerDay !== 1 ? 's' : ''} will be distributed daily at {distributionTime}
              </p>
            </div>
          )}
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
