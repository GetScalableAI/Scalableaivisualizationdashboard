import { motion } from 'framer-motion';
import {
  Users,
  Building,
  Mail,
  CheckCircle2,
  Calendar,
  Settings,
  PlayCircle,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { DivisionDistribution, DistributionSettings } from './types';

interface DistributionPanelProps {
  distributions: DivisionDistribution[];
  settings: DistributionSettings;
  onOpenSettings: () => void;
  onDistributeNow: () => void;
}

export default function DistributionPanel({
  distributions,
  settings,
  onOpenSettings,
  onDistributeNow,
}: DistributionPanelProps) {
  const totalDistributed = distributions.reduce((sum, d) => sum + d.rfqCount, 0);
  const totalValue = distributions.reduce(
    (sum, d) => sum + d.rfqs.reduce((s, rfq) => s + rfq.value, 0),
    0
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Today's Distribution</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {settings.enabled ? `Auto-distribute ${settings.rfqsPerDay} RFQs at ${settings.distributionTime}` : 'Auto-distribution disabled'}
            </p>
          </div>
          <button
            onClick={onOpenSettings}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Distribution Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-blue-600 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Distributed
            </div>
            <div className="text-2xl font-bold text-blue-700">
              {totalDistributed} <span className="text-sm font-normal">of {settings.rfqsPerDay}</span>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-green-600 mb-1">
              <DollarSign className="w-3.5 h-3.5" />
              Total Value
            </div>
            <div className="text-2xl font-bold text-green-700">
              ${(totalValue / 1000).toFixed(0)}K
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span>Distribution Progress</span>
            <span className="font-medium">
              {Math.round((totalDistributed / settings.rfqsPerDay) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(totalDistributed / settings.rfqsPerDay) * 100}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>

        {/* Manual Distribution Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDistributeNow}
          disabled={totalDistributed >= settings.rfqsPerDay}
          className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <PlayCircle className="w-4 h-4" />
          <span className="font-medium">Distribute Now</span>
        </motion.button>
      </div>

      {/* Division Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Building className="w-5 h-5 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Division Breakdown</h3>
        </div>

        {distributions.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No distributions yet today</p>
            <p className="text-xs text-gray-400 mt-1">Click "Distribute Now" to start</p>
          </div>
        ) : (
          <div className="space-y-3">
            {distributions.map((division, index) => (
              <motion.div
                key={division.divisionName}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-gray-900 text-sm">
                        {division.divisionName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Mail className="w-3 h-3" />
                      {division.managerName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {division.rfqCount}
                    </div>
                    <div className="text-xs text-gray-500">RFQs</div>
                  </div>
                </div>

                {/* RFQ Details */}
                {division.rfqs.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
                    {division.rfqs.map((rfq) => (
                      <div
                        key={rfq.id}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-gray-600 font-mono">{rfq.id}</span>
                        <span className="font-medium text-gray-900">
                          ${rfq.value.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Division Total */}
                <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Division Total</span>
                  <span className="text-sm font-bold text-green-600">
                    ${division.rfqs.reduce((sum, rfq) => sum + rfq.value, 0).toLocaleString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Distribution History Link */}
      {settings.lastDistribution && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Last Distribution:</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {new Date(settings.lastDistribution).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
