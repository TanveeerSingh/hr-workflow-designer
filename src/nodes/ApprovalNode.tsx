import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { CheckCircle } from 'lucide-react';
import type { ApprovalNodeData } from '../types/index';

function ApprovalNode({ data: nodeData, selected }: NodeProps) {
  const data = nodeData as ApprovalNodeData;
  const cls = selected ? 'border-amber-500 shadow-lg scale-105' : 'border-amber-300 shadow-md';
  return (
    <div className={`px-6 py-4 rounded-lg bg-amber-50 border-2 transition-all ${cls} min-w-fit`}>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-amber-600" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-amber-600" />
      <div className="space-y-2 min-w-[160px]">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-amber-600" />
          <span className="font-semibold text-sm text-amber-900 truncate">{data.label}</span>
        </div>
        {data.approverRole && <p className="text-xs text-amber-700">👤 {data.approverRole}</p>}
        {data.autoApproveThreshold && <p className="text-xs text-amber-600">💰 ≤ ${data.autoApproveThreshold}</p>}
      </div>
    </div>
  );
}

export default memo(ApprovalNode);
