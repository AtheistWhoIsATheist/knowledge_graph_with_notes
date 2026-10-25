/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP v2
 * Node Creation & Editing Modal
 */

import React, { useState, useEffect } from 'react';
import {
  GraphNode,
  NodeType,
  EpistemicTier,
  LifecycleStatus,
} from '../types';
import { Plus, Edit, ShieldAlert, Check, X } from 'lucide-react';

interface NodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNode: (node: Partial<GraphNode>) => void;
  initialNode?: GraphNode | null;
}

const LENSES = [
  'Ontology of Collapse',
  'Kyoto Metaphysics',
  'Apophatic Theology',
  'Phenomenology of Despair',
  'Radical Immanence',
  'Phenomenology of the Void',
];

export const NodeModal: React.FC<NodeModalProps> = ({
  isOpen,
  onClose,
  onSaveNode,
  initialNode,
}) => {
  const [label, setLabel] = useState<string>('');
  const [type, setType] = useState<NodeType>('concept');
  const [lens, setLens] = useState<string>('Ontology of Collapse');
  const [epistemicTier, setEpistemicTier] = useState<EpistemicTier>('NIHILTHEISTIC_RECONSTRUCTION');
  const [description, setDescription] = useState<string>('');
  const [tradition, setTradition] = useState<string>('');
  const [period, setPeriod] = useState<string>('');
  const [keyWorks, setKeyWorks] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [sourceRef, setSourceRef] = useState<string>('Journal314 Corpus');

  useEffect(() => {
    if (initialNode) {
      setLabel(initialNode.label);
      setType(initialNode.type);
      setLens(initialNode.lens);
      setEpistemicTier(initialNode.epistemicTier);
      setDescription(initialNode.description);
      setTradition(initialNode.tradition || '');
      setPeriod(initialNode.period || '');
      setKeyWorks((initialNode.keyWorks || []).join(', '));
      setTags(initialNode.tags.join(', '));
      setSourceRef(initialNode.sourceReference || 'Journal314 Corpus');
    } else {
      setLabel('');
      setType('concept');
      setLens('Ontology of Collapse');
      setEpistemicTier('NIHILTHEISTIC_RECONSTRUCTION');
      setDescription('');
      setTradition('');
      setPeriod('');
      setKeyWorks('');
      setTags('Metaphysics, Epistemic');
      setSourceRef('Journal314 Corpus');
    }
  }, [initialNode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !description.trim()) return;

    onSaveNode({
      id: initialNode ? initialNode.id : `node-${Date.now()}`,
      label: label.trim(),
      type,
      lens,
      epistemicTier,
      description: description.trim(),
      tradition: tradition.trim() || undefined,
      period: period.trim() || undefined,
      keyWorks: keyWorks.split(',').map((s) => s.trim()).filter(Boolean),
      tags: tags.split(',').map((s) => s.trim()).filter(Boolean),
      sourceReference: sourceRef.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h3 className="font-serif font-bold text-lg text-neutral-100 flex items-center gap-2">
            {initialNode ? <Edit className="w-4 h-4 text-amber-400" /> : <Plus className="w-4 h-4 text-amber-400" />}
            {initialNode ? 'Edit Knowledge Graph Entity' : 'Create Knowledge Graph Entity'}
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-400 block mb-1">Entity Label / Name:</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Ungrund or Keiji Nishitani"
                required
                className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-neutral-200"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Entity Type:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as NodeType)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-neutral-200"
              >
                <option value="thinker">Thinker</option>
                <option value="concept">Concept</option>
                <option value="claim">Claim</option>
                <option value="text">Source Text</option>
                <option value="aporia">Aporia</option>
                <option value="phenomenology">Phenomenology</option>
                <option value="objection">Objection / Counter</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-400 block mb-1">Ontological Lens:</label>
              <select
                value={lens}
                onChange={(e) => setLens(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-neutral-200"
              >
                {LENSES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Epistemic Tier:</label>
              <select
                value={epistemicTier}
                onChange={(e) => setEpistemicTier(e.target.value as EpistemicTier)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-neutral-200"
              >
                <option value="SOURCE_TEXT">SOURCE_TEXT</option>
                <option value="TEXTUAL_CLAIM">TEXTUAL_CLAIM</option>
                <option value="PHENOMENOLOGICAL_DESCRIPTION">PHENOMENOLOGICAL_DESCRIPTION</option>
                <option value="INTERPRETATION">INTERPRETATION</option>
                <option value="NIHILTHEISTIC_RECONSTRUCTION">NIHILTHEISTIC_RECONSTRUCTION</option>
                <option value="COUNTER_READING">COUNTER_READING</option>
                <option value="OBJECTION">OBJECTION</option>
                <option value="SPECULATIVE_HYPOTHESIS">SPECULATIVE_HYPOTHESIS</option>
                <option value="CANONICAL_PROJECT_DEFINITION">CANONICAL_PROJECT_DEFINITION</option>
                <option value="UNRESOLVED_APORIA">UNRESOLVED_APORIA</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-neutral-400 block mb-1">Description / Definition:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Epistemically rigorous definition or textual summary..."
              required
              className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-neutral-200 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-400 block mb-1">Tradition (Optional):</label>
              <input
                type="text"
                value={tradition}
                onChange={(e) => setTradition(e.target.value)}
                placeholder="e.g. Christian Theosophy / Kyoto School"
                className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-neutral-200"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Period (Optional):</label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="e.g. 1575–1624"
                className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-neutral-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-400 block mb-1">Key Works (comma separated):</label>
              <input
                type="text"
                value={keyWorks}
                onChange={(e) => setKeyWorks(e.target.value)}
                placeholder="e.g. Aurora, Mysterium Magnum"
                className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-neutral-200"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Source Reference / Provenance:</label>
              <input
                type="text"
                value={sourceRef}
                onChange={(e) => setSourceRef(e.target.value)}
                placeholder="Journal314 Corpus / REN"
                className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-neutral-200"
              />
            </div>
          </div>

          <div>
            <label className="text-neutral-400 block mb-1">Tags (comma separated):</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. Ungrund, Nothingness, Böhme"
              className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-neutral-200"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-black font-semibold rounded text-xs"
            >
              {initialNode ? 'Save Node' : 'Create Node'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
