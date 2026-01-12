import { X, Download, Check, Flag } from 'lucide-react';

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

interface PDFViewerModalProps {
  invoice: Invoice;
  onClose: () => void;
}

export default function PDFViewerModal({ invoice, onClose }: PDFViewerModalProps) {
  // Mock line items for the invoice
  const lineItems = [
    { description: 'Steel Sheets - 100 units', quantity: 100, unitPrice: 85, total: 8500 },
    { description: 'Assembly Brackets - 500 units', quantity: 500, unitPrice: 4.5, total: 2250 },
    { description: 'Fasteners Kit', quantity: 10, unitPrice: 165, total: 1650 },
  ];

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // Mock PO data for comparison
  const matchedPO = {
    poNumber: invoice.poNumber,
    lineItems: [
      { description: 'Steel Sheets - 100 units', quantity: 100, unitPrice: 85, total: 8500 },
      { description: 'Assembly Brackets - 500 units', quantity: 500, unitPrice: 4.5, total: 2250 },
      { description: 'Fasteners Kit', quantity: 10, unitPrice: 150, total: 1500 }, // Price mismatch here
    ],
  };

  const poSubtotal = matchedPO.lineItems.reduce((sum, item) => sum + item.total, 0);
  const poTax = poSubtotal * 0.08;
  const poTotal = poSubtotal + poTax;

  const hasPriceMismatch = invoice.flagReason === 'Price mismatch';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Invoice Review</h2>
            <p className="text-gray-600 mt-1">{invoice.invoiceNumber} - {invoice.vendor}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Side - PDF Viewer */}
          <div className="w-1/2 border-r border-gray-200 p-6 overflow-y-auto bg-gray-50">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-center mb-6">
                <div className="text-xs text-gray-500 mb-2">INVOICE</div>
                <div className="text-2xl font-bold text-gray-900">{invoice.invoiceNumber}</div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="text-xs text-gray-500 mb-2">FROM</div>
                  <div className="font-medium text-gray-900">{invoice.vendor}</div>
                  <div className="text-sm text-gray-600">123 Supplier Street</div>
                  <div className="text-sm text-gray-600">Industrial City, ST 12345</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-2">BILL TO</div>
                  <div className="font-medium text-gray-900">Your Company Name</div>
                  <div className="text-sm text-gray-600">456 Manufacturing Ave</div>
                  <div className="text-sm text-gray-600">Factory Town, ST 67890</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-gray-200">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Invoice Date</div>
                  <div className="text-sm font-medium text-gray-900">{invoice.dateReceived}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Due Date</div>
                  <div className="text-sm font-medium text-gray-900">2026-02-10</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">PO Number</div>
                  <div className="text-sm font-medium text-gray-900">{invoice.poNumber || 'N/A'}</div>
                </div>
              </div>

              <div className="mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-2 text-xs font-medium text-gray-700">DESCRIPTION</th>
                      <th className="text-right py-2 text-xs font-medium text-gray-700">QTY</th>
                      <th className="text-right py-2 text-xs font-medium text-gray-700">UNIT PRICE</th>
                      <th className="text-right py-2 text-xs font-medium text-gray-700">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-3 text-gray-900">{item.description}</td>
                        <td className="text-right text-gray-900">{item.quantity}</td>
                        <td className="text-right text-gray-900">${item.unitPrice.toFixed(2)}</td>
                        <td className="text-right text-gray-900">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (8%):</span>
                    <span className="text-gray-900 font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <span className="text-xs text-gray-500">Zoom controls: Use browser zoom (Cmd/Ctrl +/-)</span>
            </div>
          </div>

          {/* Right Side - Extracted Data */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Data & Validation</h3>

            {/* Status Alert */}
            {invoice.status === 'flagged' && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <div className="flex items-start gap-3">
                  <Flag className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-red-900">Flagged for Review</div>
                    <div className="text-sm text-red-700 mt-1">
                      Reason: {invoice.flagReason}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Invoice Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Invoice Information</h4>
              <dl className="space-y-2">
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-600">Invoice Number:</dt>
                  <dd className="font-medium text-gray-900">{invoice.invoiceNumber}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-600">Vendor:</dt>
                  <dd className="font-medium text-gray-900">{invoice.vendor}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-600">Invoice Date:</dt>
                  <dd className="font-medium text-gray-900">{invoice.dateReceived}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-600">Total Amount:</dt>
                  <dd className="font-medium text-gray-900">${total.toFixed(2)}</dd>
                </div>
              </dl>
            </div>

            {/* PO Matching */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Matched Purchase Order</h4>
              {invoice.poNumber ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">PO Found: {invoice.poNumber}</span>
                  </div>
                  <dl className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <dt className="text-gray-600">PO Total:</dt>
                      <dd className={`font-medium ${hasPriceMismatch ? 'text-red-600' : 'text-gray-900'}`}>
                        ${poTotal.toFixed(2)}
                        {hasPriceMismatch && ' ⚠️'}
                      </dd>
                    </div>
                    <div className="flex justify-between text-sm">
                      <dt className="text-gray-600">Invoice Total:</dt>
                      <dd className={`font-medium ${hasPriceMismatch ? 'text-red-600' : 'text-gray-900'}`}>
                        ${total.toFixed(2)}
                        {hasPriceMismatch && ' ⚠️'}
                      </dd>
                    </div>
                    {hasPriceMismatch && (
                      <div className="flex justify-between text-sm pt-2 border-t border-red-200">
                        <dt className="text-red-700 font-medium">Difference:</dt>
                        <dd className="font-medium text-red-700">
                          ${Math.abs(total - poTotal).toFixed(2)}
                        </dd>
                      </div>
                    )}
                  </dl>
                </>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <X className="w-4 h-4" />
                  <span className="text-sm font-medium">No matching PO found</span>
                </div>
              )}
            </div>

            {/* Line Item Comparison */}
            {hasPriceMismatch && invoice.poNumber && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-3">Line Item Comparison</h4>
                <div className="space-y-3">
                  {lineItems.map((item, index) => {
                    const poItem = matchedPO.lineItems[index];
                    const priceMismatch = item.unitPrice !== poItem?.unitPrice;
                    
                    return (
                      <div key={index} className={`p-3 rounded-lg ${priceMismatch ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                        <div className="text-sm font-medium text-gray-900 mb-2">{item.description}</div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <div className="text-gray-600 mb-1">Invoice</div>
                            <div className={priceMismatch ? 'text-red-700 font-medium' : 'text-gray-900'}>
                              {item.quantity} × ${item.unitPrice} = ${item.total}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-1">PO</div>
                            <div className={priceMismatch ? 'text-red-700 font-medium' : 'text-gray-900'}>
                              {poItem.quantity} × ${poItem.unitPrice} = ${poItem.total}
                            </div>
                          </div>
                        </div>
                        {priceMismatch && (
                          <div className="mt-2 text-xs text-red-700 font-medium">
                            ⚠️ Unit price mismatch: ${Math.abs(item.unitPrice - poItem.unitPrice).toFixed(2)} difference
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Processing Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Processing Information</h4>
              <dl className="space-y-2">
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-600">Date Received:</dt>
                  <dd className="font-medium text-gray-900">{invoice.dateReceived}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-600">Processing Time:</dt>
                  <dd className="font-medium text-gray-900">{invoice.processingTime}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-600">Status:</dt>
                  <dd className="font-medium text-gray-900 capitalize">{invoice.status.replace('-', ' ')}</dd>
                </div>
              </dl>
            </div>

            {/* Notes */}
            {invoice.status === 'flagged' && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Add Note</h4>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#2E5C8A] focus:border-transparent"
                  rows={3}
                  placeholder="Add a note about this invoice..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Confidence Score: <span className="font-medium text-gray-900">94%</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {invoice.status === 'flagged' && (
                <>
                  <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    Flag for AP Review
                  </button>
                  <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Approve Anyway
                  </button>
                </>
              )}
              {invoice.status === 'approved' && (
                <button className="px-6 py-2 bg-[#2E5C8A] text-white rounded-lg hover:bg-[#244A6E] transition-colors">
                  Post to ERP
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
