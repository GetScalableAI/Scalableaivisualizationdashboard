import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

interface CustomMetricWidgetProps {
  title?: string;
  value?: string | number;
  target?: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  description?: string;
}

export default function CustomMetricWidget({
  title = 'Custom Metric',
  value = '0',
  target,
  unit = '',
  trend = 'neutral',
  trendValue = '0%',
  description = 'User-defined metric',
}: CustomMetricWidgetProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4" />;
      case 'down': return <TrendingDown className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full bg-gray-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 backdrop-blur-sm relative overflow-hidden group"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 font-medium">{title}</span>
          <BarChart3 className="w-5 h-5 text-violet-600 opacity-50" />
        </div>

        <div className="mb-3">
          <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
            {value}{unit && <span className="text-2xl ml-1">{unit}</span>}
          </div>
          {description && (
            <div className="text-xs text-gray-500 mt-1">{description}</div>
          )}
        </div>

        {/* Trend indicator */}
        {trend !== 'neutral' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center gap-1.5 text-sm ${getTrendColor()} mb-3`}
          >
            {getTrendIcon()}
            <span className="font-medium">{trendValue}</span>
          </motion.div>
        )}

        {/* Target comparison */}
        {target && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-600">Target:</span>
              <span className="font-semibold text-gray-900">{target}{unit}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-400 to-purple-600 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min((Number(value) / Number(target)) * 100, 100)}%`
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Info card */}
        <div className="bg-violet-50/50 backdrop-blur-sm rounded-lg p-3 border border-violet-200/50">
          <div className="text-xs text-violet-800 font-medium">
            Custom metric created by user
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Click to edit metric settings
          </div>
        </div>
      </div>
    </motion.div>
  );
}
