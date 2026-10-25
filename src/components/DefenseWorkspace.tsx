/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP v2
 * Dissertation Defense Preparation Workspace
 */

import React, { useState } from 'react';
import {
  DefenseItem,
  GraphNode,
} from '../types';
import {
  GraduationCap,
  Plus,
  Trash2,
  Edit,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  FileText,
  Layers,
  Award
} from 'lucide-react';

interface DefenseWorkspaceProps {
  defenseItems: DefenseItem[];
  nodes: GraphNode[];
  onSaveDefenseItem: (item: Partial<DefenseItem> & { id: string }) => void;
  onCreateDefenseItem: (item: Partial<DefenseItem>) => void;
  onDeleteDefenseItem: (itemId: string) => void;
}

const CATEGORIES = [
  'ALL',
  'Ontological Void',
  'Epistemic Groundlessness',
  'Ethics & Nihilism',
  'Cross-Traditional Comparative',
  'Apophatic Theology',
  'Methodological Boundary',
];

export const DefenseWorkspace: React.FC<DefenseWorkspaceProps> = ({
  defenseItems,
  nodes,
  onSaveDefenseItem,
  onCreateDefenseItem,
  onDeleteDefenseItem,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>(defenseItems[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Edit draft state
  const [draftQuestion, setDraftQuestion] = useState<string>('');
  const [draftCategory, setDraftCategory] = useState<any>('Epistemic Groundlessness');
  const [draftDifficulty, setDraftDifficulty] = useState<any>('Hostile Committee');
  const [draftAnswer, setDraftAnswer] = useState<string>('');
  const [draftEvidence, setDraftEvidence] = useState<string[]>([]);
  const [draftWeakPoints, setDraftWeakPoints] = useState<string[]>([]);
  const [draftEvaluation, setDraftEvaluation] = useState<string>('');
  const [draftIsReady, setDraftIsReady] = useState<boolean>(false);

  const selectedItem = defenseItems.find((d) => d.id === selectedItemId) || defenseItems[0] || null;

  const startEdit = (item: DefenseItem) => {
    setDraftQuestion(item.question);
    setDraftCategory(item.category);
    setDraftDifficulty(item.difficulty);
    setDraftAnswer(item.draftAnswer);
    setDraftEvidence([...item.linkedEvidence]);
    setDraftWeakPoints([...item.weakPoints]);
    setDraftEvaluation(item.evaluationNotes);
    setDraftIsReady(item.isReady);
    setIsEditing(true);
  };

  const startNew = () => {
    const newId = `defense-${Date.now()}`;
    const newItem: Partial<DefenseItem> = {
      id: newId,
      question: 'New Dissertation Committee Defense Challenge...',
      category: 'Epistemic Groundlessness',
      difficulty: 'Hostile Committee',
      draftAnswer: 'Draft oral defense rebuttal addressing committee premise...',
      linkedEvidence: ['Journal314 Part I'],
      linkedNodeIds: [],
      weakPoints: ['Identify vulnerable rhetorical assumptions'],
      evaluationNotes: 'Requires grounded citation of Primary Sources.',
      isReady: false,
    };
    onCreateDefenseItem(newItem);
    setSelectedItemId(newId);
  };

  const saveEdit = () => {
    if (!selectedItem) return;
    onSaveDefenseItem({
      id: selectedItem.id,
      question: draftQuestion,
      category: draftCategory,
      difficulty: draftDifficulty,
      draftAnswer: draftAnswer,
      linkedEvidence: draftEvidence.filter((e) => e.trim()),
      weakPoints: draftWeakPoints.filter((w) => w.trim()),
      evaluationNotes: draftEvaluation,
      isReady: draftIsReady,
    });
    setIsEditing(false);
  };

  // Readiness calculation
  const totalCount = defenseItems.length;
  const readyCount = defenseItems.filter((d) => d.isReady).length;
  const readinessPercent = totalCount > 0 ? Math.round((readyCount / totalCount) * 100) : 0;

  return (
    <div id="defense-workspace-container" className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-neutral-950 text-neutral-200">
      {/* Left Defense Questions Sidebar */}
      <aside aria-label="Defense Questions List" className="w-full md:w-84 bg-neutral-900/90 border-r border-neutral-800 flex flex-col overflow-hidden">
        {/* Header with Readiness Widget */}
        <div className="p-3 border-b border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-sm text-neutral-100 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              Defense Workspace
            </h2>
            <button
              onClick={startNew}
              className="flex items-center gap-1 px-2.5 py-1 bg-purple-950 hover:bg-purple-900 border border-purple-800 text-purple-200 rounded text-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>

          {/* Defense Readiness Meter */}
          <div className="bg-neutral-950/80 border border-neutral-800 p-2.5 rounded-lg space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Defense Readiness:</span>
              <span className="font-mono font-bold text-purple-400">{readinessPercent}%</span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-500"
                style={{ width: `${readinessPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-neutral-500 flex justify-between font-mono">
              <span>{readyCount} Prepared</span>
              <span>{totalCount - readyCount} In Progress</span>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-purple-950 border border-purple-800 text-purple-300 font-medium'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {defenseItems
            .filter((d) => selectedCategory === 'ALL' || d.category === selectedCategory)
            .map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItemId(item.id);
                    setIsEditing(false);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-neutral-800/90 border-purple-600/80 shadow-md'
                      : 'bg-neutral-950/60 border-neutral-800/80 hover:bg-neutral-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                        item.difficulty === 'Hostile Committee'
                          ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                          : item.difficulty === 'Deep Aporia'
                          ? 'bg-amber-950/80 border-amber-800 text-amber-300'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                      }`}
                    >
                      {item.difficulty}
                    </span>
                    {item.isReady ? (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" /> Ready
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-500">Draft</span>
                    )}
                  </div>
                  <h4 className="font-serif text-xs font-semibold text-neutral-100 line-clamp-2 leading-relaxed">
                    {item.question}
                  </h4>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-neutral-500 font-mono">
                    <span className="text-purple-400/90 truncate max-w-[150px]">{item.category}</span>
                    <span>{item.weakPoints.length} vulnerabilities</span>
                  </div>
                </div>
              );
            })}
        </div>
      </aside>

      {/* Right Question Detail & Rebuttal Area */}
      {selectedItem ? (
        <main aria-label="Defense Answer Drafting" className="flex-1 flex flex-col h-full overflow-y-auto bg-neutral-950 p-4 md:p-6">
          <div className="max-w-4xl mx-auto w-full space-y-5">
            {/* Header / Actions */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-neutral-800">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300 font-mono">
                    Category: {selectedItem.category}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded border font-mono ${
                      selectedItem.difficulty === 'Hostile Committee'
                        ? 'bg-rose-950 border-rose-800 text-rose-300'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-300'
                    }`}
                  >
                    Difficulty: {selectedItem.difficulty}
                  </span>
                </div>
                {isEditing ? (
                  <textarea
                    value={draftQuestion}
                    onChange={(e) => setDraftQuestion(e.target.value)}
                    rows={3}
                    className="font-serif font-bold text-lg text-neutral-100 bg-neutral-900 border border-neutral-700 rounded p-2 w-full mt-2"
                  />
                ) : (
                  <h3 className="font-serif font-bold text-lg text-neutral-100 mt-1 leading-snug">
                    "{selectedItem.question}"
                  </h3>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-medium transition-colors"
                    >
                      Save Rebuttal
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
                      onClick={() => startEdit(selectedItem)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 rounded text-xs transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Response</span>
                    </button>
                    <button
                      onClick={() => onDeleteDefenseItem(selectedItem.id)}
                      className="p-1.5 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300"
                      title="Delete Question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Candidate Rebuttal / Draft Answer */}
            <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Oral Defense Argument & Theoretical Rebuttal
                </label>
                <span className="text-[11px] font-mono text-neutral-500">
                  {selectedItem.draftAnswer.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              {isEditing ? (
                <textarea
                  value={draftAnswer}
                  onChange={(e) => setDraftAnswer(e.target.value)}
                  rows={6}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded p-3 text-sm text-neutral-200 font-sans leading-relaxed"
                />
              ) : (
                <div className="text-sm text-neutral-200 leading-relaxed bg-neutral-950/60 p-3.5 rounded border border-neutral-800/80">
                  {selectedItem.draftAnswer}
                </div>
              )}
            </div>

            {/* Committee Weak Points & Vulnerabilities */}
            <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  Identified Weaknesses & Vulnerabilities
                </label>
                {isEditing && (
                  <button
                    onClick={() => setDraftWeakPoints([...draftWeakPoints, ''])}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Weak Point
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  {draftWeakPoints.map((w, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={w}
                        onChange={(e) => {
                          const updated = [...draftWeakPoints];
                          updated[idx] = e.target.value;
                          setDraftWeakPoints(updated);
                        }}
                        className="flex-1 bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1 text-xs text-neutral-200"
                      />
                      <button
                        onClick={() => setDraftWeakPoints(draftWeakPoints.filter((_, i) => i !== idx))}
                        className="text-neutral-500 hover:text-rose-400 px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedItem.weakPoints.map((w, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-rose-950/20 border border-rose-900/40 rounded text-xs text-rose-200 flex items-start gap-2"
                    >
                      <span className="text-rose-400">⚠️</span>
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Heuristic Evaluation & Linked Evidence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-900/80 border border-neutral-800 p-3.5 rounded-lg space-y-2">
                <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
                  Evaluation Rubric Notes (Heuristic Assessment)
                </label>
                <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950/60 p-2.5 rounded border border-neutral-800 font-sans">
                  {selectedItem.evaluationNotes}
                </p>
                <div className="text-[10px] text-neutral-500 italic">
                  * Note: Evaluated against Journal314 Epistemic Standards and Invariant E-I1 through E-I8.
                </div>
              </div>

              <div className="bg-neutral-900/80 border border-neutral-800 p-3.5 rounded-lg space-y-2">
                <label className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                  Linked Corpus Evidence
                </label>
                <div className="space-y-1">
                  {selectedItem.linkedEvidence.map((ev, idx) => (
                    <div key={idx} className="text-xs font-mono text-neutral-300 bg-neutral-950 px-2 py-1 rounded border border-neutral-800">
                      📜 {ev}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : null}
    </div>
  );
};
