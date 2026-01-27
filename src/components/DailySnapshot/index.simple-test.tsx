import { useState } from 'react';
import { useLayoutManager } from './hooks/useLayoutManager';
import DashboardLayout from './DashboardLayout';

interface DailySnapshotProps {
  onOpenChat: () => void;
}

export default function DailySnapshot({ onOpenChat }: DailySnapshotProps) {
  const {
    layouts,
    activeWidgets,
    currentPreset,
    isEditMode,
    handleLayoutChange,
    removeWidget,
  } = useLayoutManager();

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
        Enhanced Daily Snapshot - Grid Layout Test
      </h1>

      <DashboardLayout
        layouts={layouts}
        activeWidgets={activeWidgets}
        isEditMode={isEditMode}
        onLayoutChange={handleLayoutChange}
        onRemoveWidget={removeWidget}
        onOpenChat={onOpenChat}
      />
    </div>
  );
}
