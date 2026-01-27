import { useState } from 'react';
import { Clock, AlertCircle, ChevronRight, BarChart3, Table, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell, AreaChart, Area } from 'recharts';
import { useDrillDownSafe } from '../context/DrillDownContext';

type TabType = 'chart' | 'data' | 'trends';

export default function UptimeWidget() {
  const { openDrillDown } = useDrillDownSafe();
  const [activeTab, setActiveTab] = useState<TabType>('chart');

  const uptimePercentage = 94.2;
  const productiveHours = 22.6;
  const totalHours = 24;
  const unplannedDowntime = 1.4;
  const machinesDown = ['CNC-03', 'Press-12'];

  // Downtime events for mini timeline
  const downtimeEvents = [
    { id: 'DT-001', start: '07:15', duration: 1.5, reason: 'Breakdown', machine: 'CNC-03', status: 'Resolved' },
    { id: 'DT-002', start: '10:00', duration: 1.5, reason: 'Maintenance', machine: 'Mill-02', status: 'Resolved' },
    { id: 'DT-003', start: '13:00', duration: 0.75, reason: 'Changeover', machine: 'Press-01', status: 'Resolved' },
    { id: 'DT-004', start: '15:30', duration: 0.75, reason: 'Material', machine: 'Lathe-02', status: 'Resolved' },
    { id: 'DT-005', start: '18:00', duration: 2, reason: 'Breakdown', machine: 'Mill-02', status: 'Active' },
  ];

  // Weekly uptime trend
  const weeklyTrend = [
    { day: 'Mon', uptime: 92.5, productive: 22.2, downtime: 1.8 },
    { day: 'Tue', uptime: 95.8, productive: 23.0, downtime: 1.0 },
    { day: 'Wed', uptime: 91.2, productive: 21.9, downtime: 2.1 },
    { day: 'Thu', uptime: 96.5, productive: 23.2, downtime: 0.8 },
    { day: 'Fri', uptime: 93.8, productive: 22.5, downtime: 1.5 },
    { day: 'Sat', uptime: 94.0, productive: 22.6, downtime: 1.4 },
    { day: 'Today', uptime: uptimePercentage, productive: productiveHours, downtime: unplannedDowntime },
  ];

  // Machine uptime data
  const machineUptime = [
    { machine: 'CNC-01', uptime: 98.2, downtime: 0.4, status: 'Good' },
    { machine: 'CNC-02', uptime: 95.5, downtime: 1.1, status: 'Good' },
    { machine: 'CNC-03', uptime: 85.2, downtime: 3.5, status: 'Critical' },
    { machine: 'Press-01', uptime: 97.8, downtime: 0.5, status: 'Good' },
    { machine: 'Press-02', uptime: 94.2, downtime: 1.4, status: 'Good' },
    { machine: 'Mill-02', uptime: 88.5, downtime: 2.8, status: 'Warning' },
    { machine: 'Lathe-02', uptime: 96.5, downtime: 0.8, status: 'Good' },
  ];

  const reasonColors: Record<string, string> = {
    Breakdown: '#EF4444',
    Maintenance: '#3B82F6',
    Changeover: '#8B5CF6',
    Material: '#F59E0B',
  };

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
        <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
          {uptimePercentage}%
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-lg font-semibold text-gray-900">{productiveHours} hrs</span>
          <span className="text-xs text-gray-600">productive</span>
        </div>
        <div className="text-xs text-gray-500">out of {totalHours} hrs</div>
      </div>

      {/* Machine Uptime Chart */}
      <div className="h-24 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={machineUptime.slice(0, 5)} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis dataKey="machine" tick={{ fontSize: 8 }} />
            <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
            <Bar dataKey="uptime" radius={[2, 2, 0, 0]}>
              {machineUptime.slice(0, 5).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Downtime alert */}
      {unplannedDowntime > 0 && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100/80 backdrop-blur-sm text-red-800 text-xs rounded-full mb-2 border border-red-200/50"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span className="font-medium">{unplannedDowntime} hrs unplanned downtime</span>
        </motion.div>
      )}

      {/* Visual uptime indicator */}
      <div className="mt-2">
        <div className="w-full h-2 bg-gray-200/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${uptimePercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </>
  );

  const renderDataView = () => (
    <div className="h-full">
      <div className="text-xs font-semibold text-gray-700 mb-2">Downtime Events (Today)</div>
      <div className="overflow-auto max-h-40">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="text-left p-1.5 font-medium text-gray-600">ID</th>
              <th className="text-left p-1.5 font-medium text-gray-600">Time</th>
              <th className="text-left p-1.5 font-medium text-gray-600">Machine</th>
              <th className="text-left p-1.5 font-medium text-gray-600">Reason</th>
              <th className="text-right p-1.5 font-medium text-gray-600">Hrs</th>
              <th className="text-left p-1.5 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {downtimeEvents.map((row, index) => (
              <tr key={row.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className="p-1.5 font-mono text-green-600">{row.id}</td>
                <td className="p-1.5 text-gray-500">{row.start}</td>
                <td className="p-1.5 font-medium">{row.machine}</td>
                <td className="p-1.5">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: reasonColors[row.reason] }} />
                    {row.reason}
                  </span>
                </td>
                <td className="p-1.5 text-right">{row.duration}</td>
                <td className="p-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-white text-xs ${row.status === 'Active' ? 'bg-red-500' : 'bg-green-500'}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Machines Down */}
      <div className="mt-3 pt-2 border-t border-gray-200">
        <div className="text-xs font-medium text-gray-700 mb-1">Currently Down:</div>
        <div className="flex flex-wrap gap-1">
          {machinesDown.map((machine, index) => (
            <span key={index} className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-md border border-red-200">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {machine}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTrendsView = () => (
    <div className="h-full">
      <div className="text-xs font-semibold text-gray-700 mb-2">7-Day Uptime Trend</div>
      <div className="h-28 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyTrend}>
            <defs>
              <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <XAxis dataKey="day" tick={{ fontSize: 9 }} />
            <YAxis domain={[85, 100]} tick={{ fontSize: 9 }} />
            <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
            <Area type="monotone" dataKey="uptime" stroke="#10B981" strokeWidth={2} fill="url(#uptimeGradient)" name="Uptime %" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="text-xs font-semibold text-gray-700 mb-2">Machine Uptime Comparison</div>
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={machineUptime} layout="vertical" margin={{ left: 50, right: 10 }}>
            <XAxis type="number" domain={[80, 100]} tick={{ fontSize: 9 }} />
            <YAxis type="category" dataKey="machine" tick={{ fontSize: 8 }} width={50} />
            <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
            <Bar dataKey="uptime" radius={[0, 4, 4, 0]}>
              {machineUptime.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="bg-green-50 rounded-lg p-2">
          <div className="text-xs text-gray-500">Avg Uptime (7d)</div>
          <div className="text-lg font-bold text-green-600">94.0%</div>
        </div>
        <div className="bg-red-50 rounded-lg p-2">
          <div className="text-xs text-gray-500">Total Downtime</div>
          <div className="text-lg font-bold text-red-600">10.0 hrs</div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="h-full bg-gray-100 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 relative overflow-hidden group"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 font-medium">Uptime</span>
          <Clock className="w-4 h-4 text-green-600 opacity-50" />
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
                    ? 'bg-white text-green-600 shadow-sm'
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
          onClick={() => openDrillDown('uptime')}
          className="mt-2 text-xs text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
        >
          Click for details
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
