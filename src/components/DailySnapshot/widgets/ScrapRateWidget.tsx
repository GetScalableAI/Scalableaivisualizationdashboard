import { useState } from 'react';
import { TrendingDown, AlertTriangle, ChevronRight, BarChart3, Table, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell, AreaChart, Area, LineChart, Line } from 'recharts';
import { useDrillDownSafe } from '../context/DrillDownContext';

type TabType = 'chart' | 'data' | 'trends';

export default function ScrapRateWidget() {
  const { openDrillDown } = useDrillDownSafe();
  const [activeTab, setActiveTab] = useState<TabType>('chart');

  const scrapRate = 2.1;
  const scrapValue = 4230;
  const targetRate = 2.5;
  const isBelowTarget = scrapRate < targetRate;

  // Defect breakdown data
  const defectBreakdown = [
    { name: 'Dimensional', count: 45, color: '#EF4444', percentage: 35, cost: 1480 },
    { name: 'Surface', count: 32, color: '#F59E0B', percentage: 25, cost: 1058 },
    { name: 'Material', count: 25, color: '#8B5CF6', percentage: 19, cost: 804 },
    { name: 'Assembly', count: 15, color: '#3B82F6', percentage: 12, cost: 508 },
    { name: 'Other', count: 12, color: '#6B7280', percentage: 9, cost: 380 },
  ];

  // Detailed scrap data
  const scrapData = [
    { id: 'SCR-001', type: 'Dimensional', part: 'Housing A', quantity: 8, cost: 264, time: '08:15' },
    { id: 'SCR-002', type: 'Surface', part: 'Cover B', quantity: 5, cost: 165, time: '09:30' },
    { id: 'SCR-003', type: 'Material', part: 'Shaft C', quantity: 4, cost: 128, time: '10:45' },
    { id: 'SCR-004', type: 'Dimensional', part: 'Bracket D', quantity: 6, cost: 198, time: '11:20' },
    { id: 'SCR-005', type: 'Assembly', part: 'Unit E', quantity: 3, cost: 102, time: '13:00' },
    { id: 'SCR-006', type: 'Surface', part: 'Panel F', quantity: 7, cost: 231, time: '14:15' },
    { id: 'SCR-007', type: 'Other', part: 'Component G', quantity: 2, cost: 68, time: '15:30' },
  ];

  // Weekly trend data
  const weeklyTrend = [
    { day: 'Mon', rate: 2.4, cost: 4800, units: 145 },
    { day: 'Tue', rate: 2.2, cost: 4400, units: 132 },
    { day: 'Wed', rate: 2.5, cost: 5000, units: 150 },
    { day: 'Thu', rate: 1.9, cost: 3800, units: 114 },
    { day: 'Fri', rate: 2.0, cost: 4000, units: 120 },
    { day: 'Sat', rate: 2.3, cost: 4600, units: 138 },
    { day: 'Today', rate: scrapRate, cost: scrapValue, units: 129 },
  ];

  const totalDefects = defectBreakdown.reduce((sum, d) => sum + d.count, 0);

  const tabs = [
    { id: 'chart' as TabType, label: 'Chart', icon: BarChart3 },
    { id: 'data' as TabType, label: 'Data', icon: Table },
    { id: 'trends' as TabType, label: 'Trends', icon: TrendingUp },
  ];

  const renderChartView = () => (
    <>
      <div className="mb-3">
        <div className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent">
          {scrapRate}%
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-red-600">
            -${scrapValue.toLocaleString()}
          </span>
          <span className="text-xs text-gray-600">in scrap today</span>
        </div>
      </div>

      {/* Defect Type Breakdown - Bar Chart */}
      <div className="h-24 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={defectBreakdown} layout="vertical" margin={{ left: 60, right: 10 }}>
            <XAxis type="number" tick={{ fontSize: 9 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={60} />
            <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {defectBreakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Trend indicator */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center gap-1.5 text-sm text-green-600 mb-2 bg-green-50/50 backdrop-blur-sm rounded-lg px-2 py-1 border border-green-200/50"
      >
        <TrendingDown className="w-4 h-4" />
        <span className="font-medium">0.3% vs last week</span>
      </motion.div>

      {/* Target indicator */}
      <div className="bg-gray-50/50 backdrop-blur-sm rounded-lg p-2 border border-gray-200/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Target:</span>
          <div className="flex items-center gap-1">
            <span className={`font-semibold ${isBelowTarget ? 'text-green-600' : 'text-red-600'}`}>
              &lt;{targetRate}%
            </span>
            {isBelowTarget && (
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            )}
          </div>
        </div>
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2">
          <motion.div
            className={`h-full rounded-full ${
              isBelowTarget ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-red-400 to-red-600'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((scrapRate / targetRate) * 100, 100)}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>
    </>
  );

  const renderDataView = () => (
    <div className="h-full">
      <div className="text-xs font-semibold text-gray-700 mb-2">Scrap Log (Today)</div>
      <div className="overflow-auto max-h-48">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="text-left p-1.5 font-medium text-gray-600">ID</th>
              <th className="text-left p-1.5 font-medium text-gray-600">Type</th>
              <th className="text-left p-1.5 font-medium text-gray-600">Part</th>
              <th className="text-right p-1.5 font-medium text-gray-600">Qty</th>
              <th className="text-right p-1.5 font-medium text-gray-600">Cost</th>
              <th className="text-left p-1.5 font-medium text-gray-600">Time</th>
            </tr>
          </thead>
          <tbody>
            {scrapData.map((row, index) => (
              <tr key={row.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className="p-1.5 font-mono text-red-600">{row.id}</td>
                <td className="p-1.5">{row.type}</td>
                <td className="p-1.5">{row.part}</td>
                <td className="p-1.5 text-right font-medium">{row.quantity}</td>
                <td className="p-1.5 text-right text-red-600">${row.cost}</td>
                <td className="p-1.5 text-gray-500">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between text-xs text-gray-500">
        <span>Total: {totalDefects} defects | ${scrapValue.toLocaleString()}</span>
        <button className="text-red-600 hover:text-red-700 font-medium">Export CSV</button>
      </div>
    </div>
  );

  const renderTrendsView = () => (
    <div className="h-full">
      <div className="text-xs font-semibold text-gray-700 mb-2">7-Day Scrap Rate Trend</div>
      <div className="h-28 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyTrend}>
            <defs>
              <linearGradient id="scrapGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <XAxis dataKey="day" tick={{ fontSize: 9 }} />
            <YAxis domain={[1.5, 3]} tick={{ fontSize: 9 }} />
            <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
            <Area type="monotone" dataKey="rate" stroke="#EF4444" strokeWidth={2} fill="url(#scrapGradient)" name="Rate %" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="text-xs font-semibold text-gray-700 mb-2">Cost & Units Trend</div>
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <XAxis dataKey="day" tick={{ fontSize: 9 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 9 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9 }} />
            <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
            <Line yAxisId="left" type="monotone" dataKey="cost" stroke="#EF4444" strokeWidth={2} dot={{ r: 2 }} name="Cost ($)" />
            <Line yAxisId="right" type="monotone" dataKey="units" stroke="#F59E0B" strokeWidth={2} dot={{ r: 2 }} name="Units" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="bg-red-50 rounded-lg p-2">
          <div className="text-xs text-gray-500">Avg Rate (7d)</div>
          <div className="text-lg font-bold text-red-600">2.2%</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-2">
          <div className="text-xs text-gray-500">Total Cost (7d)</div>
          <div className="text-lg font-bold text-amber-600">$30.8K</div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="h-full bg-gray-100 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 relative overflow-hidden group"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 font-medium">Scrap Rate</span>
          <AlertTriangle className="w-4 h-4 text-red-500 opacity-50" />
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
                    ? 'bg-white text-red-600 shadow-sm'
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
          onClick={() => openDrillDown('scrap')}
          className="mt-2 text-xs text-red-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
        >
          Click for details
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
