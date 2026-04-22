# HR Workflow Designer

[![Deploy to GitHub Pages](https://github.com/TanveeerSingh/hr-workflow-designer/actions/workflows/deploy.yml/badge.svg)](https://github.com/TanveeerSingh/hr-workflow-designer/actions/workflows/deploy.yml)

Live site: https://tanveeersingh.github.io/hr-workflow-designer/

A modern, drag-and-drop workflow designer built with React, TypeScript, and React Flow. This application allows HR administrators to visually create and test internal workflows such as onboarding, leave approval, or document verification.

## Features

### Workflow Canvas (React Flow)
- **Drag-and-drop interface**: Drag nodes from the sidebar onto the canvas
- **Multiple node types**: Start, Task, Approval, Automated Step, and End nodes
- **Edge connections**: Connect nodes by clicking one node, then the next
- **Auto-validation**: Validates workflow structure, including start/end requirements and cycle checks
- **Viewport layout**: Fixed to the screen with no page scrolling

### Node Types

#### Start Node
- Entry point for the workflow
- Configurable title and metadata key-value pairs

#### Task Node
- Human task assignments (e.g., collect documents)
- Fields: Title (required), Description, Assignee, Due Date

#### Approval Node
- Manager or HR approval steps
- Fields: Title, Approver Role (Manager, HRBP, Director, CTO, CEO), Auto-approve threshold

#### Automated Step Node
- System-triggered actions (e.g., send email, generate PDF)
- Dynamic parameters based on selected action
- Available actions: Send Email, Generate Document, Create Ticket, Slack Notification, Update Database

#### End Node
- Workflow completion marker
- Fields: Label, End Message, Summary flag

### Node Configuration Panel
- Dynamic forms for each node type
- Real-time editing of node properties
- Metadata support for Start node
- Type-safe with TypeScript interfaces

### Mock API Layer
- `GET /automations`: Returns available automated actions
- `POST /simulate`: Simulates workflow execution with step-by-step results
- Validates workflow structure (cycles, disconnected nodes, missing start/end)

### Simulation/Sandbox Panel
- Execute workflows in a sandbox environment
- Step-by-step execution log with timestamps
- Visual status indicators (pending, running, completed, failed)
- Execution time tracking
- Error reporting with clear messages

### Interaction Notes
- Load Example creates a vertical onboarding flow that stays visible on screen
- Test Workflow opens the simulation panel and runs the workflow immediately
- Node editing updates the selected node in real time

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Workflow Engine**: React Flow (@xyflow/react)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Utilities**: uuid (unique IDs)

## Architecture

```
src/
├── api/
│   └── mockApi.ts          # Mock API layer (GET /automations, POST /simulate)
├── components/
│   ├── NodeSidebar.tsx     # Draggable node sidebar
│   ├── NodeEditPanel.tsx   # Node configuration forms
│   └── SimulationPanel.tsx # Workflow testing panel
├── nodes/
│   ├── StartNode.tsx       # Start node component
│   ├── TaskNode.tsx        # Task node component
│   ├── ApprovalNode.tsx    # Approval node component
│   ├── AutomatedNode.tsx   # Automated step node component
│   ├── EndNode.tsx         # End node component
│   └── index.ts            # Node types registry
├── types/
│   └── index.ts            # TypeScript interfaces and types
├── App.tsx                 # Main application component
├── main.tsx                # Entry point
└── index.css               # Global styles + Tailwind
```

### Design Decisions

1. **Component Modularity**: Each node type has its own component file for easy extension and maintenance
2. **Type Safety**: Comprehensive TypeScript interfaces for all data structures
3. **Custom Hooks Pattern**: Used React Flow's built-in hooks (useNodesState, useEdgesState)
4. **Separation of Concerns**: API layer, UI components, and types are cleanly separated
5. **Drag and Drop**: Native HTML5 drag and drop API for node creation
6. **Validation**: Real-time workflow validation with clear error messages

## Getting Started

### Live Application
**The app is live and available at:** https://tanveeersingh.github.io/hr-workflow-designer/

No local setup is needed - just visit the link above to start designing workflows.

### Local Development

#### Prerequisites
- Node.js 18+
- npm or yarn

#### Installation

```bash
# Clone the repository
git clone https://github.com/TanveeerSingh/hr-workflow-designer.git
cd hr-workflow-designer

# Install dependencies
npm install

# Start development server
npm run dev
```

The local development server will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Usage

1. **Create a Workflow**:
   - Drag nodes from the left sidebar onto the canvas
   - Connect nodes by clicking one node, then clicking the target node

2. **Configure Nodes**:
   - Click on a node to open the configuration panel
   - Edit properties specific to each node type
   - Delete nodes using the trash icon

3. **Validate Workflow**:
   - The top toolbar shows validation status
   - Ensure you have exactly one Start node and at least one End node
   - Ensure there are no cycles or disconnected nodes

4. **Test Workflow**:
   - Click "Test Workflow" to open the simulation panel
   - The simulation runs immediately when the panel opens
   - You can click "Run Simulation" again to rerun it manually
   - View step-by-step execution results

5. **Navigate the Canvas**:
   - The app fits the workflow to the visible screen and does not scroll the page
   - Zoom in/out controls were removed to keep the layout clean and focused

## Design System

This project uses a flat design aesthetic with:
- **Primary Colors**: Blue (#2563EB) for primary actions
- **Node Colors**: Distinct colors per node type (Green, Blue, Amber, Purple, Red)
- **Typography**: Plus Jakarta Sans (body), Fira Code (monospace)
- **Spacing**: 8dp grid system
- **Animations**: 150-300ms transitions for micro-interactions

## Future Enhancements

With more time, the following features could be added:
- Export/Import workflow as JSON
- Undo/Redo functionality
- Mini-map overview panel
- Workflow validation errors visually shown on nodes
- Auto-layout for nodes
- Node version history
- Backend persistence with real database
- Real-time collaboration
- Optional zoom in/out controls as a compact toolbar

## Notes

- The current layout is optimized for a single-screen workflow canvas with fixed panels.
- Example workflows are arranged vertically so the full flow remains visible in the canvas.

## License

MIT
