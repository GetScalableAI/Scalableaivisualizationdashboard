import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Calendar, Save, Plus, FileText, AlertCircle, Settings } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import WidgetLibrary from './WidgetLibrary';
import NavigationSidebar from './NavigationSidebar';
import DrillDownPanel from './DrillDownPanel';
import { DrillDownProvider, useDrillDown } from './context/DrillDownContext';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { ReportProvider, useReports } from './context/ReportContext';
import { useLayoutManager } from './hooks/useLayoutManager';
import DashboardChatPanel from './chat/DashboardChatPanel';
import ReportSaveDialog from './reports/ReportSaveDialog';
import { WidgetConfig } from './types/widgetConfig';
import { DashboardContext as ChatDashboardContext } from './chat/chatPrompts';

interface DailySnapshotProps {
  onOpenChat?: () => void;
}

// Inner component that uses the contexts
function DailySnapshotInner({ onOpenChat }: DailySnapshotProps) {
  const {
    layouts,
    activeWidgets,
    currentPreset,
    isEditMode,
    showWidgetLibrary,
    availableWidgets,
    presets,
    handleLayoutChange,
    addWidget,
    removeWidget,
    loadPreset,
    resetLayout,
    toggleEditMode,
    toggleWidgetLibrary,
    exportLayout,
    importLayout,
  } = useLayoutManager();

  const { state: drillDownState, openDrillDown, closeDrillDown } = useDrillDown();
  const { sortedReports, currentReportId, setCurrentReport, createReport, deleteReport, exportReport } = useReports();

  const [productLineFilter, setProductLineFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [widgetConfigs, setWidgetConfigs] = useState<Record<string, WidgetConfig>>({});

  // Get current report info
  const currentReport = sortedReports.find(r => r.id === currentReportId);

  // Build dashboard context for chat
  const chatContext: ChatDashboardContext = useMemo(() => ({
    activeWidgets,
    availableWidgets: availableWidgets.map(w => w.id),
    currentReport: currentReport ? { id: currentReport.id, name: currentReport.name } : null,
    savedReports: sortedReports.map(r => ({ id: r.id, name: r.name })),
    filters: {
      dateRange: 'today',
      productLine: productLineFilter,
      shift: shiftFilter,
    },
    drillDownState: {
      isOpen: drillDownState.isOpen,
      widgetType: drillDownState.widgetType,
      currentLevel: drillDownState.currentLevel,
    },
  }), [activeWidgets, availableWidgets, currentReport, sortedReports, productLineFilter, shiftFilter, drillDownState]);

  const handleOpenChat = () => {
    setIsChatOpen(true);
    // Don't call onOpenChat here - we use the DashboardChatPanel instead of FloatingChatWidget
  };

  const handleExportData = () => {
    // Export data to CSV
    const csvContent = "data:text/csv;charset=utf-8,Day,Actual,Target\nMon,2650,3000\nTue,2800,3000";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "daily_snapshot.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveReport = async (name: string, description?: string) => {
    await createReport(name, description);
    setShowSaveDialog(false);
  };

  const handleLoadReport = (reportId: string) => {
    setCurrentReport(reportId);
  };

  const handleWidgetConfigChange = (widgetId: string, config: WidgetConfig) => {
    setWidgetConfigs(prev => ({
      ...prev,
      [widgetId]: config,
    }));
  };

  return (
    <div className="relative">
      {/* Navigation Sidebar */}
      <NavigationSidebar
        isOpen={isControlsOpen}
        onClose={() => setIsControlsOpen(false)}
        isEditMode={isEditMode}
        currentPreset={currentPreset}
        presets={presets}
        productLineFilter={productLineFilter}
        shiftFilter={shiftFilter}
        savedReports={sortedReports.map(r => r.name)}
        onToggleEditMode={toggleEditMode}
        onLoadPreset={loadPreset}
        onResetLayout={resetLayout}
        onExportLayout={exportLayout}
        onImportLayout={importLayout}
        onOpenWidgetLibrary={toggleWidgetLibrary}
        onProductLineFilterChange={setProductLineFilter}
        onShiftFilterChange={setShiftFilter}
        onExportData={handleExportData}
        onSaveReport={() => setShowSaveDialog(true)}
      />

      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20"
      >
        {/* Page Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Daily Snapshot
                </h1>
                {currentReport && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">{currentReport.name}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="h-5 w-px bg-gray-300" />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Layout:</span>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {presets.find(p => p.id === currentPreset)?.name || 'Custom'}
                  </span>
                </div>
                {isEditMode && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium rounded-full shadow-md"
                  >
                    Edit Mode Active
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Dashboard Controls Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsControlsOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl transition-all shadow-lg"
                style={{
                  backgroundColor: '#2c5282',
                  boxShadow: '0 4px 12px rgba(44, 82, 130, 0.4)',
                }}
              >
                <Settings className="w-4 h-4" />
                Controls
              </motion.button>

              {/* Save Report Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSaveDialog(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl transition-all shadow-lg"
                style={{
                  backgroundColor: '#234e7a',
                  boxShadow: '0 4px 12px rgba(35, 78, 122, 0.4)',
                }}
              >
                <Save className="w-4 h-4" />
                Save
              </motion.button>

              {/* New Report Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  resetLayout();
                  setCurrentReport(null);
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl transition-all shadow-lg"
                style={{
                  backgroundColor: '#234e7a',
                  boxShadow: '0 4px 12px rgba(35, 78, 122, 0.4)',
                }}
              >
                <Plus className="w-4 h-4" />
                New
              </motion.button>

              {/* AI Assistant Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenChat}
                className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl transition-all shadow-lg"
                style={{
                  backgroundColor: '#3b82f6',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                }}
              >
                <MessageSquare className="w-4 h-4" />
                Ask AI Assistant
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Layout */}
        <DashboardLayout
          layouts={layouts}
          activeWidgets={activeWidgets}
          isEditMode={isEditMode}
          onLayoutChange={handleLayoutChange}
          onRemoveWidget={removeWidget}
          onOpenChat={handleOpenChat}
          widgetConfigs={widgetConfigs}
          onWidgetConfigChange={handleWidgetConfigChange}
        />

        {/* Widget Library Sidebar */}
        <WidgetLibrary
          isOpen={showWidgetLibrary}
          onClose={toggleWidgetLibrary}
          availableWidgets={availableWidgets}
          activeWidgets={activeWidgets}
          onAddWidget={addWidget}
          onRemoveWidget={removeWidget}
        />

        {/* Edit Mode Instructions */}
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-2xl z-30"
          >
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="font-medium">Edit Mode:</span>
              <span>Drag widgets to rearrange • Resize from corners • Click X to remove</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Drill-Down Panel */}
      <AnimatePresence>
        <DrillDownPanel />
      </AnimatePresence>

      {/* Chat Panel */}
      <DashboardChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        dashboardContext={chatContext}
        onAddWidget={addWidget}
        onRemoveWidget={removeWidget}
        onConfigureWidget={(widgetId, config) => {
          setWidgetConfigs(prev => ({
            ...prev,
            [widgetId]: { ...prev[widgetId], ...config, id: widgetId, widgetType: widgetId } as WidgetConfig,
          }));
        }}
        onOpenDrillDown={openDrillDown}
        onCloseDrillDown={closeDrillDown}
        onSaveReport={(name, description) => handleSaveReport(name, description)}
        onLoadReport={handleLoadReport}
      />

      {/* Save Report Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <ReportSaveDialog
            mode={currentReport ? 'save' : 'create'}
            initialName={currentReport?.name}
            onSave={handleSaveReport}
            onClose={() => setShowSaveDialog(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Main export with providers
export default function DailySnapshot(props: DailySnapshotProps) {
  return (
    <DashboardProvider>
      <ReportProvider>
        <DrillDownProvider>
          <DailySnapshotInner {...props} />
        </DrillDownProvider>
      </ReportProvider>
    </DashboardProvider>
  );
}