/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP v2
 * Argument Lab Workspace
 */

import React, { useState } from 'react';
import {
  ArgumentItem,
  EpistemicTier,
  GraphNode,
} from '../types';
import {
  Scale,
  Plus,
  Trash2,
  Edit,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  CheckCircle,
  HelpCircle,
  Link,
  BookOpen
} from 'lucide-react';

interface ArgumentLabProps {
  argumentsList: ArgumentItem[];
  nodes: GraphNode[];
  onSaveArgument: (arg: Partial<ArgumentItem> & { id: string }) => void;
  onCreateArgument: (arg: Partial<ArgumentItem>) => void;
  onDeleteArgument: (argId: string) => void;
}

export const ArgumentLab: React.FC<ArgumentLabProps> = ({
  argumentsList,
  nodes,
  onSaveArgument,
  onCreateArgument,
  onDeleteArgument,
}) => {
  const [selectedArgId, setSelectedArgId] = useState<string>(argumentsList[0]?.id || '');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [filterStrength, setFilterStrength] = useState<string>('ALL');

  // Edit draft state
  const [draftTitle, setDraftTitle] = useState<string>('');
  const [draftClaim, setDraftClaim] = useState<string>('');
  const [draftPremises, setDraftPremises] = useState<string[]>([]);
  const [draftConclusion, setDraftConclusion] = useState<string>('');
  const [draftStrength, setDraftStrength] = useState<any>('phenomenological');
  const [draftStatus, setDraftStatus] = useState<any>('support');
  const [draftTier, setDraftTier] = useState<EpistemicTier>('NIHILTHEISTIC_RECONSTRUCTION');
  const [draftSources, setDraftSources] = useState<string[]>([]);
  const [draftCounters, setDraftCounters] = useState<string[]>([]);
  const [draftLinkedNodeIds, setDraftLinkedNodeIds] = useState<string[]>([]);

  const selectedArg = argumentsList.find((a) => a.id === selectedArgId) || argumentsList[0] || null;

  const startEdit = (arg: ArgumentItem) => {
    setDraftTitle(arg.title);
    setDraftClaim(arg.claim);
    setDraftPremises([...arg.premises]);
    setDraftConclusion(arg.conclusion);
    setDraftStrength(arg.strength);
    setDraftStatus(arg.status);
    setDraftTier(arg.epistemicTier);
    setDraftSources([...arg.sources]);
    setDraftCounters([...arg.counterarguments]);
    setDraftLinkedNodeIds([...arg.linkedNodeIds]);
    setIsEditing(true);
  };

  const startNew = () => {
    const newId = `arg-${Date.now()}`;
    const newArg: Partial<ArgumentItem> = {
      id: newId,
      title: 'New Epistemic Argument',
      claim: 'Formulate thesis claim here...',
      premises: ['P1: First premise', 'P2: Second premise'],
      conclusion: 'Therefore, consequence holds.',
      strength: 'phenomenological',
      status: 'open_question',
      epistemicTier: 'NIHILTHEISTIC_RECONSTRUCTION',
      sources: ['Journal314 Corpus'],
      counterarguments: ['Counter-objection...'],
      linkedNodeIds: [],
    };
    onCreateArgument(newArg);
    setSelectedArgId(newId);
  };

  const saveEdit = () => {
    if (!selectedArg) return;
    onSaveArgument({
      id: selectedArg.id,
      title: draftTitle,
      claim: draftClaim,
      premises: draftPremises.filter((p) => p.trim()),
      conclusion: draftConclusion,
      strength: draftStrength,
      status: draftStatus,
      epistemicTier: draftTier,
      sources: draftSources.filter((s) => s.trim()),
      counterarguments: draftCounters.filter((c) => c.trim()),
      linkedNodeIds: draftLinkedNodeIds,
    });
    setIsEditing(false);
  };

  return (
    <div id="argument-lab-container" className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-neutral-950 text-neutral-200">
      {/* Left Arguments Sidebar */}
      <aside aria-label="Arguments Navigation" className="w-full md:w-80 bg-neutral-900/90 border-r border-neutral-800 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-neutral-800 flex items-center justify-between">
          <h2 className="font-serif font-bold text-sm text-neutral-100 flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-400" />
            Argument Lab
          </h2>
          <button
            onClick={startNew}
            className="flex items-center gap-1 px-2.5 py-1 bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-200 rounded text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Argument</span>
          </button>
        </div>

        {/* Strength Filter Tabs */}
        <div className="p-2 border-b border-neutral-800 flex gap-1 overflow-x-auto text-[11px]">
          {['ALL', 'deductive', 'abductive', 'phenomenological', 'apophatic'].map((str) => (
            <button
              key={str}
              onClick={() => setFilterStrength(str)}
              className={`px-2 py-0.5 rounded capitalize whitespace-nowrap ${
                filterStrength === str
                  ? 'bg-blue-950 border border-blue-800 text-blue-300 font-medium'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {str}
            </button>
          ))}
        </div>

        {/* Arguments List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {argumentsList
            .filter((a) => filterStrength === 'ALL' || a.strength === filterStrength)
            .map((arg) => {
              const isSelected = selectedArg?.id === arg.id;
              return (
                <div
                  key={arg.id}
                  onClick={() => {
                    setSelectedArgId(arg.id);
                    setIsEditing(false);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-neutral-800/90 border-blue-600/80 shadow-md'
                      : 'bg-neutral-950/60 border-neutral-800/80 hover:bg-neutral-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1.5">
                    <h4 className="font-serif text-xs font-semibold text-neutral-100 line-clamp-1">
                      {arg.title}
                    </h4>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                        arg.status === 'support'
                          ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                          : arg.status === 'unresolved_aporia'
                          ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                          : 'bg-amber-950/80 border-amber-800 text-amber-300'
                      }`}
                    >
                      {arg.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                    {arg.claim}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-neutral-500 font-mono">
                    <span className="text-blue-400 capitalize">{arg.strength}</span>
                    <span>{arg.premises.length} premises</span>
                  </div>
                </div>
              );
            })}
        </div>
      </aside>

      {/* Right Argument Detail / Form */}
      {selectedArg ? (
        <main aria-label="Argument Formulation Details" className="flex-1 flex flex-col h-full overflow-y-auto bg-neutral-950 p-4 md:p-6">
          <div className="max-w-4xl mx-auto w-full space-y-5">
            {/* Header / Title Bar */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-neutral-800">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 font-mono capitalize">
                    {selectedArg.strength} Reasoning
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-cyan-300 font-mono">
                    {selectedArg.epistemicTier}
                  </span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    className="font-serif font-bold text-xl text-neutral-100 bg-neutral-900 border border-neutral-700 rounded px-3 py-1 w-full"
                  />
                ) : (
                  <h3 className="font-serif font-bold text-xl text-neutral-100">{selectedArg.title}</h3>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-xs"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(selectedArg)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 rounded text-xs transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Argument</span>
                    </button>
                    <button
                      onClick={() => onDeleteArgument(selectedArg.id)}
                      className="p-1.5 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300"
                      title="Delete Argument"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Core Claim */}
            <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-lg space-y-2">
              <label className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                Primary Claim / Thesis
              </label>
              {isEditing ? (
                <textarea
                  value={draftClaim}
                  onChange={(e) => setDraftClaim(e.target.value)}
                  rows={2}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-sm text-neutral-200"
                />
              ) : (
                <div className="text-sm font-medium text-neutral-100 leading-relaxed italic">
                  "{selectedArg.claim}"
                </div>
              )}
            </div>

            {/* Premises */}
            <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Premises & Epistemic Foundations
                </label>
                {isEditing && (
                  <button
                    onClick={() => setDraftPremises([...draftPremises, `P${draftPremises.length + 1}: `])}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Premise
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  {draftPremises.map((p, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={p}
                        onChange={(e) => {
                          const updated = [...draftPremises];
                          updated[idx] = e.target.value;
                          setDraftPremises(updated);
                        }}
                        className="flex-1 bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1 text-xs text-neutral-200"
                      />
                      <button
                        onClick={() => setDraftPremises(draftPremises.filter((_, i) => i !== idx))}
                        className="text-neutral-500 hover:text-rose-400 px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedArg.premises.map((premise, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-neutral-950/70 border border-neutral-800/80 rounded text-xs text-neutral-200 leading-relaxed font-mono"
                    >
                      {premise}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Conclusion */}
            <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-lg space-y-2">
              <label className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                Conclusion
              </label>
              {isEditing ? (
                <textarea
                  value={draftConclusion}
                  onChange={(e) => setDraftConclusion(e.target.value)}
                  rows={2}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-sm text-neutral-200"
                />
              ) : (
                <div className="text-sm font-semibold text-emerald-200 leading-relaxed bg-emerald-950/40 border border-emerald-900/50 p-3 rounded">
                  {selectedArg.conclusion}
                </div>
              )}
            </div>

            {/* Counterarguments & Invariant E-I5 Discipline */}
            <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  Counterarguments & Naturalistic Objections (Invariant E-I5)
                </label>
                {isEditing && (
                  <button
                    onClick={() => setDraftCounters([...draftCounters, ''])}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Counter
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  {draftCounters.map((c, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={c}
                        onChange={(e) => {
                          const updated = [...draftCounters];
                          updated[idx] = e.target.value;
                          setDraftCounters(updated);
                        }}
                        className="flex-1 bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1 text-xs text-neutral-200"
                      />
                      <button
                        onClick={() => setDraftCounters(draftCounters.filter((_, i) => i !== idx))}
                        className="text-neutral-500 hover:text-rose-400 px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedArg.counterarguments.map((counter, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-rose-950/20 border border-rose-900/40 rounded text-xs text-rose-200 leading-relaxed"
                    >
                      • {counter}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sources and Linked Graph Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-900/80 border border-neutral-800 p-3 rounded-lg">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                  Corpus Source Citations
                </label>
                <ul className="text-xs text-neutral-300 space-y-1">
                  {selectedArg.sources.map((s, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-400">
                      <BookOpen className="w-3 h-3 text-amber-400" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-neutral-900/80 border border-neutral-800 p-3 rounded-lg">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                  Linked Knowledge Graph Nodes
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedArg.linkedNodeIds.map((nid) => {
                    const node = nodes.find((n) => n.id === nid);
                    return (
                      <span
                        key={nid}
                        className="px-2 py-0.5 bg-neutral-950 border border-neutral-700 rounded text-xs text-cyan-300 font-mono"
                      >
                        {node?.label || nid}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : null}
    </div>
  );
};
