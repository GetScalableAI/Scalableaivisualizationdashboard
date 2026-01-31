import { useState } from 'react';
import { ShoppingCart, Clock, TrendingUp, Eye, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface POProcessingProps {
  onOpenChat: () => void;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  requestedBy: string;
  amount: number;
  status: 'pending-approval' | 'approved' | 'ordered' | 'delivered' | 'delayed';
  expectedDelivery: string;
  daysUntilDelivery: number;
}

export default function POProcessing({ onOpenChat }: POProcessingProps) {
  const [showCharts, setShowCharts] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  // Mock PO data
  const purchaseOrders: PurchaseOrder[] = [
    { id: '1', poNumber: 'PO-8945', vendor: 'Steel Suppliers Co', requestedBy: 'Manufacturing', amount: 24500, status: 'delayed', expectedDelivery: '2026-01-08', daysUntilDelivery: -3 },
    { id: '2', poNumber: 'PO-8946', vendor: 'Acme Corp', requestedBy: 'Operations', amount: 12800, status: 'ordered', expectedDelivery: '2026-01-15', daysUntilDelivery: 4 },
    { id: '3', poNumber: 'PO-8947', vendor: 'TechStart Inc', requestedBy: 'IT', amount: 8400, status: 'pending-approval', expectedDelivery: '2026-01-20', daysUntilDelivery: 9 },
    { id: '4', poNumber: 'PO-8948', vendor: 'Parts Plus', requestedBy: 'Maintenance', amount: 3200, status: 'delivered', expectedDelivery: '2026-01-10', daysUntilDelivery: -1 },
    { id: '5', poNumber: 'PO-8949', vendor: 'BuildRight LLC', requestedBy: 'Manufacturing', amount: 18900, status: 'ordered', expectedDelivery: '2026-01-14', daysUntilDelivery: 3 },
    { id: '6', poNumber: 'PO-8950', vendor: 'Industrial Tools', requestedBy: 'Manufacturing', amount: 15600, status: 'delayed', expectedDelivery: '2026-01-09', daysUntilDelivery: -2 },
    { id: '7', poNumber: 'PO-8951', vendor: 'Chemical Supplies', requestedBy: 'Quality', amount: 6700, status: 'delivered', expectedDelivery: '2026-01-11', daysUntilDelivery: 0 },
    { id: '8', poNumber: 'PO-8952', vendor: 'Steel Suppliers Co', requestedBy: 'Manufacturing', amount: 22100, status: 'approved', expectedDelivery: '2026-01-18', daysUntilDelivery: 7 },
  ];

  // Mock data for charts
  const volumeBySupplier = [
    { supplier: 'Steel Suppliers', count: 28, value: 486000 },
    { supplier: 'Acme Corp', count: 22, value: 342000 },
    { supplier: 'BuildRight LLC', count: 18, value: 298000 },
    { supplier: 'TechStart Inc', count: 15, value: 234000 },
    { supplier: 'Parts Plus', count: 12, value: 156000 },
  ];

  const deliveryTrend = [
    { week: 'Week 1', onTime: 45, delayed: 8 },
    { week: 'Week 2', onTime: 52, delayed: 12 },
    { week: 'Week 3', onTime: 48, delayed: 7 },
    { week: 'Week 4', onTime: 56, delayed: 11 },
  ];

  const avgValueTrend = [
    { month: 'Sep', value: 8200 },
    { month: 'Oct', value: 8900 },
    { month: 'Nov', value: 9400 },
    { month: 'Dec', value: 8700 },
    { month: 'Jan', value: 9800 },
  ];

  const filteredPOs = statusFilter === 'all'
    ? purchaseOrders
    : purchaseOrders.filter(po => po.status === statusFilter);

  const getStatusBadge = (status: PurchaseOrder['status']) => {
    const badges = {
      'pending-approval': {
        variant: 'secondary' as const,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Pending Approval',
        icon: Clock
      },
      'approved': {
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800 border-green-200',
        label: 'Approved',
        icon: CheckCircle
      },
      'ordered': {
        variant: 'default' as const,
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Ordered',
        icon: ShoppingCart
      },
      'delivered': {
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800 border-green-200',
        label: 'Delivered',
        icon: CheckCircle
      },
      'delayed': {
        variant: 'destructive' as const,
        className: '',
        label: 'Delayed',
        icon: AlertTriangle
      },
    };

    const badge = badges[status];
    const Icon = badge.icon;

    return (
      <Badge variant={badge.variant} className={badge.className}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">PO Processing</h1>
          <div className="flex items-center gap-4">
            <Select defaultValue="this-month">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                <SelectItem value="last-quarter">Last Quarter</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending-approval">Pending Approval</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="ordered">Ordered</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Top Row - PO Metrics */}
      <div className="grid grid-cols-3 gap-6">
        {/* Card 1: Active POs */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-gray-600 mb-2">Active POs</div>
                <div className="text-4xl font-medium text-gray-900">124</div>
                <div className="text-sm text-gray-600">open purchase orders</div>
              </div>
              <ShoppingCart className="w-8 h-8 text-[#2E5C8A]" />
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="text-lg font-medium text-gray-900 mb-3">$487,340</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">On time:</span>
                  <span className="font-medium text-green-600">89</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Delayed:</span>
                  <span className="font-medium text-red-600">35</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Processing Speed */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-gray-600 mb-2">Processing Speed</div>
                <div className="text-4xl font-medium text-green-600">2.1</div>
                <div className="text-sm text-gray-600">min avg PO creation</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                vs 15 min manual (est.)
              </div>
              <div className="text-lg font-medium text-gray-900 mt-2">8.7 hours</div>
              <div className="text-sm text-gray-600">saved this week</div>
              <div className="flex items-center gap-1 text-sm text-green-600 mt-2">
                <TrendingUp className="w-4 h-4" />
                <span>+18% efficiency gain</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Fulfillment Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-gray-600 mb-2">On-Time Delivery Rate</div>
                <div className="text-4xl font-medium text-yellow-600">72%</div>
                <div className="text-sm text-gray-600">this month</div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">On time:</span>
                <span className="font-medium text-green-600">89</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Delayed:</span>
                <span className="font-medium text-red-600">23</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Pending:</span>
                <span className="font-medium text-gray-900">12</span>
              </div>
              <Badge variant="destructive" className="mt-2">
                ⚠ 5 critical POs at risk
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button className="bg-[#2E5C8A] hover:bg-[#244A6E]">
            Create New PO
          </Button>
          <Button variant="outline">
            Export to CSV
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowCharts(!showCharts)}
        >
          {showCharts ? 'Show Table Only' : 'Show Charts'}
        </Button>
      </div>

      {/* Main Section - PO Table or Charts */}
      {!showCharts ? (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>PO #</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPOs.map((po) => (
                  <TableRow
                    key={po.id}
                    className={po.status === 'delayed' ? 'bg-red-50' : ''}
                  >
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="text-[#2E5C8A] p-0 h-auto font-medium"
                      >
                        {po.poNumber}
                      </Button>
                    </TableCell>
                    <TableCell className="text-gray-900">{po.vendor}</TableCell>
                    <TableCell className="text-gray-600">{po.requestedBy}</TableCell>
                    <TableCell className="text-gray-900 font-medium">
                      ${po.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(po.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{po.expectedDelivery}</div>
                      {po.daysUntilDelivery < 0 && (
                        <div className="text-xs text-red-600 font-medium">
                          {Math.abs(po.daysUntilDelivery)} days overdue
                        </div>
                      )}
                      {po.daysUntilDelivery > 0 && po.daysUntilDelivery <= 3 && (
                        <div className="text-xs text-yellow-600">
                          {po.daysUntilDelivery} days remaining
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedPO(po)}
                              >
                                <Eye className="w-4 h-4 text-gray-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        {po.status === 'pending-approval' && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Approve</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {/* PO Volume by Supplier */}
          <Card className="col-span-2">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">PO Volume by Supplier</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={volumeBySupplier}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="supplier" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="count" fill="#2E5C8A" name="PO Count" />
                  <Bar yAxisId="right" dataKey="value" fill="#10B981" name="Total Value ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* On-time vs Delayed Trend */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">On-time vs Delayed Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={deliveryTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Area type="monotone" dataKey="onTime" stackId="1" stroke="#10B981" fill="#10B981" name="On Time" />
                  <Area type="monotone" dataKey="delayed" stackId="1" stroke="#EF4444" fill="#EF4444" name="Delayed" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Average PO Value Over Time */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Average PO Value Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={avgValueTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#2E5C8A" strokeWidth={2} name="Avg PO Value ($)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Right Sidebar - AI Assistant */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Ask about purchase orders...</h3>
          <Input
            type="text"
            placeholder="e.g., 'Show me delayed POs from XYZ Supplier'"
            onClick={onOpenChat}
            readOnly
          />
          <div className="flex flex-wrap gap-2 mt-3">
            <Button variant="secondary" size="sm">
              What's causing delays this month?
            </Button>
            <Button variant="secondary" size="sm">
              PO volume by department
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* PO Details Dialog */}
      <Dialog open={!!selectedPO} onOpenChange={(open) => !open && setSelectedPO(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Purchase Order Details</DialogTitle>
            <DialogDescription>
              {selectedPO?.poNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedPO && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Vendor</div>
                  <div className="font-medium text-gray-900">{selectedPO.vendor}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Requested By</div>
                  <div className="font-medium text-gray-900">{selectedPO.requestedBy}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Amount</div>
                  <div className="font-medium text-gray-900">${selectedPO.amount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Status</div>
                  <div className="mt-1">{getStatusBadge(selectedPO.status)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Expected Delivery</div>
                  <div className="font-medium text-gray-900">{selectedPO.expectedDelivery}</div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Line Items</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Steel Sheets (100 units)</span>
                    <span className="font-medium">$15,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Assembly Parts (500 units)</span>
                    <span className="font-medium">$7,500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping & Handling</span>
                    <span className="font-medium">$2,000</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Approval Workflow</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Requested by {selectedPO.requestedBy} - Jan 8, 2026</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Approved by Manager - Jan 9, 2026</span>
                  </div>
                  {selectedPO.status === 'delivered' && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-600">Delivered - {selectedPO.expectedDelivery}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button className="bg-[#2E5C8A] hover:bg-[#244A6E]">
              Download PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedPO(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
