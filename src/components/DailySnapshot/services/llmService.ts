// LLM Service - API integration for chatbot functionality
// Supports OpenAI API format (compatible with OpenAI, Azure OpenAI, and local LLMs)

import { getSystemPrompt, DashboardContext } from '../chat/chatPrompts';

export interface LLMConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  action?: {
    type: string;
    params: Record<string, unknown>;
  };
  error?: string;
}

export interface FunctionDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description?: string;
      enum?: string[];
    }>;
    required?: string[];
  };
}

// Available functions for the LLM to call
const DASHBOARD_FUNCTIONS: FunctionDefinition[] = [
  {
    name: 'add_widget',
    description: 'Add a new widget to the dashboard',
    parameters: {
      type: 'object',
      properties: {
        widgetType: {
          type: 'string',
          description: 'The type of widget to add',
          enum: [
            'production-target', 'oee', 'scrap-rate', 'uptime',
            'production-trend', 'schedule-analysis', 'quality-metrics',
            'sales-performance', 'quick-insights', 'utilization',
            'machine-performance', 'per-machine-metrics', 'environmental-data',
            'ghg-emissions', 'debt-to-equity', 'custom-metric'
          ]
        }
      },
      required: ['widgetType']
    }
  },
  {
    name: 'remove_widget',
    description: 'Remove a widget from the dashboard',
    parameters: {
      type: 'object',
      properties: {
        widgetId: {
          type: 'string',
          description: 'The ID of the widget to remove'
        }
      },
      required: ['widgetId']
    }
  },
  {
    name: 'configure_widget',
    description: 'Configure a widget\'s settings (thresholds, display options, etc.)',
    parameters: {
      type: 'object',
      properties: {
        widgetId: {
          type: 'string',
          description: 'The ID of the widget to configure'
        },
        config: {
          type: 'object',
          description: 'Configuration object with thresholds, displayOptions, or dataSource'
        }
      },
      required: ['widgetId', 'config']
    }
  },
  {
    name: 'open_drill_down',
    description: 'Open the drill-down panel for a specific widget to see detailed data',
    parameters: {
      type: 'object',
      properties: {
        widgetType: {
          type: 'string',
          description: 'The type of widget to drill down into',
          enum: ['production', 'oee', 'scrap', 'uptime']
        }
      },
      required: ['widgetType']
    }
  },
  {
    name: 'close_drill_down',
    description: 'Close the drill-down panel',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'save_report',
    description: 'Save the current dashboard configuration as a report',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name for the report'
        },
        description: {
          type: 'string',
          description: 'Optional description for the report'
        }
      },
      required: ['name']
    }
  },
  {
    name: 'load_report',
    description: 'Load a saved report',
    parameters: {
      type: 'object',
      properties: {
        reportId: {
          type: 'string',
          description: 'The ID of the report to load'
        }
      },
      required: ['reportId']
    }
  },
  {
    name: 'set_filter',
    description: 'Set a dashboard filter (date range, product line, or shift)',
    parameters: {
      type: 'object',
      properties: {
        filterType: {
          type: 'string',
          enum: ['dateRange', 'productLine', 'shift'],
          description: 'The type of filter to set'
        },
        value: {
          type: 'string',
          description: 'The filter value'
        }
      },
      required: ['filterType', 'value']
    }
  }
];

// Default configuration
const DEFAULT_CONFIG: LLMConfig = {
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4',
  maxTokens: 1024,
  temperature: 0.7,
};

class LLMService {
  private config: LLMConfig;

  constructor(config: Partial<LLMConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Update configuration
  setConfig(config: Partial<LLMConfig>) {
    this.config = { ...this.config, ...config };
  }

  // Check if API is configured
  isConfigured(): boolean {
    return !!this.config.apiKey;
  }

  // Get API key from environment or local storage
  getApiKey(): string | null {
    // Check environment variable (for development)
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OPENAI_API_KEY) {
      return import.meta.env.VITE_OPENAI_API_KEY;
    }

    // Check local storage
    const storedKey = localStorage.getItem('openai-api-key');
    if (storedKey) return storedKey;

    // Check config
    return this.config.apiKey || null;
  }

  // Set API key
  setApiKey(key: string) {
    this.config.apiKey = key;
    localStorage.setItem('openai-api-key', key);
  }

  // Clear API key
  clearApiKey() {
    this.config.apiKey = undefined;
    localStorage.removeItem('openai-api-key');
  }

