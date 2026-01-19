import { useState } from 'react';
import { Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DailySnapshot from './components/DailySnapshot/index';
import InvoiceAutomation from './components/InvoiceAutomation';
import POProcessing from './components/POProcessing';
import AIChatbot from './components/AIChatbot';
import ThreeWayMatching from './components/ThreeWayMatching';
import RFQToQuote from './components/RFQToQuote';

type TabType = 'daily-snapshot' | 'invoice-automation' | 'po-processing' | 'three-way-matching' | 'rfq-to-quote' | 'ai-chatbot';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('daily-snapshot');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'daily-snapshot', label: 'Daily Snapshot' },
    { id: 'invoice-automation', label: 'Invoice Automation' },
    { id: 'po-processing', label: 'PO Processing' },
    { id: 'three-way-matching', label: '3 Way Matching' },
    { id: 'rfq-to-quote', label: 'RFQ to Quote' },
    { id: 'ai-chatbot', label: 'AI Chatbot' },
  ];

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      x: 20,
      scale: 0.98
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: {
      opacity: 0,
      x: -20,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const renderTabContent = () => {
    const content = (() => {
      switch (activeTab) {
        case 'daily-snapshot':
          return <DailySnapshot />;
        case 'invoice-automation':
          return <InvoiceAutomation />;
        case 'po-processing':
          return <POProcessing />;
        case 'three-way-matching':
          return <ThreeWayMatching />;
        case 'rfq-to-quote':
          return <RFQToQuote />;
        case 'ai-chatbot':
          return <AIChatbot />;
        default:
          return null;
      }
    })();

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {content}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <img
                src="https://244666554.fs1.hubspotusercontent-na2.net/hubfs/244666554/413ecf10-8ec2-4899-929d-ca6e5e564e24.png"
                alt="Scalable AI Logo"
                className="w-10 h-10"
              />
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
                      : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
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
                <span className="text-sm text-green-600 font-medium">Synced 2 min ago</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-[#2E5C8A] to-[#3B6FA0] rounded-full flex items-center justify-center hover:opacity-90 transition-all cursor-pointer">
                  <span className="text-sm font-semibold text-white">JD</span>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-gray-500" />
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
    </div>
  );
}