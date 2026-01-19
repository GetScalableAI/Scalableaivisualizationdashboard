import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpDown,
  Eye,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Calendar,
  Building2,
  ChevronDown,
  Send,
  Timer,
  Loader2,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

interface RFQToQuoteProps {
  onOpenChat?: () => void;
}

type RFQStatus = 'draft' | 'sent' | 'processing' | 'quoted' | 'accepted' | 'rejected' | 'expired';

type TeamType = 'Engineering' | 'Procurement' | 'Finance' | 'Operations' | 'Quality' | 'Vendor';

interface RFQ {
  id: string;
  title: string;
  vendor: string;
  category: string;
  value: number;
  items: number;
  status: RFQStatus;
  assignedTo: TeamType;
  createdDate: string;
  dueDate: string;
  responseDate?: string;
  quoteAmount?: number;
  processingProgress?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export default function RFQToQuote({ onOpenChat }: RFQToQuoteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RFQStatus | 'all'>('all');
  const [valueFilter, setValueFilter] = useState<'all' | 'under10k' | '10k-50k' | '50k-100k' | 'over100k'>('all');
  const [sortBy, setSortBy] = useState<'value' | 'date' | 'status'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [showChart, setShowChart] = useState(false);

  // Sample RFQ data
  const rfqData: RFQ[] = [
    {
      id: 'RFQ-2024-0156',
      title: 'Industrial Motors & Drives',
      vendor: 'PowerTech Industries',
      category: 'Electrical',
      value: 185000,
      items: 24,
      status: 'processing',
      assignedTo: 'Engineering',
      createdDate: '2024-01-15',
      dueDate: '2024-01-25',
      processingProgress: 65,
      priority: 'high',
    },
    {
      id: 'RFQ-2024-0155',
      title: 'Precision Bearings Set',
      vendor: 'BearingWorld Ltd.',
      category: 'Mechanical',
      value: 45200,
      items: 150,
      status: 'quoted',
      assignedTo: 'Finance',
      createdDate: '2024-01-14',
      dueDate: '2024-01-22',
      responseDate: '2024-01-18',
      quoteAmount: 43850,
      priority: 'medium',
    },
    {
      id: 'RFQ-2024-0154',
      title: 'Steel Sheet Materials',
      vendor: 'MetalCorp Inc.',
      category: 'Raw Materials',
      value: 128500,
      items: 35,
      status: 'processing',
      assignedTo: 'Vendor',
      createdDate: '2024-01-13',
      dueDate: '2024-01-23',
      processingProgress: 40,
      priority: 'urgent',
    },
    {
      id: 'RFQ-2024-0153',
      title: 'Safety Equipment Package',
      vendor: 'SafetyFirst Corp.',
      category: 'Safety',
      value: 22800,
      items: 200,
      status: 'accepted',
      assignedTo: 'Procurement',
      createdDate: '2024-01-12',
      dueDate: '2024-01-20',
      responseDate: '2024-01-16',
      quoteAmount: 21500,
      priority: 'low',
    },
    {
      id: 'RFQ-2024-0152',
      title: 'CNC Machine Components',
      vendor: 'TechParts Global',
      category: 'Components',
      value: 312000,
      items: 45,
      status: 'sent',
      assignedTo: 'Vendor',
      createdDate: '2024-01-11',
      dueDate: '2024-01-28',
      priority: 'high',
    },
    {
      id: 'RFQ-2024-0151',
      title: 'Hydraulic Systems',
      vendor: 'HydroFlow Systems',
      category: 'Mechanical',
      value: 78900,
      items: 18,
      status: 'processing',
      assignedTo: 'Engineering',
      createdDate: '2024-01-10',
      dueDate: '2024-01-24',
      processingProgress: 85,
      priority: 'medium',
    },
    {
      id: 'RFQ-2024-0150',
      title: 'Electronic Sensors Batch',
      vendor: 'SensorTech Inc.',
      category: 'Electronics',
      value: 56300,
      items: 500,
      status: 'quoted',
      assignedTo: 'Finance',
      createdDate: '2024-01-09',
      dueDate: '2024-01-19',
      responseDate: '2024-01-17',
      quoteAmount: 58200,
      priority: 'medium',
    },
    {
      id: 'RFQ-2024-0149',
      title: 'Packaging Materials',
      vendor: 'PackPro Solutions',
      category: 'Consumables',
      value: 8500,
      items: 1000,
      status: 'rejected',
      assignedTo: 'Operations',
      createdDate: '2024-01-08',
      dueDate: '2024-01-16',
      responseDate: '2024-01-14',
      quoteAmount: 12800,
      priority: 'low',
    },
    {
      id: 'RFQ-2024-0148',
      title: 'Industrial Lubricants',
      vendor: 'LubeMax Corp.',
      category: 'Consumables',
      value: 15200,
      items: 80,
      status: 'expired',
      assignedTo: 'Operations',
      createdDate: '2024-01-05',
      dueDate: '2024-01-12',
      priority: 'low',
    },
    {
      id: 'RFQ-2024-0147',
      title: 'Automation Controllers',
      vendor: 'AutoControl Systems',
      category: 'Electronics',
      value: 245000,
      items: 12,
      status: 'draft',
      assignedTo: 'Engineering',
      createdDate: '2024-01-18',
      dueDate: '2024-02-01',
      priority: 'high',
    },
  ];

  // Stats
  const stats = useMemo(() => ({
    total: rfqData.length,
    draft: rfqData.filter(r => r.status === 'draft').length,
    sent: rfqData.filter(r => r.status === 'sent').length,
    processing: rfqData.filter(r => r.status === 'processing').length,
    quoted: rfqData.filter(r => r.status === 'quoted').length,
    accepted: rfqData.filter(r => r.status === 'accepted').length,
    totalValue: rfqData.reduce((sum, r) => sum + r.value, 0),
    processingValue: rfqData.filter(r => r.status === 'processing').reduce((sum, r) => sum + r.value, 0),
  }), []);

  // Chart data
  const pieData = [
    { name: 'Draft', value: stats.draft, color: '#6B7280' },
    { name: 'Sent', value: stats.sent, color: '#3B82F6' },
    { name: 'Processing', value: stats.processing, color: '#F59E0B' },
    { name: 'Quoted', value: stats.quoted, color: '#8B5CF6' },
    { name: 'Accepted', value: stats.accepted, color: '#10B981' },
  ];

  const valueDistribution = [
    { range: '<$10K', count: rfqData.filter(r => r.value < 10000).length, value: rfqData.filter(r => r.value < 10000).reduce((s, r) => s + r.value, 0) },
    { range: '$10K-$50K', count: rfqData.filter(r => r.value >= 10000 && r.value < 50000).length, value: rfqData.filter(r => r.value >= 10000 && r.value < 50000).reduce((s, r) => s + r.value, 0) },
    { range: '$50K-$100K', count: rfqData.filter(r => r.value >= 50000 && r.value < 100000).length, value: rfqData.filter(r => r.value >= 50000 && r.value < 100000).reduce((s, r) => s + r.value, 0) },
    { range: '>$100K', count: rfqData.filter(r => r.value >= 100000).length, value: rfqData.filter(r => r.value >= 100000).reduce((s, r) => s + r.value, 0) },
  ];

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

  // Filtering and sorting
  const filteredAndSortedRFQs = useMemo(() => {
    let filtered = rfqData.filter(rfq => {
      const matchesSearch =
        rfq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rfq.vendor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || rfq.status === statusFilter;

      let matchesValue = true;
      if (valueFilter === 'under10k') matchesValue = rfq.value < 10000;
      else if (valueFilter === '10k-50k') matchesValue = rfq.value >= 10000 && rfq.value < 50000;
      else if (valueFilter === '50k-100k') matchesValue = rfq.value >= 50000 && rfq.value < 100000;
      else if (valueFilter === 'over100k') matchesValue = rfq.value >= 100000;

      return matchesSearch && matchesStatus && matchesValue;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'value') comparison = a.value - b.value;
      else if (sortBy === 'date') comparison = new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
      else if (sortBy === 'status') comparison = a.status.localeCompare(b.status);
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [searchTerm, statusFilter, valueFilter, sortBy, sortOrder]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RFQ to Quote</h1>
          <p className="text-gray-500 mt-1">Manage Request for Quotes and track vendor responses</p>
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
              <div className="text-xs text-gray-500 font-medium">Total RFQs</div>
              <div className="text-xl font-bold text-gray-900">{stats.total}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Processing</div>
              <div className="text-xl font-bold text-amber-600">{stats.processing}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Quoted</div>
              <div className="text-xl font-bold text-purple-600">{stats.quoted}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Total Value</div>
              <div className="text-xl font-bold text-green-600">${(stats.totalValue / 1000000).toFixed(2)}M</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 last:pr-0">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">In Process</div>
              <div className="text-xl font-bold text-orange-600">${(stats.processingValue / 1000).toFixed(0)}K</div>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">RFQ Status Distribution</h3>
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
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-600">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">RFQ Value Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={valueDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === 'count' ? value : `$${(value / 1000).toFixed(0)}K`,
                        name === 'count' ? 'Count' : 'Value'
                      ]}
                    />
                    <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} name="count" />
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
            placeholder="Search by RFQ ID, title, or vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as RFQStatus | 'all')}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="processing">Processing</option>
            <option value="quoted">Quoted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-gray-400" />
          <select
            value={valueFilter}
            onChange={(e) => setValueFilter(e.target.value as typeof valueFilter)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Values</option>
            <option value="under10k">Under $10K</option>
            <option value="10k-50k">$10K - $50K</option>
            <option value="50k-100k">$50K - $100K</option>
            <option value="over100k">Over $100K</option>
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">RFQ ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title / Vendor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th
                  className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleSort('value')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Value
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Processing</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAndSortedRFQs.map((rfq, index) => {
                const statusConfig = getStatusConfig(rfq.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <motion.tr
                    key={rfq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-blue-600">{rfq.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{rfq.title}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Building2 className="w-3 h-3" />
                        {rfq.vendor}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                        {rfq.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-gray-900">${rfq.value.toLocaleString()}</span>
                      {rfq.quoteAmount && rfq.quoteAmount !== rfq.value && (
                        <div className={`text-xs mt-1 ${rfq.quoteAmount < rfq.value ? 'text-green-600' : 'text-red-600'}`}>
                          Quote: ${rfq.quoteAmount.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-700">{rfq.items}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getPriorityBadge(rfq.priority)}
                    </td>
                    <td className="px-6 py-4">
                      {rfq.status === 'processing' && rfq.processingProgress !== undefined ? (
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Progress</span>
                            <span className="text-xs font-medium text-amber-600">{rfq.processingProgress}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${rfq.processingProgress}%` }}
                              transition={{ duration: 0.8 }}
                            />
                          </div>
                        </div>
                      ) : rfq.status === 'sent' ? (
                        <div className="flex items-center justify-center gap-1 text-xs text-blue-600">
                          <Clock className="w-3 h-3" />
                          Awaiting
                        </div>
                      ) : rfq.responseDate ? (
                        <div className="text-xs text-gray-500 text-center">
                          {rfq.responseDate}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 text-center">-</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                          <StatusIcon className={`w-3.5 h-3.5 ${rfq.status === 'processing' ? 'animate-spin' : ''}`} />
                          {statusConfig.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          with <span className="font-medium text-gray-700">{rfq.assignedTo}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedRFQ(rfq)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {filteredAndSortedRFQs.length} of {rfqData.length} RFQs
          </div>
          <div className="text-sm text-gray-500">
            Total Value: <span className="font-semibold text-gray-900">${filteredAndSortedRFQs.reduce((sum, r) => sum + r.value, 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRFQ && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedRFQ(null)}
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
                  <h2 className="text-xl font-bold text-gray-900">{selectedRFQ.title}</h2>
                  <p className="text-gray-500">{selectedRFQ.id}</p>
                </div>
                {(() => {
                  const config = getStatusConfig(selectedRFQ.status);
                  const Icon = config.icon;
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
                      <Icon className={`w-4 h-4 ${selectedRFQ.status === 'processing' ? 'animate-spin' : ''}`} />
                      {config.label}
                    </span>
                  );
                })()}
              </div>

              <div className="space-y-6">
                {/* Vendor, Category & Assigned To */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <Building2 className="w-3 h-3" />
                      Vendor
                    </div>
                    <div className="font-medium text-gray-900">{selectedRFQ.vendor}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Category</div>
                    <div className="font-medium text-gray-900">{selectedRFQ.category}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-xs text-blue-600 mb-1">Currently With</div>
                    <div className="font-medium text-blue-700">{selectedRFQ.assignedTo}</div>
                  </div>
                </div>

                {/* Values */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-xs text-blue-600 mb-1">Estimated Value</div>
                    <div className="text-xl font-bold text-blue-700">${selectedRFQ.value.toLocaleString()}</div>
                  </div>
                  {selectedRFQ.quoteAmount && (
                    <div className={`rounded-lg p-4 ${selectedRFQ.quoteAmount <= selectedRFQ.value ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className={`text-xs mb-1 ${selectedRFQ.quoteAmount <= selectedRFQ.value ? 'text-green-600' : 'text-red-600'}`}>Quote Amount</div>
                      <div className={`text-xl font-bold ${selectedRFQ.quoteAmount <= selectedRFQ.value ? 'text-green-700' : 'text-red-700'}`}>
                        ${selectedRFQ.quoteAmount.toLocaleString()}
                      </div>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Line Items</div>
                    <div className="text-xl font-bold text-gray-900">{selectedRFQ.items}</div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <Calendar className="w-3 h-3" />
                      Created
                    </div>
                    <div className="font-medium text-gray-900">{selectedRFQ.createdDate}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <Clock className="w-3 h-3" />
                      Due Date
                    </div>
                    <div className="font-medium text-gray-900">{selectedRFQ.dueDate}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Priority</div>
                    <div>{getPriorityBadge(selectedRFQ.priority)}</div>
                  </div>
                </div>

                {/* Processing Progress */}
                {selectedRFQ.status === 'processing' && selectedRFQ.processingProgress !== undefined && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-amber-800">Processing Progress</span>
                      <span className="text-sm font-bold text-amber-800">{selectedRFQ.processingProgress}%</span>
                    </div>
                    <div className="w-full h-3 bg-amber-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedRFQ.processingProgress}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <p className="text-xs text-amber-700 mt-2">Vendor is reviewing the request and preparing quote</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRFQ(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </motion.button>
                {selectedRFQ.status === 'quoted' && (
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
                {selectedRFQ.status === 'draft' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send RFQ
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
