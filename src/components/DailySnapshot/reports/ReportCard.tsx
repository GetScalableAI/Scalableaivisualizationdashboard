// ReportCard - Individual report preview card
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  MoreVertical,
  Star,
  Copy,
  Trash2,
  Download,
  Check,
} from 'lucide-react';
import { ReportMetadata } from '../types/report';

interface ReportCardProps {
  report: ReportMetadata;
  isActive: boolean;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onSetDefault: (id: string) => void;
  onExport: (id: string) => void;
}

export default function ReportCard({
  report,
  isActive,
  onLoad,
  onDelete,
  onDuplicate,
  onSetDefault,
  onExport,
}: ReportCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    onDelete(report.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDeleting ? 0 : 1, y: isDeleting ? -10 : 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className={`relative p-3 rounded-lg border transition-all cursor-pointer ${
        isActive
          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 shadow-md'
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={() => onLoad(report.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-md ${
              isActive
                ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                : 'bg-gray-100'
            }`}
          >
            <FileText
              className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-600'}`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4
              className={`text-sm font-medium truncate ${
                isActive ? 'text-blue-700' : 'text-gray-900'
              }`}
            >
              {report.name}
            </h4>
          </div>
        </div>

        {/* Menu button */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20"
              >
                {!report.isDefault && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetDefault(report.id);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Star className="w-4 h-4" />
                    Set as Default
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(report.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onExport(report.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {report.description && (
        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
          {report.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{formatDate(report.updatedAt)}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-400">
            {report.widgetCount} widget{report.widgetCount !== 1 ? 's' : ''}
          </span>

          {report.isDefault && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-medium">Default</span>
            </div>
          )}

          {isActive && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full">
              <Check className="w-3 h-3" />
              <span className="text-xs font-medium">Active</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
