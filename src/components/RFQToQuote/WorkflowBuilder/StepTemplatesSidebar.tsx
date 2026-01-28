import { useDraggable } from '@dnd-kit/core';
import {
  ClipboardCheck,
  DollarSign,
  Shield,
  Send,
  UserCheck,
  Bell,
  GitBranch,
  BarChart2,
  Package,
  AlertTriangle,
  Users,
  Building,
  Ruler,
  Layers,
  Clock,
  Target,
  Gauge,
  FileText,
  Inbox,
  Filter,
  TrendingUp,
  Network,
} from 'lucide-react';
import { StepTemplate, ConditionTemplate, TeamType } from '../types/workflow';

// Template types for new node types
export interface StackedFilterTemplate {
  id: string;
  name: string;
  icon: typeof Filter;
  category: 'filter';
  defaultDescription?: string;
}

export interface SortTemplate {
  id: string;
  name: string;
  icon: typeof TrendingUp;
  category: 'sort';
  defaultDescription?: string;
}

export interface DistributeTemplate {
  id: string;
  name: string;
  icon: typeof Network;
  category: 'distribute';
  defaultDescription?: string;
}

// Predefined step templates
export const STEP_TEMPLATES: StepTemplate[] = [
  {
    id: 'rfq-received',
    name: 'RFQ Received',
    icon: Inbox,
    category: 'processing',
    defaultTeam: 'Procurement',
    defaultDuration: 0,
    defaultDescription: 'Starting point - RFQ has been received and logged into the system',
    isStartNode: true,
  },
  {
    id: 'send-to-users',
    name: 'Send to Users',
    icon: Users,
    category: 'notification',
    defaultTeam: 'Procurement',
    defaultDuration: 1,
    defaultDescription: 'Send RFQ details to specified users for review or action',
  },
  {
    id: 'eng-review',
    name: 'Engineering Review',
    icon: ClipboardCheck,
    category: 'review',
    defaultTeam: 'Engineering',
    defaultDuration: 24,
    defaultDescription: 'Technical review of requirements and specifications',
  },
  {
    id: 'finance-approval',
    name: 'Finance Approval',
    icon: DollarSign,
    category: 'approval',
    defaultTeam: 'Finance',
    defaultDuration: 8,
    defaultDescription: 'Financial review and budget approval',
  },
  {
    id: 'quality-check',
    name: 'Quality Check',
    icon: Shield,
    category: 'review',
    defaultTeam: 'Quality',
    defaultDuration: 16,
    defaultDescription: 'Quality assurance review',
  },
  {
    id: 'submit-vendor',
    name: 'Submit to Vendor',
    icon: Send,
    category: 'processing',
    defaultTeam: 'Vendor',
    defaultDuration: 48,
    defaultDescription: 'Send RFQ to vendor for quote',
  },
  {
    id: 'manager-approval',
    name: 'Manager Approval',
    icon: UserCheck,
    category: 'approval',
    defaultTeam: 'Operations',
    defaultDuration: 4,
    defaultDescription: 'Management sign-off',
  },
  {
    id: 'send-notification',
    name: 'Send Notification',
    icon: Bell,
    category: 'notification',
    defaultTeam: 'Procurement',
    defaultDuration: 1,
    defaultDescription: 'Notify relevant parties',
  },
];

