/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP v2
 * Header & Navigation Component
 */

import React from 'react';
import {
  Network,
  BookOpen,
  Scale,
  GraduationCap,
  ShieldCheck,
  Library,
  Brain,
  Bookmark,
  Search,
  Database,
  RefreshCw,
  PlusCircle,
  FileText,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { LifecycleStatus } from '../types';

export type WorkspaceTab =
  | 'graph'
  | 'notes'
  | 'arguments'
  | 'defense'
  | 'governance'
  | 'library'
  | 'second-brain'
  | 'views'
  | 'backup';

interface HeaderProps {
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;
  onOpenSearch: () => void;
  onOpenNewNode: () => void;
  onOpenNewNote: () => void;
  onOpenBackup: () => void;
  onOpenIngestion?: () => void;
  nodesCount: number;
  canonicalCount: number;
  hashChainValid: boolean;
  isBackendConnected: boolean;
  onReseed: () => void;
  isReseeding: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenNewNode,
  onOpenNewNote,
  onOpenBackup,
  onOpenIngestion,
  nodesCount,
  canonicalCount,
  hashChainValid,
  isBackendConnected,
  onReseed,
  isReseeding,
}) => {
  return (
    <header id="main-app-header" className="bg-neutral-950 border-b border-neutral-800 text-neutral-200 sticky top-0 z-40">
      {/* Top Banner with Title & Global Controls */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-amber-500 shadow-inner">
            <span className="font-serif text-lg font-bold">Ω</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-base text-neutral-100 tracking-wider">
                NIHILTHEISM
              </h1>
              <span className="text-xs px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-amber-400 font-mono">
                N-KGAP v2
              </span>
              <span className="text-xs text-neutral-400 hidden sm:inline">
                | Journal314 & REN Corpus
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-sans hidden md:block">
              Epistemically Governed Philosophical Knowledge Graph & Dissertation Defense System
            </p>
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2">
          {/* Quick Search trigger */}
          <button
            id="btn-global-search"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 transition-colors shadow-sm"
            title="Global Multi-Entity Search (Ctrl+K / ⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Search Corpus</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-neutral-950 border border-neutral-700 rounded text-neutral-400 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Ingest & Synthesize Button */}
          {onOpenIngestion && (
            <button
              id="btn-ingest-corpus"
              onClick={onOpenIngestion}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 hover:border-cyan-400 text-xs text-cyan-300 font-medium transition-all shadow-sm shadow-cyan-950/50"
              title="Automated Document Ingestion & Ontological Extraction"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline">Ingest & Parse</span>
            </button>
          )}

          {/* New Node button */}
          <button
            id="btn-create-node"
            onClick={onOpenNewNode}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-200 transition-colors"
            title="Add Concept or Thinker Node"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Node</span>
          </button>

          {/* New Note button */}
          <button
            id="btn-create-note"
            onClick={onOpenNewNote}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-200 transition-colors"
            title="Create Research Note"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Note</span>
          </button>

          {/* Reseed button */}
          <button
            id="btn-reseed-data"
            onClick={onReseed}
            disabled={isReseeding}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 transition-colors"
            title="Reload Canonical Journal314 & REN Canon"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isReseeding ? 'animate-spin' : ''}`} />
            <span className="hidden lg:inline">Reseed</span>
          </button>

          {/* Backup & System button */}
          <button
            id="btn-open-backup"
            onClick={onOpenBackup}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-200 transition-colors"
            title="Backup, Integrity Audit & Restore"
          >
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Backup & Store</span>
          </button>

          {/* Live Status Indicators */}
          <div className="flex items-center gap-2 pl-2 border-l border-neutral-800 text-xs font-mono">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border ${
                isBackendConnected
                  ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-800/80 text-rose-300'
              }`}
              title={isBackendConnected ? 'Backend SQLite Persistence Active' : 'Connecting to Backend...'}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              <span className="hidden xl:inline">{isBackendConnected ? 'SQLite Active' : 'Offline'}</span>
            </span>

            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border ${
                hashChainValid
                  ? 'bg-neutral-900 border-neutral-700 text-neutral-300'
                  : 'bg-rose-950 border-rose-800 text-rose-300'
              }`}
              title={`Governance Hash Chain: ${hashChainValid ? 'Valid' : 'Compromised'} | ${canonicalCount}/${nodesCount} Canonical`}
            >
              {hashChainValid ? (
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span className="hidden sm:inline">{canonicalCount}/{nodesCount} Canon</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav aria-label="Main Workspace Navigation" className="border-t border-neutral-900 bg-neutral-950/80 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          <button
            id="tab-graph"
            onClick={() => setActiveTab('graph')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'graph'
                ? 'bg-amber-950/70 border border-amber-800/80 text-amber-200'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Knowledge Graph</span>
          </button>

          <button
            id="tab-notes"
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'notes'
                ? 'bg-emerald-950/70 border border-emerald-800/80 text-emerald-200'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Notes & Backlinks</span>
          </button>

          <button
            id="tab-arguments"
            onClick={() => setActiveTab('arguments')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'arguments'
                ? 'bg-blue-950/70 border border-blue-800/80 text-blue-200'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Argument Lab</span>
          </button>

          <button
            id="tab-defense"
            onClick={() => setActiveTab('defense')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'defense'
                ? 'bg-purple-950/70 border border-purple-800/80 text-purple-200'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Defense Workspace</span>
          </button>

          <button
            id="tab-governance"
            onClick={() => setActiveTab('governance')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'governance'
                ? 'bg-amber-950/70 border border-amber-800/80 text-amber-200'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Governance & Sentinel</span>
          </button>

          <button
            id="tab-library"
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'library'
                ? 'bg-cyan-950/70 border border-cyan-800/80 text-cyan-200'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Library className="w-3.5 h-3.5" />
            <span>Knowledge Library</span>
          </button>

          <button
            id="tab-second-brain"
            onClick={() => setActiveTab('second-brain')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'second-brain'
                ? 'bg-rose-950/70 border border-rose-800/80 text-rose-200'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Second Brain</span>
          </button>

          <button
            id="tab-views"
            onClick={() => setActiveTab('views')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'views'
                ? 'bg-neutral-800 border border-neutral-700 text-neutral-200'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Views</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
