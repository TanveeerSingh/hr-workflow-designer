import { Play, ClipboardList, CheckCircle, Zap, Flag, Sparkles } from 'lucide-react';
import type { NodeType } from '../types/index';

interface NodeItemProps {
  type: NodeType;
  label: string;
  icon: React.ReactNode;
  description: string;
  gradient: string;
}

function NodeItem({ type, label, icon, description, gradient }: NodeItemProps) {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={`group flex items-center gap-2 p-3 rounded-lg cursor-move transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 border border-transparent ${gradient}`}
    >
      <div className="p-1.5 rounded-md bg-white/80 backdrop-blur-sm group-hover:bg-white transition-all flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-xs text-white truncate">{label}</h4>
        <p className="text-xs text-white/70 truncate">{description}</p>
      </div>
    </div>
  );
}

const nodeItems: Omit<NodeItemProps, 'onDragStart'>[] = [
  {
    type: 'start',
    label: 'Start',
    icon: <Play className="w-5 h-5 text-emerald-600" />,
    description: 'Begin workflow',
    gradient: 'bg-gradient-to-br from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700',
  },
  {
    type: 'task',
    label: 'Task',
    icon: <ClipboardList className="w-5 h-5 text-indigo-600" />,
    description: 'Assign work',
    gradient: 'bg-gradient-to-br from-indigo-400 to-indigo-600 hover:from-indigo-500 hover:to-indigo-700',
  },
  {
    type: 'approval',
    label: 'Approval',
    icon: <CheckCircle className="w-5 h-5 text-amber-600" />,
    description: 'Get approval',
    gradient: 'bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700',
  },
  {
    type: 'automated',
    label: 'Automated',
    icon: <Zap className="w-5 h-5 text-purple-600" />,
    description: 'Auto execute',
    gradient: 'bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700',
  },
  {
    type: 'end',
    label: 'End',
    icon: <Flag className="w-5 h-5 text-red-600" />,
    description: 'Complete flow',
    gradient: 'bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700',
  },
];

export default function NodeSidebar() {
  return (
    <div className="w-56 bg-gradient-to-b from-surface to-surface-dim border-r border-border h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Nodes</h2>
        </div>
        <p className="text-xs text-text-tertiary">Drag & drop</p>
      </div>

      {/* Nodes List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {nodeItems.map((item) => (
          <NodeItem
            key={item.type}
            type={item.type}
            label={item.label}
            icon={item.icon}
            description={item.description}
            gradient={item.gradient}
          />
        ))}
      </div>
    </div>
  );
}
