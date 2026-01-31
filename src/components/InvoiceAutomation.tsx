import { useState } from 'react';
import { FileText, CheckCircle, AlertCircle, Clock, Eye, Check, Flag } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import PDFViewerModal from './PDFViewerModal';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface InvoiceAutomationProps {
  onOpenChat: () => void;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  vendor: string;
  amount: number;
  poNumber: string;
  dateReceived: string;
  processingTime: string;
  status: 'approved' | 'flagged' | 'processing';
  flagReason?: string;
}

export default function InvoiceAutomation({ onOpenChat }: InvoiceAutomationProps) {
  const [showCharts, setShowCharts] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock invoice data
  const invoices: Invoice[] = [
    { id: '1', invoiceNumber: 'INV-12847', vendor: 'Acme Corp', amount: 12450, poNumber: 'PO-8934', dateReceived: '2026-01-11', processingTime: '2.4 min', status: 'flagged', flagReason: 'Price mismatch' },
    { id: '2', invoiceNumber: 'INV-12848', vendor: 'BuildRight LLC', amount: 8200, poNumber: 'PO-8935', dateReceived: '2026-01-11', processingTime: '3.1 min', status: 'approved' },
    { id: '3', invoiceNumber: 'INV-12849', vendor: 'TechStart Inc', amount: 5670, poNumber: 'PO-8936', dateReceived: '2026-01-11', processingTime: '2.8 min', status: 'approved' },
    { id: '4', invoiceNumber: 'INV-12850', vendor: 'Parts Plus', amount: 3420, poNumber: '', dateReceived: '2026-01-10', processingTime: '4.2 min', status: 'flagged', flagReason: 'Missing PO' },
    { id: '5', invoiceNumber: 'INV-12851', vendor: 'Steel Suppliers Co', amount: 18900, poNumber: 'PO-8937', dateReceived: '2026-01-10', processingTime: '3.5 min', status: 'approved' },
    { id: '6', invoiceNumber: 'INV-12852', vendor: 'Acme Corp', amount: 6780, poNumber: 'PO-8938', dateReceived: '2026-01-10', processingTime: '2.9 min', status: 'approved' },
    { id: '7', invoiceNumber: 'INV-12853', vendor: 'Industrial Tools', amount: 4230, poNumber: 'PO-8939', dateReceived: '2026-01-09', processingTime: '3.3 min', status: 'flagged', flagReason: 'Price mismatch' },
    { id: '8', invoiceNumber: 'INV-12854', vendor: 'Chemical Supplies', amount: 9540, poNumber: 'PO-8940', dateReceived: '2026-01-09', processingTime: '2.7 min', status: 'approved' },
  ];

  // Mock data for charts
  const volumeByVendor = [
    { vendor: 'Acme Corp', count: 12 },
    { vendor: 'BuildRight LLC', count: 8 },
    { vendor: 'TechStart Inc', count: 7 },
    { vendor: 'Steel Suppliers', count: 6 },
    { vendor: 'Parts Plus', count: 5 },
  ];

  const exceptionTrend = [
    { week: 'Week 1', rate: 12.5 },
    { week: 'Week 2', rate: 14.2 },
    { week: 'Week 3', rate: 11.8 },
    { week: 'Week 4', rate: 10.6 },
  ];

  const filteredInvoices = statusFilter === 'all'
    ? invoices
    : invoices.filter(inv => inv.status === statusFilter);

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'flagged':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-600">Auto-Approved</Badge>;
      case 'flagged':
        return <Badge variant="destructive">Flagged</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Invoice Automation</h1>
            <div className="flex items-center gap-4">
              <Select defaultValue="this-week">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Top Row - Invoice Metrics */}
        <div className="grid grid-cols-3 gap-6">
          {/* Card 1: Invoices Processed */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-600 mb-2">Invoices Processed</div>
                  <div className="text-4xl font-medium text-gray-900">47</div>
                  <div className="text-sm text-gray-600">This week</div>
                </div>
                <FileText className="w-8 h-8 text-[#2E5C8A]" />
              </div>
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Auto-approved:</span>
                  <span className="font-medium text-green-600">42</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Flagged for review:</span>
                  <span className="font-medium text-red-600">5</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-3 pt-3 border-t border-gray-100">
                  <span className="text-gray-600">Avg processing time:</span>
                  <span className="font-medium text-gray-900">3.2 min</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Time Saved */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-600 mb-2">Time Saved</div>
                  <div className="text-4xl font-medium text-green-600">11.2</div>
                  <div className="text-sm text-gray-600">hours saved</div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  vs manual processing (est. 15 min/invoice)
                </div>
                <div className="text-lg font-medium text-gray-900 mt-2">$448</div>
                <div className="text-sm text-gray-600">in labor savings</div>
                <div className="flex items-center gap-1 text-sm text-green-600 mt-2">
                  <span>+23% vs last week</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Exception Rate */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-600 mb-2">Exception Rate</div>
                  <div className="text-4xl font-medium text-yellow-600">10.6%</div>
                  <div className="text-sm text-gray-600">5 of 47 flagged</div>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-700 mb-2">Common Reasons:</div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Price mismatch:</span>
                  <span className="font-medium text-gray-900">3</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Missing PO:</span>
                  <span className="font-medium text-gray-900">2</span>
                </div>
                <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-2">
                  Target: &lt;15%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button className="bg-[#2E5C8A] hover:bg-[#244A6E]">
              Approve Selected
            </Button>
            <Button variant="outline">
              Export Selected
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowCharts(!showCharts)}
          >
            {showCharts ? 'Show Table Only' : 'Show Charts'}
          </Button>
        </div>

        {/* Main Section - Invoice Table or Charts */}
        {!showCharts ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>PO #</TableHead>
                    <TableHead>Date Received</TableHead>
                    <TableHead>Processing Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow
                      key={invoice.id}
                      className={invoice.status === 'flagged' ? 'bg-yellow-50' : ''}
                    >
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(invoice.status)}
                          {invoice.status === 'flagged' && invoice.flagReason && (
                            <span className="text-xs text-red-600">({invoice.flagReason})</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          className="text-[#2E5C8A] p-0 h-auto font-medium"
                        >
                          {invoice.invoiceNumber}
                        </Button>
                      </TableCell>
                      <TableCell className="text-gray-900">{invoice.vendor}</TableCell>
                      <TableCell className="text-gray-900 font-medium">
                        ${invoice.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {invoice.poNumber ? (
                          <Button
                            variant="link"
                            className="text-[#2E5C8A] p-0 h-auto"
                          >
                            {invoice.poNumber}
                          </Button>
                        ) : (
                          <span className="text-red-600 text-sm">Missing</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">{invoice.dateReceived}</TableCell>
                      <TableCell className="text-gray-600 text-sm">{invoice.processingTime}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedInvoice(invoice)}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="w-4 h-4 text-gray-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View PDF</p>
                            </TooltipContent>
                          </Tooltip>
                          {invoice.status === 'flagged' && (
                            <>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Check className="w-4 h-4 text-green-600" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Approve</p>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Flag className="w-4 h-4 text-red-600" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Flag</p>
                                </TooltipContent>
                              </Tooltip>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {/* Invoice Volume by Vendor */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Volume by Vendor</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={volumeByVendor}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vendor" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="#2E5C8A" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Exception Rate Trend */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Exception Rate Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={exceptionTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="rate" stroke="#EAB308" strokeWidth={2} name="Exception Rate %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Right Sidebar - AI Assistant */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Ask about invoices...</h3>
          <Input
            type="text"
            placeholder="e.g., 'Show me all flagged invoices from Acme Corp'"
            onClick={onOpenChat}
            readOnly
            className="focus-visible:ring-[#2E5C8A]"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant="secondary"
              className="h-auto py-1 px-3 text-sm rounded-full"
            >
              Why was invoice #12847 flagged?
            </Button>
            <Button
              variant="secondary"
              className="h-auto py-1 px-3 text-sm rounded-full"
            >
              Compare invoice volume to last month
            </Button>
          </div>
        </div>

        {/* PDF Viewer Modal */}
        {selectedInvoice && (
          <PDFViewerModal
            invoice={selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
