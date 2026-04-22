import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
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
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [pendingConnectionSourceId, setPendingConnectionSourceId] = useState<string | null>(null);
  const [automationActions, setAutomationActions] = useState<AutomationAction[]>([]);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [simulationRunTrigger, setSimulationRunTrigger] = useState(0);
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

  useEffect(() => {
    if (nodes.length === 0) return;

    const frameId = window.requestAnimationFrame(() => {
      void fitView({ padding: 0.2, duration: 250 });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isSimulationOpen, nodes.length, fitView]);

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
      setPendingConnectionSourceId(null);
    },
    [setEdges]
  );

  // Node selection + click-to-connect
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const clickedNode = node as Node<WorkflowNodeData>;
    setSelectedNodeId(clickedNode.id);

    setPendingConnectionSourceId((currentSourceNodeId) => {
      if (!currentSourceNodeId) {
        // End nodes cannot start a connection.
        if (clickedNode.data.type === 'end') {
          return null;
        }
        return clickedNode.id;
      }

      // Clicking same node toggles connection mode off.
      if (currentSourceNodeId === clickedNode.id) {
        return null;
      }

      // Start nodes should not receive incoming edges.
      if (clickedNode.data.type === 'start') {
        return currentSourceNodeId;
      }

      setEdges((currentEdges) => {
        const alreadyConnected = currentEdges.some(
          (edge) => edge.source === currentSourceNodeId && edge.target === clickedNode.id
        );

        if (alreadyConnected) {
          return currentEdges;
        }

        return addEdge(
          {
            id: uuidv4(),
            source: currentSourceNodeId,
            target: clickedNode.id,
          },
          currentEdges
        );
      });

      return null;
    });
  }, [setEdges]);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setPendingConnectionSourceId(null);
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
      setSelectedNodeId((currentId) => (currentId === nodeId ? null : currentId));
      setPendingConnectionSourceId((currentId) => (currentId === nodeId ? null : currentId));
    },
    [setNodes, setEdges]
  );

  // Clear all
  const clearAll = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setPendingConnectionSourceId(null);
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
        position: { x: 140, y: 40 },
        data: {
          type: 'start',
          label: 'Employee Onboarding Trigger',
          metadata: { source: 'HRIS', event: 'new_hire' },
        },
      },
      {
        id: collectDocsId,
        type: 'task',
        position: { x: 170, y: 150 },
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
        position: { x: 170, y: 340 },
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
        position: { x: 120, y: 530 },
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
        position: { x: 190, y: 720 },
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
    setSelectedNodeId(null);
    setPendingConnectionSourceId(null);

    window.requestAnimationFrame(() => {
      void fitView({ padding: 0.2, duration: 300 });
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
  const selectedNode = selectedNodeId
    ? (nodes.find((node) => node.id === selectedNodeId) as Node<WorkflowNodeData> | undefined) ?? null
    : null;
  const pendingConnectionSource = pendingConnectionSourceId
    ? nodes.find((node) => node.id === pendingConnectionSourceId) ?? null
    : null;

  return (
    <div className="flex flex-1 h-[100dvh] gap-2 p-2 overflow-hidden">
      <NodeSidebar />

      <div className="flex-1 relative rounded-2xl border border-border/70 overflow-hidden shadow-sm">
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
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={12} size={1} />

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
                  onClick={() => {
                    setIsSimulationOpen(true);
                    setSimulationRunTrigger((count) => count + 1);
                  }}
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

              {pendingConnectionSource && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium w-full bg-primary/10 text-primary border border-primary/20">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-primary" />
                  <span className="truncate">
                    Connecting from "{pendingConnectionSource.data.label}" - click target node
                  </span>
                </div>
              )}
            </div>
          </Panel>
        </ReactFlow>

      </div>

      {isSimulationOpen ? (
        <SimulationPanel
          workflow={{ nodes, edges }}
          isOpen={isSimulationOpen}
          runTrigger={simulationRunTrigger}
          onClose={() => setIsSimulationOpen(false)}
        />
      ) : selectedNode ? (
        <NodeEditPanel
          selectedNode={selectedNode}
          automationActions={automationActions}
          onUpdateNode={updateNodeData}
          onClose={() => setSelectedNodeId(null)}
          onDeleteNode={deleteNode}
          nodes={nodes}
          edges={edges}
        />
      ) : null
      }
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
