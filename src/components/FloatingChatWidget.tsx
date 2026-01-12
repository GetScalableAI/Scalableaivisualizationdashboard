import { useState } from 'react';
import { X, Send, MessageSquare, Maximize2, Minimize2 } from 'lucide-react';

interface FloatingChatWidgetProps {
  onClose: () => void;
  onOpenFullChat: () => void;
}

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
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 bg-[#2E5C8A] text-white px-4 py-3 rounded-full shadow-xl hover:bg-[#244A6E] transition-all hover:scale-105 flex items-center gap-2 z-50 animate-scaleIn"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="font-medium">AI Assistant</span>
        {messages.length > 0 && (
          <span className="bg-white text-[#2E5C8A] px-2 py-0.5 rounded-full text-xs font-semibold">
            {messages.filter(m => m.role === 'assistant').length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[420px] bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200 max-h-[650px] animate-slideUp">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-[#2E5C8A] to-[#3B6FA0] text-white rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold">AI Assistant</span>
            <div className="text-xs text-white/80">Ask me anything</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenFullChat}
            className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            title="Open full chat"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[350px] bg-gradient-to-b from-gray-50 to-white">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#2E5C8A] to-[#3B6FA0] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">How can I help you?</h3>
            <p className="text-sm text-gray-600 mb-4">Ask me about your manufacturing data, production metrics, or operations.</p>
            <div className="space-y-2 w-full">
              <button
                onClick={() => setInput('Why is OEE below target today?')}
                className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 hover:border-[#2E5C8A] transition-all text-left shadow-sm hover:shadow"
              >
                <div className="font-medium">Why is OEE below target today?</div>
                <div className="text-xs text-gray-500 mt-0.5">Analyze equipment effectiveness</div>
              </button>
              <button
                onClick={() => setInput('Show me delayed POs')}
                className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 hover:border-[#2E5C8A] transition-all text-left shadow-sm hover:shadow"
              >
                <div className="font-medium">Show me delayed POs</div>
                <div className="text-xs text-gray-500 mt-0.5">View purchase order status</div>
              </button>
              <button
                onClick={() => setInput('What caused the scrap rate increase?')}
                className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 hover:border-[#2E5C8A] transition-all text-left shadow-sm hover:shadow"
              >
                <div className="font-medium">What caused the scrap rate increase?</div>
                <div className="text-xs text-gray-500 mt-0.5">Quality metrics analysis</div>
              </button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-[#2E5C8A] to-[#3B6FA0] text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div className="text-center pt-2">
              <button
                onClick={onOpenFullChat}
                className="text-xs text-[#2E5C8A] hover:underline font-medium inline-flex items-center gap-1"
              >
                <Maximize2 className="w-3 h-3" />
                Open full chat for charts and detailed analysis
              </button>
            </div>
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white rounded-b-xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E5C8A] focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 bg-gradient-to-r from-[#2E5C8A] to-[#3B6FA0] text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <div className="flex-1 flex items-center gap-1 text-xs text-gray-500">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span>AI ready</span>
          </div>
          <span className="text-xs text-gray-400">Press Enter to send</span>
        </div>
      </div>
    </div>
  );
}
