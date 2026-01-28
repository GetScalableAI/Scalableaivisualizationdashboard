import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Building2,
  DollarSign,
  Calendar,
  Clock,
  Package,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Send,
  FileText,
  Loader2,
  XCircle,
  Timer,
  Users,
  Wrench,
  Box,
  MapPin,
} from 'lucide-react';
import { RFQ, RFQStatus } from './types';

interface RFQDetailModalProps {
  rfq: RFQ;
  onClose: () => void;
}

export default function RFQDetailModal({ rfq, onClose }: RFQDetailModalProps) {
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

  const getFitScoreColor = (fit?: RFQ['fit']) => {
    if (!fit) return 'bg-gray-50 text-gray-700';
    const colors = {
      poor: 'bg-red-50 text-red-700',
      fair: 'bg-yellow-50 text-yellow-700',
      good: 'bg-blue-50 text-blue-700',
      excellent: 'bg-green-50 text-green-700',
    };
    return colors[fit];
  };

  const getPriorityColor = (priority: RFQ['priority']) => {
    const colors = {
      low: 'bg-gray-50 text-gray-700',
      medium: 'bg-blue-50 text-blue-700',
      high: 'bg-orange-50 text-orange-700',
      urgent: 'bg-red-50 text-red-700',
    };
    return colors[priority];
  };

  const statusConfig = getStatusConfig(rfq.status);
  const StatusIcon = statusConfig.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{rfq.title}</h2>
              <p className="text-sm text-gray-500 font-mono">{rfq.id}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                <StatusIcon className={`w-4 h-4 ${rfq.status === 'processing' ? 'animate-spin' : ''}`} />
                {statusConfig.label}
              </span>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Stats Cards Row */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 text-xs text-blue-600 mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium">Total Revenue</span>
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  ${rfq.value.toLocaleString()}
                </div>
              </div>

              <div className={`rounded-xl p-4 border ${getFitScoreColor(rfq.fit)} ${rfq.fit ? 'border-current/20' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2 text-xs mb-2">
                  <Star className="w-4 h-4" />
                  <span className="font-medium">Fit Score</span>
                </div>
                <div className="text-2xl font-bold capitalize">
                  {rfq.fit || 'N/A'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-2 text-xs text-purple-600 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Lead Time</span>
                </div>
                <div className="text-2xl font-bold text-purple-700">
                  {rfq.leadTime || 'N/A'} <span className="text-sm font-normal">days</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-2 text-xs text-green-600 mb-2">
                  <Package className="w-4 h-4" />
                  <span className="font-medium">Item Count</span>
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {rfq.items}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">RFQ Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Vendor */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Building2 className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Vendor</div>
                    <div className="text-sm font-semibold text-gray-900 mt-0.5">{rfq.vendor}</div>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Box className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Category</div>
                    <div className="text-sm font-semibold text-gray-900 mt-0.5">{rfq.category}</div>
                  </div>
                </div>

                {/* Material */}
                {rfq.material && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Wrench className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Material Type</div>
                      <div className="text-sm font-semibold text-gray-900 mt-0.5">{rfq.material}</div>
                    </div>
                  </div>
                )}

                {/* Size */}
                {rfq.size && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <TrendingUp className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Size/Dimensions</div>
                      <div className="text-sm font-semibold text-gray-900 mt-0.5">{rfq.size}</div>
                    </div>
                  </div>
                )}

                {/* Building */}
                {rfq.building && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Building/Location</div>
                      <div className="text-sm font-semibold text-gray-900 mt-0.5">{rfq.building}</div>
                    </div>
                  </div>
                )}

                {/* Contract Length */}
                {rfq.contractLength && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Contract Length</div>
                      <div className="text-sm font-semibold text-gray-900 mt-0.5 capitalize">{rfq.contractLength}</div>
                    </div>
                  </div>
                )}

                {/* Priority */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <AlertCircle className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Priority</div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${getPriorityColor(rfq.priority)}`}>
                      {rfq.priority.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Assigned To */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Currently With</div>
                    <div className="text-sm font-semibold text-blue-600 mt-0.5">{rfq.assignedTo}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Created</div>
                    <div className="text-sm font-medium text-gray-900">{rfq.createdDate}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div className="flex-1">
                    <div className="text-xs text-orange-600 font-medium">Due Date</div>
                    <div className="text-sm font-semibold text-orange-700">{rfq.dueDate}</div>
                  </div>
                </div>

                {rfq.responseDate && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <div className="text-xs text-green-600 font-medium">Response Date</div>
                      <div className="text-sm font-semibold text-green-700">{rfq.responseDate}</div>
                    </div>
                  </div>
                )}

                {rfq.quoteAmount && (
                  <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                    rfq.quoteAmount <= rfq.value ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <DollarSign className={`w-5 h-5 ${rfq.quoteAmount <= rfq.value ? 'text-green-600' : 'text-red-600'}`} />
                    <div className="flex-1">
                      <div className={`text-xs font-medium ${rfq.quoteAmount <= rfq.value ? 'text-green-600' : 'text-red-600'}`}>
                        Quote Amount
                      </div>
                      <div className={`text-sm font-semibold ${rfq.quoteAmount <= rfq.value ? 'text-green-700' : 'text-red-700'}`}>
                        ${rfq.quoteAmount.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">vs. Estimate</div>
                      <div className={`text-sm font-bold ${rfq.quoteAmount <= rfq.value ? 'text-green-700' : 'text-red-700'}`}>
                        {rfq.quoteAmount <= rfq.value ? '-' : '+'}{Math.abs(((rfq.quoteAmount - rfq.value) / rfq.value) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Processing Progress */}
            {rfq.status === 'processing' && rfq.processingProgress !== undefined && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-amber-800">Processing Progress</span>
                  <span className="text-lg font-bold text-amber-800">{rfq.processingProgress}%</span>
                </div>
                <div className="w-full h-3 bg-amber-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${rfq.processingProgress}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <p className="text-xs text-amber-700 mt-2">Vendor is reviewing the request and preparing quote</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Close
              </motion.button>

              {rfq.status === 'quoted' && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2.5 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                  >
                    Reject Quote
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Accept Quote
                  </motion.button>
                </>
              )}

              {rfq.status === 'draft' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send RFQ
                </motion.button>
              )}

              {(rfq.status === 'processing' || rfq.status === 'sent') && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2.5 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Distribute to Division
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
