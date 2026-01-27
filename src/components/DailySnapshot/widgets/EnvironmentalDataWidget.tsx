import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Leaf, Droplets, Wind, Zap } from 'lucide-react';

export default function EnvironmentalDataWidget() {
  const energyData = [
    { hour: '00:00', energy: 245, water: 120, emissions: 18 },
    { hour: '04:00', energy: 198, water: 95, emissions: 15 },
    { hour: '08:00', energy: 312, water: 145, emissions: 23 },
    { hour: '12:00', energy: 385, water: 178, emissions: 29 },
    { hour: '16:00', energy: 420, water: 195, emissions: 32 },
    { hour: '20:00', energy: 365, water: 162, emissions: 28 },
    { hour: 'Now', energy: 298, water: 138, emissions: 22 },
  ];

  const metrics = [
    { label: 'Energy Used', value: '2,223 kWh', icon: Zap, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50' },
    { label: 'Water Used', value: '1,033 gal', icon: Droplets, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' },
    { label: 'Carbon Footprint', value: '167 kg CO₂', icon: Wind, color: 'from-gray-500 to-slate-600', bg: 'bg-gray-50' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-emerald-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-xs text-yellow-600">Energy: {payload[0].value} kWh</p>
            <p className="text-xs text-blue-600">Water: {payload[1].value} gal</p>
            <p className="text-xs text-gray-600">CO₂: {payload[2].value} kg</p>
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
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-600" />
              Environmental Data
            </h3>
            <p className="text-sm text-gray-600 mt-1">Real-time resource consumption</p>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`${metric.bg} border border-gray-200/50 rounded-lg p-2`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <Icon className="w-3 h-3 text-gray-600" />
                  <span className="text-xs text-gray-600">{metric.label}</span>
                </div>
                <div className={`text-base font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                  {metric.value}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={energyData}>
              <defs>
                <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="emissionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6B7280" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6B7280" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis
                dataKey="hour"
                tick={{ fill: '#6B7280', fontSize: 10 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 10 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '10px' }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="energy"
                stroke="#F59E0B"
                strokeWidth={2}
                name="Energy (kWh)"
                dot={{ fill: '#F59E0B', r: 3 }}
                activeDot={{ r: 5 }}
                fill="url(#energyGradient)"
              />
              <Line
                type="monotone"
                dataKey="water"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Water (gal)"
                dot={{ fill: '#3B82F6', r: 3 }}
                activeDot={{ r: 5 }}
                fill="url(#waterGradient)"
              />
              <Line
                type="monotone"
                dataKey="emissions"
                stroke="#6B7280"
                strokeWidth={2}
                name="CO₂ (kg)"
                dot={{ fill: '#6B7280', r: 3 }}
                activeDot={{ r: 5 }}
                fill="url(#emissionsGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sustainability score */}
        <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Sustainability Score</span>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-emerald-600">B+</div>
              <div className="text-xs text-green-600 font-medium">↑ 5%</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
