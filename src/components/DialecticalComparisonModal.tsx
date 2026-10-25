/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP Ω³
 * Constructive Dialectical Synthesis Engine (REN Workstation Core)
 *
 * Invariant: Constructive Synthesis Over Adversarial Critique.
 * Confronting absolute groundlessness dissolves the reified ego and reveals an ineffable presence:
 * a timeless, otherworldly realm of pure potentiality akin to Plato's eternal Forms.
 * Formulates substantive conclusion propositions and commits new synthetic nodes to the live graph.
 */

import React, { useState, useMemo } from 'react';
import { GraphNode, GraphEdge, EdgeRelation } from '../types';
import {
  Sparkles,
  Zap,
  CheckCircle,
  X,
  Split,
  PlusCircle,
  ShieldCheck,
  Compass,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface DialecticalComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: GraphNode[];
  edges: GraphEdge[];
  initialNodeA?: GraphNode | null;
  initialNodeB?: GraphNode | null;
  onCreateEdge: (source: string, target: string, relation: EdgeRelation, weight: number) => void;
  onSelectNode: (node: GraphNode) => void;
  onCommitSynthesis?: (
    node: Partial<GraphNode>,
    edgeA: { source: string; target: string; relation: EdgeRelation; weight: number },
    edgeB: { source: string; target: string; relation: EdgeRelation; weight: number }
  ) => void;
}

