// ReportManager - Main reports list component for sidebar
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  ArrowUpDown,
  Upload,
  FolderOpen,
  FileText,
} from 'lucide-react';
import ReportCard from './ReportCard';
import ReportSaveDialog from './ReportSaveDialog';
import ReportLoadDialog from './ReportLoadDialog';
import { ReportMetadata } from '../types/report';

interface ReportManagerProps {
  reports: ReportMetadata[];
  currentReportId: string | null;
  onLoadReport: (id: string) => void;
  onCreateReport: (name: string, description?: string) => void;
  onDeleteReport: (id: string) => void;
  onDuplicateReport: (id: string, newName: string) => void;
  onSetDefaultReport: (id: string) => void;
  onExportReport: (id: string) => void;
  onImportReport: (file: File) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'name' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'name' | 'createdAt' | 'updatedAt', sortOrder: 'asc' | 'desc') => void;
}

export default function ReportManager({
  reports,
  currentReportId,
  onLoadReport,
  onCreateReport,
  onDeleteReport,
  onDuplicateReport,
  onSetDefaultReport,
  onExportReport,
  onImportReport,
  searchQuery,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
}: ReportManagerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  const handleCreateReport = (name: string, description?: string) => {
    onCreateReport(name, description);
    setShowCreateDialog(false);
  };

  const handleDuplicate = (id: string) => {
    const report = reports.find(r => r.id === id);
    if (report) {
      setDuplicatingId(id);
    }
  };

  const handleDuplicateConfirm = (name: string) => {
    if (duplicatingId) {
      onDuplicateReport(duplicatingId, name);
      setDuplicatingId(null);
    }
  };

  const handleImport = (file: File) => {
    onImportReport(file);
    setShowImportDialog(false);
  };

  const toggleSortOrder = () => {
    onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSortByChange = (newSortBy: 'name' | 'createdAt' | 'updatedAt') => {
    onSortChange(newSortBy, sortOrder);
    setShowSortMenu(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-700">Reports</h3>
          <span className="text-xs text-gray-400">({reports.length})</span>
        </div>

        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowImportDialog(true)}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
            title="Import Report"
          >
            <Upload className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateDialog(true)}
            className="p-1.5 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm"
            title="Create New Report"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-1 p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
            title="Sort options"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>

          {showSortMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowSortMenu(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20"
              >
                <div className="px-3 py-1 text-xs font-medium text-gray-500">Sort by</div>
                {[
                  { key: 'name', label: 'Name' },
                  { key: 'updatedAt', label: 'Last Updated' },
                  { key: 'createdAt', label: 'Created' },
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleSortByChange(option.key as 'name' | 'createdAt' | 'updatedAt')}
                    className={`flex items-center justify-between w-full px-3 py-1.5 text-xs ${
                      sortBy === option.key
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                    {sortBy === option.key && (
                      <span className="text-blue-500">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                ))}
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={toggleSortOrder}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                >
                  {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
                </button>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Reports List */}
      <div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-2">
        <AnimatePresence mode="popLayout">
          {reports.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mb-1">No reports yet</p>
              <p className="text-xs text-gray-400 mb-3">
                Create your first report to save your dashboard configuration
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateDialog(true)}
                className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-sm"
              >
                Create Report
              </motion.button>
            </motion.div>
          ) : (
            reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                isActive={report.id === currentReportId}
                onLoad={onLoadReport}
                onDelete={onDeleteReport}
                onDuplicate={handleDuplicate}
                onSetDefault={onSetDefaultReport}
                onExport={onExportReport}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Create Dialog */}
      <AnimatePresence>
        {showCreateDialog && (
          <ReportSaveDialog
            mode="create"
            onSave={handleCreateReport}
            onClose={() => setShowCreateDialog(false)}
          />
        )}
      </AnimatePresence>

      {/* Duplicate Dialog */}
      <AnimatePresence>
        {duplicatingId && (
          <ReportSaveDialog
            mode="duplicate"
            initialName={reports.find(r => r.id === duplicatingId)?.name + ' (Copy)'}
            onSave={handleDuplicateConfirm}
            onClose={() => setDuplicatingId(null)}
          />
        )}
      </AnimatePresence>

      {/* Import Dialog */}
      <AnimatePresence>
        {showImportDialog && (
          <ReportLoadDialog
            onImport={handleImport}
            onClose={() => setShowImportDialog(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
