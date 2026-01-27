import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ChevronRight, BarChart3, Table, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

type TabType = 'chart' | 'data' | 'trends';

export default function QualityMetricsWidget() {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<TabType>('chart');

  // Defect breakdown data
  const qualityData = [
    { name: 'Dimensional Issues', value: 45, percentage: 40.9, trend: '+5%', shift: 'Morning' },
    { name: 'Surface Defects', value: 28, percentage: 25.5, trend: '-12%', shift: 'Afternoon' },
    { name: 'Material Defects', value: 18, percentage: 16.4, trend: '+2%', shift: 'Morning' },
    { name: 'Assembly Errors', value: 12, percentage: 10.9, trend: '-8%', shift: 'Night' },
    { name: 'Other', value: 7, percentage: 6.3, trend: '0%', shift: 'All' },
  ];

  // First Pass Yield by shift
  const fpyByShift = [
    { shift: 'Morning', fpy: 89.5, target: 92, defects: 32 },
    { shift: 'Afternoon', fpy: 92.8, target: 92, defects: 22 },
    { shift: 'Night', fpy: 91.2, target: 92, defects: 28 },
  ];

  // Weekly trend data
  const weeklyTrend = [
    { day: 'Mon', fpy: 90.2, defects: 112, scrap: 2.1 },
    { day: 'Tue', fpy: 91.5, defects: 98, scrap: 1.8 },
    { day: 'Wed', fpy: 89.8, defects: 118, scrap: 2.3 },
    { day: 'Thu', fpy: 92.1, defects: 89, scrap: 1.6 },
    { day: 'Fri', fpy: 91.8, defects: 94, scrap: 1.7 },
    { day: 'Sat', fpy: 90.5, defects: 108, scrap: 2.0 },
    { day: 'Today', fpy: 91.2, defects: 110, scrap: 1.9 },
  ];

  // Detailed source data
  const sourceData = [
    { id: 'DEF-001', type: 'Dimensional', part: 'Housing A', machine: 'CNC-03', time: '08:42', severity: 'High' },
    { id: 'DEF-002', type: 'Surface', part: 'Cover B', machine: 'Press-01', time: '09:15', severity: 'Medium' },
    { id: 'DEF-003', type: 'Material', part: 'Shaft C', machine: 'Lathe-02', time: '10:23', severity: 'Low' },
    { id: 'DEF-004', type: 'Dimensional', part: 'Bracket D', machine: 'CNC-01', time: '11:08', severity: 'High' },
    { id: 'DEF-005', type: 'Assembly', part: 'Unit E', machine: 'Assembly-01', time: '13:45', severity: 'Medium' },
    { id: 'DEF-006', type: 'Surface', part: 'Panel F', machine: 'Press-02', time: '14:22', severity: 'Low' },
    { id: 'DEF-007', type: 'Dimensional', part: 'Housing G', machine: 'CNC-03', time: '15:10', severity: 'High' },
    { id: 'DEF-008', type: 'Material', part: 'Rod H', machine: 'Lathe-01', time: '16:05', severity: 'Medium' },
  ];

  const COLORS = ['#7C3AED', '#A855F7', '#C084FC', '#E9D5FF', '#F3E8FF'];
  const firstPassYield = 91.2;
  const totalDefects = 110;
  const scrapRate = 1.9;

  const tabs = [
    { id: 'chart' as TabType, label: 'Chart', icon: BarChart3 },
    { id: 'data' as TabType, label: 'Data', icon: Table },
    { id: 'trends' as TabType, label: 'Trends', icon: TrendingUp },
  ];

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-purple-200">
          <p className="text-sm font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">{payload[0].value} defects</p>
          <p className="text-xs text-purple-600 font-medium">{payload[0].payload.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const renderChartView = () => (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
          <div className="flex items-center gap-1 mb-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span className="text-xs text-gray-500">FPY</span>
          </div>
          <div className="text-lg font-bold text-green-600">{firstPassYield}%</div>
        </div>
        <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
          <div className="flex items-center gap-1 mb-1">
            <AlertTriangle className="w-3 h-3 text-red-500" />
            <span className="text-xs text-gray-500">Defects</span>
          </div>
          <div className="text-lg font-bold text-red-600">{totalDefects}</div>
        </div>
        <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
          <div className="flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3 text-amber-500" />
            <span className="text-xs text-gray-500">Scrap</span>
          </div>
          <div className="text-lg font-bold text-amber-600">{scrapRate}%</div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="h-40 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {COLORS.map((color, index) => (
                <linearGradient key={`gradient-${index}`} id={`qualityGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                  <stop offset="100%" stopColor={color} stopOpacity={1}/>
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={qualityData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={65}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              {qualityData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#qualityGradient${index})`}
                  className="cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* FPY by Shift */}
      <div className="mb-3">
        <div className="text-xs font-semibold text-gray-700 mb-2">First Pass Yield by Shift</div>
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fpyByShift} layout="vertical" margin={{ left: 50, right: 10 }}>
              <XAxis type="number" domain={[85, 95]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="shift" tick={{ fontSize: 10 }} width={50} />
              <Bar dataKey="fpy" fill="#8B5CF6" radius={[0, 4, 4, 0]}>
                {fpyByShift.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fpy >= entry.target ? '#10B981' : '#F59E0B'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Issues */}
      <div className="border-t border-gray-200/50 pt-2">
        <div className="text-xs font-semibold text-gray-700 mb-2">Top Issues Today:</div>
        <div className="space-y-1">
          {qualityData.slice(0, 3).map((issue, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 2 }}
              className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-gray-700">{issue.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{issue.value}</span>
                <span className={`text-xs ${issue.trend.startsWith('+') ? 'text-red-500' : issue.trend.startsWith('-') ? 'text-green-500' : 'text-gray-500'}`}>
                  {issue.trend}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );

  const renderDataView = () => (
    <div className="h-full">
      <div className="text-xs font-semibold text-gray-700 mb-2">Defect Log (Today)</div>
      <div className="overflow-auto max-h-80">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="text-left p-2 font-medium text-gray-600">ID</th>
              <th className="text-left p-2 font-medium text-gray-600">Type</th>
              <th className="text-left p-2 font-medium text-gray-600">Part</th>
              <th className="text-left p-2 font-medium text-gray-600">Machine</th>
              <th className="text-left p-2 font-medium text-gray-600">Time</th>
              <th className="text-left p-2 font-medium text-gray-600">Severity</th>
            </tr>
          </thead>
          <tbody>
            {sourceData.map((row, index) => (
              <tr key={row.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className="p-2 font-mono text-purple-600">{row.id}</td>
                <td className="p-2">{row.type}</td>
                <td className="p-2">{row.part}</td>
                <td className="p-2">{row.machine}</td>
                <td className="p-2 text-gray-500">{row.time}</td>
                <td className="p-2">
                  <span
                    className="px-2 py-0.5 rounded-full text-white text-xs"
                    style={{ backgroundColor: getSeverityColor(row.severity) }}
                  >
                    {row.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 pt-2 border-t border-gray-200 flex justify-between text-xs text-gray-500">
        <span>Showing {sourceData.length} of {totalDefects} records</span>
        <button className="text-purple-600 hover:text-purple-700 font-medium">Export CSV</button>
      </div>
    </div>
  );

  const renderTrendsView = () => (
    <div className="h-full">
      {/* Weekly FPY Trend */}
      <div className="mb-4">
        <div className="text-xs font-semibold text-gray-700 mb-2">First Pass Yield - 7 Day Trend</div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyTrend}>
              <defs>
                <linearGradient id="fpyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis domain={[88, 94]} tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
                formatter={(value: number) => [`${value}%`, 'FPY']}
              />
              <Area type="monotone" dataKey="fpy" stroke="#8B5CF6" strokeWidth={2} fill="url(#fpyGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Defects vs Scrap Trend */}
      <div className="mb-4">
        <div className="text-xs font-semibold text-gray-700 mb-2">Defects & Scrap Rate Trend</div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line yAxisId="left" type="monotone" dataKey="defects" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} name="Defects" />
              <Line yAxisId="right" type="monotone" dataKey="scrap" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} name="Scrap %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-2 border-t border-gray-200/50 pt-3">
        <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-500">Avg FPY (7d)</div>
          <div className="text-lg font-bold text-purple-600">90.9%</div>
          <div className="text-xs text-green-500">+0.3% vs last week</div>
        </div>
        <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-500">Total Defects (7d)</div>
          <div className="text-lg font-bold text-red-600">729</div>
          <div className="text-xs text-green-500">-8% vs last week</div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="h-full bg-gray-100 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            Quality Metrics
          </h3>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-3 bg-gray-200/50 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
        >
          <span>View detailed report</span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
