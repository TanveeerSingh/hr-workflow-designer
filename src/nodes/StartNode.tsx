import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';
import type { StartNodeData } from '../types/index';

function StartNode({ data: nodeData, selected }: NodeProps) {
  const data = nodeData as StartNodeData;
  const cls = selected ? 'border-emerald-500 shadow-lg scale-105' : 'border-emerald-300 shadow-md';
  return (
    <div className={`px-6 py-4 rounded-lg bg-emerald-50 border-2 transition-all ${cls} min-w-fit`}>
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-emerald-600" />
      <div className="flex items-center gap-2">
        <Play className="w-4 h-4 text-emerald-600" />
        <span className="font-semibold text-sm text-emerald-900">{data.label}</span>
      </div>
    </div>
  );
}

export default memo(StartNode);
