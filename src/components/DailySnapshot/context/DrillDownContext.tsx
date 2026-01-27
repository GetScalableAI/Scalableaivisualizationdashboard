import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { DrillDownState, WidgetType, DrillDownLevel, DrillDownPath } from '../types/drillDown';

interface DrillDownContextType {
  state: DrillDownState;
  openDrillDown: (widgetType: WidgetType) => void;
  closeDrillDown: () => void;
  drillTo: (level: DrillDownLevel, label: string, id: string) => void;
  navigateToLevel: (levelIndex: number) => void;
  goBack: () => void;
}

const initialState: DrillDownState = {
  isOpen: false,
  widgetType: null,
  currentLevel: 1,
  path: [],
  selectedId: null,
};

const DrillDownContext = createContext<DrillDownContextType | undefined>(undefined);

export function DrillDownProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DrillDownState>(initialState);

  const openDrillDown = useCallback((widgetType: WidgetType) => {
    const levelLabels: Record<WidgetType, string> = {
      production: 'By Shift',
      oee: 'A/P/Q Breakdown',
      scrap: 'By Defect Type',
      uptime: 'By Machine',
    };

    setState({
      isOpen: true,
      widgetType,
      currentLevel: 1,
      path: [{
        level: 1,
        label: levelLabels[widgetType],
        id: 'level-1',
      }],
      selectedId: null,
    });
  }, []);

  const closeDrillDown = useCallback(() => {
    setState(initialState);
  }, []);

  const drillTo = useCallback((level: DrillDownLevel, label: string, id: string) => {
    setState((prev) => {
      // Keep path up to current level and add new level
      const newPath: DrillDownPath[] = [
        ...prev.path.slice(0, level - 1),
        { level, label, id },
      ];

      return {
        ...prev,
        currentLevel: level,
        path: newPath,
        selectedId: id,
      };
    });
  }, []);

  const navigateToLevel = useCallback((levelIndex: number) => {
    setState((prev) => {
      if (levelIndex >= prev.path.length) return prev;

      const newPath = prev.path.slice(0, levelIndex + 1);
      const targetLevel = newPath[levelIndex];

      return {
        ...prev,
        currentLevel: targetLevel.level,
        path: newPath,
        selectedId: targetLevel.id,
      };
    });
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      if (prev.currentLevel === 1) {
        return initialState;
      }

      const newPath = prev.path.slice(0, -1);
      const lastItem = newPath[newPath.length - 1];

      return {
        ...prev,
        currentLevel: (prev.currentLevel - 1) as DrillDownLevel,
        path: newPath,
        selectedId: lastItem?.id || null,
      };
    });
  }, []);

  return (
    <DrillDownContext.Provider
      value={{
        state,
        openDrillDown,
        closeDrillDown,
        drillTo,
        navigateToLevel,
        goBack,
      }}
    >
      {children}
    </DrillDownContext.Provider>
  );
}

export function useDrillDown() {
  const context = useContext(DrillDownContext);
  if (context === undefined) {
    throw new Error('useDrillDown must be used within a DrillDownProvider');
  }
  return context;
}

// Safe hook that returns defaults when used outside DrillDownProvider
// Use this in widgets that may be rendered in isolation (e.g., for preview or testing)
const defaultDrillDownContext: DrillDownContextType = {
  state: {
    isOpen: false,
    widgetType: null,
    currentLevel: 1,
    path: [],
    selectedId: null,
  },
  openDrillDown: () => {},
  closeDrillDown: () => {},
  drillTo: () => {},
  navigateToLevel: () => {},
  goBack: () => {},
};

export function useDrillDownSafe(): DrillDownContextType {
  const context = useContext(DrillDownContext);
  return context ?? defaultDrillDownContext;
}
