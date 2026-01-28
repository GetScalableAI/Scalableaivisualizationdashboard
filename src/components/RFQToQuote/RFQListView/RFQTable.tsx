import { motion } from 'framer-motion';
import {
  ArrowUpDown,
  Eye,
  Clock,
  Building2,
  Loader2,
  FileText,
  Send,
  CheckCircle2,
  XCircle,
  Timer,
} from 'lucide-react';
import { RFQ, RFQStatus } from './types';

interface RFQTableProps {
  rfqs: RFQ[];
  onSelectRFQ: (rfq: RFQ) => void;
  onSort: (field: 'value' | 'date' | 'status') => void;
  sortBy: 'value' | 'date' | 'status';
  sortOrder: 'asc' | 'desc';
}

export default function RFQTable({ rfqs, onSelectRFQ, onSort, sortBy, sortOrder }: RFQTableProps) {
  const getStatusConfig = (status: RFQStatus) => {
    const configs = {
      draft: { icon: FileText, color: 'gray', bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
      sent: { icon: Send, color: 'blue', bg: 'bg-blue-100', text: 'text-blue-700', label: 'Sent' },
      processing: { icon: Loader2, color: 'amber', bg: 'bg-amber-100', text: 'text-amber-700', label: 'Processing' },
      quoted: { icon: FileText, color: 'purple', bg: 'bg-purple-100', text: 'text-purple-700', label: 'Quoted' },
      accepted: { icon: CheckCircle2, color: 'green', bg: 'bg-green-100', text: 'text-green-700', label: 'Accepted' },
      rejected: { icon: XCircle, color: 'red', bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
      expired: { icon: Timer, color: 'gray', bg: 'bg-gray-100', text: 'text-gray-500', label: 'Expired' },
    };
    return configs[status];
  };

  const getPriorityBadge = (priority: RFQ['priority']) => {
    const styles = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      urgent: 'bg-red-100 text-red-600',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getFitBadge = (fit?: RFQ['fit']) => {
    if (!fit) return null;
    const styles = {
      poor: 'bg-red-100 text-red-700',
      fair: 'bg-yellow-100 text-yellow-700',
      good: 'bg-blue-100 text-blue-700',
      excellent: 'bg-green-100 text-green-700',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[fit]}`}>
        {fit.charAt(0).toUpperCase() + fit.slice(1)}
      </span>
    );
  };

  const toggleSort = (field: typeof sortBy) => {
    onSort(field);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">RFQ ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title / Vendor</th>
              <th
                className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => toggleSort('value')}
              >
                <div className="flex items-center justify-end gap-1">
                  Value
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Fit Score</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rfqs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <div className="text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No RFQs match your current filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              rfqs.map((rfq, index) => {
                const statusConfig = getStatusConfig(rfq.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <motion.tr
                    key={rfq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onSelectRFQ(rfq)}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-medium text-blue-600">{rfq.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 text-sm">{rfq.title}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Building2 className="w-3 h-3" />
                        {rfq.vendor}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold text-gray-900">${rfq.value.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {getFitBadge(rfq.fit)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {getPriorityBadge(rfq.priority)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                          <StatusIcon className={`w-3 h-3 ${rfq.status === 'processing' ? 'animate-spin' : ''}`} />
                          {statusConfig.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRFQ(rfq);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-sm">
        <div className="text-gray-500">
          Showing {rfqs.length} RFQ{rfqs.length !== 1 ? 's' : ''}
        </div>
        <div className="text-gray-500">
          Total Value: <span className="font-semibold text-gray-900">${rfqs.reduce((sum, r) => sum + r.value, 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
