import { useState } from 'react';
import { Settings, Database, MessageCircle } from 'lucide-react';
import DailySnapshot from './components/DailySnapshot';
import InvoiceAutomation from './components/InvoiceAutomation';
import POProcessing from './components/POProcessing';
import AIChatbot from './components/AIChatbot';
import FloatingChatWidget from './components/FloatingChatWidget';

type TabType = 'daily-snapshot' | 'invoice-automation' | 'po-processing' | 'ai-chatbot';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('daily-snapshot');
  const [showFloatingChat, setShowFloatingChat] = useState(false);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'daily-snapshot', label: 'Daily Snapshot' },
    { id: 'invoice-automation', label: 'Invoice Automation' },
    { id: 'po-processing', label: 'PO Processing' },
    { id: 'ai-chatbot', label: 'AI Chatbot' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'daily-snapshot':
        return <DailySnapshot onOpenChat={() => setShowFloatingChat(true)} />;
      case 'invoice-automation':
        return <InvoiceAutomation onOpenChat={() => setShowFloatingChat(true)} />;
      case 'po-processing':
        return <POProcessing onOpenChat={() => setShowFloatingChat(true)} />;
      case 'ai-chatbot':
        return <AIChatbot />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2E5C8A] to-[#3B6FA0] rounded-lg flex items-center justify-center shadow-md">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-semibold text-gray-900">Scalable AI</span>
                <div className="text-xs text-gray-500">Manufacturing Intelligence</div>
              </div>
            </div>

            {/* Center: Tab Navigation */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-lg transition-all font-medium text-sm ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#2E5C8A] to-[#3B6FA0] text-white shadow-md'
                      : 'text-gray-600 hover:bg-white hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right: ERP Sync + User Profile + Settings */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="text-sm text-green-700 font-medium">Synced 2 min ago</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center hover:from-gray-300 hover:to-gray-400 transition-all cursor-pointer">
                  <span className="text-sm font-semibold text-gray-700">JD</span>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {renderTabContent()}
      </main>

      {/* Floating Chat Widget (only on non-chatbot tabs) */}
      {activeTab !== 'ai-chatbot' && showFloatingChat && (
        <FloatingChatWidget 
          onClose={() => setShowFloatingChat(false)} 
          onOpenFullChat={() => setActiveTab('ai-chatbot')}
        />
      )}

      {/* Floating Chat Button (when widget is closed) */}
      {activeTab !== 'ai-chatbot' && !showFloatingChat && (
        <button
          onClick={() => setShowFloatingChat(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#2E5C8A] to-[#3B6FA0] text-white rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110 flex items-center justify-center z-40 animate-scaleIn group"
          title="Open AI Chat"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <div className="absolute inset-0 rounded-full bg-[#2E5C8A] opacity-0 group-hover:opacity-20 animate-pulse"></div>
        </button>
      )}
    </div>
  );
}