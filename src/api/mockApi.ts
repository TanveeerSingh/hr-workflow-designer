import type { AutomationAction, SimulationResult, SimulationStep, WorkflowGraph } from '../types/index';

// Mock automation actions
const mockAutomationActions: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'create_ticket', label: 'Create Ticket', params: ['title', 'description', 'assignee'] },
  { id: 'slack_notification', label: 'Slack Notification', params: ['channel', 'message'] },
  { id: 'update_database', label: 'Update Database', params: ['table', 'record_id'] },
];

// Simulate delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API functions
export const mockApi = {
  // GET /automations
  getAutomations: async (): Promise<AutomationAction[]> => {
    await delay(300); // Simulate network delay
    return [...mockAutomationActions];
  },

  // POST /simulate
  simulateWorkflow: async (workflow: WorkflowGraph): Promise<SimulationResult> => {
    await delay(500); // Simulate network delay

    const { nodes, edges } = workflow;
    const steps: SimulationStep[] = [];
    const startedAt = new Date().toISOString();

    // Find start node
    const startNode = nodes.find((n) => n.data.type === 'start');
    if (!startNode) {
      return {
        workflowId: `wf-${Date.now()}`,
        status: 'error',
        steps: [],
        error: 'No start node found in workflow',
        startedAt,
        completedAt: new Date().toISOString(),
      };
    }

    // Validate workflow structure
    const validation = validateWorkflow(nodes, edges);
    if (!validation.valid) {
      return {
        workflowId: `wf-${Date.now()}`,
        status: 'error',
        steps: [],
        error: validation.error,
        startedAt,
        completedAt: new Date().toISOString(),
      };
    }

    // Build adjacency list for traversal
    const adjacencyList = new Map<string, string[]>();
    edges.forEach((edge) => {
      if (!adjacencyList.has(edge.source)) {
        adjacencyList.set(edge.source, []);
      }
      adjacencyList.get(edge.source)!.push(edge.target);
    });

    // Traverse workflow
    const visited = new Set<string>();
    const queue: string[] = [startNode.id];

    while (queue.length > 0) {
      const currentId = queue.shift()!;

      if (visited.has(currentId)) continue;
      visited.add(currentId);

      const node = nodes.find((n) => n.id === currentId);
      if (!node) continue;

      // Add step
      const step: SimulationStep = {
        nodeId: currentId,
        nodeType: node.data.type,
        nodeLabel: node.data.label || `${node.data.type} node`,
        status: 'completed',
        timestamp: new Date().toISOString(),
      };

      // Simulate node-specific execution
      switch (node.data.type) {
        case 'start':
          step.message = 'Workflow started';
          break;
        case 'task': {
          const taskData = node.data as { assignee?: string };
          step.message = `Task "${node.data.label}" assigned to ${taskData.assignee || 'unassigned'}`;
          break;
        }
        case 'approval': {
          const approvalData = node.data as { approverRole?: string };
          step.message = `Waiting for approval from ${approvalData.approverRole || 'approver'}`;
          break;
        }
        case 'automated': {
          const autoData = node.data as { actionId?: string };
          step.message = `Executed automated action: ${autoData.actionId || 'unknown'}`;
          break;
        }
        case 'end': {
          const endData = node.data as { message?: string };
          step.message = endData.message || 'Workflow completed';
          break;
        }
      }

      steps.push(step);

      // Add next nodes to queue
      const nextNodes = adjacencyList.get(currentId) || [];
      nextNodes.forEach((nextId) => {
        if (!visited.has(nextId)) {
          queue.push(nextId);
        }
      });
    }

    return {
      workflowId: `wf-${Date.now()}`,
      status: 'success',
      steps,
      startedAt,
      completedAt: new Date().toISOString(),
    };
  },
};

// Workflow validation
function validateWorkflow(
  nodes: WorkflowGraph['nodes'],
  edges: WorkflowGraph['edges']
): { valid: boolean; error?: string } {
  // Check for start node
  const startNodes = nodes.filter((n) => n.data.type === 'start');
  if (startNodes.length === 0) {
    return { valid: false, error: 'Workflow must have a start node' };
  }
  if (startNodes.length > 1) {
    return { valid: false, error: 'Workflow can only have one start node' };
  }

  // Check for end node
  const endNodes = nodes.filter((n) => n.data.type === 'end');
  if (endNodes.length === 0) {
    return { valid: false, error: 'Workflow must have at least one end node' };
  }

  // Check for cycles
  const hasCycle = detectCycle(nodes, edges);
  if (hasCycle) {
    return { valid: false, error: 'Workflow contains a cycle' };
  }

  // Check for disconnected nodes
  const connectedNodeIds = new Set<string>();
  const startNode = startNodes[0];

  // Build adjacency list
  const adjacencyList = new Map<string, string[]>();
  edges.forEach((edge) => {
    if (!adjacencyList.has(edge.source)) {
      adjacencyList.set(edge.source, []);
    }
    adjacencyList.get(edge.source)!.push(edge.target);
  });

  // Traverse from start
  const queue = [startNode.id];
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (connectedNodeIds.has(currentId)) continue;
    connectedNodeIds.add(currentId);

    const nextNodes = adjacencyList.get(currentId) || [];
    nextNodes.forEach((nextId) => {
      if (!connectedNodeIds.has(nextId)) {
        queue.push(nextId);
      }
    });
  }

  const disconnectedNodes = nodes.filter((n) => !connectedNodeIds.has(n.id));
  if (disconnectedNodes.length > 0) {
    return {
      valid: false,
      error: `Disconnected nodes found: ${disconnectedNodes.map((n) => n.data.label || n.id).join(', ')}`,
    };
  }

  return { valid: true };
}

// Cycle detection using DFS
function detectCycle(
  nodes: WorkflowGraph['nodes'],
  edges: WorkflowGraph['edges']
): boolean {
  const adjacencyList = new Map<string, string[]>();
  edges.forEach((edge) => {
    if (!adjacencyList.has(edge.source)) {
      adjacencyList.set(edge.source, []);
    }
    adjacencyList.get(edge.source)!.push(edge.target);
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }

  return false;
}
