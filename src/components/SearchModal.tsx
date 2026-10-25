/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP v2
 * Omni-Search Modal Component (Cmd+K / Ctrl+K)
 */

import React, { useState, useEffect } from 'react';
import { SearchResult } from '../types';
import {
  Search,
  BookOpen,
  Network,
  Scale,
  GraduationCap,
  Library,
  ShieldCheck,
  X,
  ArrowRight
} from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (result: SearchResult) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setResults([]);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await res.json();
        if (data.results) {
          setResults(data.results);
        }
      } catch (err) {
        console.error('Search query error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Keyboard shortcut listener (Cmd+K or Ctrl+K or Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'node':
        return <Network className="w-4 h-4 text-amber-400" />;
      case 'note':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'argument':
        return <Scale className="w-4 h-4 text-blue-400" />;
      case 'defense':
        return <GraduationCap className="w-4 h-4 text-purple-400" />;
      case 'library':
        return <Library className="w-4 h-4 text-cyan-400" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center pt-20 p-4 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-0">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-neutral-800 flex items-center gap-3 bg-neutral-950">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search across nodes, notes, arguments, corpus library, defense questions..."
            autoFocus
            className="flex-1 bg-transparent text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none font-sans"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-neutral-500 hover:text-neutral-300 text-xs">
              Clear
            </button>
          )}
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {isLoading && (
            <div className="p-4 text-center text-xs text-neutral-400 font-mono">
              Searching epistemic corpus...
            </div>
          )}

          {!isLoading && searchTerm && results.length === 0 && (
            <div className="p-6 text-center text-xs text-neutral-500">
              No matching records found in SQLite database.
            </div>
          )}

          {!isLoading && !searchTerm && (
            <div className="p-6 text-center text-xs text-neutral-500 space-y-1">
              <p>Type keywords to search across the entire Journal314 & REN knowledge ecosystem.</p>
              <p className="text-[11px] text-neutral-600 font-mono">Try searching: "Nishitani", "Ungrund", "Kenosis", "Extinction", "Collapse"</p>
            </div>
          )}

          {results.map((r) => (
            <div
              key={`${r.type}-${r.id}`}
              onClick={() => {
                onSelectResult(r);
                onClose();
              }}
              className="p-3 rounded-lg hover:bg-neutral-800/80 cursor-pointer transition-colors border border-transparent hover:border-neutral-700 flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  {getTypeIcon(r.type)}
                  <span className="font-serif font-semibold text-neutral-100">{r.title}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 uppercase">
                    {r.type}
                  </span>
                  {r.epistemicTier && (
                    <span className="text-[9px] font-mono text-cyan-400">{r.epistemicTier}</span>
                  )}
                </div>
                <div className="text-[11px] text-neutral-400 line-clamp-1 leading-relaxed">
                  {r.contentSnippet}
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-600 self-center" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-neutral-950 border-t border-neutral-800 text-[10px] text-neutral-500 flex justify-between font-mono">
          <span>Esc to close</span>
          <span>Lexical Search Grounded in SQLite</span>
        </div>
      </div>
    </div>
  );
};