  // Send message to LLM
  async sendMessage(
    userMessage: string,
    dashboardContext: DashboardContext,
    conversationHistory: ChatMessage[] = []
  ): Promise<LLMResponse> {
    const apiKey = this.getApiKey();

    // If no API key, use local processing
    if (!apiKey) {
      return this.processLocally(userMessage, dashboardContext);
    }

    try {
      const systemPrompt = getSystemPrompt(dashboardContext);

      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];

      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          functions: DASHBOARD_FUNCTIONS,
          function_call: 'auto',
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const choice = data.choices?.[0];

      if (!choice) {
        throw new Error('No response from LLM');
      }

      // Check for function call
      if (choice.message.function_call) {
        const functionName = choice.message.function_call.name;
        const args = JSON.parse(choice.message.function_call.arguments || '{}');

        return {
          content: this.generateActionResponse(functionName, args),
          action: {
            type: functionName,
            params: args
          }
        };
      }

      // Regular text response
      return {
        content: choice.message.content || ''
      };

    } catch (error) {
      console.error('LLM API error:', error);

      // Fallback to local processing on error
      return this.processLocally(userMessage, dashboardContext);
    }
  }

  // Process message locally without API (basic pattern matching)
  private processLocally(
    userMessage: string,
    context: DashboardContext
  ): LLMResponse {
    const loweredMessage = userMessage.toLowerCase();

    // Widget addition
    if (loweredMessage.includes('add') && (loweredMessage.includes('widget') || loweredMessage.includes('chart'))) {
      const widgetType = this.extractWidgetType(loweredMessage);
      if (widgetType) {
        return {
          content: `I'll add the ${this.getWidgetName(widgetType)} widget to your dashboard.`,
          action: { type: 'add_widget', params: { widgetType } }
        };
      }
      return {
        content: `Which widget would you like to add? Available options: ${context.availableWidgets.filter(w => !context.activeWidgets.includes(w)).join(', ')}`
      };
    }

    // Widget removal
    if (loweredMessage.includes('remove') || loweredMessage.includes('delete') || loweredMessage.includes('hide')) {
      const widgetType = this.extractWidgetType(loweredMessage);
      if (widgetType && context.activeWidgets.includes(widgetType)) {
        return {
          content: `I'll remove the ${this.getWidgetName(widgetType)} widget from your dashboard.`,
          action: { type: 'remove_widget', params: { widgetId: widgetType } }
        };
      }
    }

    // Drill down
    if (loweredMessage.includes('drill') || loweredMessage.includes('details') || loweredMessage.includes('breakdown')) {
      const widgetType = this.extractDrillDownType(loweredMessage);
      if (widgetType) {
        return {
          content: `I'll open the drill-down view for ${widgetType} details.`,
          action: { type: 'open_drill_down', params: { widgetType } }
        };
      }
    }

    // Save report
    if (loweredMessage.includes('save')) {
      const nameMatch = userMessage.match(/(?:as|named|called)\s+["']?([^"']+)["']?/i);
      const reportName = nameMatch?.[1] || `Report - ${new Date().toLocaleString()}`;
      return {
        content: `I'll save your current dashboard configuration as "${reportName}".`,
        action: { type: 'save_report', params: { name: reportName } }
      };
    }

    // Load report
    if (loweredMessage.includes('load') || loweredMessage.includes('open')) {
      const reportMatch = context.savedReports.find(r =>
        loweredMessage.includes(r.name.toLowerCase())
      );
      if (reportMatch) {
        return {
          content: `I'll load the "${reportMatch.name}" report.`,
          action: { type: 'load_report', params: { reportId: reportMatch.id } }
        };
      }
    }

    // Analysis questions
    if (loweredMessage.includes('why') || loweredMessage.includes('explain') || loweredMessage.includes('analyze')) {
      if (loweredMessage.includes('oee')) {
        return {
          content: `Your current OEE is calculated from Availability (92%), Performance (89%), and Quality (95%). The Performance component is the lowest, which could indicate minor stoppages, reduced speed, or cycle time issues. To investigate further, I'd recommend drilling down into the machine-level OEE data to identify specific underperforming machines.`,
        };
      }
      if (loweredMessage.includes('scrap') || loweredMessage.includes('defect')) {
        return {
          content: `Your scrap rate of 2.1% is currently below the 2.5% target, which is good. The main defect types are Dimensional (35%), Surface (25%), and Material (19%). To reduce scrap further, focus on dimensional accuracy in your machining operations.`,
        };
      }
      if (loweredMessage.includes('production') || loweredMessage.includes('target')) {
        return {
          content: `Current production is at 2,847 units vs a target of 3,000 (94.9%). Looking at the hourly trend, there was a dip around 12:00 and 16:00 which impacted the daily total. The afternoon shift seems to be performing slightly below the morning shift.`,
        };
      }
      if (loweredMessage.includes('downtime') || loweredMessage.includes('uptime')) {
        return {
          content: `Current uptime is 94.2% with 22.6 productive hours out of 24. There was 1.4 hours of unplanned downtime, primarily from breakdowns on CNC-03 and Press-12. The main downtime reasons today are: breakdown (2 events), maintenance (1 event), and changeover (1 event).`,
        };
      }
    }

    // General help
    if (loweredMessage.includes('help') || loweredMessage.includes('what can you')) {
      return {
        content: `I can help you with:

**Widget Management**
- "Add a production chart" - Add widgets to your dashboard
- "Remove the sales widget" - Remove widgets
- "Configure OEE thresholds" - Adjust widget settings

**Data Analysis**
- "Why is OEE low?" - Analyze specific metrics
- "Explain the scrap rate" - Get insights on data

**Reports**
- "Save this as Morning Report" - Save current layout
- "Load my Production Dashboard" - Load saved reports

**Navigation**
- "Show machine breakdown" - Drill into detailed data

What would you like to do?`
      };
    }

    // Default response
    return {
      content: `I understand you're asking about "${userMessage}". I can help you manage widgets, analyze production data, save/load reports, or drill down into metrics. Could you be more specific about what you'd like to do?`
    };
  }

  // Extract widget type from message
  private extractWidgetType(message: string): string | null {
    const widgetMappings: Record<string, string[]> = {
      'production-target': ['production target', 'production vs target', 'production metric'],
      'oee': ['oee', 'overall equipment effectiveness'],
      'scrap-rate': ['scrap', 'scrap rate', 'defect'],
      'uptime': ['uptime', 'downtime'],
      'production-trend': ['production trend', 'trend chart', 'production chart'],
      'schedule-analysis': ['schedule', 'behind ahead', 'schedule analysis'],
      'quality-metrics': ['quality', 'quality metrics'],
      'sales-performance': ['sales', 'sales performance', 'revenue'],
      'quick-insights': ['insights', 'quick insights', 'ai insights'],
      'utilization': ['utilization', 'machine utilization'],
      'machine-performance': ['machine performance', 'machine comparison'],
      'per-machine-metrics': ['per machine', 'machine metrics'],
      'environmental-data': ['environmental', 'environment'],
      'ghg-emissions': ['emissions', 'ghg', 'greenhouse'],
      'debt-to-equity': ['debt', 'equity', 'financial'],
    };

    for (const [widgetId, keywords] of Object.entries(widgetMappings)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return widgetId;
      }
    }

    return null;
  }

  // Extract drill-down type from message
  private extractDrillDownType(message: string): 'production' | 'oee' | 'scrap' | 'uptime' | null {
    if (message.includes('production') || message.includes('output')) return 'production';
    if (message.includes('oee') || message.includes('effectiveness')) return 'oee';
    if (message.includes('scrap') || message.includes('defect') || message.includes('quality')) return 'scrap';
    if (message.includes('uptime') || message.includes('downtime') || message.includes('machine')) return 'uptime';
    return null;
  }

  // Get human-readable widget name
  private getWidgetName(widgetType: string): string {
    const names: Record<string, string> = {
      'production-target': 'Production vs Target',
      'oee': 'OEE',
      'scrap-rate': 'Scrap Rate',
      'uptime': 'Uptime',
      'production-trend': 'Production Trend',
      'schedule-analysis': 'Schedule Analysis',
      'quality-metrics': 'Quality Metrics',
      'sales-performance': 'Sales Performance',
      'quick-insights': 'Quick Insights',
      'utilization': 'Utilization',
      'machine-performance': 'Machine Performance',
      'per-machine-metrics': 'Per Machine Metrics',
      'environmental-data': 'Environmental Data',
      'ghg-emissions': 'GHG Emissions',
      'debt-to-equity': 'Debt to Equity',
    };
    return names[widgetType] || widgetType;
  }

  // Generate action response
  private generateActionResponse(functionName: string, params: Record<string, unknown>): string {
    switch (functionName) {
      case 'add_widget':
        return `I'll add the ${this.getWidgetName(params.widgetType as string)} widget to your dashboard.`;
      case 'remove_widget':
        return `I'll remove the ${params.widgetId} widget from your dashboard.`;
      case 'configure_widget':
        return `I'll update the configuration for the ${params.widgetId} widget.`;
      case 'open_drill_down':
        return `I'll open the drill-down view for ${params.widgetType} details.`;
      case 'close_drill_down':
        return `I'll close the drill-down panel.`;
      case 'save_report':
        return `I'll save your dashboard as "${params.name}".`;
      case 'load_report':
        return `I'll load the requested report.`;
      case 'set_filter':
        return `I'll set the ${params.filterType} filter to ${params.value}.`;
      default:
        return `Action ${functionName} executed.`;
    }
  }

  // Stream message (for real-time responses)
  async *streamMessage(
    userMessage: string,
    dashboardContext: DashboardContext,
    conversationHistory: ChatMessage[] = []
  ): AsyncGenerator<string, LLMResponse, unknown> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      const result = this.processLocally(userMessage, dashboardContext);
      yield result.content;
      return result;
    }

    // For streaming, we'd implement SSE parsing here
    // For now, just return the full response
    const result = await this.sendMessage(userMessage, dashboardContext, conversationHistory);
    yield result.content;
    return result;
  }
}

// Export singleton instance
export const llmService = new LLMService();

// Export for direct imports
export { LLMService };
