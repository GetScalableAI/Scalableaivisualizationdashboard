// useChatDashboard - Hook connecting chat to dashboard actions
import { useState, useCallback, useRef } from 'react';
import { llmService, LLMResponse } from '../services/llmService';
import { DashboardContext } from './chatPrompts';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  action?: {
    type: string;
    params: Record<string, unknown>;
    executed: boolean;
    result?: string;
  };
  isLoading?: boolean;
}

interface UseChatDashboardOptions {
  onAddWidget?: (widgetType: string) => void;
  onRemoveWidget?: (widgetId: string) => void;
  onConfigureWidget?: (widgetId: string, config: Record<string, unknown>) => void;
  onOpenDrillDown?: (widgetType: 'production' | 'oee' | 'scrap' | 'uptime') => void;
  onCloseDrillDown?: () => void;
  onSaveReport?: (name: string, description?: string) => void;
  onLoadReport?: (reportId: string) => void;
  onSetFilter?: (filterType: string, value: string) => void;
}

interface UseChatDashboardReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  executeAction: (action: Message['action']) => void;
  retryLastMessage: () => Promise<void>;
  isApiConfigured: boolean;
  setApiKey: (key: string) => void;
}

export function useChatDashboard(
  dashboardContext: DashboardContext,
  options: UseChatDashboardOptions = {}
): UseChatDashboardReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastUserMessageRef = useRef<string | null>(null);

  const {
    onAddWidget,
    onRemoveWidget,
    onConfigureWidget,
    onOpenDrillDown,
    onCloseDrillDown,
    onSaveReport,
    onLoadReport,
    onSetFilter,
  } = options;

  // Check if API is configured
  const isApiConfigured = llmService.isConfigured() || !!llmService.getApiKey();

  // Set API key
  const setApiKey = useCallback((key: string) => {
    llmService.setApiKey(key);
  }, []);

  // Generate unique message ID
  const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Execute a dashboard action
  const executeAction = useCallback((action?: Message['action']) => {
    if (!action) return;

    try {
      switch (action.type) {
        case 'add_widget':
          if (onAddWidget && typeof action.params.widgetType === 'string') {
            onAddWidget(action.params.widgetType);
            action.executed = true;
            action.result = 'Widget added successfully';
          }
          break;

        case 'remove_widget':
          if (onRemoveWidget && typeof action.params.widgetId === 'string') {
            onRemoveWidget(action.params.widgetId);
            action.executed = true;
            action.result = 'Widget removed successfully';
          }
          break;

        case 'configure_widget':
          if (onConfigureWidget && typeof action.params.widgetId === 'string') {
            onConfigureWidget(
              action.params.widgetId,
              action.params.config as Record<string, unknown>
            );
            action.executed = true;
            action.result = 'Widget configured successfully';
          }
          break;

        case 'open_drill_down':
          if (onOpenDrillDown && typeof action.params.widgetType === 'string') {
            const validTypes = ['production', 'oee', 'scrap', 'uptime'];
            if (validTypes.includes(action.params.widgetType)) {
              onOpenDrillDown(action.params.widgetType as 'production' | 'oee' | 'scrap' | 'uptime');
              action.executed = true;
              action.result = 'Drill-down opened';
            }
          }
          break;

        case 'close_drill_down':
          if (onCloseDrillDown) {
            onCloseDrillDown();
            action.executed = true;
            action.result = 'Drill-down closed';
          }
          break;

        case 'save_report':
          if (onSaveReport && typeof action.params.name === 'string') {
            onSaveReport(action.params.name, action.params.description as string | undefined);
            action.executed = true;
            action.result = 'Report saved successfully';
          }
          break;

        case 'load_report':
          if (onLoadReport && typeof action.params.reportId === 'string') {
            onLoadReport(action.params.reportId);
            action.executed = true;
            action.result = 'Report loaded successfully';
          }
          break;

        case 'set_filter':
          if (
            onSetFilter &&
            typeof action.params.filterType === 'string' &&
            typeof action.params.value === 'string'
          ) {
            onSetFilter(action.params.filterType, action.params.value);
            action.executed = true;
            action.result = 'Filter updated';
          }
          break;

        default:
          console.warn('Unknown action type:', action.type);
      }
    } catch (err) {
      console.error('Action execution error:', err);
      action.executed = false;
      action.result = err instanceof Error ? err.message : 'Action failed';
    }
  }, [
    onAddWidget,
    onRemoveWidget,
    onConfigureWidget,
    onOpenDrillDown,
    onCloseDrillDown,
    onSaveReport,
    onLoadReport,
    onSetFilter,
  ]);

  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    setError(null);
    lastUserMessageRef.current = content;

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Add loading message
    const loadingMessageId = generateId();
    setMessages(prev => [
      ...prev,
      {
        id: loadingMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isLoading: true,
      },
    ]);

    setIsLoading(true);

    try {
      // Convert messages to chat format
      const chatHistory = messages
        .filter(m => !m.isLoading)
        .map(m => ({
          role: m.role as 'user' | 'assistant' | 'system',
          content: m.content,
        }));

      // Send to LLM
      const response: LLMResponse = await llmService.sendMessage(
        content,
        dashboardContext,
        chatHistory
      );

      // Create assistant message
      const assistantMessage: Message = {
        id: loadingMessageId,
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        action: response.action ? {
          type: response.action.type,
          params: response.action.params,
          executed: false,
        } : undefined,
      };

      // Update messages (replace loading message)
      setMessages(prev =>
        prev.map(m => (m.id === loadingMessageId ? assistantMessage : m))
      );

      // Auto-execute action if present
      if (response.action) {
        executeAction(assistantMessage.action);
      }

    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response';
      setError(errorMessage);

      // Update loading message with error
      setMessages(prev =>
        prev.map(m =>
          m.id === loadingMessageId
            ? {
                ...m,
                content: `I encountered an error: ${errorMessage}. Please try again.`,
                isLoading: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, dashboardContext, executeAction]);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // Retry the last message
  const retryLastMessage = useCallback(async () => {
    if (lastUserMessageRef.current) {
      // Remove the last user and assistant messages
      setMessages(prev => prev.slice(0, -2));
      await sendMessage(lastUserMessageRef.current);
    }
  }, [sendMessage]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    executeAction,
    retryLastMessage,
    isApiConfigured,
    setApiKey,
  };
}

export type { DashboardContext };
