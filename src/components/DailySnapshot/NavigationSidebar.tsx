import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Layout,
  Save,
  Download,
  Upload,
  RefreshCw,
  Edit3,
  Eye,
  Plus,
  Filter,
  FileDown,
  X,
  Check,
  Factory,
  DollarSign,
  Wrench,
  LayoutGrid,
  BarChart3,
  Minimize2,
} from 'lucide-react';
import { useState } from 'react';
import { LayoutPreset } from './hooks/useLayoutManager';

interface NavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  currentPreset: string;
  presets: LayoutPreset[];
  productLineFilter: string;
  shiftFilter: string;
  savedReports: string[];
  onToggleEditMode: () => void;
  onLoadPreset: (presetId: string) => void;
  onResetLayout: () => void;
  onExportLayout: () => void;
  onImportLayout: (file: File) => void;
  onOpenWidgetLibrary: () => void;
  onProductLineFilterChange: (value: string) => void;
  onShiftFilterChange: (value: string) => void;
  onExportData: () => void;
  onSaveReport: () => void;
  onLoadReport?: (reportIndex: number) => void;
}

// Clean blue theme colors
const colors = {
  panelBg: '#1a365d',
  headerBg: '#2c5282',
  contentBg: '#1e4976',
  cardBg: '#234e7a',
  cardHover: '#2d6091',
  border: 'rgba(255, 255, 255, 0.1)',
  borderHover: 'rgba(96, 165, 250, 0.5)',
  textPrimary: '#ffffff',
  textSecondary: '#a0c4e8',
  textMuted: '#7eb8e5',
  accent: '#3b82f6',
  accentHover: '#2563eb',
  success: '#10b981',
  warning: '#f59e0b',
};

