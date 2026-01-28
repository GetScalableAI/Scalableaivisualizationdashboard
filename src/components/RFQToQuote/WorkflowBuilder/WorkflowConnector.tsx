import { ArrowDown } from 'lucide-react';

interface WorkflowConnectorProps {
  className?: string;
}

export default function WorkflowConnector({ className = '' }: WorkflowConnectorProps) {
  return (
    <div className={`flex flex-col items-center py-2 ${className}`}>
      <div className="w-0.5 h-4 bg-gray-300" />
      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
        <ArrowDown className="w-3 h-3 text-gray-500" />
      </div>
      <div className="w-0.5 h-4 bg-gray-300" />
    </div>
  );
}

// Simpler line connector without arrow
export function LineConnector({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center py-1 ${className}`}>
      <div className="w-0.5 h-6 bg-gray-300" />
    </div>
  );
}

// Branch connector for condition nodes
export function BranchConnector({ className = '' }: { className?: string }) {
  return (
    <div className={`relative h-8 ${className}`}>
      <div className="absolute left-1/2 top-0 w-0.5 h-4 bg-gray-300 -translate-x-1/2" />
      <div className="absolute left-1/4 top-4 right-1/4 h-0.5 bg-gray-300" />
      <div className="absolute left-1/4 top-4 w-0.5 h-4 bg-gray-300 -translate-x-1/2" />
      <div className="absolute right-1/4 top-4 w-0.5 h-4 bg-gray-300 translate-x-1/2" />
    </div>
  );
}

// Merge connector after branches
export function MergeConnector({ className = '' }: { className?: string }) {
  return (
    <div className={`relative h-8 ${className}`}>
      <div className="absolute left-1/4 top-0 w-0.5 h-4 bg-gray-300 -translate-x-1/2" />
      <div className="absolute right-1/4 top-0 w-0.5 h-4 bg-gray-300 translate-x-1/2" />
      <div className="absolute left-1/4 top-4 right-1/4 h-0.5 bg-gray-300" />
      <div className="absolute left-1/2 top-4 w-0.5 h-4 bg-gray-300 -translate-x-1/2" />
    </div>
  );
}
