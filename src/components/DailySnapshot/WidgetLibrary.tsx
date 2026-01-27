import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Layout, TrendingUp, Award, DollarSign, Search, Filter, Check } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Widget } from './hooks/useLayoutManager';

interface WidgetLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  availableWidgets: Widget[];
  activeWidgets: string[];
  onAddWidget: (widgetId: string) => void;
  onRemoveWidget: (widgetId: string) => void;
}

const categoryIcons: { [key: string]: React.ElementType } = {
  metrics: Layout,
  charts: TrendingUp,
  analytics: Award,
  insights: DollarSign,
};

// Blue theme colors matching Controls panel
const colors = {
  panelBg: '#1a365d',
  headerBg: '#2c5282',
  contentBg: '#1e4976',
  cardBg: '#234e7a',
  cardHover: '#2d5a8a',
  accent: '#3b82f6',
  accentHover: '#2563eb',
  success: '#10b981',
  danger: '#ef4444',
  text: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.7)',
  textDim: 'rgba(255, 255, 255, 0.5)',
  border: 'rgba(255, 255, 255, 0.1)',
  inputBg: 'rgba(255, 255, 255, 0.1)',
};

export default function WidgetLibrary({
  isOpen,
  onClose,
  availableWidgets,
  activeWidgets,
  onAddWidget,
  onRemoveWidget,
}: WidgetLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = ['all'];
    availableWidgets.forEach(widget => {
      if (!cats.includes(widget.category)) {
        cats.push(widget.category);
      }
    });
    return cats;
  }, [availableWidgets]);

  const filteredWidgets = useMemo(() => {
    return availableWidgets.filter(widget => {
      const matchesSearch = widget.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || widget.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [availableWidgets, searchTerm, selectedCategory]);

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
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 40,
            }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              right: 20,
              top: 20,
              bottom: 20,
              width: 380,
              backgroundColor: colors.panelBg,
              borderRadius: 20,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              zIndex: 50,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                backgroundColor: colors.headerBg,
                padding: '24px',
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: colors.text, margin: 0 }}>
                  Widget Library
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X style={{ width: 20, height: 20, color: colors.text }} />
                </motion.button>
              </div>
              <p style={{ color: colors.textMuted, fontSize: 14, margin: 0 }}>
                Add or remove widgets from your dashboard
              </p>
            </div>

            {/* Search and Filter */}
            <div
              style={{
                padding: 16,
                borderBottom: `1px solid ${colors.border}`,
                backgroundColor: colors.contentBg,
              }}
            >
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <Search
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 18,
                    height: 18,
                    color: colors.textMuted,
                  }}
                />
                <input
                  type="text"
                  placeholder="Search widgets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: 40,
                    paddingRight: 16,
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 10,
                    color: colors.text,
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Category Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto' }}>
                <Filter style={{ width: 16, height: 16, color: colors.textMuted, flexShrink: 0 }} />
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: selectedCategory === category ? colors.accent : colors.cardBg,
                      color: colors.text,
                      transition: 'all 0.2s',
                    }}
                  >
                    {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Widget List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 16,
                backgroundColor: colors.contentBg,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filteredWidgets.map((widget) => {
                  const isActive = activeWidgets.includes(widget.id);
                  const Icon = categoryIcons[widget.category] || Layout;

                  return (
                    <motion.div
                      key={widget.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                      style={{
                        padding: 16,
                        borderRadius: 12,
                        backgroundColor: isActive ? 'rgba(16, 185, 129, 0.15)' : colors.cardBg,
                        border: `1px solid ${isActive ? colors.success : colors.border}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 10,
                              backgroundColor: colors.accent,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                            }}
                          >
                            <Icon style={{ width: 20, height: 20, color: colors.text }} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.text, margin: 0 }}>
                              {widget.title}
                            </h3>
                            <span style={{ fontSize: 12, color: colors.textMuted, textTransform: 'capitalize' }}>
                              {widget.category}
                            </span>
                          </div>
                        </div>

                        {isActive ? (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onRemoveWidget(widget.id)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: 'rgba(239, 68, 68, 0.2)',
                              color: '#fca5a5',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 500,
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                          >
                            Remove
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onAddWidget(widget.id)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: colors.accent,
                              color: colors.text,
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 500,
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              transition: 'all 0.2s',
                            }}
                          >
                            <Plus style={{ width: 12, height: 12 }} />
                            Add
                          </motion.button>
                        )}
                      </div>

                      {/* Widget Size Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 11, color: colors.textDim, marginTop: 8 }}>
                        <span>Default: {widget.defaultSize.w}×{widget.defaultSize.h}</span>
                        {widget.minW && <span>Min: {widget.minW}×{widget.minH}</span>}
                        {widget.maxW && <span>Max: {widget.maxW}×{widget.maxH}</span>}
                      </div>

                      {isActive && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, color: colors.success, fontSize: 12 }}>
                          <Check style={{ width: 14, height: 14 }} />
                          <span>Active on dashboard</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {filteredWidgets.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: colors.textMuted }}>
                    <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>No widgets found</p>
                    <p style={{ fontSize: 14 }}>Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: 16,
                borderTop: `1px solid ${colors.border}`,
                backgroundColor: colors.headerBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 14, color: colors.textMuted }}>
                {activeWidgets.length} of {availableWidgets.length} widgets active
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  backgroundColor: colors.accent,
                  color: colors.text,
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 14,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                }}
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
