/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP v2
 * Semantic Path Narrative & Dialectical Step Walker
 */

import React from 'react';
import { GraphNode, GraphEdge } from '../types';
import { Route, ArrowRight, Compass, Sparkles, ChevronRight, X } from 'lucide-react';

interface GraphPathNarrativeProps {
  pathNodeIds: string[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  onSelectNode: (node: GraphNode) => void;
  onClearPath: () => void;
}

export const GraphPathNarrative: React.FC<GraphPathNarrativeProps> = ({
  pathNodeIds,
  nodes,
  edges,
  onSelectNode,
  onClearPath,
}) => {
  if (pathNodeIds.length < 2) return null;

  const pathNodes = pathNodeIds.map((id) => nodes.find((n) => n.id === id)).filter(Boolean) as GraphNode[];

  // Find connecting relations between consecutive path nodes
  const steps = pathNodes.slice(0, -1).map((current, idx) => {
    const next = pathNodes[idx + 1];
    const edge = edges.find((e) => {
      const s = typeof e.source === 'object' ? (e.source as any).id : e.source;
      const t = typeof e.target === 'object' ? (e.target as any).id : e.target;
      return (s === current.id && t === next.id) || (s === next.id && t === current.id);
    });

    const isForward = edge ? (typeof edge.source === 'object' ? (edge.source as any).id : edge.source) === current.id : true;
    const relationName = edge?.relation?.replace(/_/g, ' ') || 'correlates with';

    return {
      from: current,
      to: next,
      relation: relationName,
      isForward,
      notes: edge?.notes,
    };
  });

  return (
    <div className="absolute top-16 left-4 z-20 max-w-md w-full bg-neutral-900/95 border border-emerald-800/80 rounded-xl shadow-2xl p-3.5 backdrop-blur-md space-y-2.5 animate-fade-in text-xs">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <div className="flex items-center gap-2">
          <Route className="w-4 h-4 text-emerald-400" />
          <h4 className="font-serif font-bold text-neutral-100">
            Semantic Dialectical Path ({pathNodes.length} Nodes)
          </h4>
        </div>
        <button onClick={onClearPath} className="text-neutral-400 hover:text-neutral-200">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="p-2 bg-neutral-950/80 rounded-lg border border-neutral-800 space-y-1"
          >
            <div className="flex items-center gap-1.5 flex-wrap font-mono text-[11px]">
              <button
                onClick={() => onSelectNode(step.from)}
                className="font-bold text-neutral-200 hover:text-amber-300 underline"
              >
                {step.from.label}
              </button>
              <span className="text-emerald-400 font-semibold px-1 py-0.2 rounded bg-emerald-950/80 border border-emerald-800 text-[10px]">
                {step.isForward ? `—[${step.relation}]→` : `←[${step.relation}]—`}
              </span>
              <button
                onClick={() => onSelectNode(step.to)}
                className="font-bold text-neutral-200 hover:text-amber-300 underline"
              >
                {step.to.label}
              </button>
            </div>
            {step.notes && (
              <p className="text-[10px] text-neutral-400 font-sans italic">{step.notes}</p>
            )}
          </div>
        ))}
      </div>

      <div className="text-[10px] text-neutral-500 font-mono flex justify-between items-center pt-1 border-t border-neutral-800">
        <span>Click node names to focus inspector</span>
        <button onClick={onClearPath} className="text-emerald-400 hover:underline">
          Reset Path
        </button>
      </div>
    </div>
  );
};
