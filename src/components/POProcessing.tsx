import { useState } from 'react';
import { ShoppingCart, Clock, TrendingUp, Eye, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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
      'pending-approval': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Approval', icon: Clock },
      'approved': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Approved', icon: CheckCircle },
      'ordered': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Ordered', icon: ShoppingCart },
      'delivered': { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered', icon: CheckCircle },
      'delayed': { bg: 'bg-red-100', text: 'text-red-800', label: 'Delayed', icon: AlertTriangle },
    };
    
    const badge = badges[status];
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">PO Processing</h1>
          <div className="flex items-center gap-4">
            <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
              <option>This Month</option>
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
              <option>Custom</option>
            </select>
            <select 
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending-approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="ordered">Ordered</option>
              <option value="delivered">Delivered</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top Row - PO Metrics */}
      <div className="grid grid-cols-3 gap-6">
        {/* Card 1: Active POs */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
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
        </div>

        {/* Card 2: Processing Speed */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
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
        </div>

        {/* Card 3: Fulfillment Status */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
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
            <div className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full mt-2">
              ⚠ 5 critical POs at risk
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#2E5C8A] text-white rounded-lg hover:bg-[#244A6E] transition-colors text-sm">
            Create New PO
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            Export to CSV
          </button>
        </div>
        <button
          onClick={() => setShowCharts(!showCharts)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          {showCharts ? 'Show Table Only' : 'Show Charts'}
        </button>
      </div>

      {/* Main Section - PO Table or Charts */}
      {!showCharts ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">PO #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Requested By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Expected Delivery</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPOs.map((po) => (
                  <tr 
                    key={po.id} 
                    className={`hover:bg-gray-50 ${po.status === 'delayed' ? 'bg-red-50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-[#2E5C8A] hover:underline font-medium">
                        {po.poNumber}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{po.vendor}</td>
                    <td className="px-6 py-4 text-gray-600">{po.requestedBy}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      ${po.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(po.status)}
                    </td>
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedPO(po)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        {po.status === 'pending-approval' && (
                          <button className="p-1 hover:bg-gray-100 rounded" title="Approve">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {/* PO Volume by Supplier */}
          <div className="bg-white rounded-lg p-6 shadow-sm col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">PO Volume by Supplier</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={volumeBySupplier}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="supplier" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="count" fill="#2E5C8A" name="PO Count" />
                <Bar yAxisId="right" dataKey="value" fill="#10B981" name="Total Value ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* On-time vs Delayed Trend */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">On-time vs Delayed Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={deliveryTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="onTime" stackId="1" stroke="#10B981" fill="#10B981" name="On Time" />
                <Area type="monotone" dataKey="delayed" stackId="1" stroke="#EF4444" fill="#EF4444" name="Delayed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Average PO Value Over Time */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Average PO Value Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={avgValueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#2E5C8A" strokeWidth={2} name="Avg PO Value ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Right Sidebar - AI Assistant */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Ask about purchase orders...</h3>
        <input
          type="text"
          placeholder="e.g., 'Show me delayed POs from XYZ Supplier'"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5C8A] focus:border-transparent"
          onClick={onOpenChat}
          readOnly
        />
        <div className="flex flex-wrap gap-2 mt-3">
          <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200">
            What's causing delays this month?
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200">
            PO volume by department
          </button>
        </div>
      </div>

      {/* Simple PO Details Modal */}
      {selectedPO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Purchase Order Details</h2>
                <p className="text-gray-600">{selectedPO.poNumber}</p>
              </div>
              <button
                onClick={() => setSelectedPO(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
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

              <div className="border-t border-gray-200 pt-4 mt-4">
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

              <div className="border-t border-gray-200 pt-4 mt-4">
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

              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-[#2E5C8A] text-white rounded-lg hover:bg-[#244A6E]">
                  Download PDF
                </button>
                <button 
                  onClick={() => setSelectedPO(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
