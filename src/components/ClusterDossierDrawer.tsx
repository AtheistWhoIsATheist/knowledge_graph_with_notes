/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP v2
 * Thematic Cluster Dossier & Macro-Epistemic Inspector
 */

import React from 'react';
import { ThematicCluster, GraphNode, GraphEdge, ClusterInterConnection, WorkspaceTab } from '../types';
import {
  Layers,
  Sparkles,
  Scale,
  Users,
  GitBranch,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Filter,
  Download,
  BookOpen,
  X,
  Zap,
  Compass,
  CheckCircle2
} from 'lucide-react';

interface ClusterDossierDrawerProps {
  cluster: ThematicCluster | null;
  onClose: () => void;
  nodes: GraphNode[];
  edges: GraphEdge[];
  interConnections: ClusterInterConnection[];
  onSelectNode: (node: GraphNode) => void;
  onFilterToCluster: (cluster: ThematicCluster) => void;
  onNavigateToTab?: (tab: WorkspaceTab, contextNode?: GraphNode) => void;
}

export const ClusterDossierDrawer: React.FC<ClusterDossierDrawerProps> = ({
  cluster,
  onClose,
  nodes,
  edges,
  interConnections,
  onSelectNode,
  onFilterToCluster,
  onNavigateToTab,
}) => {
  if (!cluster) return null;

  const clusterNodes = nodes.filter((n) => cluster.nodeIds.includes(n.id));
  const thinkers = clusterNodes.filter((n) => n.type === 'thinker');
  const concepts = clusterNodes.filter((n) => n.type === 'concept');
  const aporias = clusterNodes.filter((n) => n.type === 'aporia');
  const canonicalCount = clusterNodes.filter((n) => n.status === 'CANONICAL').length;

  // Find outward & inward connections to other clusters
  const outgoing = interConnections.filter((c) => c.sourceClusterId === cluster.id);
  const incoming = interConnections.filter((c) => c.targetClusterId === cluster.id);

  // Export Cluster Dossier as JSON or Markdown
  const handleExportDossier = () => {
    const markdown = `# Thematic Cluster Dossier: ${cluster.name}
**Subtitle:** ${cluster.subtitle}
**Dominant Tradition:** ${cluster.dominantTradition}
**Epistemic Health:** ${cluster.epistemicHealth} (Tension Score: ${cluster.internalTensionScore}/100)
**Confidence Index:** ${(cluster.totalConfidence * 100).toFixed(1)}%

## Core Philosophical Thesis
${cluster.coreThesis}

## Quantitative Composition
- **Total Entities:** ${clusterNodes.length} (${canonicalCount} Canonical Anchors)
- **Thinkers:** ${thinkers.map((t) => t.label).join(', ') || 'None'}
- **Key Concepts:** ${concepts.map((c) => c.label).join(', ') || 'None'}
- **Unresolved Aporias:** ${aporias.map((a) => a.label).join(', ') || 'None'}

## Inter-Cluster Relational Bridges
${outgoing.map((o) => `- **[${o.dominantRelation.toUpperCase()}]** → Cluster ${o.targetClusterId} (${o.edgeCount} links)`).join('\n')}

---
*Generated via NIHILTHEISM Knowledge Graph Epistemic Kernel*
`;
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thematic_cluster_${cluster.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <aside
      aria-label="Thematic Cluster Dossier"
      className="absolute top-0 right-0 bottom-0 w-full sm:w-96 bg-neutral-900/98 border-l border-neutral-800 p-5 flex flex-col justify-between overflow-y-auto z-30 shadow-2xl backdrop-blur-xl animate-fade-in"
    >
      <div className="space-y-4">
        {/* Header with Cluster Color & Close */}
        <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-4 h-4 rounded-full shadow-lg"
              style={{ backgroundColor: cluster.color, boxShadow: `0 0 10px ${cluster.color}` }}
            />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                Thematic Cluster • {clusterNodes.length} Entities
              </span>
              <h3 className="font-serif font-bold text-base text-neutral-100 leading-snug">
                {cluster.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subtitle & Badges */}
        <p className="text-xs text-neutral-400 italic font-serif leading-relaxed">
          {cluster.subtitle}
        </p>

        <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded bg-neutral-950 text-neutral-300 border border-neutral-800">
            {cluster.dominantTradition}
          </span>
          <span
            className={`px-2 py-0.5 rounded border ${
              cluster.epistemicHealth === 'Robust'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                : cluster.epistemicHealth === 'Moderate'
                ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                : 'bg-rose-950/80 text-rose-300 border-rose-800'
            }`}
          >
            Health: {cluster.epistemicHealth}
          </span>
          <span className="px-2 py-0.5 rounded bg-neutral-950 text-amber-400 border border-neutral-800">
            Tension: {cluster.internalTensionScore}/100
          </span>
        </div>

        {/* Core Philosophical Thesis */}
        <div className="bg-neutral-950/90 p-3.5 rounded-xl border border-neutral-800 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-neutral-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Core Philosophical Thesis</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
            {cluster.coreThesis}
          </p>
        </div>

        {/* Key Thinkers & Entities List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-serif font-bold text-neutral-300">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              Member Entities ({clusterNodes.length})
            </span>
            <span className="text-[10px] font-mono text-neutral-500">{canonicalCount} Canonical</span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {clusterNodes.map((node) => (
              <div
                key={node.id}
                onClick={() => onSelectNode(node)}
                className="flex items-center justify-between p-2 rounded-lg bg-neutral-950/70 hover:bg-neutral-800 border border-neutral-800/80 cursor-pointer transition-colors text-xs group"
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      node.status === 'CANONICAL' ? 'bg-amber-400' : 'bg-neutral-500'
                    }`}
                  />
                  <span className="font-medium text-neutral-200 group-hover:text-amber-300 truncate">
                    {node.label}
                  </span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-900 text-neutral-400">
                  {node.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Inter-Cluster Relational Flow */}
        {(outgoing.length > 0 || incoming.length > 0) && (
          <div className="space-y-2 pt-1 border-t border-neutral-800">
            <div className="text-xs font-serif font-bold text-neutral-300 flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-purple-400" />
              <span>Macro Dialectical Bridges</span>
            </div>
            <div className="space-y-1 text-xs font-mono">
              {outgoing.map((out) => (
                <div
                  key={out.id}
                  className="flex items-center justify-between p-1.5 rounded bg-neutral-950 border border-neutral-800/80 text-[11px]"
                >
                  <span className="text-neutral-400">
                    → [{out.dominantRelation}] → <strong className="text-neutral-200">Cluster {out.targetClusterId}</strong>
                  </span>
                  <span className="text-amber-400 font-bold">{out.edgeCount}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-neutral-800 space-y-2">
        <button
          onClick={() => onFilterToCluster(cluster)}
          className="w-full flex items-center justify-center gap-2 py-2 bg-amber-900/80 hover:bg-amber-800 border border-amber-700 text-amber-200 rounded-lg text-xs font-semibold transition-colors"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Isolate Graph to This Cluster</span>
        </button>

        <button
          onClick={handleExportDossier}
          className="w-full flex items-center justify-center gap-2 py-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-lg text-xs font-medium transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Cluster Dossier (.md)</span>
        </button>
      </div>
    </aside>
  );
};
