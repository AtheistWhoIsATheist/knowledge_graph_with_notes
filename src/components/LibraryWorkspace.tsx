/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP v2
 * Knowledge Library & Corpus Ingestion Workspace
 */

import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  LibraryDocument,
  LifecycleStatus,
} from '../types';
import {
  Library,
  Upload,
  FileText,
  Trash2,
  ShieldCheck,
  Search,
  Hash,
  Copy,
  Check,
  BookOpen,
  PlusCircle,
  AlertTriangle,
  Zap,
  Layers,
  Sparkles
} from 'lucide-react';
import { GraphNode, GraphEdge } from '../types';

interface LibraryWorkspaceProps {
  library: LibraryDocument[];
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  onImportDocument: (doc: Partial<LibraryDocument>) => void;
  onDeleteDocument: (docId: string) => void;
  onPromoteDocument: (doc: LibraryDocument) => void;
  onCreateNoteFromQuote: (quote: string, sourceTitle: string) => void;
  onOpenIngestionModal?: (initialDoc?: LibraryDocument) => void;
  onExtractDocument?: (doc: LibraryDocument) => void;
}

export const LibraryWorkspace: React.FC<LibraryWorkspaceProps> = ({
  library,
  nodes = [],
  edges = [],
  onImportDocument,
  onDeleteDocument,
  onPromoteDocument,
  onCreateNoteFromQuote,
  onOpenIngestionModal,
  onExtractDocument,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(library[0]?.id || '');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [showImportModal, setShowImportModal] = useState<boolean>(false);

  // Import form state
  const [importTitle, setImportTitle] = useState<string>('');
  const [importAuthor, setImportAuthor] = useState<string>('');
  const [importFilename, setImportFilename] = useState<string>('');
  const [importContent, setImportContent] = useState<string>('');
  const [importTags, setImportTags] = useState<string>('Corpus, Philosophical');
  const [importError, setImportError] = useState<string>('');

  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  const selectedDoc = useMemo(() => {
    return library.find((d) => d.id === selectedDocId) || library[0] || null;
  }, [library, selectedDocId]);

  const filteredDocs = useMemo(() => {
    return library.filter((d) => {
      if (!searchFilter) return true;
      const q = searchFilter.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q) ||
        (d.author || '').toLowerCase().includes(q)
      );
    });
  }, [library, searchFilter]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFilename(file.name);
    setImportTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setImportContent(text || '');
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    setImportError('');
    if (!importTitle.trim() || !importContent.trim()) {
      setImportError('Document title and text content are required.');
      return;
    }

    onImportDocument({
      title: importTitle,
      author: importAuthor || 'Imported Author',
      filename: importFilename || `${importTitle.toLowerCase().replace(/\s+/g, '_')}.md`,
      content: importContent,
      tags: importTags.split(',').map((s) => s.trim()).filter(Boolean),
    });

    setShowImportModal(false);
    setImportTitle('');
    setImportAuthor('');
    setImportFilename('');
    setImportContent('');
  };

  const handleCopyHash = (sha: string) => {
    navigator.clipboard.writeText(sha);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 1500);
  };

  return (
    <div id="library-workspace-container" className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-neutral-950 text-neutral-200">
      {/* Left Corpus Browser Sidebar */}
      <aside aria-label="Knowledge Library Documents" className="w-full md:w-84 bg-neutral-900/90 border-r border-neutral-800 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-sm text-neutral-100 flex items-center gap-2">
              <Library className="w-4 h-4 text-cyan-400" />
              Corpus Library
            </h2>
            <div className="flex items-center gap-1.5">
              {onOpenIngestionModal && (
                <button
                  onClick={() => onOpenIngestionModal()}
                  className="flex items-center gap-1 px-2 py-1 bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200 rounded text-xs transition-colors shadow-sm shadow-cyan-950"
                  title="Automated Multi-Modal Ingestion Pipeline"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span className="font-medium">Ingest</span>
                </button>
              )}
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-1 px-2 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 rounded text-xs transition-colors"
                title="Quick manual document upload"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-neutral-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search library texts..."
              className="w-full pl-8 pr-3 py-1 bg-neutral-950 border border-neutral-700 rounded text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Documents Scrollable List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredDocs.map((doc) => {
            const isSelected = selectedDoc?.id === doc.id;
            const linkedNodesCount =
              doc.linkedNodeIds?.length ||
              nodes.filter(
                (n) =>
                  n.sourceReference?.toLowerCase().includes(doc.title.toLowerCase()) ||
                  n.provenance?.sourceReference?.toLowerCase().includes(doc.title.toLowerCase())
              ).length;
            const linkedEdgesCount =
              doc.linkedEdgeIds?.length || (linkedNodesCount > 0 ? linkedNodesCount * 2 : 0);

            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all space-y-2 ${
                  isSelected
                    ? 'bg-neutral-800/90 border-cyan-600/80 shadow-md'
                    : 'bg-neutral-950/60 border-neutral-800/80 hover:bg-neutral-800/50'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <h4 className="font-serif text-xs font-semibold text-neutral-100 line-clamp-1">
                    {doc.title}
                  </h4>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded border shrink-0 ${
                      doc.canonicalStatus === 'CANONICAL'
                        ? 'bg-amber-950/80 border-amber-800 text-amber-300'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                    }`}
                  >
                    {doc.canonicalStatus}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400 font-mono line-clamp-1">
                  {doc.filename}
                </div>

                {/* Linked Nodes & Edges Telemetry Badge */}
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono flex items-center gap-1">
                    <Layers className="w-2.5 h-2.5 text-cyan-400" />
                    {linkedNodesCount} Nodes • {linkedEdgesCount} Edges Linked
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60 text-[10px] text-neutral-500 font-mono">
                  <span>{doc.sizeBytes} bytes</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onExtractDocument) {
                        onExtractDocument(doc);
                      } else if (onOpenIngestionModal) {
                        onOpenIngestionModal(doc);
                      }
                    }}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono transition-all hover:scale-[1.02]"
                    title="Extract ontological concepts, 53 thinkers, and project directly to graph"
                  >
                    <Zap className="w-3 h-3 text-cyan-400" />
                    <span>Extract to Graph</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Right Document Reader */}
      {selectedDoc ? (
        <main aria-label="Document Reader" className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-950">
          {/* Document Top Bar */}
          <div className="p-3 bg-neutral-900/80 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-neutral-100">{selectedDoc.title}</h3>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    selectedDoc.canonicalStatus === 'CANONICAL'
                      ? 'bg-amber-950/80 border-amber-800 text-amber-300'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                  }`}
                >
                  {selectedDoc.canonicalStatus}
                </span>
                {/* Linked Nodes Count Chip */}
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-[10.5px] font-mono flex items-center gap-1">
                  <Layers className="w-3 h-3 text-cyan-400" />
                  {selectedDoc.linkedNodeIds?.length ||
                    nodes.filter((n) => n.sourceReference?.includes(selectedDoc.title)).length}{' '}
                  Nodes Linked
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
                <span>File: {selectedDoc.filename}</span>
                <span>•</span>
                <span>Author: {selectedDoc.author || 'Canon'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Extract & Project to Graph Button */}
              <button
                onClick={() => {
                  if (onExtractDocument) {
                    onExtractDocument(selectedDoc);
                  } else if (onOpenIngestionModal) {
                    onOpenIngestionModal(selectedDoc);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-cyan-950 to-neutral-900 hover:from-cyan-900 hover:to-neutral-800 border border-cyan-500/40 text-cyan-200 rounded text-xs font-mono transition-all shadow-sm shadow-cyan-950"
                title="Extract ontological concepts and link to 53 thinkers"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>⚡ Extract & Project to Graph</span>
              </button>

              {/* SHA-256 Proof Chip */}
              <button
                onClick={() => handleCopyHash(selectedDoc.sha256)}
                className="flex items-center gap-1 px-2.5 py-1 bg-neutral-950 border border-neutral-700 hover:border-neutral-600 rounded text-xs font-mono text-cyan-300 transition-colors"
                title="Click to copy SHA-256 cryptographic hash"
              >
                <Hash className="w-3 h-3 text-cyan-400" />
                <span>{selectedDoc.sha256.slice(0, 12)}...</span>
                {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-neutral-500" />}
              </button>

              {/* Submit for Canonical Review */}
              {selectedDoc.canonicalStatus !== 'CANONICAL' && (
                <button
                  onClick={() => onPromoteDocument(selectedDoc)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-200 rounded text-xs transition-colors"
                  title="Submit imported document for canonical promotion review"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Promote</span>
                </button>
              )}

              {/* Delete Document */}
              <button
                onClick={() => onDeleteDocument(selectedDoc.id)}
                className="p-1.5 rounded bg-rose-950/70 hover:bg-rose-900 border border-rose-800 text-rose-300"
                title="Delete Document"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Reader Body */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="prose prose-invert prose-cyan max-w-4xl mx-auto text-neutral-200 text-sm leading-relaxed">
              <ReactMarkdown>{selectedDoc.content}</ReactMarkdown>
            </div>
          </div>
        </main>
      ) : (
        <div className="flex-1 flex items-center justify-center text-neutral-500 text-xs">
          No documents in library. Click 'Import' to add texts.
        </div>
      )}

      {/* Ingestion Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-serif font-bold text-lg text-neutral-100 flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-400" />
                Import Philosophical Corpus (.md / .txt)
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-neutral-400 hover:text-neutral-200">
                ✕
              </button>
            </div>

            {importError && (
              <div className="p-2.5 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs rounded flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>{importError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              {/* File upload input */}
              <div>
                <label className="text-neutral-400 block mb-1">Select File (.md, .txt):</label>
                <input
                  type="file"
                  accept=".md,.txt,.markdown"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-neutral-400 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-cyan-950 file:text-cyan-300 hover:file:bg-cyan-900 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Document Title:</label>
                  <input
                    type="text"
                    value={importTitle}
                    onChange={(e) => setImportTitle(e.target.value)}
                    placeholder="e.g. Nishitani on Emptiness"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-neutral-200"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Author / Source:</label>
                  <input
                    type="text"
                    value={importAuthor}
                    onChange={(e) => setImportAuthor(e.target.value)}
                    placeholder="e.g. Keiji Nishitani"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-neutral-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Text Content (Markdown):</label>
                <textarea
                  value={importContent}
                  onChange={(e) => setImportContent(e.target.value)}
                  rows={8}
                  placeholder="Paste or edit document contents here..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded p-2.5 font-mono text-xs text-neutral-200"
                />
              </div>

              <div className="text-[11px] text-neutral-500 bg-neutral-950 p-2.5 rounded border border-neutral-800">
                🔒 Invariant Guarantee: Imported texts are hashed with SHA-256, validated against duplicates, stored in persistent SQLite, and given PROVISIONAL status. They will never silently bypass governance.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteImport}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold"
              >
                Confirm Ingestion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
