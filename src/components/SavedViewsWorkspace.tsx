/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP v2
 * Saved Views Workspace Component
 */

import React, { useState } from 'react';
import { SavedView } from '../types';
import { Bookmark, Plus, Trash2, Eye, Compass, Layers, Check } from 'lucide-react';

interface SavedViewsWorkspaceProps {
  onSelectLensInGraph: (lens: string) => void;
}

const DEFAULT_VIEWS: SavedView[] = [
  {
    id: 'view-collapse',
    name: 'Ontology of Collapse & Ungrund',
    description: 'Focuses on the primordial groundless void (Böhme, Schelling, Cioran) and the metaphysical breakdown of onto-theology.',
    activeLens: 'Ontology of Collapse',
    activeFilterTypes: ['thinker', 'concept', 'claim', 'aporia'],
    epistemicFilter: ['NIHILTHEISTIC_RECONSTRUCTION', 'CANONICAL_PROJECT_DEFINITION'],
    searchTerms: '',
    cameraZoom: 1.2,
    cameraCenter: [400, 300],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'view-kyoto',
    name: 'Kyoto Metaphysics & Absolute Emptiness',
    description: 'Explores Keiji Nishitani, Nishida Kitaro, and the structural inversion of Western nihilism into Sunyata (Absolute Emptiness).',
    activeLens: 'Kyoto Metaphysics',
    activeFilterTypes: ['thinker', 'concept', 'text'],
    epistemicFilter: ['SOURCE_TEXT', 'INTERPRETATION'],
    searchTerms: 'Nishitani',
    cameraZoom: 1.4,
    cameraCenter: [500, 350],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'view-apophatic',
    name: 'Apophatic Theology & Divine Darkness',
    description: 'Traces Pseudo-Dionysius and Meister Eckhart on radical unknowing, kenosis, and Gottheit prior to God.',
    activeLens: 'Apophatic Theology',
    activeFilterTypes: ['thinker', 'concept', 'aporia'],
    epistemicFilter: ['SOURCE_TEXT', 'NIHILTHEISTIC_RECONSTRUCTION'],
    searchTerms: 'Eckhart',
    cameraZoom: 1.1,
    cameraCenter: [450, 320],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'view-extinction',
    name: 'Radical Immanence & Extinction Realism',
    description: 'Maps Ray Brassier and Laruelle against the metaphysical horizon of solar extinction and transcendental real.',
    activeLens: 'Radical Immanence',
    activeFilterTypes: ['thinker', 'concept', 'objection', 'claim'],
    epistemicFilter: ['COUNTER_READING', 'OBJECTION'],
    searchTerms: 'Brassier',
    cameraZoom: 1.3,
    cameraCenter: [480, 310],
    createdAt: new Date().toISOString(),
  },
];

export const SavedViewsWorkspace: React.FC<SavedViewsWorkspaceProps> = ({
  onSelectLensInGraph,
}) => {
  const [views, setViews] = useState<SavedView[]>(DEFAULT_VIEWS);
  const [activeViewId, setActiveViewId] = useState<string>(DEFAULT_VIEWS[0].id);

  const handleApplyView = (view: SavedView) => {
    setActiveViewId(view.id);
    onSelectLensInGraph(view.activeLens);
  };

  return (
    <div id="saved-views-container" className="flex-1 flex flex-col h-full overflow-y-auto bg-neutral-950 text-neutral-200 p-6">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <div className="border-b border-neutral-800 pb-4">
          <h2 className="font-serif font-bold text-xl text-neutral-100 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            Curated Ontological Perspectives & Saved Views
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Pre-configured epistemic viewpoints tailored for specific dissertation defense themes, thematic seminars, and structural graph analyses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {views.map((v) => {
            const isActive = activeViewId === v.id;
            return (
              <div
                key={v.id}
                className={`p-5 rounded-xl border space-y-3 transition-all ${
                  isActive
                    ? 'bg-neutral-900/90 border-amber-600/80 shadow-xl'
                    : 'bg-neutral-900/50 border-neutral-800/80 hover:bg-neutral-900/80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif font-bold text-sm text-neutral-100">{v.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 border border-neutral-700 text-amber-400">
                    {v.activeLens}
                  </span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed font-sans">{v.description}</p>

                <div className="flex flex-wrap gap-1 pt-1 text-[10px] font-mono text-neutral-500">
                  <span>Filtered: {v.activeFilterTypes.join(', ')}</span>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                  <button
                    onClick={() => handleApplyView(v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-900/80 hover:bg-amber-800 border border-amber-700 text-amber-200 rounded text-xs font-semibold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Launch in Graph</span>
                  </button>

                  {isActive && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                      <Check className="w-3.5 h-3.5" /> Active Perspective
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
