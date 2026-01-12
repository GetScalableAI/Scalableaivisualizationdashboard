import { useState } from 'react';
import { Send, BookOpen, Database, Star, Trash2, Download, PlusCircle, File, X, Book } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import PDFDragDrop from './PDFDragDrop';

type ChatMode = 'data-queries' | 'equipment-manuals';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  chart?: {
    type: 'bar' | 'line' | 'pie' | 'table';
    data: any[];
    title: string;
  };
  insight?: string;
  source?: string;
}

export default function AIChatbot() {
  const [mode, setMode] = useState<ChatMode>('data-queries');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileDrop = (file: File) => {
    setUploadedFile(file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  // Mock conversation history
  const conversationHistory = [
    { id: '1', title: 'OEE Analysis by Shift', timestamp: '2 hours ago' },
    { id: '2', title: 'Delayed POs by Supplier', timestamp: 'Yesterday' },
    { id: '3', title: 'Scrap Rate Trends', timestamp: '2 days ago' },
  ];

  // Mock saved queries
  const savedQueries = [
    'Show open POs by supplier',
    'Weekly OEE comparison',
    'Top 5 quality issues',
  ];

  const manuals = [
    '024-Nitrogen-Catalog-9800c04600024.pdf',
    '2023_1091-SpecSpring-Conv Guide Trifold_03.indd',
    '2021_312-DieSpring Comparison 8pg_5.indd',
  ];

  // Sample chart data for demo responses
  const sampleChartData = {
    posBySupplier: [
      { supplier: 'ABC Supplier', count: 34, value: 142500 },
      { supplier: 'XYZ Corp', count: 28, value: 98300 },
      { supplier: 'Tech Parts Inc', count: 22, value: 76200 },
      { supplier: 'Industrial Co', count: 18, value: 54800 },
      { supplier: 'BuildRight', count: 15, value: 43900 },
    ],
    oeeComparison: [
      { week: 'Week 1', thisMonth: 78, lastMonth: 74 },
      { week: 'Week 2', thisMonth: 81, lastMonth: 76 },
      { week: 'Week 3', thisMonth: 79, lastMonth: 77 },
      { week: 'Week 4', thisMonth: 83, lastMonth: 75 },
    ],
    scrapRate: [
      { product: 'Product A', rate: 1.2 },
      { product: 'Product B', rate: 3.8 },
      { product: 'Product C', rate: 0.9 },
      { product: 'Product D', rate: 2.4 },
      { product: 'Product E', rate: 1.6 },
    ],
  };

  const handleSend = () => {
    if (!input.trim() && !uploadedFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    // Simulate AI response based on mode and input
    let assistantMessage: Message;

    if (mode === 'data-queries') {
      if (input.toLowerCase().includes('open pos') || input.toLowerCase().includes('purchase order')) {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Here are your open purchase orders grouped by supplier:',
          chart: {
            type: 'bar',
            data: sampleChartData.posBySupplier,
            title: 'Open POs by Supplier',
          },
          insight: 'ABC Supplier has the most open POs (34) totaling $142,500. 8 of these are past their expected delivery date.',
        };
      } else if (input.toLowerCase().includes('oee') || input.toLowerCase().includes('equipment')) {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Here\'s a comparison of this week\'s OEE to last month:',
          chart: {
            type: 'line',
            data: sampleChartData.oeeComparison,
            title: 'OEE Comparison: This Month vs Last Month',
          },
          insight: 'OEE has improved by an average of 5.2% compared to last month, with the strongest performance in Week 4 (83%).',
        };
      } else if (input.toLowerCase().includes('scrap')) {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Here are the products with the highest scrap rates:',
          chart: {
            type: 'bar',
            data: sampleChartData.scrapRate,
            title: 'Scrap Rate by Product',
          },
          insight: 'Product B has the highest scrap rate at 3.8%, which is 51% above the company target of 2.5%. This accounts for approximately $8,400 in losses this month.',
        };
      } else {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I can help you analyze your manufacturing data. Here are some things you can ask me about:

• Production metrics (OEE, uptime, output)
• Purchase orders and invoice status
• Quality metrics and scrap rates
• Supplier performance
• Cost analysis and trends

Try asking something like "Show me open POs by supplier" or "Compare this week's OEE to last month".`,
        };
      }
    } else {
      // Equipment manuals mode
      if (uploadedFile) {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I have received the file "${uploadedFile.name}". I am now ready to answer your questions about it.`,
        };
      } else {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `To calibrate Machine #47, follow these steps:

1. Power down the machine completely and wait 2 minutes
2. Access the calibration menu using the control panel (Settings > Maintenance > Calibration)
3. Follow the on-screen prompts to calibrate each axis
4. Test the calibration with a sample part before resuming production

**Important:** Only certified technicians should perform calibration procedures.`,
          source: 'Machine #47 Manual, Page 23',
        };
      }
    }

    setMessages([...messages, userMessage, assistantMessage]);
    setInput('');
  };

  const renderChart = (chart: Message['chart']) => {
    if (!chart) return null;

    const COLORS = ['#2E5C8A', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    return (
      <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">{chart.title}</h4>
        <ResponsiveContainer width="100%" height={300}>
          {chart.type === 'bar' && (
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={Object.keys(chart.data[0])[0]} angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(chart.data[0]).filter(key => key !== Object.keys(chart.data[0])[0]).map((key, index) => (
                <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} name={key.charAt(0).toUpperCase() + key.slice(1)} />
              ))}
            </BarChart>
          )}
          {chart.type === 'line' && (
            <LineChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={Object.keys(chart.data[0])[0]} />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(chart.data[0]).filter(key => key !== Object.keys(chart.data[0])[0]).map((key, index) => (
                <Line 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={COLORS[index % COLORS.length]} 
                  strokeWidth={2} 
                  name={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
        <div className="flex items-center gap-2 mt-4">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1">
            <Download className="w-3 h-3" />
            Export as PNG
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1">
            <PlusCircle className="w-3 h-3" />
            Add to Dashboard
          </button>
          <select className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
            <option>Bar Chart</option>
            <option>Line Chart</option>
            <option>Pie Chart</option>
            <option>Table View</option>
          </select>
        </div>
      </div>
    );
  };

  const suggestedQueries = mode === 'data-queries' 
    ? [
        'Show open POs by supplier',
        'Compare this week\'s OEE to last month',
        'Which products have highest scrap rate?',
        'Invoice approval rate by vendor',
      ]
    : [
        'How do I calibrate Machine #47?',
        'What\'s the maintenance schedule for CNC lathe?',
        'Troubleshoot conveyor belt jam',
        'Safety procedures for press operations',
      ];

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)]">
      {/* Left Sidebar */}
      <div className="w-80 bg-white rounded-lg shadow-sm p-4 flex flex-col">
        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('data-queries')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
              mode === 'data-queries'
                ? 'bg-[#2E5C8A] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span className="text-sm font-medium">Data Queries</span>
          </button>
          <button
            onClick={() => setMode('equipment-manuals')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
              mode === 'equipment-manuals'
                ? 'bg-[#2E5C8A] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">Parts Lookup</span>
          </button>
        </div>

        {/* Add Manuals Dropzone */}
        {mode === 'equipment-manuals' && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Add Manuals</h3>
            {!uploadedFile ? (
              <PDFDragDrop onFileDrop={handleFileDrop} />
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-2">
                  <File className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-700 truncate">{uploadedFile.name}</span>
                </div>
                <button onClick={handleRemoveFile} className="p-1 hover:bg-gray-200 rounded-full">
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Manuals List */}
        {mode === 'equipment-manuals' && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Available Manuals</h3>
            <div className="space-y-2">
              {manuals.map((manual, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <File className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 truncate">{manual}</span>
                  </div>
                  <button className="p-1 hover:bg-gray-200 rounded-full">
                    <Trash2 className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Conversations */}
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Conversations</h3>
          <div className="space-y-2">
            {conversationHistory.map((conv) => (
              <button
                key={conv.id}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="text-sm text-gray-900">{conv.title}</div>
                <div className="text-xs text-gray-500 mt-1">{conv.timestamp}</div>
              </button>
            ))}
          </div>

          {/* Saved Queries */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Saved Queries</h3>
            <div className="space-y-2">
              {savedQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => setInput(query)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between group"
                >
                  <span className="text-sm text-gray-900">{query}</span>
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clear Chat */}
        <button className="mt-4 w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2">
          <Trash2 className="w-4 h-4" />
          Clear Chat
        </button>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'data-queries' ? 'Manufacturing Data Assistant' : 'Parts Lookup Chatbot'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {mode === 'data-queries' 
              ? 'Ask questions about your production, invoices, and purchase orders'
              : 'Search for parts, check inventory, and create orders'
            }
          </p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-[#2E5C8A] rounded-full flex items-center justify-center mb-4">
                {mode === 'data-queries' ? (
                  <Database className="w-10 h-10 text-white" />
                ) : (
                  <Book className="w-10 h-10 text-white" />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {mode === 'data-queries' ? 'Ask about your manufacturing data' : 'Parts Lookup Chatbot'}
              </h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                {mode === 'data-queries'
                  ? 'Get instant insights from your production data, invoices, and purchase orders with AI-powered analysis.'
                  : 'Search for parts, check inventory, and create orders using natural language.'
                }
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
                {suggestedQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(query)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-3xl ${message.role === 'user' ? 'ml-12' : 'mr-12'}`}>
                    <div
                      className={`rounded-lg px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-[#2E5C8A] text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.chart && renderChart(message.chart)}
                    {message.insight && (
                      <div className="mt-3 p-4 bg-blue-50 border-l-4 border-[#2E5C8A] rounded">
                        <div className="flex items-start gap-2">
                          <span className="text-sm font-medium text-[#2E5C8A]">💡 Insight:</span>
                          <p className="text-sm text-gray-700">{message.insight}</p>
                        </div>
                      </div>
                    )}
                    {message.source && (
                      <div className="mt-2 text-xs text-gray-600">
                        <button className="hover:underline">📄 Source: {message.source}</button>
                      </div>
                    )}
                    {message.role === 'assistant' && message.chart && (
                      <div className="flex gap-2 mt-3">
                        <button className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50">
                          View PO Details
                        </button>
                        <button className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50">
                          Ask Follow-up
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={
                mode === 'data-queries'
                  ? 'Ask about your manufacturing data...'
                  : 'Ask about equipment or processes...'
              }
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5C8A] focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() && !uploadedFile}
              className="px-6 py-3 bg-[#2E5C8A] text-white rounded-lg hover:bg-[#244A6E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
          {mode === 'data-queries' && (
            <div className="flex flex-wrap gap-2 mt-3">
              {suggestedQueries.slice(0, 4).map((query, index) => (
                <button
                  key={index}
                  onClick={() => setInput(query)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200"
                >
                  {query}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
