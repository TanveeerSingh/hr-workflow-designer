import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Zap } from 'lucide-react';
import type { AutomatedNodeData } from '../types/index';

function AutomatedNode({ data: nodeData, selected }: NodeProps) {
  const data = nodeData as AutomatedNodeData;
  const cls = selected ? 'border-purple-500 shadow-lg scale-105' : 'border-purple-300 shadow-md';
  return (
    <div className={`px-6 py-4 rounded-lg bg-purple-50 border-2 transition-all ${cls} min-w-fit`}>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-purple-600" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-purple-600" />
      <div className="space-y-2 min-w-[160px]">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-600 animate-pulse" />
          <span className="font-semibold text-sm text-purple-900 truncate">{data.label}</span>
        </div>
        {data.actionId && <p className="text-xs text-purple-700">⚙️ {data.actionId}</p>}
      </div>
    </div>
  );
}

export default memo(AutomatedNode);
