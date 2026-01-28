import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ClipboardCheck, Clock, Users, Plus, Trash2, Mail, Phone, User, Key, CheckCircle2, AlertCircle } from 'lucide-react';
import { WorkflowStep, TeamType, ContactInfo, InboxCredentials } from '../types/workflow';
import InboxCredentialsDialog from './dialogs/InboxCredentialsDialog';

interface StepConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step: WorkflowStep | null;
  onSave: (updates: Partial<WorkflowStep>) => void;
}

const TEAM_OPTIONS: TeamType[] = [
  'Engineering',
  'Procurement',
  'Finance',
  'Operations',
  'Quality',
  'Vendor',
];

const DURATION_PRESETS = [
  { label: '1 hour', value: 1 },
  { label: '4 hours', value: 4 },
  { label: '8 hours', value: 8 },
  { label: '24 hours', value: 24 },
  { label: '48 hours', value: 48 },
  { label: '72 hours', value: 72 },
];

const NOTIFICATION_TYPES = [
  { value: 'email', label: 'Email Only' },
  { value: 'sms', label: 'SMS Only' },
  { value: 'both', label: 'Email & SMS' },
];

export default function StepConfigDialog({
  open,
  onOpenChange,
  step,
  onSave,
}: StepConfigDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTeam, setAssignedTeam] = useState<TeamType>('Engineering');
  const [estimatedDuration, setEstimatedDuration] = useState(24);
  const [isRequired, setIsRequired] = useState(true);
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [notificationType, setNotificationType] = useState<'email' | 'sms' | 'both'>('email');
  const [inboxCredentials, setInboxCredentials] = useState<InboxCredentials | null>(null);
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);

  const isSendToUsersStep = name.toLowerCase().includes('send to user') || step?.id?.includes('send-to-users');
  const isRFQReceivedStep = name.toLowerCase().includes('rfq received') || step?.id?.includes('rfq-received');

  useEffect(() => {
    if (step) {
      setName(step.name);
      setDescription(step.description);
      setAssignedTeam(step.assignedTeam);
      setEstimatedDuration(step.estimatedDuration);
      setIsRequired(step.isRequired);
      setContacts(step.contacts || []);
      setNotificationType(step.notificationType || 'email');
      setInboxCredentials(step.inboxCredentials || null);
    } else {
      setName('');
      setDescription('');
      setAssignedTeam('Engineering');
      setEstimatedDuration(24);
      setIsRequired(true);
      setContacts([]);
      setNotificationType('email');
      setInboxCredentials(null);
    }
  }, [step, open]);

  const handleSave = () => {
    if (!name.trim()) return;

    const updates: Partial<WorkflowStep> = {
      name: name.trim(),
      description: description.trim(),
      assignedTeam,
      estimatedDuration,
      isRequired,
    };

    if (isSendToUsersStep) {
      updates.contacts = contacts;
      updates.notificationType = notificationType;
    }

    if (isRFQReceivedStep) {
      updates.inboxCredentials = inboxCredentials || undefined;
    }

    onSave(updates);
    onOpenChange(false);
  };

  const formatDuration = (hours: number) => {
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (remainingHours === 0) return `${days} day${days !== 1 ? 's' : ''}`;
    return `${days} day${days !== 1 ? 's' : ''} ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
  };

  const addContact = () => {
    setContacts([...contacts, { name: '', email: '', phone: '', role: '' }]);
  };

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const updateContact = (index: number, field: keyof ContactInfo, value: string) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: value };
    setContacts(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-blue-600" />
            Configure Step
          </DialogTitle>
          <DialogDescription>
            Set up the properties for this workflow step.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Step Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Engineering Review"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happens in this step..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Assigned Team */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Users className="w-4 h-4" />
              Assigned Team
            </label>
            <select
              value={assignedTeam}
              onChange={(e) => setAssignedTeam(e.target.value as TeamType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {TEAM_OPTIONS.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>

          {/* Estimated Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Estimated Duration
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {DURATION_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setEstimatedDuration(preset.value)}
                  className={`
                    px-3 py-1 text-sm rounded-full transition-colors
                    ${estimatedDuration === preset.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">hours ({formatDuration(estimatedDuration)})</span>
            </div>
          </div>

          {/* Inbox Credentials Section - only for RFQ Received step */}
          {isRFQReceivedStep && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Key className="w-4 h-4" />
                  Inbox API Credentials
                </label>
                <button
                  type="button"
                  onClick={() => setShowCredentialsDialog(true)}
                  className="flex items-center gap-1 px-2 py-1 text-sm text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  <Key className="w-4 h-4" />
                  {inboxCredentials ? 'Edit Credentials' : 'Configure Credentials'}
                </button>
              </div>

              {inboxCredentials ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800">Credentials Configured</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-green-600">Client ID:</span>
                          <code className="text-xs font-mono text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                            {inboxCredentials.clientId.substring(0, 20)}...
                          </code>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-green-600">Client Secret:</span>
                          <code className="text-xs font-mono text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                            ••••••••••••••••
                          </code>
                        </div>
                        {inboxCredentials.endpoint && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-green-600">Endpoint:</span>
                            <code className="text-xs font-mono text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                              {inboxCredentials.endpoint}
                            </code>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">No Credentials Configured</p>
                      <p className="text-xs text-amber-600 mt-1">
                        Click "Configure Credentials" to set up API access to your RFQ inbox.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                API credentials allow the workflow to automatically fetch RFQs from your inbox.
              </p>
            </div>
          )}

          {/* Contact Information Section - only for Send to Users step */}
          {isSendToUsersStep && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Contact Information
                </label>
                <button
                  type="button"
                  onClick={addContact}
                  className="flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Contact
                </button>
              </div>

              {contacts.length === 0 && (
                <div className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  No contacts added. Click "Add Contact" to add recipients.
                </div>
              )}

              <div className="space-y-3">
                {contacts.map((contact, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500">Contact #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeContact(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <User className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={contact.name}
                          onChange={(e) => updateContact(index, 'name', e.target.value)}
                          placeholder="Name"
                          className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={contact.email}
                          onChange={(e) => updateContact(index, 'email', e.target.value)}
                          placeholder="Email"
                          className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={contact.phone || ''}
                          onChange={(e) => updateContact(index, 'phone', e.target.value)}
                          placeholder="Phone (optional)"
                          className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <input
                        type="text"
                        value={contact.role || ''}
                        onChange={(e) => updateContact(index, 'role', e.target.value)}
                        placeholder="Role (optional)"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Notification Type */}
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Method
                </label>
                <div className="flex gap-2">
                  {NOTIFICATION_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setNotificationType(type.value as 'email' | 'sms' | 'both')}
                      className={`
                        flex-1 px-3 py-2 text-sm rounded-lg border transition-colors
                        ${notificationType === type.value
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Required checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isRequired"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isRequired" className="text-sm text-gray-700">
              This step is required (cannot be skipped)
            </label>
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
            disabled={!name.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save Step
          </button>
        </DialogFooter>
      </DialogContent>

      {/* Inbox Credentials Dialog */}
      <InboxCredentialsDialog
        open={showCredentialsDialog}
        onOpenChange={setShowCredentialsDialog}
        credentials={inboxCredentials}
        onSave={(credentials) => {
          setInboxCredentials(credentials);
          setShowCredentialsDialog(false);
        }}
      />
    </Dialog>
  );
}
