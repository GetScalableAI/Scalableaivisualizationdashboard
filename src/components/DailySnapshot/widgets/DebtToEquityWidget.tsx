import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { PiggyBank, TrendingDown, AlertTriangle } from 'lucide-react';

export default function DebtToEquityWidget() {
  const currentRatio = 0.68;
  const industryAverage = 0.75;
  const targetRatio = 0.60;

  const trendData = [
    { quarter: 'Q1 2025', ratio: 0.82 },
    { quarter: 'Q2 2025', ratio: 0.79 },
    { quarter: 'Q3 2025', ratio: 0.74 },
    { quarter: 'Q4 2025', ratio: 0.71 },
    { quarter: 'Q1 2026', ratio: 0.68 },
  ];

  const financialMetrics = [
    { label: 'Total Debt', value: '$8.5M', change: '-5.2%', isPositive: true },
    { label: 'Total Equity', value: '$12.5M', change: '+3.1%', isPositive: true },
    { label: 'Interest Coverage', value: '4.2x', change: '+0.3x', isPositive: true },
  ];

  const getRatingColor = (ratio: number) => {
    if (ratio < 0.5) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', rating: 'Excellent' };
    if (ratio < 0.75) return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', rating: 'Good' };
    if (ratio < 1.0) return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600', rating: 'Fair' };
    return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', rating: 'Poor' };
  };

  const rating = getRatingColor(currentRatio);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const ratio = payload[0].value;
      const tooltipRating = getRatingColor(ratio);
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-pink-200">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className="text-lg font-bold text-pink-600">{ratio.toFixed(2)}</p>
          <p className={`text-xs font-medium ${tooltipRating.text}`}>{tooltipRating.rating}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full bg-gray-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-pink-600" />
              Debt-to-Equity Ratio
            </h3>
            <p className="text-sm text-gray-600 mt-1">Financial leverage indicator</p>
          </div>
        </div>

        {/* Current ratio display */}
        <div className="mb-4">
          <div className="flex items-end gap-2 mb-2">
            <div className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              {currentRatio.toFixed(2)}
            </div>
            <div className="mb-2 flex items-center gap-1 text-green-600">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm font-medium">Improving</span>
            </div>
          </div>

          <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${rating.bg} border ${rating.border} rounded-full`}>
            <div className={`w-2 h-2 rounded-full ${rating.text.replace('text-', 'bg-')} animate-pulse`} />
            <span className={`text-sm font-medium ${rating.text}`}>{rating.rating} Financial Health</span>
          </div>
        </div>

        {/* Comparison bars */}
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="text-gray-600">Current</span>
              <span className="font-bold text-gray-900">{currentRatio.toFixed(2)}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentRatio / 1.5) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="text-gray-600">Industry Avg</span>
              <span className="font-bold text-gray-900">{industryAverage.toFixed(2)}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(industryAverage / 1.5) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="text-gray-600">Target</span>
              <span className="font-bold text-green-600">{targetRatio.toFixed(2)}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(targetRatio / 1.5) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              />
            </div>
          </div>
        </div>

        {/* Trend chart */}
        <div className="h-32 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis
                dataKey="quarter"
                tick={{ fill: '#6B7280', fontSize: 9 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                domain={[0.5, 0.9]}
                tick={{ fill: '#6B7280', fontSize: 10 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={industryAverage}
                stroke="#9CA3AF"
                strokeDasharray="3 3"
                label={{ value: 'Industry Avg', fontSize: 9, fill: '#6B7280' }}
              />
              <Line
                type="monotone"
                dataKey="ratio"
                stroke="#EC4899"
                strokeWidth={2}
                dot={{ fill: '#EC4899', r: 4 }}
                activeDot={{ r: 6, fill: '#DB2777', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Financial metrics */}
        <div className="grid grid-cols-3 gap-2">
          {financialMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-2 bg-gray-50/50 border border-gray-200/50 rounded-lg"
            >
              <div className="text-xs text-gray-600 mb-1">{metric.label}</div>
              <div className="text-sm font-bold text-gray-900">{metric.value}</div>
              <div className={`text-xs font-medium ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
