import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { CheckCheck } from 'lucide-react';
import type { EndNodeData } from '../types/index';

function EndNode({ data: nodeData, selected }: NodeProps) {
  const data = nodeData as EndNodeData;
  const cls = selected ? 'border-red-500 shadow-lg scale-105' : 'border-red-300 shadow-md';
  return (
    <div className={`px-6 py-4 rounded-lg bg-red-50 border-2 transition-all ${cls} min-w-fit`}>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-red-600" />
      <div className="flex items-center gap-2">
        <CheckCheck className="w-4 h-4 text-red-600" />
        <span className="font-semibold text-sm text-red-900">{data.label}</span>
      </div>
    </div>
  );
}

export default memo(EndNode);
