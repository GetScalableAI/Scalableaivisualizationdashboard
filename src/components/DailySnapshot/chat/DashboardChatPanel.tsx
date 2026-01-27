// DashboardChatPanel - Slide-in chat UI integrated with dashboard
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Sparkles,
  MessageSquare,
  Bot,
  User,
  RefreshCw,
  Trash2,
  ChevronDown,
  Check,
  AlertCircle,
  Key,
  Settings,
  Play,
} from 'lucide-react';
import { useChatDashboard, Message, DashboardContext } from './useChatDashboard';

interface DashboardChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardContext: DashboardContext;
  onAddWidget: (widgetType: string) => void;
  onRemoveWidget: (widgetId: string) => void;
  onConfigureWidget?: (widgetId: string, config: Record<string, unknown>) => void;
  onOpenDrillDown: (widgetType: 'production' | 'oee' | 'scrap' | 'uptime') => void;
  onCloseDrillDown: () => void;
  onSaveReport: (name: string, description?: string) => void;
  onLoadReport: (reportId: string) => void;
  onSetFilter?: (filterType: string, value: string) => void;
}

const QUICK_PROMPTS = [
  { label: 'Add production chart', icon: '📊' },
  { label: 'Why is OEE low?', icon: '🔍' },
  { label: 'Show machine breakdown', icon: '🔧' },
  { label: 'Save current report', icon: '💾' },
];

