/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP v2
 * Graph Export & Epistemic Evidence Packet Generator
 */

import React, { useState } from 'react';
import { GraphNode, GraphEdge } from '../types';
import { Download, FileCode, Image, FileText, Check, X } from 'lucide-react';

interface GraphExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: GraphNode[];
  edges: GraphEdge[];
  activeLens: string;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export const GraphExportModal: React.FC<GraphExportModalProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  activeLens,
  svgRef,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);

  if (!isOpen) return null;

  // Export SVG Vector File
  const handleExportSVG = () => {
    if (!svgRef.current) return;
    const svgElement = svgRef.current.cloneNode(true) as SVGSVGElement;
    
    // Add inline dark background
    svgElement.setAttribute('style', 'background-color: #09090b; font-family: sans-serif;');
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nihiltheism_graph_${activeLens.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export JSON Evidence Packet
  const handleExportJSON = () => {
    const packet = {
      title: 'NIHILTHEISM Philosophical Knowledge Graph Evidence Packet',
      exportTimestamp: new Date().toISOString(),
      activeLens,
      nodeCount: nodes.length,
      edgeCount: edges.length,
      governanceStatus: 'INVARIANTS_ENFORCED',
      nodes: nodes.map((n) => ({
        id: n.id,
        label: n.label,
        type: n.type,
        tier: n.epistemicTier,
        status: n.status,
        description: n.description,
        source: n.sourceReference,
        hash: n.provenance.verificationHash,
        anchor: n.provenance.externalAnchor,
        tags: n.tags,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: typeof e.source === 'object' ? (e.source as any).id : e.source,
        target: typeof e.target === 'object' ? (e.target as any).id : e.target,
        relation: e.relation,
        weight: e.epistemicWeight,
        status: e.status,
      })),
    };

    const blob = new Blob([JSON.stringify(packet, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nihiltheism_evidence_packet_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-purple-400" />
            <h3 className="font-serif font-bold text-base text-neutral-100">
              Export Graph Evidence & Visuals
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed font-sans">
          Export the filtered philosophical graph ({nodes.length} entities, {edges.length} relations) for publications, seminar presentations, or formal dissertation defense packets.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleExportSVG}
            className="w-full flex items-center justify-between p-3.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-colors text-xs text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-800/80 text-amber-400">
                <Image className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-neutral-200 group-hover:text-amber-300">Vector SVG Graph</div>
                <div className="text-[11px] text-neutral-500">Infinite resolution vector for papers and LaTeX</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300" />
          </button>

          <button
            onClick={handleExportJSON}
            className="w-full flex items-center justify-between p-3.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-colors text-xs text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-cyan-400">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-neutral-200 group-hover:text-cyan-300">Epistemic Evidence Packet (.json)</div>
                <div className="text-[11px] text-neutral-500">Complete node provenance, SHA hashes & relations</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300" />
          </button>
        </div>

        <div className="flex justify-end pt-2 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
