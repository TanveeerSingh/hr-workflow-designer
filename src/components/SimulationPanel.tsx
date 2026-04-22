import { useCallback, useEffect, useState } from 'react';
import { Play, X, CheckCircle, XCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import type { SimulationResult, SimulationStep, WorkflowGraph } from '../types/index';
import { mockApi } from '../api/mockApi';

interface SimulationPanelProps {
  workflow: WorkflowGraph;
  isOpen: boolean;
  runTrigger: number;
  onClose: () => void;
}

function StepItem({ step, index }: { step: SimulationStep; index: number }) {
  const statusIcons = {
    pending: <Clock className="w-4 h-4 text-gray-500" />,
    running: <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />,
    completed: <CheckCircle className="w-4 h-4 text-green-500" />,
    failed: <XCircle className="w-4 h-4 text-red-600" />,
  };

  const statusColors = {
    pending: 'bg-gray-100',
    running: 'bg-blue-50 border-blue-200',
    completed: 'bg-green-50 border-green-200',
    failed: 'bg-red-50 border-red-200',
  };

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${statusColors[step.status]}`}>
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        {statusIcons[step.status]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">{index + 1}</span>
          <span className="font-medium text-sm text-gray-900 truncate">
            {step.nodeLabel}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/50 text-gray-600">
            {step.nodeType}
          </span>
        </div>
        {step.message && (
          <p className="text-xs text-gray-500 mt-1">{step.message}</p>
        )}
        <span className="text-xs text-gray-500 mt-1">
          {new Date(step.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}

export default function SimulationPanel({ workflow, isOpen, runTrigger, onClose }: SimulationPanelProps) {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const simulationResult = await mockApi.simulateWorkflow(workflow);
      setResult(simulationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed');
    } finally {
      setIsLoading(false);
    }
  }, [workflow]);

  useEffect(() => {
    if (isOpen && runTrigger > 0) {
      const timeoutId = window.setTimeout(() => {
        void runSimulation();
      }, 0);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }
  }, [isOpen, runTrigger, runSimulation]);

  if (!isOpen) return null;

  return (
    <div className="w-72 bg-gradient-to-b from-surface to-surface-dim border-l border-border shadow-elevation animate-slide-in-right flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Simulation</h2>
          <p className="text-xs text-text-tertiary font-medium mt-1">Test your workflow logic</p>
        </div>
        <button
          onClick={onClose}
          className="p-2.5 text-text-secondary hover:bg-surface-variant rounded-lg transition-all active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 border-b border-border bg-surface-dim">
        <button
          onClick={runSimulation}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Run Simulation
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {error && (
          <div className="flex items-start gap-3 p-4 bg-error/10 border border-error/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error font-medium">{error}</p>
          </div>
        )}

        {result && (
          <>
            <div
              className={`flex items-center gap-3 p-4 rounded-xl font-medium ${
                result.status === 'success'
                  ? 'bg-success/10 border border-success/20 text-success'
                  : 'bg-error/10 border border-error/20 text-error'
              }`}
            >
              {result.status === 'success' ? (
                <CheckCircle className="w-6 h-6 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 flex-shrink-0" />
              )}
              <div>
                <p>
                  {result.status === 'success' ? '✓ Workflow Executed Successfully' : '✕ Execution Failed'}
                </p>
                {result.error && (
                  <p className="text-sm text-red-600">{result.error}</p>
                )}
              </div>
            </div>

            {result.steps.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Execution Steps</h3>
                <div className="space-y-2">
                  {result.steps.map((step, index) => (
                    <StepItem key={step.nodeId} step={step} index={index} />
                  ))}
                </div>
              </div>
            )}

            {result.startedAt && result.completedAt && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Started:</span>
                  <span>{new Date(result.startedAt).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Completed:</span>
                  <span>{new Date(result.completedAt).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Duration:</span>
                  <span>
                    {(
                      new Date(result.completedAt).getTime() -
                      new Date(result.startedAt).getTime()
                    ).toFixed(0)}
                    ms
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {!result && !error && !isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Click "Test Workflow" or "Run Simulation" to execute the flow</p>
          </div>
        )}
      </div>
    </div>
  );
}