// Predefined condition templates
export const CONDITION_TEMPLATES: ConditionTemplate[] = [
  // Value & Priority
  {
    id: 'high-value',
    name: 'High Value RFQ',
    icon: DollarSign,
    category: 'condition',
    field: 'value',
    operator: 'greaterThan',
    defaultValue: 50000,
  },
  {
    id: 'urgent-priority',
    name: 'Urgent Priority',
    icon: AlertTriangle,
    category: 'condition',
    field: 'priority',
    operator: 'equals',
    defaultValue: 'urgent',
  },
  {
    id: 'large-order',
    name: 'Large Order',
    icon: Package,
    category: 'condition',
    field: 'items',
    operator: 'greaterThan',
    defaultValue: 100,
  },
  {
    id: 'category-check',
    name: 'Category Check',
    icon: BarChart2,
    category: 'condition',
    field: 'category',
    operator: 'equals',
    defaultValue: '',
  },
  // Technical Specifications
  {
    id: 'material-check',
    name: 'Material Type',
    icon: Layers,
    category: 'condition',
    field: 'material',
    operator: 'equals',
    defaultValue: '',
  },
  {
    id: 'size-check',
    name: 'Size/Dimensions',
    icon: Ruler,
    category: 'condition',
    field: 'size',
    operator: 'greaterThan',
    defaultValue: '',
  },
  {
    id: 'contract-length',
    name: 'Contract Length',
    icon: FileText,
    category: 'condition',
    field: 'contractLength',
    operator: 'greaterThan',
    defaultValue: 12,
  },
  {
    id: 'building-check',
    name: 'Building/Location',
    icon: Building,
    category: 'condition',
    field: 'building',
    operator: 'equals',
    defaultValue: '',
  },
  // Quote Filters
  {
    id: 'difficulty-check',
    name: 'Difficulty Level',
    icon: Gauge,
    category: 'condition',
    field: 'difficulty',
    operator: 'greaterThan',
    defaultValue: 'medium',
  },
  {
    id: 'fit-score',
    name: 'Fit Score',
    icon: Target,
    category: 'condition',
    field: 'fit',
    operator: 'greaterThan',
    defaultValue: 80,
  },
  {
    id: 'lead-time',
    name: 'Lead Time',
    icon: Clock,
    category: 'condition',
    field: 'leadTime',
    operator: 'greaterThan',
    defaultValue: 30,
  },
];

// Stacked filter templates
export const STACKED_FILTER_TEMPLATES: StackedFilterTemplate[] = [
  {
    id: 'qualification-filters',
    name: 'Qualification Filters',
    icon: Filter,
    category: 'filter',
    defaultDescription: 'Stack multiple conditions (material, size, contract length, fit score)',
  },
  {
    id: 'technical-specs-filter',
    name: 'Technical Specs Filter',
    icon: Filter,
    category: 'filter',
    defaultDescription: 'Filter by technical specifications',
  },
];

// Sort templates
export const SORT_TEMPLATES: SortTemplate[] = [
  {
    id: 'sort-by-revenue',
    name: 'Sort by Revenue',
    icon: TrendingUp,
    category: 'sort',
    defaultDescription: 'Sort RFQs by revenue/value (highest first)',
  },
  {
    id: 'sort-by-fit',
    name: 'Sort by Fit Score',
    icon: TrendingUp,
    category: 'sort',
    defaultDescription: 'Sort RFQs by fit score (best fit first)',
  },
];

// Distribution templates
export const DISTRIBUTE_TEMPLATES: DistributeTemplate[] = [
  {
    id: 'distribute-by-division',
    name: 'Distribute by Division',
    icon: Network,
    category: 'distribute',
    defaultDescription: 'Route RFQs to division managers with email notifications',
  },
];

interface DraggableTemplateProps {
  template: StepTemplate | ConditionTemplate | StackedFilterTemplate | SortTemplate | DistributeTemplate;
  type: 'step' | 'condition' | 'stackedFilter' | 'sort' | 'distribute';
}

function DraggableTemplate({ template, type }: DraggableTemplateProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `template-${template.id}`,
    data: {
      type: 'template',
      nodeType: type,
      templateId: template.id,
      template,
    },
  });

  const Icon = template.icon;
  const isStartNode = type === 'step' && (template as StepTemplate).isStartNode;

  const categoryColors: Record<string, string> = {
    review: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    approval: 'bg-green-50 border-green-200 hover:bg-green-100',
    processing: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    notification: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
    condition: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    filter: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
    sort: 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100',
    distribute: 'bg-rose-50 border-rose-200 hover:bg-rose-100',
  };

  const iconColors: Record<string, string> = {
    review: 'text-blue-600',
    approval: 'text-green-600',
    processing: 'text-purple-600',
    notification: 'text-amber-600',
    condition: 'text-orange-600',
    filter: 'text-indigo-600',
    sort: 'text-cyan-600',
    distribute: 'text-rose-600',
  };

  // Special styling for start node
  if (isStartNode) {
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={`
          flex items-center gap-3 p-3 rounded-lg border-2 cursor-grab active:cursor-grabbing
          transition-all bg-emerald-50 border-emerald-300 hover:bg-emerald-100
          ${isDragging ? 'opacity-50 shadow-lg scale-105' : ''}
        `}
      >
        <div className="p-1.5 rounded-md bg-emerald-200">
          <Icon className="w-4 h-4 text-emerald-700" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-emerald-800">{template.name}</span>
          <span className="text-[10px] text-emerald-600 font-medium">START NODE</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`
        flex items-center gap-3 p-3 rounded-lg border cursor-grab active:cursor-grabbing
        transition-all
        ${categoryColors[template.category]}
        ${isDragging ? 'opacity-50 shadow-lg scale-105' : ''}
      `}
    >
      <div className={`p-1.5 rounded-md ${type === 'condition' ? 'bg-orange-100' : 'bg-white/60'}`}>
        {type === 'condition' ? (
          <GitBranch className={`w-4 h-4 ${iconColors[template.category]}`} />
        ) : (
          <Icon className={`w-4 h-4 ${iconColors[template.category]}`} />
        )}
      </div>
      <span className="text-sm font-medium text-gray-700">{template.name}</span>
    </div>
  );
}

