/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP v2
 * Research Notes & Backlinks Workspace
 */

import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  ResearchNote,
  EpistemicTier,
  LifecycleStatus,
  GraphNode,
} from '../types';
import {
  BookOpen,
  Plus,
  Trash2,
  Share2,
  Download,
  Link,
  ShieldCheck,
  Tag,
  Search,
  Eye,
  Edit3,
  Check,
  AlertCircle
} from 'lucide-react';

interface NotesWorkspaceProps {
  notes: ResearchNote[];
  nodes: GraphNode[];
  onSaveNote: (note: Partial<ResearchNote> & { id: string }) => void;
  onCreateNote: () => void;
  onDeleteNote: (noteId: string) => void;
  onAddToWorkingGraph: (noteId: string) => void;
  onPromoteNote: (note: ResearchNote) => void;
  onSelectNodeInGraph?: (nodeId: string) => void;
}

export const NotesWorkspace: React.FC<NotesWorkspaceProps> = ({
  notes,
  nodes,
  onSaveNote,
  onCreateNote,
  onDeleteNote,
  onAddToWorkingGraph,
  onPromoteNote,
  onSelectNodeInGraph,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [saveIndicator, setSaveIndicator] = useState<string>('Saved');

  const selectedNote = useMemo(() => {
    return notes.find((n) => n.id === selectedNoteId) || notes[0] || null;
  }, [notes, selectedNoteId]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach((n) => n.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [notes]);

  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      if (selectedTag !== 'ALL' && !n.tags.includes(selectedTag)) return false;
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
      }
      return true;
    });
  }, [notes, selectedTag, searchFilter]);

  // Auto-detect backlinks in markdown content (`[[id-or-title]]`)
  const discoveredBacklinks = useMemo(() => {
    if (!selectedNote) return [];
    const matches = selectedNote.content.match(/\[\[(.*?)\]\]/g) || [];
    const cleaned = matches.map((m) => m.replace(/\[\[|\]\]/g, ''));
    return Array.from(new Set(cleaned));
  }, [selectedNote]);

  const handleUpdateField = (field: string, value: any) => {
    if (!selectedNote) return;
    setSaveIndicator('Saving...');
    onSaveNote({
      id: selectedNote.id,
      [field]: value,
    });
    setTimeout(() => setSaveIndicator('Saved to SQLite'), 400);
  };

  const handleExportMarkdown = () => {
    if (!selectedNote) return;
    const blob = new Blob([selectedNote.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedNote.title.toLowerCase().replace(/\s+/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="notes-workspace-container" className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-neutral-950 text-neutral-200">
      {/* Left Notes List Sidebar */}
      <aside aria-label="Research Notes List" className="w-full md:w-80 bg-neutral-900/90 border-r border-neutral-800 flex flex-col overflow-hidden">
        {/* Header with Search & New Note */}
        <div className="p-3 border-b border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-sm text-neutral-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Research Notes
            </h2>
            <button
              id="btn-sidebar-new-note"
              onClick={onCreateNote}
              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 rounded text-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-neutral-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-8 pr-3 py-1 bg-neutral-950 border border-neutral-700 rounded text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Tag Chips */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] scrollbar-none">
            <button
              onClick={() => setSelectedTag('ALL')}
              className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                selectedTag === 'ALL'
                  ? 'bg-neutral-800 text-neutral-100 font-medium'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                  selectedTag === tag
                    ? 'bg-emerald-950 border border-emerald-800 text-emerald-300 font-medium'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Scrollable List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filteredNotes.map((note) => {
            const isSelected = selectedNote?.id === note.id;
            return (
              <div
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-neutral-800/90 border-emerald-700/80 shadow-md'
                    : 'bg-neutral-950/60 border-neutral-800/80 hover:bg-neutral-800/50'
                }`}
              >
                <div className="flex items-start justify-between gap-1 mb-1">
                  <h4 className="font-serif text-xs font-semibold text-neutral-100 line-clamp-1">
                    {note.title}
                  </h4>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                      note.status === 'CANONICAL'
                        ? 'bg-amber-950/80 border-amber-800 text-amber-300'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                    }`}
                  >
                    {note.status}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                  {note.content.replace(/[#*`>]/g, '')}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-neutral-500">
                  <span className="text-emerald-400/90 font-mono">{note.epistemicTier}</span>
                  <span>•</span>
                  <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  {note.isAddedToWorkingGraph && (
                    <span className="text-cyan-400 font-mono ml-auto">✓ In Graph</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Right Dual-Pane Editor / Preview */}
      {selectedNote ? (
        <main aria-label="Research Note Editor" className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-950">
          {/* Note Action Toolbar */}
          <div className="p-3 bg-neutral-900/80 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-[240px]">
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) => handleUpdateField('title', e.target.value)}
                className="font-serif font-bold text-base bg-transparent border-b border-transparent hover:border-neutral-700 focus:border-emerald-500 text-neutral-100 focus:outline-none flex-1"
                placeholder="Note Title..."
              />
              <span className="text-xs font-mono text-neutral-500 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-400" />
                {saveIndicator}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Epistemic Tier Selector */}
              <select
                value={selectedNote.epistemicTier}
                onChange={(e) => handleUpdateField('epistemicTier', e.target.value as EpistemicTier)}
                className="px-2 py-1 bg-neutral-950 border border-neutral-700 rounded text-xs text-cyan-300 font-mono"
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

              {/* Working Graph Action (Invariant E-I8 / E-I9 Compliant) */}
              <button
                id="btn-add-to-working-graph"
                onClick={() => onAddToWorkingGraph(selectedNote.id)}
                className="flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-cyan-300 rounded text-xs transition-colors"
                title="Add concept node to the working research graph (does not make it Canonical)"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Add to Working Graph</span>
              </button>

              {/* Submit for Canonical Review */}
              {selectedNote.status !== 'CANONICAL' && (
                <button
                  id="btn-submit-note-promotion"
                  onClick={() => onPromoteNote(selectedNote)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-200 rounded text-xs transition-colors"
                  title="Submit note through human promotion gate"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Promote</span>
                </button>
              )}

              {/* Preview Toggle */}
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`p-1.5 rounded border text-xs flex items-center gap-1 ${
                  isPreviewMode
                    ? 'bg-neutral-800 border-neutral-600 text-neutral-100'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
                title={isPreviewMode ? 'Switch to Edit' : 'Switch to Markdown Preview'}
              >
                {isPreviewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isPreviewMode ? 'Edit' : 'Preview'}</span>
              </button>

              {/* Export Markdown */}
              <button
                onClick={handleExportMarkdown}
                className="p-1.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200"
                title="Download .md file"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              {/* Delete Note */}
              <button
                onClick={() => onDeleteNote(selectedNote.id)}
                className="p-1.5 rounded bg-rose-950/70 hover:bg-rose-900 border border-rose-800 text-rose-300"
                title="Delete Note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tags & Epistemic Rule Reminder */}
          <div className="px-4 py-1.5 bg-neutral-950 border-b border-neutral-900 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-neutral-500 flex items-center gap-1">
              <Tag className="w-3 h-3 text-neutral-400" />
              Tags:
            </span>
            <input
              type="text"
              value={selectedNote.tags.join(', ')}
              onChange={(e) =>
                handleUpdateField(
                  'tags',
                  e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                )
              }
              placeholder="e.g. Ungrund, Nishitani, Kenosis"
              className="bg-transparent text-neutral-300 text-xs focus:outline-none flex-1"
            />
          </div>

          {/* Editor Body or Markdown Render */}
          <div className="flex-1 overflow-y-auto p-4">
            {isPreviewMode ? (
              <div className="prose prose-invert prose-amber max-w-4xl mx-auto text-neutral-200 text-sm leading-relaxed">
                <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
              </div>
            ) : (
              <textarea
                value={selectedNote.content}
                onChange={(e) => handleUpdateField('content', e.target.value)}
                placeholder="Write your research note here. Use [[concept-id]] or [[thinker-name]] to establish semantic backlinks..."
                className="w-full h-full bg-transparent text-neutral-200 font-mono text-sm leading-relaxed focus:outline-none resize-none"
              />
            )}
          </div>

          {/* Backlinks Footer Section */}
          <div className="p-3 bg-neutral-900/90 border-t border-neutral-800 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-neutral-400 font-semibold">
              <Link className="w-3.5 h-3.5 text-amber-400" />
              <span>Semantic Backlinks ({discoveredBacklinks.length}):</span>
            </div>
            {discoveredBacklinks.length === 0 ? (
              <span className="text-neutral-500 italic">
                No backlinks referenced. Use [[node-id]] to link knowledge graph entities.
              </span>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {discoveredBacklinks.map((linkTarget) => {
                  const matchingNode = nodes.find(
                    (n) => n.id === linkTarget || n.label.toLowerCase() === linkTarget.toLowerCase()
                  );
                  return (
                    <button
                      key={linkTarget}
                      onClick={() => matchingNode && onSelectNodeInGraph && onSelectNodeInGraph(matchingNode.id)}
                      className="px-2 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-cyan-300 font-mono flex items-center gap-1"
                    >
                      <span>[[{matchingNode?.label || linkTarget}]]</span>
                      {matchingNode && <span className="text-[10px] text-amber-400">({matchingNode.type})</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      ) : (
        <div className="flex-1 flex items-center justify-center text-neutral-500 text-xs">
          No research notes available. Create a note to begin.
        </div>
      )}
    </div>
  );
};
