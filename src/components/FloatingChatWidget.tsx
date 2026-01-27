import { useState } from 'react';
import { X, Send, MessageSquare, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingChatWidgetProps {
  onClose: () => void;
  onOpenFullChat: () => void;
}

// Blue theme colors matching other panels
const colors = {
  panelBg: '#1a365d',
  headerBg: '#2c5282',
  contentBg: '#1e4976',
  cardBg: '#234e7a',
  accent: '#3b82f6',
  text: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.7)',
  textDim: 'rgba(255, 255, 255, 0.5)',
  border: 'rgba(255, 255, 255, 0.1)',
  inputBg: 'rgba(255, 255, 255, 0.1)',
};

export default function FloatingChatWidget({ onClose, onOpenFullChat }: FloatingChatWidgetProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    const assistantMessage = {
      role: 'assistant' as const,
      content: `I can help you analyze that data. ${
        input.toLowerCase().includes('oee')
          ? 'Your OEE is currently at 78.3%, which is 1.7% below the 80% target. The main factors are: reduced availability due to unplanned downtime on CNC-03 (1.2 hrs) and performance losses during shift changeover.'
          : input.toLowerCase().includes('scrap')
          ? 'Your scrap rate today is 2.1% ($4,230), primarily driven by Product Line B with dimensional issues. This is still below the 2.5% target but up 0.8% from last week.'
          : input.toLowerCase().includes('delayed') || input.toLowerCase().includes('po')
          ? 'You have 35 delayed POs totaling $156,800. The top 3 suppliers with delays are: Steel Suppliers Co (8 POs), Industrial Tools (5 POs), and Parts Plus (4 POs).'
          : 'I found relevant data for your query. For detailed visualizations and deeper analysis, click "Open full chat" below.'
      }`,
    };

    setMessages([...messages, userMessage, assistantMessage]);
    setInput('');
  };

  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => setIsMinimized(false)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: colors.headerBg,
          color: colors.text,
          padding: '12px 20px',
          borderRadius: 50,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          zIndex: 50,
        }}
      >
        <MessageSquare style={{ width: 20, height: 20 }} />
        <span style={{ fontWeight: 500 }}>AI Assistant</span>
        {messages.length > 0 && (
          <span
            style={{
              backgroundColor: colors.accent,
              color: colors.text,
              padding: '2px 8px',
              borderRadius: 50,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {messages.filter(m => m.role === 'assistant').length}
          </span>
        )}
      </motion.button>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 420,
          backgroundColor: colors.panelBg,
          borderRadius: 20,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          maxHeight: 600,
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
                width: 40,
                height: 40,
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
              <div style={{ fontWeight: 600, color: colors.text, fontSize: 16 }}>AI Assistant</div>
              <div style={{ fontSize: 12, color: colors.textMuted }}>Ask me anything</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              onClick={() => setIsMinimized(true)}
              title="Minimize"
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
              <Minimize2 style={{ width: 18, height: 18, color: colors.textMuted }} />
            </button>
            <button
              onClick={onOpenFullChat}
              title="Open full chat"
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
              <Maximize2 style={{ width: 18, height: 18, color: colors.textMuted }} />
            </button>
            <button
              onClick={onClose}
              title="Close"
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

        {/* Messages Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 16,
            backgroundColor: colors.contentBg,
            minHeight: 350,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {messages.length === 0 ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '0 16px',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <MessageSquare style={{ width: 32, height: 32, color: colors.accent }} />
              </div>
              <h3 style={{ fontWeight: 600, color: colors.text, marginBottom: 8, fontSize: 18 }}>
                How can I help you?
              </h3>
              <p style={{ fontSize: 14, color: colors.textMuted, marginBottom: 20 }}>
                Ask me about your manufacturing data, production metrics, or operations.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                <button
                  onClick={() => setInput('Why is OEE below target today?')}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                    fontSize: 14,
                    borderRadius: 12,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontWeight: 500 }}>Why is OEE below target today?</div>
                  <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>
                    Analyze equipment effectiveness
                  </div>
                </button>
                <button
                  onClick={() => setInput('Show me delayed POs')}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                    fontSize: 14,
                    borderRadius: 12,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontWeight: 500 }}>Show me delayed POs</div>
                  <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>
                    View purchase order status
                  </div>
                </button>
                <button
                  onClick={() => setInput('What caused the scrap rate increase?')}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                    fontSize: 14,
                    borderRadius: 12,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontWeight: 500 }}>What caused the scrap rate increase?</div>
                  <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>
                    Quality metrics analysis
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '85%',
                      borderRadius: 16,
                      padding: '10px 16px',
                      fontSize: 14,
                      backgroundColor: message.role === 'user' ? colors.accent : colors.cardBg,
                      color: colors.text,
                      borderTopRightRadius: message.role === 'user' ? 4 : 16,
                      borderTopLeftRadius: message.role === 'user' ? 16 : 4,
                    }}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              <div style={{ textAlign: 'center', paddingTop: 8 }}>
                <button
                  onClick={onOpenFullChat}
                  style={{
                    fontSize: 12,
                    color: colors.accent,
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Maximize2 style={{ width: 12, height: 12 }} />
                  Open full chat for charts and detailed analysis
                </button>
              </div>
            </>
          )}
        </div>

        {/* Input Area */}
        <div
          style={{
            borderTop: `1px solid ${colors.border}`,
            padding: 16,
            backgroundColor: colors.headerBg,
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
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
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              style={{
                padding: '12px 16px',
                backgroundColor: colors.accent,
                color: colors.text,
                border: 'none',
                borderRadius: 12,
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                opacity: input.trim() ? 1 : 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Send style={{ width: 18, height: 18 }} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: colors.textMuted }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                }}
              />
              <span>AI ready</span>
            </div>
            <span style={{ fontSize: 11, color: colors.textDim }}>Press Enter to send</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
