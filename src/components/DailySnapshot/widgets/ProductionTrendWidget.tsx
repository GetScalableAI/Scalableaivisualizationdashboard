import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, Cell, LineChart, Line } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Settings, Target, Zap, Clock, BarChart3, Table } from 'lucide-react';

interface ProductionTrendWidgetProps {
  onOpenChat?: () => void;
}

type TabType = 'chart' | 'data' | 'trends';

export default function ProductionTrendWidget({ onOpenChat }: ProductionTrendWidgetProps) {
  const [activeTab, setActiveTab] = useState<TabType>('chart');

  const productionData = [
    { day: 'Mon', actual: 2650, target: 3000, efficiency: 88 },
    { day: 'Tue', actual: 2800, target: 3000, efficiency: 93 },
    { day: 'Wed', actual: 2720, target: 3000, efficiency: 91 },
    { day: 'Thu', actual: 2890, target: 3000, efficiency: 96 },
    { day: 'Fri', actual: 2710, target: 3000, efficiency: 90 },
    { day: 'Sat', actual: 2820, target: 3000, efficiency: 94 },
    { day: 'Today', actual: 2847, target: 3000, efficiency: 95 },
  ];

  // Calculate stats
  const totalActual = productionData.reduce((sum, d) => sum + d.actual, 0);
  const totalTarget = productionData.reduce((sum, d) => sum + d.target, 0);
  const avgEfficiency = Math.round(productionData.reduce((sum, d) => sum + d.efficiency, 0) / productionData.length);
  const percentOfTarget = Math.round((totalActual / totalTarget) * 100);
  const trend = productionData[productionData.length - 1].actual - productionData[0].actual;

  // Mini sparkline data for efficiency card
  const efficiencySparkline = productionData.map((d, i) => ({ x: i, y: d.efficiency }));

  // Detailed hourly data for today
  const hourlyTodayData = [
    { hour: '06:00', actual: 380, target: 430, variance: -50, status: 'Below' },
    { hour: '08:00', actual: 420, target: 430, variance: -10, status: 'Below' },
    { hour: '10:00', actual: 445, target: 430, variance: 15, status: 'Above' },
    { hour: '12:00', actual: 410, target: 430, variance: -20, status: 'Below' },
    { hour: '14:00', actual: 460, target: 430, variance: 30, status: 'Above' },
    { hour: '16:00', actual: 452, target: 430, variance: 22, status: 'Above' },
    { hour: '18:00', actual: 280, target: 430, variance: -150, status: 'In Progress' },
  ];

  const tabs = [
    { id: 'chart' as TabType, label: 'Chart', icon: BarChart3 },
    { id: 'data' as TabType, label: 'Data', icon: Table },
    { id: 'trends' as TabType, label: 'Trends', icon: TrendingUp },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Above': return '#10B981';
      case 'Below': return '#EF4444';
      case 'In Progress': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-semibold" style={{ color: entry.color }}>
                {entry.value.toLocaleString()} units
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChartView = () => (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {/* Total Production */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="flex items-center gap-1 mb-1">
            <Zap className="w-3 h-3 text-cyan-500" />
            <span className="text-xs font-medium text-gray-500">Total</span>
          </div>
          <div className="text-lg font-bold text-gray-900">{(totalActual / 1000).toFixed(1)}K</div>
          <div className="text-xs text-gray-500">units</div>
        </div>

        {/* Target Progress */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="flex items-center gap-1 mb-1">
            <Target className="w-3 h-3 text-purple-500" />
            <span className="text-xs font-medium text-gray-500">vs Target</span>
          </div>
          <div className={`text-lg font-bold ${percentOfTarget >= 90 ? 'text-green-600' : 'text-amber-600'}`}>
            {percentOfTarget}%
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
            <div
              className={`h-full rounded-full ${percentOfTarget >= 90 ? 'bg-green-500' : 'bg-amber-500'}`}
              style={{ width: `${Math.min(percentOfTarget, 100)}%` }}
            />
          </div>
        </div>

        {/* Efficiency */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3 text-blue-500" />
            <span className="text-xs font-medium text-gray-500">Efficiency</span>
          </div>
          <div className="text-lg font-bold text-blue-600">{avgEfficiency}%</div>
          <div className="h-6 mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={efficiencySparkline}>
                <Area
                  type="monotone"
                  dataKey="y"
                  stroke="#3B82F6"
                  strokeWidth={1.5}
                  fill="#3B82F6"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="flex items-center gap-1 mb-1">
            {trend >= 0 ? (
              <TrendingUp className="w-3 h-3 text-green-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-500" />
            )}
            <span className="text-xs font-medium text-gray-500">Trend</span>
          </div>
          <div className={`text-lg font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend}
          </div>
          <div className="text-xs text-gray-500">vs Monday</div>
        </div>
      </div>

      {/* Main Bar Chart */}
      <div className="h-48 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={productionData}
            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
            barCategoryGap="20%"
          >
            <defs>
              <linearGradient id="actualBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity={1}/>
                <stop offset="100%" stopColor="#0891B2" stopOpacity={0.8}/>
              </linearGradient>
              <linearGradient id="targetBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#CBD5E1" stopOpacity={1}/>
                <stop offset="100%" stopColor="#94A3B8" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
              domain={[0, 3500]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(6, 182, 212, 0.1)' }} />
            <Legend
              wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
              iconType="circle"
              iconSize={8}
            />
            <Bar
              dataKey="actual"
              name="Actual"
              fill="url(#actualBarGradient)"
              radius={[4, 4, 0, 0]}
              animationBegin={0}
              animationDuration={1000}
            />
            <Bar
              dataKey="target"
              name="Target"
              fill="url(#targetBarGradient)"
              radius={[4, 4, 0, 0]}
              animationBegin={200}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );

  const renderDataView = () => (
    <div className="h-full">
      <div className="text-xs font-semibold text-gray-700 mb-2">Weekly Production Data</div>
      <div className="overflow-auto max-h-40 mb-4">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="text-left p-1.5 font-medium text-gray-600">Day</th>
              <th className="text-right p-1.5 font-medium text-gray-600">Actual</th>
              <th className="text-right p-1.5 font-medium text-gray-600">Target</th>
              <th className="text-right p-1.5 font-medium text-gray-600">Variance</th>
              <th className="text-right p-1.5 font-medium text-gray-600">Efficiency</th>
            </tr>
          </thead>
          <tbody>
            {productionData.map((row, index) => {
              const variance = row.actual - row.target;
              return (
                <tr key={row.day} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="p-1.5 font-medium">{row.day}</td>
                  <td className="p-1.5 text-right font-semibold">{row.actual.toLocaleString()}</td>
                  <td className="p-1.5 text-right text-gray-500">{row.target.toLocaleString()}</td>
                  <td className={`p-1.5 text-right font-medium ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {variance >= 0 ? '+' : ''}{variance}
                  </td>
                  <td className="p-1.5 text-right">
                    <span className={`px-1.5 py-0.5 rounded text-white text-xs ${row.efficiency >= 95 ? 'bg-green-500' : row.efficiency >= 90 ? 'bg-cyan-500' : 'bg-amber-500'}`}>
                      {row.efficiency}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-xs font-semibold text-gray-700 mb-2">Today's Hourly Breakdown</div>
      <div className="overflow-auto max-h-32">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="text-left p-1.5 font-medium text-gray-600">Hour</th>
              <th className="text-right p-1.5 font-medium text-gray-600">Actual</th>
              <th className="text-right p-1.5 font-medium text-gray-600">Target</th>
              <th className="text-right p-1.5 font-medium text-gray-600">Variance</th>
              <th className="text-left p-1.5 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {hourlyTodayData.map((row, index) => (
              <tr key={row.hour} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className="p-1.5 font-mono">{row.hour}</td>
                <td className="p-1.5 text-right font-semibold">{row.actual}</td>
                <td className="p-1.5 text-right text-gray-500">{row.target}</td>
                <td className={`p-1.5 text-right font-medium ${row.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {row.variance >= 0 ? '+' : ''}{row.variance}
                </td>
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
        <span>Total: {totalActual.toLocaleString()} units | Target: {totalTarget.toLocaleString()}</span>
        <button className="text-cyan-600 hover:text-cyan-700 font-medium">Export CSV</button>
      </div>
    </div>
  );

  const renderTrendsView = () => (
    <div className="h-full">
      <div className="text-xs font-semibold text-gray-700 mb-2">7-Day Production Trend</div>
      <div className="h-32 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={productionData}>
            <defs>
              <linearGradient id="prodTrendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#06B6D4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} />
            <YAxis domain={[2400, 3200]} tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
            <Area type="monotone" dataKey="actual" stroke="#06B6D4" strokeWidth={2} fill="url(#prodTrendGradient)" name="Actual" />
            <Area type="monotone" dataKey="target" stroke="#9CA3AF" strokeWidth={1} strokeDasharray="5 5" fill="none" name="Target" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="text-xs font-semibold text-gray-700 mb-2">Efficiency Trend</div>
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={productionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} />
            <YAxis domain={[80, 100]} tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
            <Line type="monotone" dataKey="efficiency" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} name="Efficiency %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="text-center p-2 bg-cyan-50 rounded-lg">
          <div className="text-xs text-gray-500">Avg Output</div>
          <div className="text-lg font-bold text-cyan-600">{Math.round(totalActual / 7).toLocaleString()}</div>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <div className="text-xs text-gray-500">Avg Efficiency</div>
          <div className="text-lg font-bold text-blue-600">{avgEfficiency}%</div>
        </div>
        <div className="text-center p-2 bg-purple-50 rounded-lg">
          <div className="text-xs text-gray-500">vs Target</div>
          <div className="text-lg font-bold text-purple-600">{percentOfTarget}%</div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="h-full bg-gray-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-600" />
              Production Trend
            </h3>
            <p className="text-sm text-gray-600 mt-1">Actual vs target over the last 7 days</p>
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
                    ? 'bg-white text-cyan-600 shadow-sm'
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
            className="mt-3 text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
          >
            <span>Ask AI about production trends</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
