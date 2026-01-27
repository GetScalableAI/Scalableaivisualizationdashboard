import { motion } from 'framer-motion';
import { X, ChevronRight, ArrowLeft, Clock, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, Cell, Legend } from 'recharts';
import { useDrillDown } from './context/DrillDownContext';
import {
  shifts,
  machineProduction,
  hourlyProduction,
  oeeBreakdown,
  machineOEE,
  oeeTimeline,
  defectTypes,
  machineScrap,
  productScrap,
  machineUptime,
  downtimeEvents,
  getDowntimeEventDetail,
} from './services/mockDataService';

export default function DrillDownPanel() {
  const { state, closeDrillDown, drillTo, navigateToLevel, goBack } = useDrillDown();

  if (!state.isOpen || !state.widgetType) return null;

  const renderBreadcrumbs = () => (
    <nav className="flex items-center gap-2 text-sm mb-4">
      <button
        onClick={closeDrillDown}
        className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" />
        Dashboard
      </button>
      {state.path.map((item, index) => (
        <div key={item.id} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => navigateToLevel(index)}
            className={`${
              index === state.path.length - 1
                ? 'text-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {item.label}
          </button>
        </div>
      ))}
    </nav>
  );

  const renderContent = () => {
    switch (state.widgetType) {
      case 'production':
        return renderProductionContent();
      case 'oee':
        return renderOEEContent();
      case 'scrap':
        return renderScrapContent();
      case 'uptime':
        return renderUptimeContent();
      default:
        return null;
    }
  };

  const renderProductionContent = () => {
    switch (state.currentLevel) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Production by Shift</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shifts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="actual" name="Actual" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Target" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid gap-3">
              {shifts.map((shift) => (
                <motion.button
                  key={shift.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => drillTo(2, shift.name, shift.id)}
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{shift.name}</div>
                      <div className="text-sm text-gray-500">{shift.startTime} - {shift.endTime}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-blue-600">{shift.actual.toLocaleString()}</div>
                      <div className={`text-sm ${shift.efficiency >= 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {shift.efficiency}% efficiency
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Production by Machine</h3>
            <div className="grid gap-3 max-h-[400px] overflow-y-auto">
              {machineProduction.map((machine) => (
                <motion.button
                  key={machine.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => drillTo(3, machine.name, machine.id)}
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        machine.status === 'running' ? 'bg-green-500' :
                        machine.status === 'idle' ? 'bg-yellow-500' :
                        machine.status === 'maintenance' ? 'bg-blue-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <div className="font-medium text-gray-900">{machine.name}</div>
                        <div className="text-sm text-gray-500">{machine.operator}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">{machine.actual}</div>
                      <div className="text-sm text-gray-500">/ {machine.target} target</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="mt-2 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        (machine.actual / machine.target) >= 1 ? 'bg-green-500' :
                        (machine.actual / machine.target) >= 0.8 ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min((machine.actual / machine.target) * 100, 100)}%` }}
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Hourly Production Detail</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyProduction}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" fontSize={10} interval={2} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="actual" name="Actual" stroke="#3B82F6" fill="#3B82F680" />
                  <Area type="monotone" dataKey="target" name="Target" stroke="#9CA3AF" fill="#9CA3AF40" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="h-48">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Cumulative Production</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyProduction}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" fontSize={10} interval={3} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cumulative" name="Cumulative" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="cumulativeTarget" name="Target" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderOEEContent = () => {
    switch (state.currentLevel) {
      case 1:
        const oeeColors = {
          availability: '#3B82F6',
          performance: '#10B981',
          quality: '#8B5CF6',
        };
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">OEE Breakdown (A x P x Q)</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: 'availability', label: 'Availability', value: oeeBreakdown.availability, color: oeeColors.availability },
                { key: 'performance', label: 'Performance', value: oeeBreakdown.performance, color: oeeColors.performance },
                { key: 'quality', label: 'Quality', value: oeeBreakdown.quality, color: oeeColors.quality },
              ].map((item) => (
                <motion.div
                  key={item.key}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => drillTo(2, `By Machine (${item.label})`, item.key)}
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all text-center"
                >
                  <div className="text-sm text-gray-500 mb-1">{item.label}</div>
                  <div className="text-3xl font-bold" style={{ color: item.color }}>{item.value}%</div>
                  <div className="mt-2 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
              <div className="text-center">
                <div className="text-sm text-gray-600">Overall OEE</div>
                <div className="text-4xl font-bold text-yellow-600">{oeeBreakdown.oee}%</div>
                <div className="text-xs text-gray-500 mt-1">
                  {oeeBreakdown.availability}% x {oeeBreakdown.performance}% x {oeeBreakdown.quality}%
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">OEE by Machine</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={machineOEE.slice(0, 8)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} fontSize={12} />
                  <YAxis type="category" dataKey="name" fontSize={11} width={60} />
                  <Tooltip />
                  <Bar dataKey="oee" name="OEE %" fill="#F59E0B" radius={[0, 4, 4, 0]}>
                    {machineOEE.slice(0, 8).map((entry, index) => (
                      <Cell key={index} fill={entry.oee >= 80 ? '#10B981' : entry.oee >= 60 ? '#F59E0B' : '#EF4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid gap-3 max-h-[250px] overflow-y-auto">
              {machineOEE.map((machine) => (
                <motion.button
                  key={machine.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => drillTo(3, machine.name, machine.id)}
                  className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        machine.status === 'running' ? 'bg-green-500' :
                        machine.status === 'idle' ? 'bg-yellow-500' :
                        machine.status === 'maintenance' ? 'bg-blue-500' : 'bg-red-500'
                      }`} />
                      <span className="font-medium text-gray-900">{machine.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-blue-600">A: {machine.availability}%</span>
                      <span className="text-green-600">P: {machine.performance}%</span>
                      <span className="text-purple-600">Q: {machine.quality}%</span>
                      <span className={`font-semibold ${
                        machine.oee >= 80 ? 'text-green-600' : machine.oee >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        OEE: {machine.oee}%
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">OEE Timeline</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={oeeTimeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" fontSize={10} interval={2} />
                  <YAxis domain={[0, 100]} fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="availability" name="Availability" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="performance" name="Performance" stroke="#10B981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="quality" name="Quality" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="oee" name="OEE" stroke="#F59E0B" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Events Affecting OEE</h4>
              {oeeTimeline.filter(t => t.event).map((item, idx) => (
                <div key={idx} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-gray-700">{item.time}: {item.event}</span>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderScrapContent = () => {
    const severityColors = {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#EF4444',
      critical: '#7C3AED',
    };

    switch (state.currentLevel) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Scrap by Defect Type</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={defectTypes} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" fontSize={12} />
                  <YAxis type="category" dataKey="name" fontSize={11} width={100} />
                  <Tooltip />
                  <Bar dataKey="count" name="Count" radius={[0, 4, 4, 0]}>
                    {defectTypes.map((entry, index) => (
                      <Cell key={index} fill={severityColors[entry.severity]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid gap-3">
              {defectTypes.map((defect) => (
                <motion.button
                  key={defect.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => drillTo(2, defect.name, defect.id)}
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: severityColors[defect.severity] }}
                      />
                      <div>
                        <div className="font-medium text-gray-900">{defect.name}</div>
                        <div className="text-sm text-gray-500">{defect.severity} severity</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-red-600">{defect.count} units</div>
                      <div className="text-sm text-gray-500">${defect.cost.toLocaleString()} cost</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Scrap by Machine</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={machineScrap.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} angle={-45} textAnchor="end" height={60} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="scrapRate" name="Scrap Rate %" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid gap-3 max-h-[250px] overflow-y-auto">
              {machineScrap.map((machine) => (
                <motion.button
                  key={machine.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => drillTo(3, machine.name, machine.id)}
                  className="p-3 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{machine.name}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">{machine.scrapCount} / {machine.totalProduced}</span>
                      <span className={`font-semibold ${
                        machine.scrapRate <= 2 ? 'text-green-600' : machine.scrapRate <= 3 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {machine.scrapRate}%
                      </span>
                      <span className="text-red-600">${machine.cost}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Scrap by Product</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Defect</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Count</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Batch ID</th>
                  </tr>
                </thead>
                <tbody>
                  {productScrap.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-500">{item.timestamp}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">{item.name}</td>
                      <td className="py-3 px-4 text-gray-700">{item.defectType}</td>
                      <td className="py-3 px-4 text-right text-red-600 font-medium">{item.count}</td>
                      <td className="py-3 px-4 text-gray-500 font-mono text-xs">{item.batchId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderUptimeContent = () => {
    const reasonColors: Record<string, string> = {
      breakdown: '#EF4444',
      maintenance: '#3B82F6',
      changeover: '#8B5CF6',
      material: '#F59E0B',
      quality: '#EC4899',
      other: '#6B7280',
    };

    switch (state.currentLevel) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Uptime by Machine</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={machineUptime.slice(0, 8)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} fontSize={12} />
                  <YAxis type="category" dataKey="name" fontSize={11} width={60} />
                  <Tooltip />
                  <Bar dataKey="uptime" name="Uptime %" radius={[0, 4, 4, 0]}>
                    {machineUptime.slice(0, 8).map((entry, index) => (
                      <Cell key={index} fill={entry.uptime >= 95 ? '#10B981' : entry.uptime >= 85 ? '#F59E0B' : '#EF4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid gap-3 max-h-[250px] overflow-y-auto">
              {machineUptime.map((machine) => (
                <motion.button
                  key={machine.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => drillTo(2, machine.name, machine.id)}
                  className="p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        machine.status === 'running' ? 'bg-green-500' :
                        machine.status === 'idle' ? 'bg-yellow-500' :
                        machine.status === 'maintenance' ? 'bg-blue-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <div className="font-medium text-gray-900">{machine.name}</div>
                        {machine.lastDowntime && (
                          <div className="text-xs text-red-500">Last down: {machine.lastDowntime}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">{machine.productiveHours}h / {machine.totalHours}h</span>
                      <span className={`font-semibold ${
                        machine.uptime >= 95 ? 'text-green-600' : machine.uptime >= 85 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {machine.uptime}%
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Downtime Events</h3>
            {/* Timeline visualization */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {Object.entries(reasonColors).map(([reason, color]) => (
                  <div key={reason} className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
                    <span className="capitalize">{reason}</span>
                  </div>
                ))}
              </div>
              <div className="relative h-8 bg-green-100 rounded overflow-hidden">
                {downtimeEvents.map((event) => {
                  const startHour = parseInt(event.startTime.split(':')[0]);
                  const startMin = parseInt(event.startTime.split(':')[1]);
                  const startPercent = ((startHour * 60 + startMin) / (24 * 60)) * 100;
                  const widthPercent = (event.duration / (24 * 60)) * 100;

                  return (
                    <div
                      key={event.id}
                      className="absolute h-full cursor-pointer hover:opacity-80 transition-opacity"
                      style={{
                        left: `${startPercent}%`,
                        width: `${Math.max(widthPercent, 1)}%`,
                        backgroundColor: reasonColors[event.reason],
                      }}
                      title={`${event.machineName}: ${event.description}`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>24:00</span>
              </div>
            </div>
            <div className="grid gap-3 max-h-[300px] overflow-y-auto">
              {downtimeEvents.map((event) => (
                <motion.button
                  key={event.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => drillTo(3, `Event: ${event.machineName}`, event.id)}
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-4 h-4 rounded mt-0.5"
                        style={{ backgroundColor: reasonColors[event.reason] }}
                      />
                      <div>
                        <div className="font-medium text-gray-900">{event.machineName}</div>
                        <div className="text-sm text-gray-600">{event.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {event.startTime} - {event.endTime || 'Ongoing'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{event.duration} min</span>
                      </div>
                      {!event.resolved && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full mt-1">
                          <AlertTriangle className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 3:
        const eventDetail = getDowntimeEventDetail(state.selectedId || '');
        if (!eventDetail) return <div>Event not found</div>;

        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Event Detail</h3>
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-semibold text-gray-900">{eventDetail.machineName}</div>
                  <div className="text-sm text-gray-500 capitalize">{eventDetail.reason}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  eventDetail.endTime ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {eventDetail.endTime ? 'Resolved' : 'Active'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Duration</div>
                  <div className="text-lg font-semibold">{eventDetail.duration} min</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Cost Impact</div>
                  <div className="text-lg font-semibold text-red-600">${eventDetail.cost.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Start Time</div>
                  <div className="text-lg font-semibold">{eventDetail.startTime}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">End Time</div>
                  <div className="text-lg font-semibold">{eventDetail.endTime || 'Ongoing'}</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Root Cause</div>
                <div className="text-gray-600">{eventDetail.rootCause}</div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Technician</div>
                <div className="text-gray-600">{eventDetail.technician}</div>
              </div>

              {eventDetail.partsReplaced.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Parts Replaced</div>
                  <div className="flex flex-wrap gap-2">
                    {eventDetail.partsReplaced.map((part, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {part}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {eventDetail.notes && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Notes</div>
                  <div className="text-gray-600 text-sm">{eventDetail.notes}</div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/30"
        onClick={closeDrillDown}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-gray-50 shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {state.widgetType === 'production' && <TrendingUp className="w-5 h-5 text-blue-600" />}
            {state.widgetType === 'oee' && <Activity className="w-5 h-5 text-yellow-600" />}
            {state.widgetType === 'scrap' && <AlertTriangle className="w-5 h-5 text-red-600" />}
            {state.widgetType === 'uptime' && <Clock className="w-5 h-5 text-green-600" />}
            <h2 className="text-lg font-semibold text-gray-900 capitalize">
              {state.widgetType} Details
            </h2>
          </div>
          <button
            onClick={closeDrillDown}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderBreadcrumbs()}
          {renderContent()}
        </div>
      </motion.div>
    </motion.div>
  );
}
