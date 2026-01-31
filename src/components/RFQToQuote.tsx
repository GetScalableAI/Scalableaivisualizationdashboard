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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

  const getStatusBadge = (status: RFQStatus) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'sent':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Sent</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Processing</Badge>;
      case 'quoted':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Quoted</Badge>;
      case 'accepted':
        return <Badge variant="default" className="bg-green-600">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'expired':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600">Expired</Badge>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: RFQ['priority']) => {
    switch (priority) {
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700">High</Badge>;
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      default:
        return null;
    }
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
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">RFQ to Quote</h1>
            <p className="text-gray-500 mt-1">Manage Request for Quotes and track vendor responses</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowChart(!showChart)}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {showChart ? 'Hide Charts' : 'Show Charts'}
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            {onOpenChat && (
              <Button onClick={onOpenChat}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Ask AI
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <Card>
          <CardContent className="p-4">
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
          </CardContent>
        </Card>

        {/* Charts */}
        <AnimatePresence>
          {showChart && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>RFQ Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
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
                        <RechartsTooltip />
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>RFQ Value Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={valueDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <RechartsTooltip
                          formatter={(value: number, name: string) => [
                            name === 'count' ? value : `$${(value / 1000).toFixed(0)}K`,
                            name === 'count' ? 'Count' : 'Value'
                          ]}
                        />
                        <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} name="count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by RFQ ID, title, or vendor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as RFQStatus | 'all')}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="quoted">Quoted</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <Select value={valueFilter} onValueChange={(value) => setValueFilter(value as typeof valueFilter)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Values" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Values</SelectItem>
                    <SelectItem value="under10k">Under $10K</SelectItem>
                    <SelectItem value="10k-50k">$10K - $50K</SelectItem>
                    <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                    <SelectItem value="over100k">Over $100K</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RFQ ID</TableHead>
                  <TableHead>Title / Vendor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSort('value')}
                      className="ml-auto"
                    >
                      Value
                      <ArrowUpDown className="w-3 h-3 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead className="text-center">Priority</TableHead>
                  <TableHead className="text-center">Processing</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
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
                      <TableCell>
                        <span className="font-mono text-sm font-medium text-blue-600">{rfq.id}</span>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{rfq.title}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Building2 className="w-3 h-3" />
                          {rfq.vendor}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{rfq.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold text-gray-900">${rfq.value.toLocaleString()}</span>
                        {rfq.quoteAmount && rfq.quoteAmount !== rfq.value && (
                          <div className={`text-xs mt-1 ${rfq.quoteAmount < rfq.value ? 'text-green-600' : 'text-red-600'}`}>
                            Quote: ${rfq.quoteAmount.toLocaleString()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-gray-700">{rfq.items}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        {getPriorityBadge(rfq.priority)}
                      </TableCell>
                      <TableCell>
                        {rfq.status === 'processing' && rfq.processingProgress !== undefined ? (
                          <div className="w-full">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-500">Progress</span>
                              <span className="text-xs font-medium text-amber-600">{rfq.processingProgress}%</span>
                            </div>
                            <Progress value={rfq.processingProgress} className="h-2" />
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
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                            <StatusIcon className={`w-3.5 h-3.5 ${rfq.status === 'processing' ? 'animate-spin' : ''}`} />
                            {statusConfig.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            with <span className="font-medium text-gray-700">{rfq.assignedTo}</span>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedRFQ(rfq)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
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
        </Card>

        {/* Detail Modal */}
        <Dialog open={!!selectedRFQ} onOpenChange={(open) => !open && setSelectedRFQ(null)}>
          <DialogContent className="max-w-2xl">
            {selectedRFQ && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle>{selectedRFQ.title}</DialogTitle>
                      <p className="text-gray-500 text-sm mt-1">{selectedRFQ.id}</p>
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
                </DialogHeader>

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

                  <Separator />

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

                  <Separator />

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
                    <>
                      <Separator />
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-amber-800">Processing Progress</span>
                          <span className="text-sm font-bold text-amber-800">{selectedRFQ.processingProgress}%</span>
                        </div>
                        <Progress value={selectedRFQ.processingProgress} className="h-3" />
                        <p className="text-xs text-amber-700 mt-2">Vendor is reviewing the request and preparing quote</p>
                      </div>
                    </>
                  )}
                </div>

                <DialogFooter>
                  <div className="flex gap-3 w-full">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedRFQ(null)}
                      className="flex-1"
                    >
                      Close
                    </Button>
                    {selectedRFQ.status === 'quoted' && (
                      <>
                        <Button
                          variant="destructive"
                          className="flex-1"
                        >
                          Reject Quote
                        </Button>
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          Accept Quote
                        </Button>
                      </>
                    )}
                    {selectedRFQ.status === 'draft' && (
                      <Button
                        className="flex-1"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send RFQ
                      </Button>
                    )}
                  </div>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
