import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ChevronRight, BarChart3, Table, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell, AreaChart, Area } from 'recharts';
import { useDrillDownSafe } from '../context/DrillDownContext';

type TabType = 'chart' | 'data' | 'trends';

export default function OEEWidget() {
  const { openDrillDown } = useDrillDownSafe();
  const [activeTab, setActiveTab] = useState<TabType>('chart');

  const oeeBreakdown = {
    availability: 92,
    performance: 89,
    quality: 95,
  };

  const oeeValue = Math.round(
    (oeeBreakdown.availability / 100) *
    (oeeBreakdown.performance / 100) *
    (oeeBreakdown.quality / 100) * 1000
  ) / 10;

  const targetOEE = 80;
  const totalValue = 27450;
  const isAboveTarget = oeeValue >= targetOEE;

  // Machine-level OEE data
  const machineData = [
    { machine: 'CNC-01', oee: 85.2, availability: 94, performance: 92, quality: 98, status: 'Good' },
    { machine: 'CNC-02', oee: 78.5, availability: 88, performance: 91, quality: 98, status: 'Warning' },
    { machine: 'CNC-03', oee: 72.1, availability: 82, performance: 89, quality: 99, status: 'Critical' },
    { machine: 'Press-01', oee: 88.4, availability: 95, performance: 94, quality: 99, status: 'Good' },
    { machine: 'Press-02', oee: 81.2, availability: 90, performance: 92, quality: 98, status: 'Good' },
    { machine: 'Lathe-01', oee: 76.3, availability: 86, performance: 90, quality: 99, status: 'Warning' },
    { machine: 'Lathe-02', oee: 83.7, availability: 92, performance: 93, quality: 98, status: 'Good' },
    { machine: 'Assembly', oee: 79.8, availability: 89, performance: 91, quality: 99, status: 'Warning' },
  ];

  // Weekly OEE trend
  const weeklyTrend = [
    { day: 'Mon', oee: 76.5, availability: 90, performance: 87, quality: 98 },
    { day: 'Tue', oee: 79.2, availability: 91, performance: 89, quality: 98 },
    { day: 'Wed', oee: 77.8, availability: 89, performance: 89, quality: 98 },
    { day: 'Thu', oee: 81.3, availability: 93, performance: 90, quality: 97 },
    { day: 'Fri', oee: 80.1, availability: 92, performance: 89, quality: 98 },
    { day: 'Sat', oee: 78.9, availability: 91, performance: 88, quality: 99 },
    { day: 'Today', oee: oeeValue, availability: 92, performance: 89, quality: 95 },
  ];

  const breakdownItems = [
    { key: 'availability', label: 'Availability', value: oeeBreakdown.availability, color: '#3B82F6' },
    { key: 'performance', label: 'Performance', value: oeeBreakdown.performance, color: '#10B981' },
    { key: 'quality', label: 'Quality', value: oeeBreakdown.quality, color: '#8B5CF6' },
  ];

  const tabs = [
    { id: 'chart' as TabType, label: 'Chart', icon: BarChart3 },
    { id: 'data' as TabType, label: 'Data', icon: Table },
    { id: 'trends' as TabType, label: 'Trends', icon: TrendingUp },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good': return '#10B981';
      case 'Warning': return '#F59E0B';
      case 'Critical': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderChartView = () => (
    <>
      <div className="mb-3">
        <div className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-700 bg-clip-text text-transparent">
          {oeeValue}%
        </div>
        <div className="text-xs text-gray-500 mt-1">Overall Equipment Effectiveness</div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-gray-900">${(totalValue / 1000).toFixed(1)}K</span>
          <span className="text-xs text-gray-600">value today</span>
        </div>
      </div>

      {/* A x P x Q Visual Breakdown */}
      <div className="space-y-2 mb-3">
        {breakdownItems.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <span className="text-xs text-gray-600 w-20">{item.label}</span>
            <div className="flex-1 h-2 bg-gray-200/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: item.color }}
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
            <span className="text-xs font-semibold w-10 text-right" style={{ color: item.color }}>
              {item.value}%
            </span>
          </div>
        ))}
      </div>

      {/* Mini Machine Chart */}
      <div className="h-20 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={machineData.slice(0, 5)} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis dataKey="machine" tick={{ fontSize: 8 }} />
            <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
            <Bar dataKey="oee" radius={[2, 2, 0, 0]}>
              {machineData.slice(0, 5).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Target indicator */}
      <div className="flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
            isAboveTarget
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isAboveTarget ? 'bg-green-500' : 'bg-yellow-500'
            } animate-pulse`}
          />
          Target: {targetOEE}%+
        </motion.div>
      </div>
    </>
  );

  const renderDataView = () => (
    <div className="h-full">
      <div className="text-xs font-semibold text-gray-700 mb-2">Machine OEE Breakdown</div>
      <div className="overflow-auto max-h-56">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="text-left p-1.5 font-medium text-gray-600">Machine</th>
              <th className="text-right p-1.5 font-medium text-gray-600">OEE</th>
              <th className="text-right p-1.5 font-medium text-gray-600">A</th>
              <th className="text-right p-1.5 font-medium text-gray-600">P</th>
              <th className="text-right p-1.5 font-medium text-gray-600">Q</th>
              <th className="text-left p-1.5 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {machineData.map((row, index) => (
              <tr key={row.machine} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className="p-1.5 font-medium">{row.machine}</td>
                <td className="p-1.5 text-right font-bold" style={{ color: getStatusColor(row.status) }}>{row.oee}%</td>
                <td className="p-1.5 text-right text-blue-600">{row.availability}%</td>
                <td className="p-1.5 text-right text-green-600">{row.performance}%</td>
                <td className="p-1.5 text-right text-purple-600">{row.quality}%</td>
                <td className="p-1.5">
                  <span
                    className="px-1.5 py-0.5 rounded text-white text-xs"
                    style={{ backgroundColor: getStatusColor(row.status) }}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between text-xs text-gray-500">
        <span>Avg OEE: {oeeValue}%</span>
        <button className="text-yellow-600 hover:text-yellow-700 font-medium">Export CSV</button>
      </div>
    </div>
  );

  const renderTrendsView = () => (
    <div className="h-full">
      <div className="text-xs font-semibold text-gray-700 mb-2">7-Day OEE Trend</div>
      <div className="h-32 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyTrend}>
            <defs>
              <linearGradient id="oeeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#F59E0B" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} />
            <YAxis domain={[70, 90]} tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Area type="monotone" dataKey="oee" stroke="#F59E0B" strokeWidth={2} fill="url(#oeeGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="text-xs font-semibold text-gray-700 mb-2">A/P/Q Breakdown Trend</div>
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyTrend} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <XAxis dataKey="day" tick={{ fontSize: 9 }} />
            <YAxis domain={[80, 100]} tick={{ fontSize: 9 }} />
            <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
            <Bar dataKey="availability" fill="#3B82F6" radius={[2, 2, 0, 0]} name="Availability" />
            <Bar dataKey="performance" fill="#10B981" radius={[2, 2, 0, 0]} name="Performance" />
            <Bar dataKey="quality" fill="#8B5CF6" radius={[2, 2, 0, 0]} name="Quality" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2">
        <div className="text-center p-1 bg-blue-50 rounded">
          <div className="text-xs text-gray-500">Avg A</div>
          <div className="text-sm font-bold text-blue-600">90.9%</div>
        </div>
        <div className="text-center p-1 bg-green-50 rounded">
          <div className="text-xs text-gray-500">Avg P</div>
          <div className="text-sm font-bold text-green-600">88.7%</div>
        </div>
        <div className="text-center p-1 bg-purple-50 rounded">
          <div className="text-xs text-gray-500">Avg Q</div>
          <div className="text-sm font-bold text-purple-600">97.6%</div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="h-full bg-gray-100 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 relative overflow-hidden group"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 font-medium">OEE</span>
          <Activity className="w-4 h-4 text-yellow-600 opacity-50" />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-3 bg-gray-200/50 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab(tab.id);
                }}
                className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-yellow-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-3 h-3" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'chart' && renderChartView()}
              {activeTab === 'data' && renderDataView()}
              {activeTab === 'trends' && renderTrendsView()}
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={() => openDrillDown('oee')}
          className="mt-2 text-xs text-yellow-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
        >
          Click for details
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
