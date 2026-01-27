import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area, LineChart, Line } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Settings, AlertCircle, CheckCircle2, TrendingUp, TrendingDown, BarChart3, Table } from 'lucide-react';

interface ScheduleAnalysisWidgetProps {
  onOpenChat?: () => void;
}

type TabType = 'chart' | 'data' | 'trends';

export default function ScheduleAnalysisWidget({ onOpenChat }: ScheduleAnalysisWidgetProps) {
  const [selectedBar, setSelectedBar] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('chart');

  const scheduleData = [
    { name: 'Product Line A', value: 120, status: 'ahead' },
    { name: 'Product Line B', value: -85, status: 'behind' },
    { name: 'Product Line C', value: 45, status: 'ahead' },
    { name: 'Product Line D', value: -30, status: 'behind' },
    { name: 'Product Line E', value: 90, status: 'ahead' },
  ];

  // Pie chart data for summary
  const aheadCount = scheduleData.filter(d => d.status === 'ahead').length;
  const behindCount = scheduleData.filter(d => d.status === 'behind').length;
  const pieData = [
    { name: 'Ahead', value: aheadCount, color: '#10B981' },
    { name: 'Behind', value: behindCount, color: '#EF4444' },
  ];

  // Trend data for the mini chart
  const trendData = [
    { time: '6AM', value: -50 },
    { time: '8AM', value: -20 },
    { time: '10AM', value: 30 },
    { time: '12PM', value: 80 },
    { time: '2PM', value: 120 },
    { time: '4PM', value: 140 },
    { time: 'Now', value: 140 },
  ];

  const totalAhead = scheduleData.filter(d => d.value > 0).reduce((sum, d) => sum + d.value, 0);
  const totalBehind = Math.abs(scheduleData.filter(d => d.value < 0).reduce((sum, d) => sum + d.value, 0));
  const netPosition = totalAhead - totalBehind;

  // Detailed schedule data with more info
  const detailedScheduleData = [
    { id: 'PL-A', name: 'Product Line A', planned: 1200, actual: 1320, variance: 120, status: 'ahead', completion: 110 },
    { id: 'PL-B', name: 'Product Line B', planned: 950, actual: 865, variance: -85, status: 'behind', completion: 91 },
    { id: 'PL-C', name: 'Product Line C', planned: 800, actual: 845, variance: 45, status: 'ahead', completion: 106 },
    { id: 'PL-D', name: 'Product Line D', planned: 600, actual: 570, variance: -30, status: 'behind', completion: 95 },
    { id: 'PL-E', name: 'Product Line E', planned: 1100, actual: 1190, variance: 90, status: 'ahead', completion: 108 },
  ];

  // Weekly schedule performance trend
  const weeklyScheduleTrend = [
    { day: 'Mon', netPosition: -120, ahead: 180, behind: 300 },
    { day: 'Tue', netPosition: -80, ahead: 220, behind: 300 },
    { day: 'Wed', netPosition: 20, ahead: 280, behind: 260 },
    { day: 'Thu', netPosition: 85, ahead: 320, behind: 235 },
    { day: 'Fri', netPosition: 110, ahead: 350, behind: 240 },
    { day: 'Sat', netPosition: 125, ahead: 380, behind: 255 },
    { day: 'Today', netPosition: netPosition, ahead: totalAhead, behind: totalBehind },
  ];

  const tabs = [
    { id: 'chart' as TabType, label: 'Chart', icon: BarChart3 },
    { id: 'data' as TabType, label: 'Data', icon: Table },
    { id: 'trends' as TabType, label: 'Trends', icon: TrendingUp },
  ];

  const getStatusBadgeColor = (status: string) => {
    return status === 'ahead' ? 'bg-green-500' : 'bg-red-500';
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const isAhead = data.value > 0;
      return (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-xl border-2 border-purple-200"
        >
          <div className="flex items-center gap-2 mb-2">
            {isAhead ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <p className="text-sm font-semibold text-gray-900">{data.payload.name}</p>
          </div>
          <p className={`text-lg font-bold ${isAhead ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(data.value)} units {isAhead ? 'ahead' : 'behind'}
          </p>
        </motion.div>
      );
    }
    return null;
  };

  const renderChartView = () => (
    <>
      {/* Summary Cards with Mini Charts */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Net Position Card */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-500">Net Position</span>
            {netPosition >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className={`text-xl font-bold ${netPosition >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {netPosition >= 0 ? '+' : ''}{netPosition}
          </div>
          <div className="h-8 mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={netPosition >= 0 ? '#10B981' : '#EF4444'} stopOpacity={0.3}/>
                    <stop offset="100%" stopColor={netPosition >= 0 ? '#10B981' : '#EF4444'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={netPosition >= 0 ? '#10B981' : '#EF4444'}
                  strokeWidth={2}
                  fill="url(#trendGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ahead Card */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-500">Total Ahead</span>
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
          <div className="text-xl font-bold text-green-600">+{totalAhead}</div>
          <div className="text-xs text-gray-500 mt-1">{aheadCount} product lines</div>
        </div>

        {/* Behind Card */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-500">Total Behind</span>
            <div className="w-2 h-2 rounded-full bg-red-500" />
          </div>
          <div className="text-xl font-bold text-red-600">-{totalBehind}</div>
          <div className="text-xs text-gray-500 mt-1">{behindCount} product lines</div>
        </div>
      </div>

      {/* Main Chart and Pie Chart */}
      <div className="flex gap-4">
        {/* Bar Chart */}
        <div className="flex-1 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scheduleData} layout="vertical" margin={{ left: 70, right: 10 }}>
              <defs>
                <linearGradient id="aheadGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
                </linearGradient>
                <linearGradient id="behindGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#DC2626" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis
                type="number"
                tick={{ fill: '#6B7280', fontSize: 10 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={65}
                tick={{ fill: '#6B7280', fontSize: 10 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(147, 51, 234, 0.05)' }} />
              <Bar
                dataKey="value"
                radius={[0, 6, 6, 0]}
                onClick={(data) => setSelectedBar(data.name)}
              >
                {scheduleData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.status === 'ahead' ? 'url(#aheadGradient)' : 'url(#behindGradient)'}
                    opacity={selectedBar === null || selectedBar === entry.name ? 1 : 0.3}
                    className="cursor-pointer transition-opacity duration-300"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="w-28 h-48 flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height={100}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={40}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`pie-cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-1">
            <div className="text-xs font-semibold text-gray-700">
              {Math.round((aheadCount / scheduleData.length) * 100)}%
            </div>
            <div className="text-xs text-gray-500">On Track</div>
          </div>
        </div>
      </div>

      {selectedBar && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-purple-900">Selected: {selectedBar}</p>
            <button
              onClick={() => setSelectedBar(null)}
              className="text-xs text-purple-600 hover:text-purple-800 font-medium"
            >
              Clear
            </button>
          </div>
        </motion.div>
      )}
    </>
  );

  const renderDataView = () => (
    <div className="h-full">
      <div className="text-xs font-semibold text-gray-700 mb-2">Schedule Performance by Product Line</div>
      <div className="overflow-auto max-h-56">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="text-left p-1.5 font-medium text-gray-600">ID</th>
              <th className="text-left p-1.5 font-medium text-gray-600">Product Line</th>
              <th className="text-right p-1.5 font-medium text-gray-600">Planned</th>
              <th className="text-right p-1.5 font-medium text-gray-600">Actual</th>
              <th className="text-right p-1.5 font-medium text-gray-600">Variance</th>
              <th className="text-right p-1.5 font-medium text-gray-600">%</th>
              <th className="text-left p-1.5 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {detailedScheduleData.map((row, index) => (
              <tr key={row.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className="p-1.5 font-mono text-purple-600">{row.id}</td>
                <td className="p-1.5 font-medium">{row.name}</td>
                <td className="p-1.5 text-right text-gray-500">{row.planned.toLocaleString()}</td>
                <td className="p-1.5 text-right font-semibold">{row.actual.toLocaleString()}</td>
                <td className={`p-1.5 text-right font-medium ${row.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {row.variance >= 0 ? '+' : ''}{row.variance}
                </td>
                <td className="p-1.5 text-right">
                  <span className={`px-1.5 py-0.5 rounded text-white text-xs ${row.completion >= 100 ? 'bg-green-500' : row.completion >= 95 ? 'bg-amber-500' : 'bg-red-500'}`}>
                    {row.completion}%
                  </span>
                </td>
                <td className="p-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-white text-xs ${getStatusBadgeColor(row.status)}`}>
                    {row.status === 'ahead' ? 'Ahead' : 'Behind'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between text-xs text-gray-500">
        <span>Net Position: {netPosition >= 0 ? '+' : ''}{netPosition} units | {aheadCount} ahead, {behindCount} behind</span>
        <button className="text-purple-600 hover:text-purple-700 font-medium">Export CSV</button>
      </div>
    </div>
  );

  const renderTrendsView = () => (
    <div className="h-full">
      <div className="text-xs font-semibold text-gray-700 mb-2">7-Day Net Position Trend</div>
      <div className="h-32 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyScheduleTrend}>
            <defs>
              <linearGradient id="netPosGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
            <Area type="monotone" dataKey="netPosition" stroke="#8B5CF6" strokeWidth={2} fill="url(#netPosGradient)" name="Net Position" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="text-xs font-semibold text-gray-700 mb-2">Ahead vs Behind Trend</div>
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyScheduleTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
            <Bar dataKey="ahead" fill="#10B981" radius={[2, 2, 0, 0]} name="Ahead" />
            <Bar dataKey="behind" fill="#EF4444" radius={[2, 2, 0, 0]} name="Behind" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="text-center p-2 bg-purple-50 rounded-lg">
          <div className="text-xs text-gray-500">Avg Net</div>
          <div className="text-lg font-bold text-purple-600">+{Math.round(weeklyScheduleTrend.reduce((a, b) => a + b.netPosition, 0) / 7)}</div>
        </div>
        <div className="text-center p-2 bg-green-50 rounded-lg">
          <div className="text-xs text-gray-500">Best Day</div>
          <div className="text-lg font-bold text-green-600">+{Math.max(...weeklyScheduleTrend.map(d => d.netPosition))}</div>
        </div>
        <div className="text-center p-2 bg-red-50 rounded-lg">
          <div className="text-xs text-gray-500">Worst Day</div>
          <div className="text-lg font-bold text-red-600">{Math.min(...weeklyScheduleTrend.map(d => d.netPosition))}</div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="h-full bg-gray-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-500/5 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Behind/Ahead Analysis
            </h3>
            <p className="text-sm text-gray-600 mt-1">Units ahead or behind schedule</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-gray-100/80 backdrop-blur-sm hover:bg-gray-200/80 transition-colors border border-gray-200/50"
          >
            <Settings className="w-4 h-4 text-gray-600" />
          </motion.button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-4 bg-gray-200/50 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab(tab.id);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
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

        {onOpenChat && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenChat}
            className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
          >
            <span>Ask AI: Why is Product Line B behind?</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
