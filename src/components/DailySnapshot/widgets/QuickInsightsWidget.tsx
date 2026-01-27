import { motion } from 'framer-motion';
import { MessageSquare, Sparkles, ChevronRight } from 'lucide-react';

interface QuickInsightsWidgetProps {
  onOpenChat?: () => void;
}

export default function QuickInsightsWidget({ onOpenChat }: QuickInsightsWidgetProps) {
  const suggestedQuestions = [
    { text: 'OEE by shift', icon: '📊' },
    { text: 'Scrap by product', icon: '🔍' },
    { text: 'Downtime causes', icon: '⚠️' },
    { text: 'Compare to last week', icon: '📈' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="h-full bg-gray-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Quick Insights
          </h3>
          {onOpenChat && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenChat}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
            >
              <span>Open full chat</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        <div className="relative mb-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <input
              type="text"
              placeholder="Ask about your production data... (e.g., 'Which machines had the most downtime?')"
              className="w-full px-4 py-3.5 pl-12 pr-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm hover:bg-white/90"
              onClick={onOpenChat}
              readOnly
            />
            <MessageSquare className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-500" />
          </motion.div>
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((question, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenChat}
              className="px-3.5 py-2 bg-gradient-to-r from-purple-100/80 to-pink-100/80 backdrop-blur-sm text-gray-700 text-sm rounded-full hover:from-purple-200/80 hover:to-pink-200/80 transition-all duration-200 border border-purple-200/50 flex items-center gap-1.5 shadow-sm hover:shadow-md"
            >
              <span>{question.icon}</span>
              <span className="font-medium">{question.text}</span>
            </motion.button>
          ))}
        </div>

        {/* AI Status Indicator */}
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>AI Assistant Ready</span>
          </div>
          <span className="text-gray-400">•</span>
          <span>Powered by Claude</span>
        </div>
      </div>
    </motion.div>
  );
}