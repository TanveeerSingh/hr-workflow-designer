import { useState, useCallback } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Node, Edge } from '@xyflow/react';
import type {
  WorkflowNodeData,
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
  AutomationAction,
} from '../types/index';

interface NodeEditPanelProps {
  selectedNode: Node<WorkflowNodeData> | null;
  automationActions: AutomationAction[];
  onUpdateNode: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  onClose: () => void;
  onDeleteNode: (nodeId: string) => void;
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
}

// Start Node Form
function StartNodeForm({ data, onChange }: { data: StartNodeData; onChange: (data: StartNodeData) => void }) {
  const [metadataKey, setMetadataKey] = useState('');
  const [metadataValue, setMetadataValue] = useState('');

  const addMetadata = () => {
    if (metadataKey.trim()) {
      onChange({
        ...data,
        metadata: { ...data.metadata, [metadataKey]: metadataValue },
      });
      setMetadataKey('');
      setMetadataValue('');
    }
  };

  const removeMetadata = (key: string) => {
    const newMetadata = { ...data.metadata };
    delete newMetadata[key];
    onChange({ ...data, metadata: newMetadata });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Title
        </label>
        <input
          type="text"
          value={data.label}
          onChange={(e) => onChange({ ...data, label: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Metadata
        </label>
        {data.metadata &&
          Object.entries(data.metadata).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 mb-2 p-2 bg-surface-variant rounded-lg">
              <span className="text-sm text-text-secondary font-medium">{key}:</span>
              <span className="text-sm flex-1 text-foreground">{value}</span>
              <button
                onClick={() => removeMetadata(key)}
                className="p-1 text-error hover:bg-error/10 rounded transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            placeholder="Key"
            value={metadataKey}
            onChange={(e) => setMetadataKey(e.target.value)}
            className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <input
            type="text"
            placeholder="Value"
            value={metadataValue}
            onChange={(e) => setMetadataValue(e.target.value)}
            className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button
            onClick={addMetadata}
            className="p-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg hover:shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Task Node Form
function TaskNodeForm({ data, onChange }: { data: TaskNodeData; onChange: (data: TaskNodeData) => void }) {

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Title <span className="text-error">*</span>
        </label>
        <input
          type="text"
          value={data.label || ''}
          onChange={(e) => onChange({ ...data, label: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Description
        </label>
        <textarea
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Assignee</label>
        <input
          type="text"
          value={data.assignee || ''}
          onChange={(e) => onChange({ ...data, assignee: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          placeholder="e.g., John Doe"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Due Date</label>
        <input
          type="date"
          value={data.dueDate || ''}
          onChange={(e) => onChange({ ...data, dueDate: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>
    </div>
  );
}

// Approval Node Form
function ApprovalNodeForm({ data, onChange }: { data: ApprovalNodeData; onChange: (data: ApprovalNodeData) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Title</label>
        <input
          type="text"
          value={data.label || ''}
          onChange={(e) => onChange({ ...data, label: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Approver Role</label>
        <select
          value={data.approverRole || ''}
          onChange={(e) => onChange({ ...data, approverRole: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        >
          <option value="">Select role...</option>
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
          <option value="CTO">CTO</option>
          <option value="CEO">CEO</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Auto-approve Threshold
        </label>
        <input
          type="number"
          value={data.autoApproveThreshold || ''}
          onChange={(e) =>
            onChange({ ...data, autoApproveThreshold: parseInt(e.target.value) || 0 })
          }
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          placeholder="e.g., 1000"
        />
        <p className="text-xs text-text-secondary mt-2">
          Requests below this amount will be auto-approved
        </p>
      </div>
    </div>
  );
}

// Automated Node Form
function AutomatedNodeForm({
  data,
  onChange,
  automationActions,
}: {
  data: AutomatedNodeData;
  onChange: (data: AutomatedNodeData) => void;
  automationActions: AutomationAction[];
}) {
  const selectedAction = automationActions.find((a) => a.id === data.actionId);

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Title</label>
        <input
          type="text"
          value={data.label || ''}
          onChange={(e) => onChange({ ...data, label: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Action</label>
        <select
          value={data.actionId || ''}
          onChange={(e) =>
            onChange({
              ...data,
              actionId: e.target.value,
              actionParams: {},
            })
          }
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        >
          <option value="">Select action...</option>
          {automationActions.map((action) => (
            <option key={action.id} value={action.id}>
              {action.label}
            </option>
          ))}
        </select>
      </div>
      {selectedAction && (
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Action Parameters
          </label>
          {(selectedAction.params ?? []).map((param) => (
            <div key={param} className="mb-3">
              <label className="block text-xs font-medium text-text-secondary mb-1 capitalize">
                {param}
              </label>
              <input
                type="text"
                value={data.actionParams?.[param] || ''}
                onChange={(e) =>
                  onChange({
                    ...data,
                    actionParams: {
                      ...data.actionParams,
                      [param]: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder={`Enter ${param}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// End Node Form
function EndNodeForm({ data, onChange }: { data: EndNodeData; onChange: (data: EndNodeData) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Label</label>
        <input
          type="text"
          value={data.label || ''}
          onChange={(e) => onChange({ ...data, label: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">End Message</label>
        <textarea
          value={data.message || ''}
          onChange={(e) => onChange({ ...data, message: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          rows={3}
          placeholder="e.g., Workflow completed successfully"
        />
      </div>
      <div className="flex items-center gap-3 p-3 bg-surface-variant rounded-lg">
        <input
          type="checkbox"
          id="showSummary"
          checked={data.showSummary}
          onChange={(e) => onChange({ ...data, showSummary: e.target.checked })}
          className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
        />
        <label htmlFor="showSummary" className="text-sm text-foreground font-medium cursor-pointer flex-1">
          Show summary on completion
        </label>
      </div>
    </div>
  );
}

export default function NodeEditPanel({
  selectedNode,
  automationActions,
  onUpdateNode,
  onClose,
  onDeleteNode,
}: NodeEditPanelProps) {
  const handleDataChange = useCallback(
    (newData: WorkflowNodeData) => {
      if (selectedNode) {
        onUpdateNode(selectedNode.id, newData);
      }
    },
    [selectedNode, onUpdateNode]
  );

  if (!selectedNode) {
    return (
      <div className="w-80 bg-gradient-to-b from-surface to-surface-dim border-l border-border flex flex-col items-center justify-center text-center p-8">
        <div className="text-text-tertiary mb-2">
          <p className="text-sm font-medium">No node selected</p>
          <p className="text-xs text-text-secondary mt-1">Select a node to edit its properties</p>
        </div>
      </div>
    );
  }

  const nodeType = selectedNode.data.type;
  const nodeTypeLabels: Record<string, string> = {
    start: 'Start Node',
    task: 'Task Node',
    approval: 'Approval Node',
    automated: 'Automated Step',
    end: 'End Node',
  };

  const renderForm = () => {
    switch (nodeType) {
      case 'start':
        return (
          <StartNodeForm
            data={selectedNode.data as StartNodeData}
            onChange={handleDataChange}
          />
        );
      case 'task':
        return (
          <TaskNodeForm
            data={selectedNode.data as TaskNodeData}
            onChange={handleDataChange}
          />
        );
      case 'approval':
        return (
          <ApprovalNodeForm
            data={selectedNode.data as ApprovalNodeData}
            onChange={handleDataChange}
          />
        );
      case 'automated':
        return (
          <AutomatedNodeForm
            data={selectedNode.data as AutomatedNodeData}
            onChange={handleDataChange}
            automationActions={automationActions}
          />
        );
      case 'end':
        return (
          <EndNodeForm
            data={selectedNode.data as EndNodeData}
            onChange={handleDataChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-80 bg-gradient-to-b from-surface to-surface-dim border-l border-border flex flex-col animate-slide-in-right overflow-hidden">
      <div className="p-5 border-b border-border bg-surface flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">{nodeTypeLabels[nodeType]}</h2>
          <p className="text-xs text-text-tertiary font-medium mt-1">Configure node properties</p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onDeleteNode(selectedNode.id)}
            className="p-2.5 text-error hover:bg-error/10 rounded-lg transition-all active:scale-95"
            title="Delete node"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2.5 text-text-secondary hover:bg-surface-variant rounded-lg transition-all active:scale-95"
            title="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-5">{renderForm()}</div>
    </div>
  );
}
