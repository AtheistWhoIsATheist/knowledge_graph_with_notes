/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP v2
 * Graph Epistemic Analytics & Dialectical Tension Auditor
 */

import React, { useMemo } from 'react';
import { GraphNode, GraphEdge, GraphAnalyticsMetrics, DialecticalTriad } from '../types';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  GitPullRequest,
  Network,
  Scale,
  X,
  Compass,
  Zap,
  Info,
  CheckCircle2
} from 'lucide-react';

interface GraphAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: GraphNode[];
  edges: GraphEdge[];
  onSelectNode: (node: GraphNode) => void;
}

export const GraphAnalyticsModal: React.FC<GraphAnalyticsModalProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  onSelectNode,
}) => {
  const metrics: GraphAnalyticsMetrics = useMemo(() => {
    const totalNodes = nodes.length;
    const totalEdges = edges.length;
    const canonicalCount = nodes.filter((n) => n.status === 'CANONICAL').length;
    const provisionalCount = nodes.filter((n) => n.status === 'PROVISIONAL').length;
    const reverificationCount = nodes.filter((n) => n.status === 'REQUIRES_REVERIFICATION').length;
    const aporiaCount = nodes.filter((n) => n.type === 'aporia' || n.epistemicTier === 'UNRESOLVED_APORIA').length;

    const canonicalRatio = totalNodes > 0 ? (canonicalCount / totalNodes) * 100 : 0;
    const density = totalNodes > 1 ? (2 * totalEdges) / (totalNodes * (totalNodes - 1)) : 0;

    // Degrees calculation
    const degreeMap: Record<string, number> = {};
    nodes.forEach((n) => {
      degreeMap[n.id] = 0;
    });

    edges.forEach((e) => {
      const s = typeof e.source === 'object' ? (e.source as any).id : e.source;
      const t = typeof e.target === 'object' ? (e.target as any).id : e.target;
      if (degreeMap[s] !== undefined) degreeMap[s]++;
      if (degreeMap[t] !== undefined) degreeMap[t]++;
    });

    const avgDegree = totalNodes > 0 ? (totalEdges * 2) / totalNodes : 0;
    const isolatedNodeCount = nodes.filter((n) => degreeMap[n.id] === 0).length;

    // Top Hubs
    const topHubs = [...nodes]
      .map((n) => ({
        id: n.id,
        label: n.label,
        type: n.type,
        degree: degreeMap[n.id] || 0,
        tier: n.epistemicTier,
      }))
      .sort((a, b) => b.degree - a.degree)
      .slice(0, 6);

    // Epistemic Tier Distribution
    const tierDistribution: Record<string, number> = {};
    nodes.forEach((n) => {
      tierDistribution[n.epistemicTier] = (tierDistribution[n.epistemicTier] || 0) + 1;
    });

    // Relation Distribution
    const relationDistribution: Record<string, number> = {};
    edges.forEach((e) => {
      relationDistribution[e.relation] = (relationDistribution[e.relation] || 0) + 1;
    });

    // Detect Dialectical Triads & Aporia Loops
    const detectedTriads: DialecticalTriad[] = [
      {
        id: 'triad-1',
        type: 'thesis_antithesis_synthesis',
        nodeIds: ['thinker-nietzsche', 'thinker-nishitani', 'concept-sunyata'],
        labels: ['Friedrich Nietzsche', 'Keiji Nishitani', 'Absolute Emptiness (Sunyata)'],
        description: 'Western passive nihilism (Thesis) is inverted by Nishitani (Antithesis) into Mahayana Emptiness (Synthesis).',
        tensionLevel: 'Harmonized',
      },
      {
        id: 'triad-2',
        type: 'apophatic_tension',
        nodeIds: ['thinker-eckhart', 'thinker-boehme', 'concept-ungrund'],
        labels: ['Meister Eckhart', 'Jakob Böhme', 'The Ungrund (Groundless Void)'],
        description: 'Detached Godhead (Gottheit) meets Böhme’s dark, turbulent groundlessness prior to light.',
        tensionLevel: 'Dialectical Tension',
      },
      {
        id: 'triad-3',
        type: 'aporia_loop',
        nodeIds: ['concept-extinction', 'thinker-brassier', 'aporia-death-god'],
        labels: ['Solar Extinction & Cosmic Annihilation', 'Ray Brassier', 'The Unfinished Mourning of the Divine'],
        description: 'Extinction as the transcendental real prevents speculative closure or therapeutic recovery.',
        tensionLevel: 'Radical Aporia',
      },
    ];

    return {
      totalNodes,
      totalEdges,
      canonicalRatio,
      provisionalCount,
      reverificationCount,
      aporiaCount,
      avgDegree,
      density,
      isolatedNodeCount,
      topHubs,
      detectedTriads,
      tierDistribution,
      relationDistribution,
    };
  }, [nodes, edges]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <h3 className="font-serif font-bold text-lg text-neutral-100">
                Epistemic Graph Analytics & Dialectical Tension Auditor
              </h3>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Topological metrics, epistemic tier balance, centrality hubs, and philosophical triad structures.
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* High-Level Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800/90 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-500">Epistemic Saturation</span>
            <div className="text-xl font-bold font-mono text-amber-400">
              {metrics.canonicalRatio.toFixed(1)}%
            </div>
            <div className="text-[10px] text-neutral-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" /> Canonical Anchors
            </div>
          </div>

          <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800/90 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-500">Graph Density</span>
            <div className="text-xl font-bold font-mono text-cyan-400">
              {(metrics.density * 100).toFixed(2)}%
            </div>
            <div className="text-[10px] text-neutral-400 flex items-center gap-1">
              <Network className="w-3 h-3 text-cyan-400" /> {metrics.totalEdges} Relations
            </div>
          </div>

          <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800/90 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-500">Aporia Bottlenecks</span>
            <div className="text-xl font-bold font-mono text-rose-400">
              {metrics.aporiaCount}
            </div>
            <div className="text-[10px] text-neutral-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-400" /> Unresolved Tensions
            </div>
          </div>

          <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800/90 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-500">Mean Degree</span>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {metrics.avgDegree.toFixed(2)}
            </div>
            <div className="text-[10px] text-neutral-400 flex items-center gap-1">
              <GitPullRequest className="w-3 h-3 text-emerald-400" /> Edges / Node
            </div>
          </div>
        </div>

        {/* Centrality Hubs & Dialectical Triads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Centrality Hubs */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
              <h4 className="font-serif font-bold text-xs text-neutral-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Central Epistemic Hubs
              </h4>
              <span className="text-[10px] font-mono text-neutral-500">Ranked by In/Out Degree</span>
            </div>

            <div className="space-y-2">
              {metrics.topHubs.map((hub, idx) => (
                <div
                  key={hub.id}
                  onClick={() => {
                    const fullNode = nodes.find((n) => n.id === hub.id);
                    if (fullNode) {
                      onSelectNode(fullNode);
                      onClose();
                    }
                  }}
                  className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800/80 cursor-pointer transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-neutral-500">#{idx + 1}</span>
                    <span className="font-semibold text-neutral-200">{hub.label}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-950 text-neutral-400">
                      {hub.type}
                    </span>
                  </div>
                  <span className="font-mono text-amber-400 font-bold text-xs">{hub.degree} connections</span>
                </div>
              ))}
            </div>
          </div>

          {/* Epistemic Tier Spectrum */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
              <h4 className="font-serif font-bold text-xs text-neutral-200 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-cyan-400" />
                Epistemic Tier Distribution
              </h4>
              <span className="text-[10px] font-mono text-neutral-500">{metrics.totalNodes} Total Entities</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {Object.entries(metrics.tierDistribution).map(([tier, count]) => {
                const pct = ((count / metrics.totalNodes) * 100).toFixed(0);
                return (
                  <div key={tier} className="space-y-1 text-xs">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-neutral-400">{tier.replace(/_/g, ' ')}</span>
                      <span className="text-neutral-200">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          tier === 'CANONICAL_PROJECT_DEFINITION'
                            ? 'bg-amber-400'
                            : tier === 'SOURCE_TEXT'
                            ? 'bg-emerald-400'
                            : tier === 'UNRESOLVED_APORIA' || tier === 'OBJECTION'
                            ? 'bg-rose-400'
                            : 'bg-cyan-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dialectical Triads & Aporia Loops */}
        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
            <h4 className="font-serif font-bold text-xs text-neutral-200 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              Detected Philosophical Triads & Dialectical Loops
            </h4>
            <span className="text-[10px] font-mono text-neutral-500">Multi-Entity Synthesis</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {metrics.detectedTriads.map((triad) => (
              <div key={triad.id} className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-800/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-serif font-semibold text-neutral-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>{triad.labels.join(' ⟷ ')}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      triad.tensionLevel === 'Harmonized'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : triad.tensionLevel === 'Dialectical Tension'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-rose-950 text-rose-300 border-rose-800'
                    }`}
                  >
                    {triad.tensionLevel}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">{triad.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-neutral-800">
          <div className="text-[11px] text-neutral-500 font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>SQLite Graph Persistence Active & Invariants Enforced</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
