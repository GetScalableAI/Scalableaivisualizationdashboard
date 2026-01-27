import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Save } from 'lucide-react';

interface CustomMetricBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (metric: CustomMetric) => void;
}

export interface CustomMetric {
  id: string;
  title: string;
  value: string | number;
  target?: string | number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  description: string;
}

export default function CustomMetricBuilder({ isOpen, onClose, onSave }: CustomMetricBuilderProps) {
  const [formData, setFormData] = useState<Partial<CustomMetric>>({
    title: '',
    value: '',
    target: '',
    unit: '',
    trend: 'neutral',
    trendValue: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const metric: CustomMetric = {
      id: `custom-${Date.now()}`,
      title: formData.title || 'Custom Metric',
      value: formData.value || 0,
      target: formData.target,
      unit: formData.unit || '',
      trend: formData.trend || 'neutral',
      trendValue: formData.trendValue || '0%',
      description: formData.description || '',
    };
    onSave(metric);
    setFormData({
      title: '',
      value: '',
      target: '',
      unit: '',
      trend: 'neutral',
      trendValue: '',
      description: '',
    });
    onClose();
  };

  const handleChange = (field: keyof CustomMetric, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    Create Custom Metric
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Add your own custom data visualization</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metric Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g., Customer Satisfaction Score"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Value and Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Value *
                    </label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => handleChange('value', e.target.value)}
                      placeholder="e.g., 92.5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      required
                      step="any"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => handleChange('unit', e.target.value)}
                      placeholder="e.g., %, units, $"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Target */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Value (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.target}
                    onChange={(e) => handleChange('target', e.target.value)}
                    placeholder="e.g., 95"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    step="any"
                  />
                </div>

                {/* Trend */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trend Direction
                    </label>
                    <select
                      value={formData.trend}
                      onChange={(e) => handleChange('trend', e.target.value as 'up' | 'down' | 'neutral')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                      <option value="neutral">No Trend</option>
                      <option value="up">Trending Up</option>
                      <option value="down">Trending Down</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trend Value
                    </label>
                    <input
                      type="text"
                      value={formData.trendValue}
                      onChange={(e) => handleChange('trendValue', e.target.value)}
                      placeholder="e.g., +5.2%"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Brief description of this metric..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Save className="w-4 h-4" />
                    Save Metric
                  </button>
                </div>
              </form>

              {/* Preview */}
              <div className="mt-6 p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg border border-violet-200">
                <div className="text-sm font-medium text-gray-700 mb-2">Preview:</div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div><span className="font-medium">Title:</span> {formData.title || 'Custom Metric'}</div>
                  <div><span className="font-medium">Value:</span> {formData.value || '0'}{formData.unit}</div>
                  {formData.target && <div><span className="font-medium">Target:</span> {formData.target}{formData.unit}</div>}
                  {formData.trend !== 'neutral' && formData.trendValue && (
                    <div><span className="font-medium">Trend:</span> {formData.trendValue} ({formData.trend})</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
