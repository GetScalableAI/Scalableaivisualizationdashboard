import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Cloud, TrendingDown, Target } from 'lucide-react';

export default function GHGEmissionsWidget() {
  const emissionsData = [
    { month: 'Jan', scope1: 145, scope2: 230, scope3: 89 },
    { month: 'Feb', scope1: 138, scope2: 220, scope3: 85 },
    { month: 'Mar', scope1: 142, scope2: 225, scope3: 87 },
    { month: 'Apr', scope1: 135, scope2: 215, scope3: 82 },
    { month: 'May', scope1: 128, scope2: 205, scope3: 78 },
    { month: 'Jun', scope1: 122, scope2: 198, scope3: 75 },
  ];

  const totalEmissions = 395; // tons CO₂e
  const reductionTarget = 450;
  const percentageReduction = ((reductionTarget - totalEmissions) / reductionTarget * 100).toFixed(1);

  const scopeBreakdown = [
    { scope: 'Scope 1', value: 122, color: 'from-red-500 to-rose-600', percentage: 30.9 },
    { scope: 'Scope 2', value: 198, color: 'from-orange-500 to-amber-600', percentage: 50.1 },
    { scope: 'Scope 3', value: 75, color: 'from-yellow-500 to-amber-500', percentage: 19.0 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-rose-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-xs" style={{ color: entry.color }}>
                {entry.name}: {entry.value} tons
              </p>
            ))}
            <p className="text-xs font-bold text-gray-900 pt-1 border-t">Total: {total} tons CO₂e</p>
          </div>
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
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-rose-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-rose-600" />
              GHG Emissions
            </h3>
            <p className="text-sm text-gray-600 mt-1">Greenhouse gas tracking</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
              {totalEmissions}
            </div>
            <div className="text-xs text-gray-600">tons CO₂e</div>
          </div>
        </div>

        {/* Reduction indicator */}
        <div className="mb-4 p-3 bg-green-50/50 border border-green-200/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Reduction Progress</span>
            </div>
            <span className="text-sm font-bold text-green-600">{percentageReduction}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percentageReduction}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center justify-between mt-1 text-xs text-gray-600">
            <span>Current: {totalEmissions}t</span>
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              <span>Target: {reductionTarget}t</span>
            </div>
          </div>
        </div>

        {/* Emissions trend chart */}
        <div className="h-40 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={emissionsData}>
              <defs>
                <linearGradient id="scope1Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="scope2Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="scope3Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#6B7280', fontSize: 10 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 10 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="scope1"
                stackId="1"
                stroke="#EF4444"
                fill="url(#scope1Gradient)"
                name="Scope 1"
              />
              <Area
                type="monotone"
                dataKey="scope2"
                stackId="1"
                stroke="#F97316"
                fill="url(#scope2Gradient)"
                name="Scope 2"
              />
              <Area
                type="monotone"
                dataKey="scope3"
                stackId="1"
                stroke="#F59E0B"
                fill="url(#scope3Gradient)"
                name="Scope 3"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Scope breakdown */}
        <div className="space-y-2">
          {scopeBreakdown.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2 flex-1">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color}`} />
                <span className="text-gray-700 font-medium">{item.scope}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-600">{item.value} tons</span>
                <span className="font-bold text-gray-900 w-12 text-right">{item.percentage}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
