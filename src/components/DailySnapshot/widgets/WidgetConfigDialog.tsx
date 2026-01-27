// WidgetConfigDialog - Configure widget settings (thresholds, display, data source)
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Settings,
  Palette,
  BarChart3,
  AlertTriangle,
  Database,
  RotateCcw,
} from 'lucide-react';
import { WidgetConfig, ThresholdConfig, DisplayOptions, DataSourceConfig, DEFAULT_WIDGET_CONFIGS } from '../types/widgetConfig';
import { AVAILABLE_WIDGETS } from '../hooks/useLayoutManager';

interface WidgetConfigDialogProps {
  widgetId: string;
  widgetType: string;
  currentConfig?: WidgetConfig;
  onSave: (config: WidgetConfig) => void;
  onClose: () => void;
}

type TabId = 'thresholds' | 'display' | 'data';

// Style constants for dark blue theme
const styles = {
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialog: {
    backgroundColor: '#1e3a5f',
    borderRadius: '12px',
  },
  header: {
    backgroundColor: '#163050',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  tabs: {
    backgroundColor: '#1a3555',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  content: {
    backgroundColor: '#1e3a5f',
  },
  footer: {
    backgroundColor: '#163050',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  input: {
    backgroundColor: '#0f2540',
    border: '1px solid #2d4a6f',
    color: 'white',
  },
  label: {
    color: '#a0c4e8',
  },
  textMuted: {
    color: '#7a9ec4',
  },
};

export default function WidgetConfigDialog({
  widgetId,
  widgetType,
  currentConfig,
  onSave,
  onClose,
}: WidgetConfigDialogProps) {
  const [activeTab, setActiveTab] = useState<TabId>('thresholds');
  const [config, setConfig] = useState<WidgetConfig>(() => {
    const defaultConfig = DEFAULT_WIDGET_CONFIGS[widgetType] || {};
    return {
      id: widgetId,
      widgetType,
      ...defaultConfig,
      ...currentConfig,
    };
  });

  const widget = AVAILABLE_WIDGETS.find(w => w.id === widgetType);
  const widgetTitle = widget?.title || widgetType;

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'thresholds', label: 'Thresholds', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'display', label: 'Display', icon: <Palette className="w-4 h-4" /> },
    { id: 'data', label: 'Data Source', icon: <Database className="w-4 h-4" /> },
  ];

  const handleThresholdChange = (key: keyof ThresholdConfig, value: number | string) => {
    setConfig(prev => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [key]: typeof value === 'string' ? (value === '' ? undefined : parseFloat(value)) : value,
      },
    }));
  };

  const handleDisplayChange = (key: keyof DisplayOptions, value: boolean | string | number) => {
    setConfig(prev => ({
      ...prev,
      displayOptions: {
        ...prev.displayOptions,
        [key]: value,
      },
    }));
  };

  const handleDataSourceChange = (key: keyof DataSourceConfig, value: string | number | string[]) => {
    setConfig(prev => ({
      ...prev,
      dataSource: {
        ...prev.dataSource,
        [key]: value,
      },
    }));
  };

  const handleReset = () => {
    const defaultConfig = DEFAULT_WIDGET_CONFIGS[widgetType] || {};
    setConfig({
      id: widgetId,
      widgetType,
      ...defaultConfig,
    });
  };

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={styles.backdrop}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
        className="rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
        style={styles.dialog}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={styles.header}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Configure Widget</h2>
              <p className="text-sm" style={styles.textMuted}>{widgetTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#7a9ec4' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2d4a6f'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#7a9ec4'; }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex" style={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors"
              style={{
                color: activeTab === tab.id ? '#60a5fa' : '#7a9ec4',
                borderBottom: activeTab === tab.id ? '2px solid #60a5fa' : '2px solid transparent',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto" style={styles.content}>
          <AnimatePresence mode="wait">
            {activeTab === 'thresholds' && (
              <motion.div
                key="thresholds"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={styles.label}>
                      Warning Threshold
                    </label>
                    <input
                      type="number"
                      value={config.thresholds?.warning ?? ''}
                      onChange={(e) => handleThresholdChange('warning', e.target.value)}
                      placeholder="e.g., 80"
                      className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={styles.label}>
                      Critical Threshold
                    </label>
                    <input
                      type="number"
                      value={config.thresholds?.critical ?? ''}
                      onChange={(e) => handleThresholdChange('critical', e.target.value)}
                      placeholder="e.g., 60"
                      className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={styles.input}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={styles.label}>
                    Target Value
                  </label>
                  <input
                    type="number"
                    value={config.thresholds?.target ?? ''}
                    onChange={(e) => handleThresholdChange('target', e.target.value)}
                    placeholder="e.g., 100"
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={styles.input}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={styles.label}>
                    Threshold Direction
                  </label>
                  <select
                    value={config.thresholds?.direction || 'higher-is-better'}
                    onChange={(e) => handleThresholdChange('direction', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={styles.input}
                  >
                    <option value="higher-is-better">Higher is Better (e.g., OEE, Uptime)</option>
                    <option value="lower-is-better">Lower is Better (e.g., Scrap Rate)</option>
                  </select>
                </div>
              </motion.div>
            )}

            {activeTab === 'display' && (
              <motion.div
                key="display"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.displayOptions?.showTrend ?? true}
                      onChange={(e) => handleDisplayChange('showTrend', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm" style={styles.label}>Show trend indicator</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.displayOptions?.showSparkline ?? true}
                      onChange={(e) => handleDisplayChange('showSparkline', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm" style={styles.label}>Show sparkline chart</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.displayOptions?.showPercentage ?? false}
                      onChange={(e) => handleDisplayChange('showPercentage', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm" style={styles.label}>Show as percentage</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.displayOptions?.compactNumbers ?? false}
                      onChange={(e) => handleDisplayChange('compactNumbers', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm" style={styles.label}>Use compact numbers (K, M)</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={styles.label}>
                    Decimal Places
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="4"
                    value={config.displayOptions?.decimalPlaces ?? 1}
                    onChange={(e) => handleDisplayChange('decimalPlaces', parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={styles.input}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={styles.label}>
                    Color Scheme
                  </label>
                  <select
                    value={config.displayOptions?.colorScheme || 'default'}
                    onChange={(e) => handleDisplayChange('colorScheme', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={styles.input}
                  >
                    <option value="default">Default</option>
                    <option value="traffic">Traffic Light (Red/Yellow/Green)</option>
                    <option value="monochrome">Monochrome</option>
                  </select>
                </div>
              </motion.div>
            )}

            {activeTab === 'data' && (
              <motion.div
                key="data"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1" style={styles.label}>
                    Time Range
                  </label>
                  <select
                    value={config.dataSource?.timeRange || 'day'}
                    onChange={(e) => handleDataSourceChange('timeRange', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={styles.input}
                  >
                    <option value="hour">Last Hour</option>
                    <option value="shift">Current Shift</option>
                    <option value="day">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={styles.label}>
                    Aggregation Method
                  </label>
                  <select
                    value={config.dataSource?.aggregation || 'avg'}
                    onChange={(e) => handleDataSourceChange('aggregation', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={styles.input}
                  >
                    <option value="sum">Sum</option>
                    <option value="avg">Average</option>
                    <option value="min">Minimum</option>
                    <option value="max">Maximum</option>
                    <option value="count">Count</option>
                    <option value="latest">Latest Value</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={styles.label}>
                    Compare With
                  </label>
                  <select
                    value={config.dataSource?.compareWith || 'none'}
                    onChange={(e) => handleDataSourceChange('compareWith', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={styles.input}
                  >
                    <option value="none">No Comparison</option>
                    <option value="previous-period">Previous Period</option>
                    <option value="target">Target</option>
                    <option value="baseline">Baseline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={styles.label}>
                    Auto-Refresh (seconds)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="30"
                    value={config.dataSource?.refreshInterval ?? 0}
                    onChange={(e) => handleDataSourceChange('refreshInterval', parseInt(e.target.value))}
                    placeholder="0 for manual refresh"
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={styles.input}
                  />
                  <p className="text-xs mt-1" style={styles.textMuted}>Set to 0 for manual refresh only</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4" style={styles.footer}>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
            style={{ color: '#7a9ec4' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2d4a6f'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#7a9ec4'; }}
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{ color: '#a0c4e8' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2d4a6f'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#a0c4e8'; }}
            >
              Cancel
            </button>
            <motion.button
              onClick={handleSave}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-md transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              Apply Changes
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
