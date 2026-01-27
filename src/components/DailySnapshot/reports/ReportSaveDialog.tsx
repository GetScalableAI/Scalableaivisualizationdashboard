// ReportSaveDialog - Modal for saving/creating reports
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Save, FileText, AlertCircle } from 'lucide-react';

interface ReportSaveDialogProps {
  mode: 'create' | 'save' | 'duplicate';
  initialName?: string;
  initialDescription?: string;
  onSave: (name: string, description?: string) => void;
  onClose: () => void;
}

export default function ReportSaveDialog({
  mode,
  initialName = '',
  initialDescription = '',
  onSave,
  onClose,
}: ReportSaveDialogProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Report name is required');
      return;
    }

    if (trimmedName.length > 100) {
      setError('Report name must be less than 100 characters');
      return;
    }

    onSave(trimmedName, description.trim() || undefined);
  };

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Create New Report';
      case 'save':
        return 'Save Report';
      case 'duplicate':
        return 'Duplicate Report';
      default:
        return 'Save Report';
    }
  };

  const getButtonText = () => {
    switch (mode) {
      case 'create':
        return 'Create';
      case 'save':
        return 'Save';
      case 'duplicate':
        return 'Duplicate';
      default:
        return 'Save';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{getTitle()}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Name input */}
            <div>
              <label
                htmlFor="report-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Report Name <span className="text-red-500">*</span>
              </label>
              <input
                ref={inputRef}
                id="report-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                placeholder="e.g., Morning Standup Dashboard"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  error
                    ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
              />
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 mt-1 text-sm text-red-600"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}
            </div>

            {/* Description input */}
            <div>
              <label
                htmlFor="report-description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                id="report-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this report..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              {getButtonText()}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
