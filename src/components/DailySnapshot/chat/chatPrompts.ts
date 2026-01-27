// Chat Prompts - System prompts for LLM context in dashboard operations

export interface DashboardContext {
  activeWidgets: string[];
  availableWidgets: string[];
  currentReport: { id: string; name: string } | null;
  savedReports: { id: string; name: string }[];
  filters: {
    dateRange: string;
    productLine: string;
    shift: string;
  };
  drillDownState: {
    isOpen: boolean;
    widgetType: string | null;
    currentLevel: number;
  };
}

// System prompt that provides context about the dashboard
export function getSystemPrompt(context: DashboardContext): string {
  return `You are an AI assistant for an industrial manufacturing dashboard called "Daily Snapshot."

## Your Capabilities
You can help users with:
1. **Widget Management**: Add, remove, or configure dashboard widgets
2. **Data Analysis**: Analyze production metrics, OEE, scrap rates, and uptime data
3. **Report Operations**: Save, load, create, or duplicate reports
4. **Drill-Down Navigation**: Navigate through data hierarchies
5. **Insights**: Provide explanations about metrics and suggest improvements

## Current Dashboard State
- **Active Widgets**: ${context.activeWidgets.join(', ') || 'None'}
- **Available Widgets**: ${context.availableWidgets.join(', ')}
- **Current Report**: ${context.currentReport?.name || 'Unsaved Dashboard'}
- **Saved Reports**: ${context.savedReports.map(r => r.name).join(', ') || 'None'}
- **Date Range**: ${context.filters.dateRange}
- **Product Line Filter**: ${context.filters.productLine}
- **Shift Filter**: ${context.filters.shift}
${context.drillDownState.isOpen ? `- **Currently Drilling Down**: ${context.drillDownState.widgetType} at level ${context.drillDownState.currentLevel}` : ''}

## Available Widget Types
- production-target: Production vs Target metric with hourly sparkline
- oee: Overall Equipment Effectiveness with A/P/Q breakdown
- scrap-rate: Scrap rate percentage with defect breakdown
- uptime: Machine uptime with downtime timeline
- production-trend: Production trend chart over time
- schedule-analysis: Behind/Ahead schedule analysis
- quality-metrics: Quality metrics visualization
- sales-performance: Sales performance data
- quick-insights: AI-powered quick insights
- utilization: Machine utilization rates
- machine-performance: Machine comparison chart
- per-machine-metrics: Individual machine metrics
- environmental-data: Environmental tracking
- ghg-emissions: Greenhouse gas emissions
- debt-to-equity: Debt-to-equity ratio

## Response Guidelines
1. Be concise and actionable
2. When suggesting actions, use clear function calls
3. For data analysis, provide specific insights based on manufacturing context
4. If asked about something outside your capabilities, explain what you can help with instead

## Function Calling
When you determine the user wants to perform an action, respond with a JSON action object:
\`\`\`json
{
  "action": "action_type",
  "params": { ... }
}
\`\`\`

Available actions:
- add_widget: { "widgetType": "string" }
- remove_widget: { "widgetId": "string" }
- configure_widget: { "widgetId": "string", "config": { ... } }
- open_drill_down: { "widgetType": "string" }
- close_drill_down: {}
- save_report: { "name": "string" }
- load_report: { "reportId": "string" }
- create_report: { "name": "string", "description": "string" }
- set_filter: { "filterType": "dateRange|productLine|shift", "value": "string" }
- analyze_data: { "metric": "string", "question": "string" }`;
}

// Prompt for widget management questions
export const WIDGET_MANAGEMENT_PROMPT = `
When the user asks to add, remove, or modify widgets:
1. Identify the specific widget type from their request
2. Match natural language to widget IDs (e.g., "production chart" → "production-trend")
3. Confirm the action before executing if ambiguous
4. Suggest related widgets if appropriate
`;

// Prompt for data analysis questions
export const DATA_ANALYSIS_PROMPT = `
When analyzing data:
1. Consider the manufacturing context (production, quality, efficiency)
2. Compare to industry benchmarks where relevant
3. Identify potential root causes for issues
4. Suggest actionable improvements
5. Use specific numbers and percentages when discussing metrics
`;

// Prompt for report operations
export const REPORT_OPERATIONS_PROMPT = `
When handling reports:
1. Use descriptive names that indicate the report's purpose
2. Confirm before overwriting existing reports
3. Suggest loading relevant reports based on user's needs
4. Warn if there are unsaved changes
`;

// Example prompts for common user requests
export const EXAMPLE_PROMPTS = [
  {
    user: "Add a production chart",
    response: "I'll add the Production Trend widget to your dashboard.",
    action: { action: "add_widget", params: { widgetType: "production-trend" } }
  },
  {
    user: "Why is OEE low today?",
    response: "Looking at your OEE breakdown, I can see that Performance is at 89% while Availability and Quality are at 92% and 95% respectively. The lower performance could be due to minor stoppages or reduced speed. Would you like me to drill down into the machine-level data to identify which machines are underperforming?",
    action: null
  },
  {
    user: "Save this as my morning report",
    response: "I'll save the current dashboard configuration as 'Morning Report'.",
    action: { action: "save_report", params: { name: "Morning Report" } }
  },
  {
    user: "Show me machine breakdown",
    response: "I'll open the drill-down view for machine-level details.",
    action: { action: "open_drill_down", params: { widgetType: "production" } }
  },
  {
    user: "Remove the sales widget",
    response: "I'll remove the Sales Performance widget from your dashboard.",
    action: { action: "remove_widget", params: { widgetId: "sales-performance" } }
  },
];

