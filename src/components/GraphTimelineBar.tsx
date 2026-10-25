/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP v2
 * Chronological & Genealogic Epoch Timeline Bar
 */

import React from 'react';
import { Calendar, Clock, Milestone, Sparkles } from 'lucide-react';

export interface TimelineEpoch {
  id: string;
  name: string;
  period: string;
  startYear: number;
  endYear: number;
  description: string;
  color: string;
}

export const TIMELINE_EPOCHS: TimelineEpoch[] = [
  {
    id: 'epoch-apophatic',
    name: 'Apophatic & Mystical Roots',
    period: 'c. 500 – 1650',
    startYear: 500,
    endYear: 1650,
    description: 'Pseudo-Dionysius, Meister Eckhart, Jakob Böhme (Gottheit, Ungrund, Divine Darkness)',
    color: '#a855f7',
  },
  {
    id: 'epoch-idealism',
    name: 'German Idealism & Dark Nature',
    period: '1780 – 1850',
    startYear: 1780,
    endYear: 1850,
    description: 'Kant, Fichte, Schelling (Freedom Treatise / Ground of Existence), Schopenhauer',
    color: '#38bdf8',
  },
  {
    id: 'epoch-transvaluation',
    name: 'Crisis of Nihilism & Death of God',
    period: '1850 – 1910',
    startYear: 1850,
    endYear: 1910,
    description: 'Mainländer, Friedrich Nietzsche (Zarathustra, Active Nihilism, Amor Fati)',
    color: '#f59e0b',
  },
  {
    id: 'epoch-kyoto-existential',
    name: 'Kyoto Metaphysics & Fundamental Ontology',
    period: '1910 – 1980',
    startYear: 1910,
    endYear: 1980,
    description: 'Nishida, Heidegger (das Nichts), Nishitani (Sunyata), Cioran, Levinas, Altizer',
    color: '#10b981',
  },
  {
    id: 'epoch-contemporary',
    name: 'Speculative Extinction & Radical Immanence',
    period: '1980 – Present',
    startYear: 1980,
    endYear: 2030,
    description: 'Brassier (Nihil Unbound), Land, Laruelle, Contemporary Nihiltheistic Reconstruction',
    color: '#f43f5e',
  },
];

interface GraphTimelineBarProps {
  activeEpoch: string | null;
  onSelectEpoch: (epochId: string | null) => void;
}

export const GraphTimelineBar: React.FC<GraphTimelineBarProps> = ({
  activeEpoch,
  onSelectEpoch,
}) => {
  return (
    <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 bg-neutral-900/95 border border-neutral-800 p-2 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2 max-w-3xl overflow-x-auto select-none animate-fade-in">
      <div className="flex items-center gap-1 px-2 text-xs font-mono font-bold text-amber-400 border-r border-neutral-800 pr-3 whitespace-nowrap">
        <Clock className="w-3.5 h-3.5" />
        <span>Chronological Epochs</span>
      </div>

      <button
        onClick={() => onSelectEpoch(null)}
        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
          activeEpoch === null
            ? 'bg-amber-950 text-amber-300 border border-amber-800'
            : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
        }`}
      >
        All Eras
      </button>

      {TIMELINE_EPOCHS.map((epoch) => {
        const isSelected = activeEpoch === epoch.id;
        return (
          <button
            key={epoch.id}
            onClick={() => onSelectEpoch(isSelected ? null : epoch.id)}
            title={epoch.description}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
              isSelected
                ? 'bg-neutral-800 text-neutral-100 border-amber-500 shadow-md'
                : 'bg-neutral-950/80 text-neutral-400 hover:text-neutral-200 border-neutral-800'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: epoch.color }}
            />
            <span>{epoch.name}</span>
            <span className="text-[10px] font-mono text-neutral-500">({epoch.period})</span>
          </button>
        );
      })}
    </div>
  );
};
