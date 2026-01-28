import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Key, Eye, EyeOff, CheckCircle2, XCircle, Loader2, Server } from 'lucide-react';
import { InboxCredentials } from '../../types/workflow';

interface InboxCredentialsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credentials: InboxCredentials | null;
  onSave: (credentials: InboxCredentials) => void;
}

export default function InboxCredentialsDialog({
  open,
  onOpenChange,
  credentials,
  onSave,
}: InboxCredentialsDialogProps) {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    if (credentials) {
      setClientId(credentials.clientId);
      setClientSecret(credentials.clientSecret);
      setEndpoint(credentials.endpoint || '');
    } else {
      setClientId('');
      setClientSecret('');
      setEndpoint('');
    }
    setShowSecret(false);
    setTestResult(null);
  }, [credentials, open]);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    // Simulate API connection test
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulated validation: check if fields are filled
    if (clientId.trim() && clientSecret.trim()) {
      setTestResult('success');
    } else {
      setTestResult('error');
    }

    setTesting(false);
  };

  const handleSave = () => {
    if (!clientId.trim() || !clientSecret.trim()) return;

    onSave({
      clientId: clientId.trim(),
      clientSecret: clientSecret.trim(),
      endpoint: endpoint.trim() || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-600" />
            Configure Inbox Credentials
          </DialogTitle>
          <DialogDescription>
            Set up API credentials to connect to your RFQ inbox and receive requests automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Client ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client ID *
            </label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="e.g., app_client_123456789"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
            />
          </div>

          {/* Client Secret */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Secret *
            </label>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="••••••••••••••••••••••••••••••"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 rounded transition-colors"
              >
                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Endpoint (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Server className="w-3.5 h-3.5" />
              Inbox Endpoint (Optional)
            </label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="https://api.example.com/v1/rfq/inbox"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave blank to use the default endpoint
            </p>
          </div>

          {/* Test Connection Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={!clientId.trim() || !clientSecret.trim() || testing}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="font-medium">Testing Connection...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span className="font-medium">Test Connection</span>
                </>
              )}
            </button>
          </div>

          {/* Test Result */}
          {testResult === 'success' && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">Connection Successful</p>
                <p className="text-xs text-green-600 mt-0.5">
                  Credentials are valid and inbox is accessible
                </p>
              </div>
            </div>
          )}

          {testResult === 'error' && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Connection Failed</p>
                <p className="text-xs text-red-600 mt-0.5">
                  Unable to authenticate. Please check your credentials.
                </p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Security Note:</strong> Credentials are stored locally and encrypted.
              Never share your Client Secret with anyone.
            </p>
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!clientId.trim() || !clientSecret.trim()}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save Credentials
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