export default function NavigationSidebar({
  isOpen,
  onClose,
  isEditMode,
  currentPreset,
  presets,
  productLineFilter,
  shiftFilter,
  savedReports,
  onToggleEditMode,
  onLoadPreset,
  onResetLayout,
  onExportLayout,
  onImportLayout,
  onOpenWidgetLibrary,
  onProductLineFilterChange,
  onShiftFilterChange,
  onExportData,
  onSaveReport,
  onLoadReport,
}: NavigationSidebarProps) {
  const [activeSection, setActiveSection] = useState<string>('layout');

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportLayout(file);
    }
  };

  const sections = [
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'filters', label: 'Filters', icon: Filter },
    { id: 'reports', label: 'Reports', icon: FileDown },
  ];

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: -340, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -340, opacity: 0 }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed left-4 top-24 bottom-6 w-80 z-50 flex flex-col"
            style={{
              backgroundColor: colors.panelBg,
              borderRadius: '20px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{
                backgroundColor: colors.headerBg,
                borderRadius: '20px 20px 0 0',
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <div>
                <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                  Controls
                </h3>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  Customize your dashboard
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full transition-colors"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <X className="w-5 h-5" style={{ color: colors.textSecondary }} />
              </motion.button>
            </div>

            {/* Tab Navigation */}
            <div
              className="px-4 py-3 flex gap-2"
              style={{ backgroundColor: colors.contentBg }}
            >
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <motion.button
                    key={section.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveSection(section.id)}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: isActive ? colors.accent : 'rgba(255, 255, 255, 0.08)',
                      color: isActive ? colors.textPrimary : colors.textSecondary,
                      boxShadow: isActive ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none',
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {section.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Content Area */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4"
              style={{ backgroundColor: colors.contentBg }}
            >
              <AnimatePresence mode="wait">
                {/* Layout Section */}
                {activeSection === 'layout' && (
                  <motion.div
                    key="layout"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Edit Mode Toggle */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onToggleEditMode}
                      className="w-full p-4 rounded-xl font-medium transition-all flex items-center gap-3"
                      style={{
                        backgroundColor: isEditMode ? colors.success : colors.cardBg,
                        color: colors.textPrimary,
                        boxShadow: isEditMode ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: isEditMode ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)' }}
                      >
                        {isEditMode ? <Eye className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{isEditMode ? 'View Mode' : 'Edit Layout'}</div>
                        <div className="text-xs opacity-70">
                          {isEditMode ? 'Switch to view mode' : 'Drag & resize widgets'}
                        </div>
                      </div>
                      {isEditMode && <Check className="w-5 h-5 ml-auto" />}
                    </motion.button>

                    {/* Add Widgets Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onOpenWidgetLibrary}
                      className="w-full p-4 rounded-xl font-medium transition-all flex items-center gap-3"
                      style={{
                        backgroundColor: colors.accent,
                        color: colors.textPrimary,
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                      >
                        <Plus className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Add Widgets</div>
                        <div className="text-xs opacity-70">Browse widget library</div>
                      </div>
                    </motion.button>

                    {/* Role-Based Layouts */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                        Role-Based Layouts
                      </label>
                      <div className="space-y-2">
                        {presets.filter(p => ['plant-manager', 'cfo', 'shop-floor'].includes(p.id)).map((preset) => {
                          const isActive = currentPreset === preset.id;
                          const getPresetIcon = (id: string) => {
                            switch (id) {
                              case 'plant-manager': return Factory;
                              case 'cfo': return DollarSign;
                              case 'shop-floor': return Wrench;
                              default: return Layout;
                            }
                          };
                          const getPresetColor = (id: string) => {
                            switch (id) {
                              case 'plant-manager': return '#8B5CF6';
                              case 'cfo': return '#10B981';
                              case 'shop-floor': return '#F59E0B';
                              default: return colors.accent;
                            }
                          };
                          const Icon = getPresetIcon(preset.id);
                          const presetColor = getPresetColor(preset.id);
                          return (
                            <motion.button
                              key={preset.id}
                              whileHover={{ scale: 1.02, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => onLoadPreset(preset.id)}
                              className="w-full p-3 rounded-xl text-left transition-all"
                              style={{
                                backgroundColor: isActive ? `${presetColor}20` : colors.cardBg,
                                border: isActive ? `2px solid ${presetColor}` : `1px solid ${colors.border}`,
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                                  style={{ backgroundColor: isActive ? presetColor : 'rgba(255,255,255,0.1)' }}
                                >
                                  <Icon className="w-4 h-4" style={{ color: colors.textPrimary }} />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm" style={{ color: colors.textPrimary }}>{preset.name}</div>
                                  <div className="text-xs line-clamp-1" style={{ color: colors.textMuted }}>{preset.description}</div>
                                </div>
                                {isActive && <Check className="w-4 h-4 flex-shrink-0" style={{ color: presetColor }} />}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Other Layouts */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                        Other Layouts
                      </label>
                      <div className="space-y-2">
                        {presets.filter(p => !['plant-manager', 'cfo', 'shop-floor'].includes(p.id)).map((preset) => {
                          const isActive = currentPreset === preset.id;
                          const getPresetIcon = (id: string) => {
                            switch (id) {
                              case 'default': return LayoutGrid;
                              case 'compact': return Minimize2;
                              case 'analytics': return BarChart3;
                              default: return Layout;
                            }
                          };
                          const Icon = getPresetIcon(preset.id);
                          return (
                            <motion.button
                              key={preset.id}
                              whileHover={{ scale: 1.02, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => onLoadPreset(preset.id)}
                              className="w-full p-3 rounded-xl text-left transition-all"
                              style={{
                                backgroundColor: isActive ? 'rgba(59, 130, 246, 0.2)' : colors.cardBg,
                                border: isActive ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`,
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                                  style={{ backgroundColor: isActive ? colors.accent : 'rgba(255,255,255,0.1)' }}
                                >
                                  <Icon className="w-4 h-4" style={{ color: colors.textPrimary }} />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm" style={{ color: colors.textPrimary }}>{preset.name}</div>
                                  <div className="text-xs line-clamp-1" style={{ color: colors.textMuted }}>{preset.description}</div>
                                </div>
                                {isActive && <Check className="w-4 h-4 flex-shrink-0" style={{ color: colors.accent }} />}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                        Actions
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={onResetLayout}
                          className="p-3 rounded-xl text-sm font-medium flex flex-col items-center gap-1.5"
                          style={{ backgroundColor: colors.cardBg, color: colors.textPrimary }}
                        >
                          <RefreshCw className="w-5 h-5" style={{ color: colors.warning }} />
                          <span>Reset</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={onExportLayout}
                          className="p-3 rounded-xl text-sm font-medium flex flex-col items-center gap-1.5"
                          style={{ backgroundColor: colors.cardBg, color: colors.textPrimary }}
                        >
                          <Download className="w-5 h-5" style={{ color: colors.accent }} />
                          <span>Export</span>
                        </motion.button>
                      </div>
                      <label className="block">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full p-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
                          style={{ backgroundColor: colors.cardBg, color: colors.textPrimary }}
                        >
                          <Upload className="w-4 h-4" style={{ color: colors.success }} />
                          Import Layout
                        </motion.div>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleFileImport}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* Filters Section */}
                {activeSection === 'filters' && (
                  <motion.div
                    key="filters"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                        Date Range
                      </label>
                      <select
                        className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                          backgroundColor: colors.cardBg,
                          color: colors.textPrimary,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <option>Today</option>
                        <option>This Week</option>
                        <option>This Month</option>
                        <option>Custom</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                        Product Line
                      </label>
                      <select
                        value={productLineFilter}
                        onChange={(e) => onProductLineFilterChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                          backgroundColor: colors.cardBg,
                          color: colors.textPrimary,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <option value="all">All Product Lines</option>
                        <option value="a">Product Line A</option>
                        <option value="b">Product Line B</option>
                        <option value="c">Product Line C</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                        Shift
                      </label>
                      <select
                        value={shiftFilter}
                        onChange={(e) => onShiftFilterChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                          backgroundColor: colors.cardBg,
                          color: colors.textPrimary,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <option value="all">All Shifts</option>
                        <option value="1">Shift 1</option>
                        <option value="2">Shift 2</option>
                        <option value="3">Shift 3</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* Reports Section */}
                {activeSection === 'reports' && (
                  <motion.div
                    key="reports"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onExportData}
                        className="p-3 rounded-xl text-sm font-medium flex flex-col items-center gap-1.5"
                        style={{ backgroundColor: colors.success, color: colors.textPrimary }}
                      >
                        <FileDown className="w-5 h-5" />
                        <span>Export CSV</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onSaveReport}
                        className="p-3 rounded-xl text-sm font-medium flex flex-col items-center gap-1.5"
                        style={{ backgroundColor: colors.accent, color: colors.textPrimary }}
                      >
                        <Save className="w-5 h-5" />
                        <span>Save Report</span>
                      </motion.button>
                    </div>

                    {/* Saved Reports */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                          Saved Reports
                        </label>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.cardBg, color: colors.textMuted }}>
                          {savedReports.length}
                        </span>
                      </div>

                      {savedReports.length > 0 ? (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {savedReports.map((report, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.02, x: 4 }}
                              className="flex items-center justify-between p-3 rounded-xl cursor-pointer"
                              style={{ backgroundColor: colors.cardBg }}
                              onClick={() => onLoadReport?.(index)}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                                  style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                                >
                                  <FileDown className="w-4 h-4" style={{ color: colors.accent }} />
                                </div>
                                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                                  {report}
                                </span>
                              </div>
                              <ChevronLeft className="w-4 h-4 rotate-180" style={{ color: colors.textMuted }} />
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 rounded-xl" style={{ backgroundColor: colors.cardBg }}>
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                          >
                            <FileDown className="w-6 h-6" style={{ color: colors.textMuted }} />
                          </div>
                          <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>No saved reports</p>
                          <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                            Save your first report above
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div
              className="px-4 py-3 text-center"
              style={{
                backgroundColor: colors.headerBg,
                borderRadius: '0 0 20px 20px',
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              <p className="text-xs" style={{ color: colors.textMuted }}>
                Press <kbd className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>Esc</kbd> to close
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
