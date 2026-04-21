import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  Panel,
  useReactFlow,
} from '@xyflow/react';
import type { Connection, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import { Play, RotateCcw, Sparkles } from 'lucide-react';

import { nodeTypes } from './nodes';
import NodeSidebar from './components/NodeSidebar';
import NodeEditPanel from './components/NodeEditPanel';
import SimulationPanel from './components/SimulationPanel';
import type { WorkflowNodeData, WorkflowNode, AutomationAction } from './types';
import { mockApi } from './api/mockApi';

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<Node<WorkflowNodeData> | null>(null);
  const [automationActions, setAutomationActions] = useState<AutomationAction[]>([]);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { screenToFlowPosition, fitView } = useReactFlow();

  // Load automation actions
  useEffect(() => {
    const loadActions = async () => {
      try {
        const actions = await mockApi.getAutomations();
        setAutomationActions(actions);
      } catch (error) {
        console.error('Failed to load automation actions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadActions();
  }, []);

  // Drag and drop handlers
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: WorkflowNode = {
        id: uuidv4(),
        type,
        position,
        data: getDefaultNodeData(type as WorkflowNodeData['type']),
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  // Get default data for new nodes
  function getDefaultNodeData(type: WorkflowNodeData['type']): WorkflowNodeData {
    switch (type) {
      case 'start':
        return { type: 'start', label: 'Start', metadata: {} };
      case 'task':
        return { type: 'task', label: 'New Task', assignee: '', description: '' };
      case 'approval':
        return { type: 'approval', label: 'Approval', approverRole: '' };
      case 'automated':
        return { type: 'automated', label: 'Automated Step' };
      case 'end':
        return { type: 'end', label: 'End', message: '', showSummary: false };
      default:
        return { type: 'task', label: 'New Task', assignee: '' };
    }
  }

  // Edge connection
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  // Node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as Node<WorkflowNodeData>);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Update node data
  const updateNodeData = useCallback(
    (nodeId: string, data: Partial<WorkflowNodeData>) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === nodeId) {
            return { ...n, data: { ...n.data, ...data } as WorkflowNodeData };
          }
          return n;
        })
      );
    },
    [setNodes]
  );

  // Delete node
  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
      setSelectedNode(null);
    },
    [setNodes, setEdges]
  );

  // Clear all
  const clearAll = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  // Load a realistic HR onboarding workflow example
  const loadExampleWorkflow = useCallback(() => {
    const startId = uuidv4();
    const collectDocsId = uuidv4();
    const managerApprovalId = uuidv4();
    const createAccountsId = uuidv4();
    const endId = uuidv4();

    const exampleNodes: WorkflowNode[] = [
      {
        id: startId,
        type: 'start',
        position: { x: 80, y: 220 },
        data: {
          type: 'start',
          label: 'Employee Onboarding Trigger',
          metadata: { source: 'HRIS', event: 'new_hire' },
        },
      },
      {
        id: collectDocsId,
        type: 'task',
        position: { x: 360, y: 220 },
        data: {
          type: 'task',
          label: 'Collect Hiring Documents',
          description: 'Gather ID proof, signed offer letter, and tax forms.',
          assignee: 'HR Operations',
          dueDate: '2026-05-15',
        },
      },
      {
        id: managerApprovalId,
        type: 'approval',
        position: { x: 640, y: 220 },
        data: {
          type: 'approval',
          label: 'Manager Budget Approval',
          approverRole: 'Manager',
          autoApproveThreshold: 2000,
        },
      },
      {
        id: createAccountsId,
        type: 'automated',
        position: { x: 920, y: 220 },
        data: {
          type: 'automated',
          label: 'Create IT Accounts + Welcome Email',
          actionId: 'send_email',
          actionParams: {
            to: 'new-hire@company.com',
            subject: 'Welcome to the team',
            body: 'Your onboarding checklist and access details are ready.',
          },
        },
      },
      {
        id: endId,
        type: 'end',
        position: { x: 1200, y: 220 },
        data: {
          type: 'end',
          label: 'Onboarding Complete',
          message: 'Employee has been onboarded successfully.',
          showSummary: true,
        },
      },
    ];

    const exampleEdges: Edge[] = [
      { id: uuidv4(), source: startId, target: collectDocsId },
      { id: uuidv4(), source: collectDocsId, target: managerApprovalId },
      { id: uuidv4(), source: managerApprovalId, target: createAccountsId },
      { id: uuidv4(), source: createAccountsId, target: endId },
    ];

    setNodes(exampleNodes);
    setEdges(exampleEdges);
    setSelectedNode(null);

    requestAnimationFrame(() => {
      fitView({ padding: 0.2, duration: 500 });
    });
  }, [fitView, setEdges, setNodes]);

  // Validation
  const validateWorkflow = useCallback((): { valid: boolean; message: string } => {
    const startNodes = nodes.filter((n) => n.data.type === 'start');
    if (startNodes.length === 0) {
      return { valid: false, message: 'Workflow must have a start node' };
    }
    if (startNodes.length > 1) {
      return { valid: false, message: 'Workflow can only have one start node' };
    }

    const endNodes = nodes.filter((n) => n.data.type === 'end');
    if (endNodes.length === 0) {
      return { valid: false, message: 'Workflow must have at least one end node' };
    }

    return { valid: true, message: 'Workflow is valid' };
  }, [nodes]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const validation = validateWorkflow();

  return (
    <div className="flex flex-1 h-screen">
      <NodeSidebar />

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Background gap={12} size={1} />
          <Controls />

          <Panel position="top-center" className="bg-gradient-to-r from-surface to-surface-dim rounded-2xl shadow-elevation border border-border p-5 backdrop-blur-xl animate-fade-in">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={loadExampleWorkflow}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-accent to-accent-light text-white rounded-lg hover:shadow-lg active:scale-95 transition-all font-medium text-sm whitespace-nowrap"
                >
                  <Sparkles className="w-5 h-5" />
                  Load Example
                </button>

                <button
                  onClick={() => setIsSimulationOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg hover:shadow-lg active:scale-95 transition-all font-medium text-sm whitespace-nowrap"
                >
                  <Play className="w-5 h-5" />
                  Test Workflow
                </button>

                <button
                  onClick={clearAll}
                  className="flex items-center gap-2 px-4 py-2.5 bg-surface text-text-secondary border border-border rounded-lg hover:bg-surface-variant hover:border-primary/30 active:scale-95 transition-all font-medium text-sm whitespace-nowrap"
                >
                  <RotateCcw className="w-5 h-5" />
                  Clear
                </button>
              </div>

              <div
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium w-full ${
                  validation.valid 
                    ? 'bg-success/10 text-success border border-success/20' 
                    : 'bg-warning/10 text-warning border border-warning/20'
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${validation.valid ? 'bg-success' : 'bg-warning'}`} />
                <span className="truncate">{validation.valid ? '✓ Valid workflow' : `⚠ ${validation.message}`}</span>
              </div>
            </div>
          </Panel>
        </ReactFlow>

        {isSimulationOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsSimulationOpen(false)}
            />
            <SimulationPanel
              workflow={{ nodes, edges }}
              isOpen={isSimulationOpen}
              onClose={() => setIsSimulationOpen(false)}
            />
          </>
        )}
      </div>

      <NodeEditPanel
        selectedNode={selectedNode}
        automationActions={automationActions}
        onUpdateNode={updateNodeData}
        onClose={() => setSelectedNode(null)}
        onDeleteNode={deleteNode}
        nodes={nodes}
        edges={edges}
      />
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

export default App;
