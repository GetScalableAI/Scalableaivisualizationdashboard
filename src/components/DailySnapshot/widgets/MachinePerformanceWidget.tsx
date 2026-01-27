import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Cpu, Zap } from 'lucide-react';

export default function MachinePerformanceWidget() {
  const performanceData = [
    { metric: 'Speed', actual: 92, target: 100 },
    { metric: 'Quality', actual: 95, target: 100 },
    { metric: 'Availability', actual: 88, target: 90 },
  ];

  const overallPerformance = 91.7;
  const trend = '+2.3%';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-indigo-200">
          <p className="text-sm font-semibold text-gray-900">{payload[0].payload.metric}</p>
          <p className="text-xs text-indigo-600">Actual: {payload[0].value}%</p>
          <p className="text-xs text-gray-500">Target: {payload[1].value}%</p>
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
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              Machine Performance
            </h3>
            <p className="text-sm text-gray-600 mt-1">Real-time performance metrics</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              {overallPerformance}%
            </div>
            <div className="flex items-center justify-end gap-1 text-xs text-green-600 font-medium mt-1">
              <Zap className="w-3 h-3" />
              {trend} vs yesterday
            </div>
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData} layout="horizontal">
              <defs>
                <linearGradient id="actualBarGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#818CF8" stopOpacity={1}/>
                </linearGradient>
                <linearGradient id="targetBarGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#CBD5E1" stopOpacity={0.6}/>
                  <stop offset="100%" stopColor="#E2E8F0" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                dataKey="metric"
                type="category"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
              <Bar dataKey="actual" fill="url(#actualBarGradient)" radius={[0, 8, 8, 0]} />
              <Bar dataKey="target" fill="url(#targetBarGradient)" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance indicators */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {performanceData.map((item, index) => {
            const percentage = (item.actual / item.target) * 100;
            const isGood = percentage >= 95;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`p-2 rounded-lg border ${
                  isGood
                    ? 'bg-green-50/50 border-green-200/50'
                    : 'bg-yellow-50/50 border-yellow-200/50'
                }`}
              >
                <div className="text-xs text-gray-600 mb-1">{item.metric}</div>
                <div className={`text-sm font-bold ${isGood ? 'text-green-600' : 'text-yellow-600'}`}>
                  {item.actual}%
                </div>
                <div className="w-full h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      isGood ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
