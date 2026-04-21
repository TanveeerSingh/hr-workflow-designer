import type { Edge, Node } from '@xyflow/react';

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface BaseNodeData {
  type: NodeType;
  label: string;
  [key: string]: unknown;
}

export interface StartNodeData extends BaseNodeData {
  type: 'start';
  metadata?: Record<string, string>;
}

export interface TaskNodeData extends BaseNodeData {
  type: 'task';
  assignee: string;
  description?: string;
  dueDate?: string;
}

export interface ApprovalNodeData extends BaseNodeData {
  type: 'approval';
  approverRole: string;
  autoApproveThreshold?: number;
}

export interface AutomatedNodeData extends BaseNodeData {
  type: 'automated';
  actionId?: string;
  actionParams?: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  type: 'end';
  message?: string;
  showSummary?: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export type WorkflowNode = Node<WorkflowNodeData>;

export interface SimulationStep {
  nodeId: string;
  nodeType: NodeType;
  nodeLabel: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  message?: string;
  timestamp: string;
}

export interface SimulationResult {
  workflowId: string;
  status: 'success' | 'error';
  steps: SimulationStep[];
  error?: string;
  startedAt: string;
  completedAt?: string;
}

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: Edge[];
}

export interface AutomationAction {
  id: string;
  label: string;
  params?: string[];
}
