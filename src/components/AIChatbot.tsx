import { useState } from 'react';
import { Send, BookOpen, Database, Star, Trash2, Download, PlusCircle, File, X, Book } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import PDFDragDrop from './PDFDragDrop';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TypingIndicator from './TypingIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [isTyping, setIsTyping] = useState(false);

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

  const handleSend = async () => {
    if (!input.trim() && !uploadedFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    let assistantMessage: Message;
    setIsTyping(true);

    if (mode === 'equipment-manuals') {
      try {
        const response = await fetch('https://joshuaross.app.n8n.cloud/webhook/124f389b-5c96-44f2-aa4b-0745281389b1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Query: currentInput }),
        });

        if (!response.ok) {
          throw new Error('Webhook response was not ok');
        }

        const data = await response.json();
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data[0]?.output || 'Sorry, I could not find an answer.',
        };
      } catch (error) {
        console.error('Webhook error:', error);
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, something went wrong while trying to get an answer.',
        };
      }
    } else {
      // Data queries mode (existing mock logic)
      if (currentInput.toLowerCase().includes('open pos') || currentInput.toLowerCase().includes('purchase order')) {
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
      } else if (currentInput.toLowerCase().includes('oee') || currentInput.toLowerCase().includes('equipment')) {
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
      } else if (currentInput.toLowerCase().includes('scrap')) {
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
    }

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
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
              <RechartsTooltip />
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
              <RechartsTooltip />
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
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            Export as PNG
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <PlusCircle className="w-3 h-3" />
            Add to Dashboard
          </Button>
          <Select defaultValue="bar">
            <SelectTrigger className="w-[130px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
              <SelectItem value="table">Table View</SelectItem>
            </SelectContent>
          </Select>
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
    <TooltipProvider>
      <div className="flex gap-6 h-[calc(100vh-140px)]">
        {/* Left Sidebar */}
        <Card className="w-80 flex flex-col">
          <CardContent className="flex-1 flex flex-col p-4">
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6">
              <Button
                onClick={() => setMode('data-queries')}
                variant={mode === 'data-queries' ? 'default' : 'outline'}
                className={mode === 'data-queries' ? 'bg-[#2E5C8A] hover:bg-[#244A6E] text-white flex-1' : 'flex-1'}
              >
                <Database className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Data Queries</span>
              </Button>
              <Button
                onClick={() => setMode('equipment-manuals')}
                variant={mode === 'equipment-manuals' ? 'default' : 'outline'}
                className={mode === 'equipment-manuals' ? 'bg-[#2E5C8A] hover:bg-[#244A6E] text-white flex-1' : 'flex-1'}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Parts Lookup</span>
              </Button>
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={handleRemoveFile} variant="ghost" size="icon" className="h-6 w-6">
                          <X className="w-4 h-4 text-gray-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove file</p>
                      </TooltipContent>
                    </Tooltip>
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Trash2 className="w-3 h-3 text-gray-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete manual</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator className="mb-4" />

            {/* Recent Conversations */}
            <ScrollArea className="flex-1">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Conversations</h3>
              <div className="space-y-2">
                {conversationHistory.map((conv) => (
                  <Button
                    key={conv.id}
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <div className="text-left">
                      <div className="text-sm text-gray-900">{conv.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{conv.timestamp}</div>
                    </div>
                  </Button>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Saved Queries */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Saved Queries</h3>
                <div className="space-y-2">
                  {savedQueries.map((query, index) => (
                    <Button
                      key={index}
                      onClick={() => setInput(query)}
                      variant="ghost"
                      className="w-full justify-between"
                    >
                      <span className="text-sm text-gray-900">{query}</span>
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    </Button>
                  ))}
                </div>
              </div>
            </ScrollArea>

            <Separator className="my-4" />

            {/* Clear Chat */}
            <Button variant="outline" className="w-full">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Chat
            </Button>
          </CardContent>
        </Card>

        {/* Main Chat Area */}
        <Card className="flex-1 flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'data-queries' ? 'Manufacturing Data Assistant' : 'Scalable Parts Lookup Chatbot'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {mode === 'data-queries'
                ? 'Ask questions about your production, invoices, and purchase orders'
                : 'Search for parts, check inventory, and create orders'
              }
            </p>
          </CardHeader>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6">
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
                    <Button
                      key={index}
                      onClick={() => setInput(query)}
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                    >
                      {query}
                    </Button>
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
                      {message.role === 'assistant' && (
                        <div className="flex items-center mb-2">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage
                              src="https://244666554.fs1.hubspotusercontent-na2.net/hubfs/244666554/413ecf10-8ec2-4899-929d-ca6e5e564e24.png"
                              alt="Scalable AI Logo"
                            />
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                          <span className="font-semibold">Scalable AI</span>
                        </div>
                      )}
                      <div
                        className={`prose rounded-lg px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-[#2E5C8A] text-white prose-invert'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
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
                        <div className="mt-2">
                          <Button variant="link" size="sm" className="text-xs p-0 h-auto">
                            📄 Source: <Badge variant="outline" className="ml-1">{message.source}</Badge>
                          </Button>
                        </div>
                      )}
                      {message.role === 'assistant' && message.chart && (
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm">
                            View PO Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Ask Follow-up
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-3xl mr-12">
                      <div className="bg-gray-100 rounded-lg px-4 py-3">
                        <TypingIndicator />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <CardContent className="border-t p-4">
            <div className="flex gap-3">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={
                  mode === 'data-queries'
                    ? 'Ask about your manufacturing data...'
                    : 'Ask about equipment or processes...'
                }
                className="h-11"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() && !uploadedFile}
                className="bg-[#2E5C8A] hover:bg-[#244A6E]"
              >
                <Send className="w-4 h-4 mr-2" />
                <span>Send</span>
              </Button>
            </div>
            {mode === 'data-queries' && (
              <div className="flex flex-wrap gap-2 mt-3">
                {suggestedQueries.slice(0, 4).map((query, index) => (
                  <Button
                    key={index}
                    onClick={() => setInput(query)}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    {query}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