export const DialecticalComparisonModal: React.FC<DialecticalComparisonModalProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  initialNodeA,
  initialNodeB,
  onCreateEdge,
  onSelectNode,
  onCommitSynthesis,
}) => {
  const [nodeAId, setNodeAId] = useState<string>(initialNodeA?.id || (nodes[0]?.id ?? ''));
  const [nodeBId, setNodeBId] = useState<string>(
    initialNodeB?.id || (nodes[1]?.id ?? nodes[0]?.id ?? '')
  );

  const [selectedRelation, setSelectedRelation] = useState<EdgeRelation>('synthesizes');
  const [edgeCreatedSuccess, setEdgeCreatedSuccess] = useState<boolean>(false);
  const [nodeCommittedSuccess, setNodeCommittedSuccess] = useState<boolean>(false);
  const [customSynthesisTitle, setCustomSynthesisTitle] = useState<string>('');

  const nodeA = useMemo(() => nodes.find((n) => n.id === nodeAId), [nodes, nodeAId]);
  const nodeB = useMemo(() => nodes.find((n) => n.id === nodeBId), [nodes, nodeBId]);

  // Direct Edge between A and B
  const directEdge = useMemo(() => {
    if (!nodeAId || !nodeBId) return null;
    return edges.find((e) => {
      const s = typeof e.source === 'object' ? (e.source as any).id : e.source;
      const t = typeof e.target === 'object' ? (e.target as any).id : e.target;
      return (s === nodeAId && t === nodeBId) || (s === nodeBId && t === nodeAId);
    });
  }, [edges, nodeAId, nodeBId]);

  // Shared Neighbors
  const sharedNeighbors = useMemo(() => {
    if (!nodeAId || !nodeBId) return [];
    const getNeighbors = (id: string) => {
      const set = new Set<string>();
      edges.forEach((e) => {
        const s = typeof e.source === 'object' ? (e.source as any).id : e.source;
        const t = typeof e.target === 'object' ? (e.target as any).id : e.target;
        if (s === id) set.add(t);
        if (t === id) set.add(s);
      });
      return set;
    };
    const setA = getNeighbors(nodeAId);
    const setB = getNeighbors(nodeBId);
    const commonIds = Array.from(setA).filter((id) => setB.has(id));
    return nodes.filter((n) => commonIds.includes(n.id));
  }, [nodes, edges, nodeAId, nodeBId]);

  // Constructive Synthesis Evaluation: Groundlessness Vector, Phenomenological Convergence, & Substantive Conclusion Proposition
  const constructiveSynthesis = useMemo(() => {
    if (!nodeA || !nodeB) return null;

    const labelA = nodeA.label;
    const labelB = nodeB.label;
    const tradA = nodeA.tradition || nodeA.lens;
    const tradB = nodeB.tradition || nodeB.lens;

    // 1. Shared Groundlessness Vector
    const groundlessnessVector = `Both ${labelA} (${tradA}) and ${labelB} (${tradB}) dismantle conventional metaphysical security by interrogating the baseline contingency of being. The vector passes directly through the cessation of ontotheological self-sufficiency.`;

    // 2. Phenomenological Convergence
    const phenomenologicalConvergence = `In confronting absolute groundlessness, ${labelA} strips away egological mastery while ${labelB} empties conceptual idolatry. Their convergence discloses an experiential clearing: ungraspable by propositional dogma yet undeniably present as pure unconditioned openness.`;

    // 3. Substantive Conclusion Proposition (Constructive Realization)
    const substantiveProposition = `Through the crucible of absolute negation, ${labelA} and ${labelB} are sublatively realized: not in permanent undecidability, but as complementary conduits into the timeless realm of eternal potentiality—where the dissolved self accesses an uncreated horizon of transcendent form and ethical clarity.`;

    const proposedTitle = `Synthesis: ${labelA.split(' ')[0]}–${labelB.split(' ')[0]} Transcendence`;

    return {
      groundlessnessVector,
      phenomenologicalConvergence,
      substantiveProposition,
      proposedTitle,
    };
  }, [nodeA, nodeB]);

  // Handle establishing direct relation
  const handleCreateConnection = () => {
    if (!nodeAId || !nodeBId || nodeAId === nodeBId) return;
    onCreateEdge(nodeAId, nodeBId, selectedRelation, 0.92);
    setEdgeCreatedSuccess(true);
    setTimeout(() => setEdgeCreatedSuccess(false), 3000);
  };

  // Commit Synthesis Node into Knowledge Graph
  const handleCommitSynthesisNode = () => {
    if (!nodeA || !nodeB || !constructiveSynthesis) return;

    const synthTitle = customSynthesisTitle.trim() || constructiveSynthesis.proposedTitle;
    const synthId = `synthesis-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const newNode: Partial<GraphNode> = {
      id: synthId,
      label: synthTitle,
      type: 'claim',
      category: 'Concept Forge Term',
      epistemicTier: 'NIHILTHEISTIC_RECONSTRUCTION',
      status: 'PROVISIONAL',
      depth: 3,
      confidence: 0.95,
      description: constructiveSynthesis.substantiveProposition,
      tradition: 'Constructive Dialectical Synthesis',
      period: '2026 / Post-Nihilistic Horizon',
      tags: ['Constructive Synthesis', 'Realm of Forms', nodeA.label, nodeB.label],
      lens: 'Radical Immanence',
      provenance: {
        origin: 'working_graph',
        creator: 'Constructive Synthesis Engine',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        epistemicJustification: `Substantive synthesis derived from dialectical intersection of ${nodeA.label} and ${nodeB.label}.`,
      },
    };

    if (onCommitSynthesis) {
      onCommitSynthesis(
        newNode,
        { source: nodeA.id, target: synthId, relation: 'synthesizes', weight: 0.95 },
        { source: nodeB.id, target: synthId, relation: 'synthesizes', weight: 0.95 }
      );
    } else {
      // Fallback: create direct edges if callback not provided
      onCreateEdge(nodeA.id, nodeB.id, 'synthesizes', 0.95);
    }

    setNodeCommittedSuccess(true);
    setTimeout(() => setNodeCommittedSuccess(false), 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#090B10] border border-cyan-500/30 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-cyan-900/40 flex items-center justify-between bg-[#050508]/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-slate-100 flex items-center gap-2">
                Constructive Dialectical Synthesis Engine
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Ω³ Synthesizer
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Groundlessness Vector Mapping • Phenomenological Convergence • Realization of Eternal Forms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Entity Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            {/* Entity A */}
            <div className="bg-[#0c0f17] p-4 rounded-xl border border-amber-500/30 space-y-2.5 flex flex-col justify-between">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
                  Entity A (Thesis / Apophatic Ground)
                </label>
                <select
                  value={nodeAId}
                  onChange={(e) => setNodeAId(e.target.value)}
                  className="w-full bg-[#11151F] border border-amber-500/40 rounded-lg p-2 text-xs text-slate-100 focus:border-amber-400 focus:outline-none font-sans"
                >
                  {nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label} ({n.type} • {n.tradition || n.lens})
                    </option>
                  ))}
                </select>
              </div>
              {nodeA && (
                <div className="text-xs space-y-1.5 text-slate-300 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="text-amber-300 font-semibold">{nodeA.tradition || nodeA.lens}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60">
                      {nodeA.epistemicTier}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
                    {nodeA.description}
                  </p>
                </div>
              )}
            </div>

            {/* Entity B */}
            <div className="bg-[#0c0f17] p-4 rounded-xl border border-cyan-500/30 space-y-2.5 flex flex-col justify-between">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1">
                  Entity B (Antithesis / Horizon of Negative Presence)
                </label>
                <select
                  value={nodeBId}
                  onChange={(e) => setNodeBId(e.target.value)}
                  className="w-full bg-[#11151F] border border-cyan-500/40 rounded-lg p-2 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none font-sans"
                >
                  {nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label} ({n.type} • {n.tradition || n.lens})
                    </option>
                  ))}
                </select>
              </div>
              {nodeB && (
                <div className="text-xs space-y-1.5 text-slate-300 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="text-cyan-300 font-semibold">{nodeB.tradition || nodeB.lens}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
                      {nodeB.epistemicTier}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
                    {nodeB.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Constructive Synthesis Triad */}
          {constructiveSynthesis && (
            <div className="bg-[#0c0f17] p-4 rounded-xl border border-slate-800 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span className="font-serif font-bold text-sm text-slate-100">
                    Constructive Synthesis Evaluation
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Constructive Realization
                </span>
              </div>

              {/* 3 Pillars of Synthesis */}
              <div className="space-y-2.5 text-xs font-sans">
                {/* 1. Shared Groundlessness Vector */}
                <div className="p-3 rounded-lg bg-[#11151F] border border-amber-500/20">
                  <strong className="text-amber-400 font-mono text-[10px] uppercase block mb-1 flex items-center gap-1.5">
                    <Compass className="w-3 h-3" />
                    1. Shared Groundlessness Vector
                  </strong>
                  <span className="text-slate-300 leading-relaxed block">
                    {constructiveSynthesis.groundlessnessVector}
                  </span>
                </div>

                {/* 2. Phenomenological Convergence */}
                <div className="p-3 rounded-lg bg-[#11151F] border border-cyan-500/20">
                  <strong className="text-cyan-400 font-mono text-[10px] uppercase block mb-1 flex items-center gap-1.5">
                    <Zap className="w-3 h-3" />
                    2. Phenomenological Convergence
                  </strong>
                  <span className="text-slate-300 leading-relaxed block">
                    {constructiveSynthesis.phenomenologicalConvergence}
                  </span>
                </div>

                {/* 3. Substantive Conclusion Proposition */}
                <div className="p-3 rounded-lg bg-[#0e1726] border border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.06)]">
                  <strong className="text-cyan-300 font-mono text-[10px] uppercase block mb-1 flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    3. Substantive Conclusion Proposition (The Realm of Forms)
                  </strong>
                  <span className="text-slate-100 leading-relaxed block font-serif text-[13px]">
                    "{constructiveSynthesis.substantiveProposition}"
                  </span>
                </div>
              </div>

              {/* Commit Synthesis Node Section */}
              <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder={constructiveSynthesis.proposedTitle}
                  value={customSynthesisTitle}
                  onChange={(e) => setCustomSynthesisTitle(e.target.value)}
                  className="flex-1 bg-[#11151F] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                />
                <button
                  onClick={handleCommitSynthesisNode}
                  disabled={nodeAId === nodeBId}
                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold shadow-[0_0_15px_rgba(0,240,255,0.25)] flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                >
                  <PlusCircle className="w-4 h-4 text-cyan-200" />
                  <span>Commit Synthesis Node to Graph</span>
                </button>
              </div>

              {nodeCommittedSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Substantive conclusion synthesized and integrated into active graph topology.</span>
                </div>
              )}
            </div>
          )}

          {/* Shared Neighbors & Intermediaries */}
          <div className="bg-[#0c0f17] p-4 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-serif font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Split className="w-3.5 h-3.5 text-cyan-400" />
                Shared Conceptual Intermediaries ({sharedNeighbors.length})
              </span>
            </div>
            {sharedNeighbors.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {sharedNeighbors.map((sn) => (
                  <button
                    key={sn.id}
                    onClick={() => onSelectNode(sn)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#11151F] hover:bg-[#1a2130] border border-slate-700 text-slate-200 text-xs transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{sn.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Direct dialectical poles: No immediate 1-hop shared intermediary. Bridging these entities directly produces novel synthetic insight.
              </p>
            )}
          </div>

          {/* Create Epistemic Edge Form */}
          <div className="bg-[#0c0f17] p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-slate-200 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                Assert Direct Dialectical Edge
              </span>
              {directEdge && (
                <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                  Active Edge: [{directEdge.relation}]
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <select
                value={selectedRelation}
                onChange={(e) => setSelectedRelation(e.target.value as EdgeRelation)}
                className="w-full sm:w-1/2 bg-[#11151F] border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono focus:border-amber-400 focus:outline-none"
              >
                <option value="synthesizes">synthesizes</option>
                <option value="grounds">grounds</option>
                <option value="apophatic_counterpart">apophatic_counterpart</option>
                <option value="phenomenologically_discloses">phenomenologically_discloses</option>
                <option value="radicalizes">radicalizes</option>
                <option value="inverts">inverts</option>
                <option value="deconstructs">deconstructs</option>
                <option value="critiques">critiques</option>
                <option value="opposes">opposes</option>
              </select>

              <button
                onClick={handleCreateConnection}
                disabled={nodeAId === nodeBId}
                className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-2 bg-amber-600/80 hover:bg-amber-500 text-white disabled:opacity-40 border border-amber-400/50 rounded-lg text-xs font-semibold transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              >
                <Zap className="w-3.5 h-3.5 text-amber-200" />
                <span>Assert Edge in Graph</span>
              </button>
            </div>

            {edgeCreatedSuccess && (
              <div className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-950/80 p-2 rounded border border-emerald-800 animate-fade-in">
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Epistemic relation asserted and integrated into graph topology.</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#050508]/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
          >
            Close Workstation
          </button>
        </div>
      </div>
    </div>
  );
};
