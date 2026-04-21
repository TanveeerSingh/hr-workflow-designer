import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { ClipboardList } from 'lucide-react';
import type { TaskNodeData } from '../types/index';

function TaskNode({ data: nodeData, selected }: NodeProps) {
  const data = nodeData as TaskNodeData;
  const cls = selected ? 'border-indigo-500 shadow-lg scale-105' : 'border-indigo-300 shadow-md';
  return (
    <div className={`px-6 py-4 rounded-lg bg-indigo-50 border-2 transition-all ${cls} min-w-fit`}>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-indigo-600" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-indigo-600" />
      <div className="space-y-2 min-w-[160px]">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold text-sm text-indigo-900 truncate">{data.label}</span>
        </div>
        {data.assignee && <p className="text-xs text-indigo-700">👤 {data.assignee}</p>}
        {data.dueDate && <p className="text-xs text-indigo-600">📅 {new Date(data.dueDate).toLocaleDateString()}</p>}
      </div>
    </div>
  );
}

export default memo(TaskNode);