interface StepTemplatesSidebarProps {
  className?: string;
}

export default function StepTemplatesSidebar({ className = '' }: StepTemplatesSidebarProps) {
  const startTemplates = STEP_TEMPLATES.filter(t => t.isStartNode);
  const regularTemplates = STEP_TEMPLATES.filter(t => !t.isStartNode);

  return (
    <div className={`w-64 bg-white border-r border-gray-300 p-4 overflow-y-auto shadow-sm ${className}`}>
      <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
        Templates
      </h2>

      {/* Start Node */}
      <div className="mb-6">
        <h3 className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Inbox className="w-3 h-3" />
          Start
        </h3>
        <div className="space-y-2">
          {startTemplates.map((template) => (
            <DraggableTemplate
              key={template.id}
              template={template}
              type="step"
            />
          ))}
        </div>
      </div>

      {/* Step Templates */}
      <div className="mb-6">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
          <ClipboardCheck className="w-3 h-3" />
          Steps
        </h3>
        <div className="space-y-2">
          {regularTemplates.map((template) => (
            <DraggableTemplate
              key={template.id}
              template={template}
              type="step"
            />
          ))}
        </div>
      </div>

      {/* Stacked Filter Templates */}
      <div className="mb-6">
        <h3 className="text-xs font-medium text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Filter className="w-3 h-3" />
          Stacked Filters
        </h3>
        <div className="space-y-2">
          {STACKED_FILTER_TEMPLATES.map((template) => (
            <DraggableTemplate
              key={template.id}
              template={template}
              type="stackedFilter"
            />
          ))}
        </div>
      </div>

      {/* Sort Templates */}
      <div className="mb-6">
        <h3 className="text-xs font-medium text-cyan-600 uppercase tracking-wider mb-2 flex items-center gap-2">
          <TrendingUp className="w-3 h-3" />
          Sort
        </h3>
        <div className="space-y-2">
          {SORT_TEMPLATES.map((template) => (
            <DraggableTemplate
              key={template.id}
              template={template}
              type="sort"
            />
          ))}
        </div>
      </div>

      {/* Distribution Templates */}
      <div className="mb-6">
        <h3 className="text-xs font-medium text-rose-600 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Network className="w-3 h-3" />
          Distribution
        </h3>
        <div className="space-y-2">
          {DISTRIBUTE_TEMPLATES.map((template) => (
            <DraggableTemplate
              key={template.id}
              template={template}
              type="distribute"
            />
          ))}
        </div>
      </div>

      {/* Condition Templates */}
      <div className="mb-6">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
          <GitBranch className="w-3 h-3" />
          Conditions
        </h3>
        <div className="space-y-2">
          {CONDITION_TEMPLATES.map((template) => (
            <DraggableTemplate
              key={template.id}
              template={template}
              type="condition"
            />
          ))}
        </div>
      </div>

      {/* Help text */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-xs text-blue-700">
          <strong>Tip:</strong> Start with "RFQ Received", add "Qualification Filters" to screen RFQs, "Sort by Revenue" to prioritize, then "Distribute by Division" to route to managers.
        </p>
      </div>
    </div>
  );
}

// Export templates for use in other components
export {
  STEP_TEMPLATES as stepTemplates,
  CONDITION_TEMPLATES as conditionTemplates,
  STACKED_FILTER_TEMPLATES as stackedFilterTemplates,
  SORT_TEMPLATES as sortTemplates,
  DISTRIBUTE_TEMPLATES as distributeTemplates,
};
