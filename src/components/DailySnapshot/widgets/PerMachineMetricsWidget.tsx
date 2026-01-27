import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Factory, CheckCircle, AlertCircle, XCircle, ChevronDown } from 'lucide-react';

interface Machine {
  id: string;
  name: string;
  status: 'running' | 'idle' | 'error';
  utilization: number;
  output: number;
  uptime: number;
}

export default function PerMachineMetricsWidget() {
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);

  const machines: Machine[] = [
    { id: 'CNC-01', name: 'CNC Machine 01', status: 'running', utilization: 94, output: 342, uptime: 23.2 },
    { id: 'CNC-02', name: 'CNC Machine 02', status: 'running', utilization: 89, output: 318, uptime: 22.1 },
    { id: 'CNC-03', name: 'CNC Machine 03', status: 'error', utilization: 0, output: 0, uptime: 0 },
    { id: 'Press-11', name: 'Press 11', status: 'running', utilization: 96, output: 512, uptime: 24.0 },
    { id: 'Press-12', name: 'Press 12', status: 'idle', utilization: 45, output: 156, uptime: 10.8 },
    { id: 'Welder-01', name: 'Welder 01', status: 'running', utilization: 91, output: 278, uptime: 21.9 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-600 bg-green-50 border-green-200';
      case 'idle': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <CheckCircle className="w-4 h-4" />;
      case 'idle': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const runningCount = machines.filter(m => m.status === 'running').length;
  const idleCount = machines.filter(m => m.status === 'idle').length;
  const errorCount = machines.filter(m => m.status === 'error').length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full bg-gray-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Factory className="w-5 h-5 text-slate-600" />
            Per Machine Metrics
          </h3>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-2 bg-green-50/50 border border-green-200/50 rounded-lg"
          >
            <div className="flex items-center gap-1 mb-1">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span className="text-xs text-gray-600">Running</span>
            </div>
            <div className="text-xl font-bold text-green-600">{runningCount}</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-2 bg-yellow-50/50 border border-yellow-200/50 rounded-lg"
          >
            <div className="flex items-center gap-1 mb-1">
              <AlertCircle className="w-3 h-3 text-yellow-600" />
              <span className="text-xs text-gray-600">Idle</span>
            </div>
            <div className="text-xl font-bold text-yellow-600">{idleCount}</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-2 bg-red-50/50 border border-red-200/50 rounded-lg"
          >
            <div className="flex items-center gap-1 mb-1">
              <XCircle className="w-3 h-3 text-red-600" />
              <span className="text-xs text-gray-600">Error</span>
            </div>
            <div className="text-xl font-bold text-red-600">{errorCount}</div>
          </motion.div>
        </div>

        {/* Machine list */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {machines.map((machine, index) => (
            <motion.div
              key={machine.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedMachine(selectedMachine === machine.id ? null : machine.id)}
                className="w-full p-3 bg-white/50 border border-gray-200/50 rounded-lg hover:border-slate-300 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <div className={`px-2 py-1 rounded-md border flex items-center gap-1 text-xs font-medium ${getStatusColor(machine.status)}`}>
                      {getStatusIcon(machine.status)}
                      <span className="capitalize">{machine.status}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{machine.name}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: selectedMachine === machine.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {selectedMachine === machine.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 pt-3 border-t border-gray-200/50"
                    >
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <div className="text-gray-600 mb-1">Utilization</div>
                          <div className="font-bold text-slate-900">{machine.utilization}%</div>
                          <div className="w-full h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-slate-400 to-slate-600 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${machine.utilization}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 mb-1">Output</div>
                          <div className="font-bold text-slate-900">{machine.output} units</div>
                        </div>
                        <div>
                          <div className="text-gray-600 mb-1">Uptime</div>
                          <div className="font-bold text-slate-900">{machine.uptime}h</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
