// ReportLoadDialog - Modal for importing reports from JSON files
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, FileJson, AlertCircle, CheckCircle } from 'lucide-react';

interface ReportLoadDialogProps {
  onImport: (file: File) => void;
  onClose: () => void;
}

export default function ReportLoadDialog({ onImport, onClose }: ReportLoadDialogProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (!file.name.endsWith('.json')) {
      setError('Please select a JSON file');
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    setError(null);
    if (validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleImport = () => {
    if (selectedFile) {
      onImport(selectedFile);
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
            <div className="p-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Import Report</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : selectedFile
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleInputChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setError(null);
                  }}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Choose different file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    isDragging ? 'bg-blue-100' : 'bg-gray-100'
                  }`}
                >
                  <FileJson
                    className={`w-6 h-6 ${
                      isDragging ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  />
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {isDragging
                    ? 'Drop your file here'
                    : 'Drag and drop a JSON file here'}
                </p>
                <p className="text-xs text-gray-400 mb-3">or</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  Browse files
                </button>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Info */}
          <p className="text-xs text-gray-500 mt-4">
            Import a previously exported dashboard report configuration. The file should
            be a valid JSON file exported from this application.
          </p>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <motion.button
              onClick={handleImport}
              disabled={!selectedFile}
              whileHover={selectedFile ? { scale: 1.02 } : {}}
              whileTap={selectedFile ? { scale: 0.98 } : {}}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg shadow-md transition-all ${
                selectedFile
                  ? 'text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600'
                  : 'text-gray-400 bg-gray-100 cursor-not-allowed'
              }`}
            >
              <Upload className="w-4 h-4" />
              Import
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
