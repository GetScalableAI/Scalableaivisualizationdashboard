import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  DollarSign,
  MessageSquare,
  TrendingUp,
  Star,
} from 'lucide-react';
import RFQTable from './RFQTable';
import DistributionPanel from './DistributionPanel';
import DistributionConfig from './DistributionConfig';
import RFQDetailModal from './RFQDetailModal';
import { RFQ, RFQStatus, FitScore, DifficultyLevel, ContractLength, DistributionSettings, DivisionDistribution } from './types';
import { mockRFQData } from './mockData';
import { distributionService } from '../services/distributionService';

interface RFQListViewProps {
  onOpenChat?: () => void;
}

export default function RFQListView({ onOpenChat }: RFQListViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RFQStatus | 'all'>('all');
  const [valueFilter, setValueFilter] = useState<'all' | 'under10k' | '10k-50k' | '50k-100k' | 'over100k'>('all');
  const [fitFilter, setFitFilter] = useState<FitScore | 'all'>('all'); // Promoted to primary
  const [sortBy, setSortBy] = useState<'value' | 'date' | 'status'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);

  // Advanced filters
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | 'all'>('all');
  const [contractLengthFilter, setContractLengthFilter] = useState<ContractLength | 'all'>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Distribution state
  const [showDistributionConfig, setShowDistributionConfig] = useState(false);
  const [distributionSettings, setDistributionSettings] = useState<DistributionSettings>(
    distributionService.getDistributionSettings()
  );
  const [distributions, setDistributions] = useState<DivisionDistribution[]>(
    distributionService.getTodaysDistributions()
  );

  // Load distribution settings on mount
  useEffect(() => {
    const settings = distributionService.getDistributionSettings();
    setDistributionSettings(settings);
    setDistributions(distributionService.getTodaysDistributions());
  }, []);

  // Filtering and sorting
  const filteredAndSortedRFQs = useMemo(() => {
    let filtered = mockRFQData.filter((rfq) => {
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

      // Primary filters
      const matchesFit = fitFilter === 'all' || rfq.fit === fitFilter;

      // Advanced filters
      const matchesDifficulty = difficultyFilter === 'all' || rfq.difficulty === difficultyFilter;
      const matchesContractLength = contractLengthFilter === 'all' || rfq.contractLength === contractLengthFilter;

      return matchesSearch && matchesStatus && matchesValue && matchesFit && matchesDifficulty && matchesContractLength;
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
  }, [searchTerm, statusFilter, valueFilter, fitFilter, sortBy, sortOrder, difficultyFilter, contractLengthFilter]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleDistributeNow = () => {
    // Mock divisions - in production, these would come from the workflow configuration
    const divisions = [
      { name: 'Division A', managerName: 'John Smith', managerEmail: 'john.smith@company.com' },
      { name: 'Division B', managerName: 'Jane Doe', managerEmail: 'jane.doe@company.com' },
      { name: 'Division C', managerName: 'Bob Johnson', managerEmail: 'bob.johnson@company.com' },
    ];

    // Execute distribution
    const newDistributions = distributionService.executeDistribution(
      mockRFQData,
      divisions,
      distributionSettings,
      'roundRobin'
    );

    // Update state
    setDistributions(newDistributions);

    // Reload settings to get updated lastDistribution
    setDistributionSettings(distributionService.getDistributionSettings());
  };

  const handleSaveSettings = (newSettings: DistributionSettings) => {
    distributionService.saveDistributionSettings(newSettings);
    setDistributionSettings(newSettings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RFQ Distribution</h1>
          <p className="text-gray-500 mt-1">Manage and distribute RFQs to your teams</p>
        </div>
        <div className="flex items-center gap-3">
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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-4 p-4 flex-wrap">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by RFQ ID, title, or vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Primary Filters */}
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

          {/* Fit Score - Promoted to Primary */}
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-gray-400" />
            <select
              value={fitFilter}
              onChange={(e) => setFitFilter(e.target.value as FitScore | 'all')}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Fit Scores</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
              showAdvancedFilters
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Filter className="w-4 h-4" />
            Advanced
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </motion.button>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 bg-gray-50 px-4 py-3"
            >
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">Difficulty:</span>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value as DifficultyLevel | 'all')}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="very high">Very High</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">Contract Length:</span>
                  <select
                    value={contractLengthFilter}
                    onChange={(e) => setContractLengthFilter(e.target.value as ContractLength | 'all')}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                    <option value="multi-year">Multi-Year</option>
                  </select>
                </div>
                {(difficultyFilter !== 'all' || contractLengthFilter !== 'all') && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setDifficultyFilter('all');
                      setContractLengthFilter('all');
                    }}
                    className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Clear Advanced Filters
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Split View Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Available RFQs */}
        <div className="col-span-8">
          <RFQTable
            rfqs={filteredAndSortedRFQs}
            onSelectRFQ={setSelectedRFQ}
            onSort={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        </div>

        {/* Right Panel - Distribution Summary */}
        <div className="col-span-4">
          <DistributionPanel
            distributions={distributions}
            settings={distributionSettings}
            onOpenSettings={() => setShowDistributionConfig(true)}
            onDistributeNow={handleDistributeNow}
          />
        </div>
      </div>

      {/* RFQ Detail Modal */}
      {selectedRFQ && (
        <RFQDetailModal
          rfq={selectedRFQ}
          onClose={() => setSelectedRFQ(null)}
        />
      )}

      {/* Distribution Config Dialog */}
      <DistributionConfig
        open={showDistributionConfig}
        onOpenChange={setShowDistributionConfig}
        settings={distributionSettings}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
