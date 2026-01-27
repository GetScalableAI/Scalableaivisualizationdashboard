import { useState } from 'react';
import { TrendingUp, ChevronRight, BarChart3, Table, TrendingDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, ReferenceLine, BarChart, Bar, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrillDownSafe } from '../context/DrillDownContext';

type TabType = 'chart' | 'data';

export default function ProductionWidget() {
  const { openDrillDown } = useDrillDownSafe();
  const [activeTab, setActiveTab] = useState<TabType>('chart');

  // Hourly production data (showing last 12 hours for sparkline)
  const hourlyData = [
    { hour: '06:00', actual: 115, target: 125, variance: -10, status: 'Below' },
    { hour: '07:00', actual: 128, target: 125, variance: 3, status: 'Above' },
    { hour: '08:00', actual: 132, target: 125, variance: 7, status: 'Above' },
    { hour: '09:00', actual: 118, target: 125, variance: -7, status: 'Below' },
    { hour: '10:00', actual: 125, target: 125, variance: 0, status: 'On Target' },
    { hour: '11:00', actual: 130, target: 125, variance: 5, status: 'Above' },
    { hour: '12:00', actual: 112, target: 125, variance: -13, status: 'Below' },
    { hour: '13:00', actual: 122, target: 125, variance: -3, status: 'Below' },
    { hour: '14:00', actual: 135, target: 125, variance: 10, status: 'Above' },
    { hour: '15:00', actual: 128, target: 125, variance: 3, status: 'Above' },
    { hour: '16:00', actual: 118, target: 125, variance: -7, status: 'Below' },
    { hour: '17:00', actual: 124, target: 125, variance: -1, status: 'Below' },
  ];

  const currentProduction = 2847;
  const target = 3000;
  const percentage = (currentProduction / target) * 100;
  const currentHourIndex = 11; // 17:00 is current

  // Calculate trend
  const recentAvg = hourlyData.slice(-3).reduce((a, b) => a + b.actual, 0) / 3;
  const earlierAvg = hourlyData.slice(-6, -3).reduce((a, b) => a + b.actual, 0) / 3;
  const trendUp = recentAvg >= earlierAvg;

  const tabs = [
    { id: 'chart' as TabType, label: 'Chart', icon: BarChart3 },
    { id: 'data' as TabType, label: 'Data', icon: Table },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Above': return '#10B981';
      case 'Below': return '#EF4444';
      case 'On Target': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const renderChartView = () => (
    <>
      <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
        {currentProduction.toLocaleString()}
      </div>
      <div className="text-sm text-gray-600 mb-3">units today</div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          <span>Target: {target.toLocaleString()}</span>
          <span className="font-semibold text-blue-600">{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-sm"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="flex items-center gap-1 text-sm text-green-600 mb-3">
        <TrendingUp className="w-4 h-4" />
        <span className="font-medium">5% vs yesterday</span>
      </div>

      {/* Enhanced Hourly Chart */}
      <div className="h-20 opacity-80 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hourlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} vertical={false} />
            <XAxis dataKey="hour" tick={{ fontSize: 8 }} interval={2} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 8 }}
              formatter={(value: number, name: string) => [value, name === 'actual' ? 'Actual' : 'Target']}
            />
            <ReferenceLine y={125} stroke="#9CA3AF" strokeDasharray="3 3" strokeWidth={1} />
            <Bar dataKey="actual" fill="#3B82F6" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Shift indicators */}
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Morning</span>
        <span>Afternoon</span>
        <span className="text-blue-600 font-medium">Now</span>
      </div>
    </>
  );

  const renderDataView = () => (
    <div className="h-full">
      <div className="text-xs font-semibold text-gray-700 mb-2">Hourly Production Log</div>
      <div className="overflow-auto max-h-52">
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
            {hourlyData.map((row, index) => (
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
        <span>Total: {currentProduction.toLocaleString()} units</span>
        <button className="text-blue-600 hover:text-blue-700 font-medium">Export CSV</button>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full bg-gray-100 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 relative overflow-hidden group"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 font-medium">Production vs Target</span>
          <div className="flex items-center gap-2">
            {trendUp ? (
              <TrendingUp className="w-4 h-4 text-green-600 opacity-50" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600 opacity-50" />
            )}
          </div>
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
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
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
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={() => openDrillDown('production')}
          className="mt-2 text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
        >
          Click for details
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
