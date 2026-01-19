import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  RefreshCw,
  FileText,
  Package,
  Receipt,
  ArrowRight,
  ChevronDown,
  Eye,
  MessageSquare,
  TrendingUp,
  Clock,
  DollarSign,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ThreeWayMatchingProps {
  onOpenChat?: () => void;
}

type MatchStatus = 'matched' | 'partial' | 'mismatch' | 'pending';

interface MatchRecord {
  id: string;
  poNumber: string;
  invoiceNumber: string;
  grNumber: string;
  vendor: string;
  poAmount: number;
  invoiceAmount: number;
  grAmount: number;
  variance: number;
  variancePercent: number;
  status: MatchStatus;
  matchDate: string;
  items: number;
  category: string;
}

export default function ThreeWayMatching({ onOpenChat }: ThreeWayMatchingProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<MatchStatus | 'all'>('all');
  const [selectedRecord, setSelectedRecord] = useState<MatchRecord | null>(null);
  const [showChart, setShowChart] = useState(false);

  // Sample data
  const matchRecords: MatchRecord[] = [
    {
      id: 'TWM-001',
      poNumber: 'PO-2024-0892',
      invoiceNumber: 'INV-78234',
      grNumber: 'GR-2024-1456',
      vendor: 'Industrial Parts Co.',
      poAmount: 45000.00,
      invoiceAmount: 45000.00,
      grAmount: 45000.00,
      variance: 0,
      variancePercent: 0,
      status: 'matched',
      matchDate: '2024-01-18',
      items: 12,
      category: 'Raw Materials',
    },
    {
      id: 'TWM-002',
      poNumber: 'PO-2024-0891',
      invoiceNumber: 'INV-78190',
      grNumber: 'GR-2024-1452',
      vendor: 'TechSupply Inc.',
      poAmount: 28500.00,
      invoiceAmount: 28750.00,
      grAmount: 28500.00,
      variance: 250.00,
      variancePercent: 0.88,
      status: 'partial',
      matchDate: '2024-01-18',
      items: 8,
      category: 'Electronics',
    },
    {
      id: 'TWM-003',
      poNumber: 'PO-2024-0888',
      invoiceNumber: 'INV-78145',
      grNumber: 'GR-2024-1448',
      vendor: 'Global Components Ltd.',
      poAmount: 67200.00,
      invoiceAmount: 72500.00,
      grAmount: 67200.00,
      variance: 5300.00,
      variancePercent: 7.89,
      status: 'mismatch',
      matchDate: '2024-01-17',
      items: 24,
      category: 'Components',
    },
    {
      id: 'TWM-004',
      poNumber: 'PO-2024-0885',
      invoiceNumber: 'INV-78098',
      grNumber: 'GR-2024-1445',
      vendor: 'MetalWorks Corp.',
      poAmount: 32100.00,
      invoiceAmount: 32100.00,
      grAmount: 32100.00,
      variance: 0,
      variancePercent: 0,
      status: 'matched',
      matchDate: '2024-01-17',
      items: 6,
      category: 'Raw Materials',
    },
    {
      id: 'TWM-005',
      poNumber: 'PO-2024-0882',
      invoiceNumber: 'INV-78056',
      grNumber: 'GR-2024-1442',
      vendor: 'Precision Tools LLC',
      poAmount: 18900.00,
      invoiceAmount: 19200.00,
      grAmount: 18900.00,
      variance: 300.00,
      variancePercent: 1.59,
      status: 'partial',
      matchDate: '2024-01-16',
      items: 15,
      category: 'Tools',
    },
    {
      id: 'TWM-006',
      poNumber: 'PO-2024-0879',
      invoiceNumber: 'INV-78012',
      grNumber: '-',
      vendor: 'Chemical Solutions Inc.',
      poAmount: 41500.00,
      invoiceAmount: 41500.00,
      grAmount: 0,
      variance: 41500.00,
      variancePercent: 100,
      status: 'pending',
      matchDate: '2024-01-16',
      items: 4,
      category: 'Chemicals',
    },
    {
      id: 'TWM-007',
      poNumber: 'PO-2024-0875',
      invoiceNumber: 'INV-77989',
      grNumber: 'GR-2024-1438',
      vendor: 'SafetyGear Pro',
      poAmount: 8750.00,
      invoiceAmount: 8750.00,
      grAmount: 8750.00,
      variance: 0,
      variancePercent: 0,
      status: 'matched',
      matchDate: '2024-01-15',
      items: 50,
      category: 'Safety Equipment',
    },
    {
      id: 'TWM-008',
      poNumber: 'PO-2024-0872',
      invoiceNumber: 'INV-77945',
      grNumber: 'GR-2024-1435',
      vendor: 'AutoParts Direct',
      poAmount: 56300.00,
      invoiceAmount: 58200.00,
      grAmount: 54100.00,
      variance: 4100.00,
      variancePercent: 7.28,
      status: 'mismatch',
      matchDate: '2024-01-15',
      items: 18,
      category: 'Auto Parts',
    },
  ];

  // Summary stats
  const stats = {
    total: matchRecords.length,
    matched: matchRecords.filter(r => r.status === 'matched').length,
    partial: matchRecords.filter(r => r.status === 'partial').length,
    mismatch: matchRecords.filter(r => r.status === 'mismatch').length,
    pending: matchRecords.filter(r => r.status === 'pending').length,
    totalValue: matchRecords.reduce((sum, r) => sum + r.poAmount, 0),
    totalVariance: matchRecords.reduce((sum, r) => sum + r.variance, 0),
  };

  // Chart data
  const pieData = [
    { name: 'Matched', value: stats.matched, color: '#10B981' },
    { name: 'Partial', value: stats.partial, color: '#F59E0B' },
    { name: 'Mismatch', value: stats.mismatch, color: '#EF4444' },
    { name: 'Pending', value: stats.pending, color: '#6B7280' },
  ];

  const barData = [
    { name: 'Mon', matched: 12, partial: 3, mismatch: 2 },
    { name: 'Tue', matched: 15, partial: 4, mismatch: 1 },
    { name: 'Wed', matched: 10, partial: 5, mismatch: 3 },
    { name: 'Thu', matched: 18, partial: 2, mismatch: 2 },
    { name: 'Fri', matched: 14, partial: 3, mismatch: 1 },
    { name: 'Today', matched: 8, partial: 2, mismatch: 2 },
  ];

  const getStatusIcon = (status: MatchStatus) => {
    switch (status) {
      case 'matched':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'partial':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'mismatch':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: MatchStatus) => {
    const styles = {
      matched: 'bg-green-100 text-green-800 border-green-200',
      partial: 'bg-amber-100 text-amber-800 border-amber-200',
      mismatch: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    const labels = {
      matched: 'Matched',
      partial: 'Partial Match',
      mismatch: 'Mismatch',
      pending: 'Pending GR',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const filteredRecords = matchRecords.filter(record => {
    const matchesSearch =
      record.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">3 Way Matching</h1>
          <p className="text-gray-500 mt-1">Match Purchase Orders, Invoices, and Goods Receipts</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowChart(!showChart)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            {showChart ? 'Hide Charts' : 'Show Charts'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
          {onOpenChat && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenChat}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Ask AI
            </motion.button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between divide-x divide-gray-200">
          <div className="flex items-center gap-3 px-4 first:pl-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Total Records</div>
              <div className="text-xl font-bold text-gray-900">{stats.total}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Matched</div>
              <div className="text-xl font-bold text-green-600">{stats.matched} <span className="text-xs font-normal">({Math.round((stats.matched / stats.total) * 100)}%)</span></div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Partial</div>
              <div className="text-xl font-bold text-amber-600">{stats.partial}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Mismatches</div>
              <div className="text-xl font-bold text-red-600">{stats.mismatch}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 last:pr-0">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Total Variance</div>
              <div className="text-xl font-bold text-purple-600">${(stats.totalVariance / 1000).toFixed(1)}K</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <AnimatePresence>
        {showChart && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Status Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-600">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Matching Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="matched" fill="#10B981" radius={[4, 4, 0, 0]} name="Matched" />
                    <Bar dataKey="partial" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Partial" />
                    <Bar dataKey="mismatch" fill="#EF4444" radius={[4, 4, 0, 0]} name="Mismatch" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by PO, Invoice, or Vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as MatchStatus | 'all')}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="matched">Matched</option>
            <option value="partial">Partial Match</option>
            <option value="mismatch">Mismatch</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </motion.button>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Match ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Documents</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">PO Amount</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">GR Amount</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Variance</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.map((record, index) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-blue-600">{record.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded text-xs text-blue-700">
                        <Package className="w-3 h-3" />
                        {record.poNumber}
                      </div>
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                      <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 rounded text-xs text-purple-700">
                        <Receipt className="w-3 h-3" />
                        {record.invoiceNumber}
                      </div>
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                      <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${record.grNumber === '-' ? 'bg-gray-50 text-gray-400' : 'bg-green-50 text-green-700'}`}>
                        <FileText className="w-3 h-3" />
                        {record.grNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{record.vendor}</div>
                    <div className="text-xs text-gray-500">{record.category}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-medium text-gray-900">${record.poAmount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-medium ${record.invoiceAmount !== record.poAmount ? 'text-amber-600' : 'text-gray-900'}`}>
                      ${record.invoiceAmount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-medium ${record.grAmount === 0 ? 'text-gray-400' : record.grAmount !== record.poAmount ? 'text-amber-600' : 'text-gray-900'}`}>
                      {record.grAmount === 0 ? '-' : `$${record.grAmount.toLocaleString()}`}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {record.variance > 0 ? (
                      <div>
                        <span className="font-medium text-red-600">${record.variance.toLocaleString()}</span>
                        <span className="text-xs text-red-500 ml-1">({record.variancePercent.toFixed(1)}%)</span>
                      </div>
                    ) : (
                      <span className="text-green-600 font-medium">$0</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedRecord(record)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedRecord(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Match Details</h2>
                  <p className="text-gray-500">{selectedRecord.id}</p>
                </div>
                {getStatusBadge(selectedRecord.status)}
              </div>

              <div className="space-y-6">
                {/* Three Way Visual */}
                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                  <div className="text-center flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-xs text-gray-500 mb-1">Purchase Order</div>
                    <div className="font-mono text-sm font-medium text-blue-600">{selectedRecord.poNumber}</div>
                    <div className="text-lg font-bold text-gray-900 mt-1">${selectedRecord.poAmount.toLocaleString()}</div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-300" />
                  <div className="text-center flex-1">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Receipt className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-xs text-gray-500 mb-1">Invoice</div>
                    <div className="font-mono text-sm font-medium text-purple-600">{selectedRecord.invoiceNumber}</div>
                    <div className={`text-lg font-bold mt-1 ${selectedRecord.invoiceAmount !== selectedRecord.poAmount ? 'text-amber-600' : 'text-gray-900'}`}>
                      ${selectedRecord.invoiceAmount.toLocaleString()}
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-300" />
                  <div className="text-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${selectedRecord.grNumber === '-' ? 'bg-gray-100' : 'bg-green-100'}`}>
                      <FileText className={`w-6 h-6 ${selectedRecord.grNumber === '-' ? 'text-gray-400' : 'text-green-600'}`} />
                    </div>
                    <div className="text-xs text-gray-500 mb-1">Goods Receipt</div>
                    <div className={`font-mono text-sm font-medium ${selectedRecord.grNumber === '-' ? 'text-gray-400' : 'text-green-600'}`}>{selectedRecord.grNumber}</div>
                    <div className={`text-lg font-bold mt-1 ${selectedRecord.grAmount === 0 ? 'text-gray-400' : 'text-gray-900'}`}>
                      {selectedRecord.grAmount === 0 ? 'Pending' : `$${selectedRecord.grAmount.toLocaleString()}`}
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Vendor</div>
                    <div className="font-medium text-gray-900">{selectedRecord.vendor}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Category</div>
                    <div className="font-medium text-gray-900">{selectedRecord.category}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Line Items</div>
                    <div className="font-medium text-gray-900">{selectedRecord.items} items</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Match Date</div>
                    <div className="font-medium text-gray-900">{selectedRecord.matchDate}</div>
                  </div>
                </div>

                {selectedRecord.variance > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      Variance Detected
                    </div>
                    <div className="text-sm text-red-700">
                      Total variance of <strong>${selectedRecord.variance.toLocaleString()}</strong> ({selectedRecord.variancePercent.toFixed(2)}%) requires review and approval.
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRecord(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </motion.button>
                {selectedRecord.status !== 'matched' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Resolve Variance
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
