import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Package, Clock } from 'lucide-react';

export default function SalesWidget() {
  const revenue = 342890;
  const revenueTarget = 375000;
  const revenuePercentage = (revenue / revenueTarget) * 100;
  const ordersShipped = 47;
  const ordersPending = 12;

  const topCustomers = [
    { name: 'Acme Corp', amount: 84200 },
    { name: 'TechStart Inc', amount: 56700 },
    { name: 'BuildRight LLC', amount: 42150 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="h-full bg-gray-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-600" />
          Sales Performance
        </h3>

        {/* Revenue Section */}
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-1 font-medium">Revenue Today</div>
          <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent mb-2">
            ${revenue.toLocaleString()}
          </div>

          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Target: ${(revenueTarget / 1000).toFixed(0)}K</span>
            <span className="font-semibold text-emerald-600">{revenuePercentage.toFixed(1)}%</span>
          </div>

          <div className="w-full h-2 bg-gray-200/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${revenuePercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Orders Section */}
        <div className="border-t border-gray-200/50 pt-3 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-green-50/50 backdrop-blur-sm rounded-lg p-2 border border-green-200/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-700">Shipped</span>
                </div>
                <span className="text-lg font-bold text-green-600">{ordersShipped}</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-yellow-50/50 backdrop-blur-sm rounded-lg p-2 border border-yellow-200/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-xs text-gray-700">Pending</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">{ordersPending}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Top Customers */}
        <div className="border-t border-gray-200/50 pt-3">
          <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            Top Customers Today
          </div>
          <div className="space-y-2">
            {topCustomers.map((customer, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 2 }}
                className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-gray-50/50 to-transparent hover:from-emerald-50/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-xs text-gray-700 font-medium">{customer.name}</span>
                </div>
                <span className="text-xs font-semibold text-gray-900">
                  ${(customer.amount / 1000).toFixed(1)}K
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}