// Helper to parse user intent
export function parseUserIntent(message: string): {
  intent: 'add_widget' | 'remove_widget' | 'configure_widget' | 'drill_down' | 'save_report' | 'load_report' | 'analyze' | 'general';
  entities: Record<string, string>;
} {
  const loweredMessage = message.toLowerCase();

  // Widget addition patterns
  const addPatterns = [
    /add (?:a |an |the )?(.+?)(?:\s+widget|\s+chart|\s+to|\s*$)/i,
    /show (?:me )?(?:a |an |the )?(.+?)(?:\s+widget|\s+chart|\s*$)/i,
    /include (?:a |an |the )?(.+)/i,
  ];

  // Widget removal patterns
  const removePatterns = [
    /remove (?:the )?(.+?)(?:\s+widget|\s+chart|\s*$)/i,
    /delete (?:the )?(.+?)(?:\s+widget|\s+chart|\s*$)/i,
    /hide (?:the )?(.+?)(?:\s+widget|\s+chart|\s*$)/i,
  ];

  // Report patterns
  const savePatterns = [
    /save (?:this |as )?(?:(?:a |an |the )?report(?:\s+(?:as|named|called))?\s*)?['""]?([^'""]+)['""]?/i,
    /create (?:a |an )?report(?:\s+(?:named|called))?\s*['""]?([^'""]+)['""]?/i,
  ];

  const loadPatterns = [
    /load (?:the )?(?:report )?['""]?([^'""]+)['""]?/i,
    /open (?:the )?(?:report )?['""]?([^'""]+)['""]?/i,
    /switch to (?:the )?['""]?([^'""]+)['""]?/i,
  ];

  // Drill-down patterns
  const drillDownPatterns = [
    /(?:show|drill|go to|open) (?:me )?(?:the )?(.+?)(?:\s+details|\s+breakdown|\s+drill[-\s]?down)/i,
    /why is (.+?) (?:low|high|down|up)/i,
    /what(?:'s| is) (?:causing|wrong with) (?:the )?(.+)/i,
  ];

  // Check patterns
  for (const pattern of addPatterns) {
    const match = message.match(pattern);
    if (match) {
      return { intent: 'add_widget', entities: { widgetName: match[1].trim() } };
    }
  }

  for (const pattern of removePatterns) {
    const match = message.match(pattern);
    if (match) {
      return { intent: 'remove_widget', entities: { widgetName: match[1].trim() } };
    }
  }

  for (const pattern of savePatterns) {
    const match = message.match(pattern);
    if (match) {
      return { intent: 'save_report', entities: { reportName: match[1].trim() } };
    }
  }

  for (const pattern of loadPatterns) {
    const match = message.match(pattern);
    if (match) {
      return { intent: 'load_report', entities: { reportName: match[1].trim() } };
    }
  }

  for (const pattern of drillDownPatterns) {
    const match = message.match(pattern);
    if (match) {
      return { intent: 'drill_down', entities: { topic: match[1].trim() } };
    }
  }

  // Check for analysis keywords
  if (
    loweredMessage.includes('why') ||
    loweredMessage.includes('analyze') ||
    loweredMessage.includes('explain') ||
    loweredMessage.includes('what') ||
    loweredMessage.includes('how')
  ) {
    return { intent: 'analyze', entities: { question: message } };
  }

  return { intent: 'general', entities: {} };
}

// Map natural language to widget IDs
export function mapToWidgetId(widgetName: string): string | null {
  const normalizedName = widgetName.toLowerCase();

  const mappings: Record<string, string[]> = {
    'production-target': ['production', 'target', 'production target', 'production vs target'],
    'oee': ['oee', 'overall equipment effectiveness', 'equipment effectiveness'],
    'scrap-rate': ['scrap', 'scrap rate', 'defect', 'defects'],
    'uptime': ['uptime', 'downtime', 'availability'],
    'production-trend': ['trend', 'production trend', 'production chart', 'chart'],
    'schedule-analysis': ['schedule', 'behind', 'ahead', 'schedule analysis'],
    'quality-metrics': ['quality', 'quality metrics'],
    'sales-performance': ['sales', 'revenue', 'sales performance'],
    'quick-insights': ['insights', 'ai insights', 'quick insights'],
    'utilization': ['utilization', 'usage', 'utilization rate'],
    'machine-performance': ['machine performance', 'machines', 'machine comparison'],
    'per-machine-metrics': ['per machine', 'machine metrics', 'individual machine'],
    'environmental-data': ['environmental', 'environment', 'eco'],
    'ghg-emissions': ['emissions', 'ghg', 'greenhouse', 'carbon'],
    'debt-to-equity': ['debt', 'equity', 'financial', 'debt to equity'],
  };

  for (const [widgetId, keywords] of Object.entries(mappings)) {
    if (keywords.some(keyword => normalizedName.includes(keyword))) {
      return widgetId;
    }
  }

  return null;
}
