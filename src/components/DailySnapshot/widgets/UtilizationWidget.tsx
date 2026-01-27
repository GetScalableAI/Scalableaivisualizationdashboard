import { motion } from 'framer-motion';
import { Gauge, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export default function UtilizationWidget() {
  const utilizationRate = 87.5;
  const targetUtilization = 85;
  const isAboveTarget = utilizationRate >= targetUtilization;

  const trendData = [
    { value: 82 },
    { value: 84 },
    { value: 83 },
    { value: 86 },
    { value: 85 },
    { value: 88 },
    { value: 87.5 },
  ];

  const avgIdleTime = 2.1;
  const avgRunTime = 21.9;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full bg-gray-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 backdrop-blur-sm relative overflow-hidden group"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 font-medium">Utilization Rate</span>
          <Gauge className="w-5 h-5 text-orange-600 opacity-50" />
        </div>

        <div className="mb-3">
          <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-700 bg-clip-text text-transparent">
            {utilizationRate}%
          </div>
        </div>

        {/* Circular progress indicator */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#FED7AA"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke="url(#utilizationGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 352" }}
              animate={{ strokeDasharray: `${(utilizationRate / 100) * 352} 352` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="utilizationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#FB923C" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm text-gray-600">Target</div>
              <div className="text-lg font-bold text-orange-600">{targetUtilization}%</div>
            </div>
          </div>
        </div>

        {/* Trend sparkline */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-600">7-day trend</span>
            <TrendingUp className="w-3 h-3 text-green-600" />
          </div>
          <div className="h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <YAxis domain={[75, 95]} hide />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#F97316"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time breakdown */}
        <div className="bg-gray-50/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-gray-600 mb-1">Avg Run Time</div>
              <div className="text-lg font-bold text-green-600">{avgRunTime}h</div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">Avg Idle Time</div>
              <div className="text-lg font-bold text-orange-600">{avgIdleTime}h</div>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        {isAboveTarget && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 flex items-center gap-2 px-3 py-2 bg-green-50/80 backdrop-blur-sm text-green-800 text-xs rounded-lg border border-green-200/50"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-medium">Above target utilization</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