export default function DashboardChatPanel({
  isOpen,
  onClose,
  dashboardContext,
  onAddWidget,
  onRemoveWidget,
  onConfigureWidget,
  onOpenDrillDown,
  onCloseDrillDown,
  onSaveReport,
  onLoadReport,
  onSetFilter,
}: DashboardChatPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    executeAction,
    retryLastMessage,
    isApiConfigured,
    setApiKey,
  } = useChatDashboard(dashboardContext, {
    onAddWidget,
    onRemoveWidget,
    onConfigureWidget,
    onOpenDrillDown,
    onCloseDrillDown,
    onSaveReport,
    onLoadReport,
    onSetFilter,
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue;
    setInputValue('');
    await sendMessage(message);
  };

  const handleQuickPrompt = async (prompt: string) => {
    setInputValue('');
    await sendMessage(prompt);
  };

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setApiKeyInput('');
      setShowSettings(false);
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';

    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-gradient-to-r from-blue-500 to-purple-500'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500'
          }`}
        >
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message content */}
        <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
          <div
            className={`inline-block max-w-[85%] px-4 py-2.5 rounded-2xl ${
              isUser
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-tr-sm'
                : 'bg-gray-100 text-gray-800 rounded-tl-sm'
            }`}
          >
            {message.isLoading ? (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-gray-500">Thinking...</span>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            )}
          </div>

          {/* Action indicator */}
          {message.action && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium"
            >
              {message.action.executed ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Action executed</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  <button
                    onClick={() => executeAction(message.action)}
                    className="hover:underline"
                  >
                    Execute action
                  </button>
                </>
              )}
            </motion.div>
          )}

          {/* Timestamp */}
          <p className="text-xs text-gray-400 mt-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </motion.div>
    );
  };

  // Blue theme colors matching other panels
  const colors = {
    panelBg: '#1a365d',
    headerBg: '#2c5282',
    contentBg: '#1e4976',
    cardBg: '#234e7a',
    accent: '#3b82f6',
    text: '#ffffff',
    textMuted: 'rgba(255, 255, 255, 0.7)',
    border: 'rgba(255, 255, 255, 0.1)',
    inputBg: 'rgba(255, 255, 255, 0.1)',
  };

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
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(4px)',
              zIndex: 40,
            }}
            onClick={onClose}
          />

          {/* Panel - Bottom Right Corner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              right: 24,
              bottom: 24,
              width: 420,
              height: 600,
              maxHeight: 'calc(100vh - 48px)',
              backgroundColor: colors.panelBg,
              borderRadius: 20,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                backgroundColor: colors.headerBg,
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    padding: 10,
                    backgroundColor: colors.accent,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles style={{ width: 20, height: 20, color: colors.text }} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: colors.text }}>
                    AI Assistant
                  </h2>
                  <p style={{ margin: 0, fontSize: 12, color: colors.textMuted }}>
                    Ask me about your data
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  title="Settings"
                  style={{
                    padding: 8,
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Settings style={{ width: 18, height: 18, color: colors.textMuted }} />
                </button>
                <button
                  onClick={clearMessages}
                  title="Clear chat"
                  style={{
                    padding: 8,
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Trash2 style={{ width: 18, height: 18, color: colors.textMuted }} />
                </button>
                <button
                  onClick={onClose}
                  style={{
                    padding: 8,
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X style={{ width: 18, height: 18, color: colors.textMuted }} />
                </button>
              </div>
            </div>

            {/* Settings panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ borderBottom: `1px solid ${colors.border}`, overflow: 'hidden' }}
                >
                  <div style={{ padding: 16, backgroundColor: colors.contentBg }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <Key style={{ width: 16, height: 16, color: colors.textMuted }} />
                      <span style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>API Configuration</span>
                    </div>

                    {isApiConfigured ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontSize: 14,
                          color: '#10b981',
                          backgroundColor: 'rgba(16, 185, 129, 0.15)',
                          padding: '8px 12px',
                          borderRadius: 8,
                        }}
                      >
                        <Check style={{ width: 16, height: 16 }} />
                        <span>API key configured</span>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>
                          Enter your OpenAI API key for enhanced responses.
                        </p>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input
                            type="password"
                            value={apiKeyInput}
                            onChange={(e) => setApiKeyInput(e.target.value)}
                            placeholder="sk-..."
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              fontSize: 14,
                              backgroundColor: colors.inputBg,
                              border: `1px solid ${colors.border}`,
                              borderRadius: 8,
                              color: colors.text,
                              outline: 'none',
                            }}
                          />
                          <button
                            onClick={handleSaveApiKey}
                            disabled={!apiKeyInput.trim()}
                            style={{
                              padding: '8px 16px',
                              fontSize: 14,
                              fontWeight: 500,
                              color: colors.text,
                              backgroundColor: colors.accent,
                              border: 'none',
                              borderRadius: 8,
                              cursor: apiKeyInput.trim() ? 'pointer' : 'not-allowed',
                              opacity: apiKeyInput.trim() ? 1 : 0.5,
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 16,
                backgroundColor: colors.contentBg,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {messages.length === 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    textAlign: 'center',
                    padding: '0 16px',
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <MessageSquare style={{ width: 32, height: 32, color: colors.accent }} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: colors.text, marginBottom: 8 }}>
                    How can I help you today?
                  </h3>
                  <p style={{ fontSize: 14, color: colors.textMuted, marginBottom: 24 }}>
                    Ask me to add widgets, analyze data, save reports, or explain metrics.
                  </p>

                  {/* Quick prompts */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%' }}>
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt.label}
                        onClick={() => handleQuickPrompt(prompt.label)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '10px 12px',
                          fontSize: 13,
                          color: colors.text,
                          backgroundColor: colors.cardBg,
                          border: 'none',
                          borderRadius: 10,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s',
                        }}
                      >
                        <span>{prompt.icon}</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {prompt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map(renderMessage)}
                  <div ref={messagesEndRef} />
                </>
              )}

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: 12,
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 10,
                    fontSize: 14,
                    color: '#fca5a5',
                  }}
                >
                  <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
                  <span>{error}</span>
                  <button
                    onClick={retryLastMessage}
                    style={{
                      marginLeft: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      color: '#fca5a5',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <RefreshCw style={{ width: 12, height: 12 }} />
                    Retry
                  </button>
                </motion.div>
              )}
            </div>

            {/* Scroll to bottom button */}
            {messages.length > 3 && (
              <button
                onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  position: 'absolute',
                  bottom: 100,
                  right: 16,
                  padding: 8,
                  backgroundColor: colors.cardBg,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  borderRadius: '50%',
                  border: `1px solid ${colors.border}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ChevronDown style={{ width: 20, height: 20, color: colors.text }} />
              </button>
            )}

            {/* Input */}
            <div
              style={{
                padding: 16,
                borderTop: `1px solid ${colors.border}`,
                backgroundColor: colors.headerBg,
              }}
            >
              <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about your dashboard..."
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    color: colors.text,
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
                <motion.button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: colors.accent,
                    color: colors.text,
                    border: 'none',
                    borderRadius: 12,
                    cursor: !inputValue.trim() || isLoading ? 'not-allowed' : 'pointer',
                    opacity: !inputValue.trim() || isLoading ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isLoading ? (
                    <RefreshCw style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <Send style={{ width: 20, height: 20 }} />
                  )}
                </motion.button>
              </form>

              <p style={{ fontSize: 11, color: colors.textMuted, marginTop: 8, textAlign: 'center' }}>
                {isApiConfigured
                  ? 'Powered by AI'
                  : 'Using basic pattern matching. Add API key for enhanced responses.'}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
