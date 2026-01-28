import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Settings } from 'lucide-react';
import { WorkflowProvider } from './context/WorkflowContext';
import RFQListView from './RFQListView';
import WorkflowBuilder from './WorkflowBuilder';

interface RFQToQuoteProps {
  onOpenChat?: () => void;
}

export default function RFQToQuote({ onOpenChat }: RFQToQuoteProps) {
  return (
    <WorkflowProvider>
      <Tabs defaultValue="rfq-list" className="h-full flex flex-col">
        <div className="flex items-center justify-between px-1 pb-4">
          <TabsList>
            <TabsTrigger value="rfq-list" className="gap-2">
              <FileText className="w-4 h-4" />
              RFQ List
            </TabsTrigger>
            <TabsTrigger value="configuration" className="gap-2">
              <Settings className="w-4 h-4" />
              Configuration
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="rfq-list" className="flex-1 mt-0">
          <RFQListView onOpenChat={onOpenChat} />
        </TabsContent>

        <TabsContent value="configuration" className="flex-1 mt-0">
          <div className="h-[calc(100vh-200px)]">
            <WorkflowBuilder />
          </div>
        </TabsContent>
      </Tabs>
    </WorkflowProvider>
  );
}
