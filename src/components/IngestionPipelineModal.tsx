/**
 * NIHILTHEISM — Live Ingestion Pipeline Drawer / Modal
 * Real-time 5-Stage Visual Telemetry, Batch File Dropzone, Manuscript Paste & Interactive Review
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  Zap,
  CheckCircle2,
  AlertCircle,
  Database,
  Layers,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  ChevronRight,
  Eye,
  Check,
  Cpu,
  Orbit,
} from 'lucide-react';
import {
  GraphNode,
  GraphEdge,
  IngestionReport,
  IngestionStage,
} from '../types';

interface IngestionPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestSuccess: (report: IngestionReport, autoCommitted: boolean) => void;
  onReprocessSuccess: (result: {
    documentsReprocessed: number;
    nodesCreatedCount: number;
    edgesCreatedCount: number;
    thinkersLinkedCount: number;
    nodes: GraphNode[];
    edges: GraphEdge[];
  }) => void;
  initialFiles?: File[];
}

export const IngestionPipelineModal: React.FC<IngestionPipelineModalProps> = ({
  isOpen,
  onClose,
  onIngestSuccess,
  onReprocessSuccess,
  initialFiles,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'reprocess'>('upload');
  const [autoCommit, setAutoCommit] = useState<boolean>(true);
  const [currentStage, setCurrentStage] = useState<IngestionStage>('idle');
  const [stageProgress, setStageProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Paste mode form
  const [pasteTitle, setPasteTitle] = useState<string>('');
  const [pasteAuthor, setPasteAuthor] = useState<string>('Researcher');
  const [pasteContent, setPasteContent] = useState<string>('');

  // Active or completed report for Review Mode
  const [ingestionReport, setIngestionReport] = useState<IngestionReport | null>(null);
  const [reviewTab, setReviewTab] = useState<'concepts' | 'thinkers' | 'edges' | 'insights'>('concepts');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle files passed via drag-and-drop
  useEffect(() => {
    if (initialFiles && initialFiles.length > 0 && isOpen) {
      handleProcessFiles(initialFiles);
    }
  }, [initialFiles, isOpen]);

  if (!isOpen) return null;

  const simulateStageTelemetry = async (onStageChange: (stage: IngestionStage, msg: string) => void) => {
    onStageChange('hashing_chunking', 'Stage 1/5: Cryptographic SHA-256 computation & discourse chunking...');
    await new Promise((r) => setTimeout(r, 260));
    onStageChange('entity_thinker_recognition', 'Stage 2/5: Scanning 53 Canonical Thinkers & extracting ontological concepts...');
    await new Promise((r) => setTimeout(r, 340));
    onStageChange('relational_edge_inference', 'Stage 3/5: Inferring intra-document & cross-corpus relational edges...');
    await new Promise((r) => setTimeout(r, 280));
    onStageChange('constructive_synthesis', 'Stage 4/5: Generating high-order Constructive Synthesis Insights in the Realm of Forms...');
    await new Promise((r) => setTimeout(r, 320));
    onStageChange('radial_shell_assignment', 'Stage 5/5: Assigning concentric radial shells (r=220, 420, 680, 880) & live commit...');
    await new Promise((r) => setTimeout(r, 240));
  };

  const handleProcessFiles = async (files: File[] | FileList) => {
    setErrorMessage('');
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const content = await file.text();

      try {
        simulateStageTelemetry((stage, msg) => {
          setCurrentStage(stage);
          setStatusMessage(msg);
        });

        const res = await fetch('/api/ingest/document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            filename: file.name,
            content,
            author: 'Imported Manuscript',
            autoCommitToGraph: autoCommit,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Ingestion failed');
        }

        const report: IngestionReport = await res.json();
        setCurrentStage('completed');
        setStatusMessage(`Successfully processed "${title}": ${report.newNodesCreated.length} nodes created, ${report.newEdgesCreated.length} edges inferred.`);
        setIngestionReport(report);

        if (autoCommit) {
          onIngestSuccess(report, true);
        }
      } catch (err: any) {
        setCurrentStage('error');
        setErrorMessage(err.message || 'Error occurred during ontological ingestion');
        return;
      }
    }
  };

  const handleProcessPaste = async () => {
    setErrorMessage('');
    if (!pasteTitle.trim() || !pasteContent.trim()) {
      setErrorMessage('Please provide both a document title and manuscript content.');
      return;
    }

    try {
      simulateStageTelemetry((stage, msg) => {
        setCurrentStage(stage);
        setStatusMessage(msg);
      });

      const res = await fetch('/api/ingest/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pasteTitle.trim(),
          filename: `${pasteTitle.trim().toLowerCase().replace(/\s+/g, '_')}.md`,
          content: pasteContent,
          author: pasteAuthor.trim() || 'Researcher',
          autoCommitToGraph: autoCommit,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Ingestion failed');
      }

      const report: IngestionReport = await res.json();
      setCurrentStage('completed');
      setStatusMessage(`Successfully synthesized "${pasteTitle}": ${report.newNodesCreated.length} nodes created, ${report.newEdgesCreated.length} edges linked.`);
      setIngestionReport(report);

      if (autoCommit) {
        onIngestSuccess(report, true);
      }
    } catch (err: any) {
      setCurrentStage('error');
      setErrorMessage(err.message || 'Error occurred during manuscript ingestion');
    }
  };

  const handleReprocessEntireLibrary = async () => {
    setErrorMessage('');
    try {
      setCurrentStage('hashing_chunking');
      setStatusMessage('Re-indexing entire corpus library and inferring cross-corpus relations...');

      const res = await fetch('/api/ingest/reprocess-library', {
        method: 'POST',
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to reprocess library');
      }

      const data = await res.json();
      setCurrentStage('completed');
      setStatusMessage(`Library re-indexing complete: Reprocessed ${data.documentsReprocessed} texts, committed ${data.nodesCreatedCount} nodes, established ${data.edgesCreatedCount} edges across 53 canonical thinkers.`);
      onReprocessSuccess(data);
    } catch (err: any) {
      setCurrentStage('error');
      setErrorMessage(err.message || 'Failed to re-index library');
    }
  };

  const handleManualCommit = () => {
    if (ingestionReport) {
      onIngestSuccess(ingestionReport, false);
      onClose();
    }
  };

  const stagesList = [
    { key: 'hashing_chunking', label: '1. SHA-256 & Chunking' },
    { key: 'entity_thinker_recognition', label: '2. 53-Thinker & Entity Scan' },
    { key: 'relational_edge_inference', label: '3. Relational Inference' },
    { key: 'constructive_synthesis', label: '4. Constructive Insights' },
    { key: 'radial_shell_assignment', label: '5. Shell Stratification' },
  ];

  const getStageIndex = (stage: IngestionStage) => {
    if (stage === 'completed') return 5;
    if (stage === 'error') return -1;
    return stagesList.findIndex((s) => s.key === stage);
  };

  const currentStageIdx = getStageIndex(currentStage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-cyan-500/30 bg-[#090b10] text-neutral-100 shadow-2xl shadow-cyan-950/40 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-[#050508]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-950 to-neutral-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-900/20">
              <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-neutral-100 font-serif tracking-wide">
                  Automated Corpus Ingestion & Live Graph Synthesis Engine
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono">
                  Ω³ Multi-Modal Pipeline
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Transforms unstructured manuscripts into verified nodes, 53-thinker cross-links, and constructive synthesis insights
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Configuration & Navigation */}
        <div className="px-5 py-3 border-b border-neutral-800/80 bg-neutral-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-neutral-950 border border-neutral-800">
            <button
              onClick={() => {
                setActiveTab('upload');
                setIngestionReport(null);
                setCurrentStage('idle');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'upload'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Batch File Upload
            </button>
            <button
              onClick={() => {
                setActiveTab('paste');
                setIngestionReport(null);
                setCurrentStage('idle');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'paste'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Manuscript Paste
            </button>
            <button
              onClick={() => {
                setActiveTab('reprocess');
                setIngestionReport(null);
                setCurrentStage('idle');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'reprocess'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Re-Synthesize Corpus Library
            </button>
          </div>

          {/* Auto-Commit Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Workflow Mode:</span>
            <button
              onClick={() => setAutoCommit(!autoCommit)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all ${
                autoCommit
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-sm'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-300'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${autoCommit ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'}`} />
              {autoCommit ? 'Auto-Commit to Live Graph (Default)' : 'Interactive Review & Curate Mode'}
            </button>
          </div>
        </div>

        {/* Real-time 5-Stage Visual Telemetry Pipeline Banner */}
        <div className="px-5 py-3 border-b border-neutral-800/60 bg-[#050508]/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              5-Stage Ontological Extraction Telemetry
            </span>
            <span className="text-[11px] font-mono text-cyan-400">
              {currentStage === 'completed'
                ? 'Pipeline Hydrated • Live Graph Synchronized'
                : currentStage === 'error'
                ? 'Pipeline Halted with Fault'
                : currentStage === 'idle'
                ? 'Standby • Ready for Manuscripts'
                : statusMessage}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {stagesList.map((stg, idx) => {
              const isPast = currentStageIdx > idx;
              const isCurrent = currentStageIdx === idx;
              return (
                <div
                  key={stg.key}
                  className={`px-2.5 py-1.5 rounded-lg border text-[10.5px] font-mono transition-all flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-900/30 animate-pulse'
                      : isPast
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : 'bg-neutral-900/40 border-neutral-800 text-neutral-500'
                  }`}
                >
                  {isPast ? (
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Orbit className="w-3 h-3 text-cyan-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-neutral-700 shrink-0" />
                  )}
                  <span className="truncate">{stg.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: Batch File Upload */}
          {activeTab === 'upload' && !ingestionReport && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleProcessFiles(e.dataTransfer.files);
                  }
                }}
                className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-400/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-gradient-to-b from-cyan-950/10 to-transparent hover:bg-cyan-950/20 group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept=".md,.txt,.json,.csv"
                  className="hidden"
                  onChange={(e) => e.target.files && handleProcessFiles(e.target.files)}
                />
                <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-105 group-hover:border-cyan-400 transition-all shadow-lg shadow-cyan-950/50">
                  <Upload className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-100 font-serif mb-1">
                  Drag & Drop Philosophical Manuscripts Here
                </h3>
                <p className="text-xs text-neutral-400 max-w-md mb-3">
                  Upload <code className="text-cyan-400">.md</code>, <code className="text-cyan-400">.txt</code>, or <code className="text-cyan-400">.json</code> files. The engine automatically chunks discourse, extracts entities, matches the 53 canonical thinkers, generates constructive synthesis insights, and maps nodes to radial shells.
                </p>
                <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400/80 bg-neutral-900/80 px-3 py-1 rounded-full border border-neutral-800">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Dual-Mode: Gemini 3.8 Flash + Zero-Latency Deterministic Parser
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Manuscript Paste */}
          {activeTab === 'paste' && !ingestionReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1 font-mono">
                    Document Title:
                  </label>
                  <input
                    type="text"
                    value={pasteTitle}
                    onChange={(e) => setPasteTitle(e.target.value)}
                    placeholder="e.g., The Apophatic Breach & Platonic Potentiality"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-900 border border-neutral-700 focus:border-cyan-400 focus:outline-none text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1 font-mono">
                    Author / Origin:
                  </label>
                  <input
                    type="text"
                    value={pasteAuthor}
                    onChange={(e) => setPasteAuthor(e.target.value)}
                    placeholder="e.g., Keiji Nishitani / Journal314 Codex"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-900 border border-neutral-700 focus:border-cyan-400 focus:outline-none text-neutral-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1 font-mono">
                  Raw Philosophical Manuscript / Markdown Content:
                </label>
                <textarea
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  rows={9}
                  placeholder={`Paste paragraphs, essays, or chapters here...

Example:
# The Transmutation of Groundlessness
When Meister Eckhart distinguishing between God and Godhead encounters the abyss, he aligns with Friedrich Nietzsche's active nihilism. Rather than permanent despair, Peter Wessel Zapffe and Herman Tønnessen reveal how consciousness confronts the absolute unground to access the timeless realm of eternal Forms.`}
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-neutral-900 border border-neutral-700 focus:border-cyan-400 focus:outline-none text-neutral-100 resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleProcessPaste}
                  disabled={currentStage !== 'idle' && currentStage !== 'completed' && currentStage !== 'error'}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-lg shadow-cyan-900/30 transition-all disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  Execute Ontological Extraction & Live Commit
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Re-Synthesize Entire Library */}
          {activeTab === 'reprocess' && !ingestionReport && (
            <div className="space-y-4 text-center p-6 border border-amber-500/20 rounded-2xl bg-amber-950/10">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto mb-2">
                <RefreshCw className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-100 font-serif">
                Re-Index & Cross-Synthesize Entire Corpus Library
              </h3>
              <p className="text-xs text-neutral-400 max-w-lg mx-auto">
                Executes full ontological extraction, 53-thinker cross-linking, and constructive insight synthesis across all pre-loaded and imported texts in the Knowledge Library, guaranteeing that every document projects its entities directly into the graph.
              </p>
              <button
                onClick={handleReprocessEntireLibrary}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-xs shadow-lg shadow-amber-950/50 transition-all"
              >
                <Zap className="w-4 h-4" />
                Run Complete Corpus Synthesis
              </button>
            </div>
          )}

          {/* Ingestion Report & Interactive Review Mode */}
          {ingestionReport && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-neutral-100 font-serif">
                      {ingestionReport.title}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                    {ingestionReport.summaryThesis}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!autoCommit && (
                    <button
                      onClick={handleManualCommit}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-900/30 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Commit All to Live Graph
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIngestionReport(null);
                      setCurrentStage('idle');
                    }}
                    className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors"
                  >
                    Ingest Another
                  </button>
                </div>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-neutral-900/70 border border-neutral-800">
                  <div className="text-lg font-bold text-cyan-400 font-mono">
                    {ingestionReport.newNodesCreated.length}
                  </div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono">
                    Nodes Created
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900/70 border border-neutral-800">
                  <div className="text-lg font-bold text-amber-400 font-mono">
                    {ingestionReport.thinkersLinked.length}
                  </div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono">
                    Thinkers Linked
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900/70 border border-neutral-800">
                  <div className="text-lg font-bold text-emerald-400 font-mono">
                    {ingestionReport.newEdgesCreated.length}
                  </div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono">
                    Edges Inferred
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900/70 border border-neutral-800">
                  <div className="text-lg font-bold text-purple-400 font-mono">
                    {ingestionReport.synthesizedInsights.length}
                  </div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono">
                    Insights Formulated
                  </div>
                </div>
              </div>

              {/* Review Tabs */}
              <div className="border-b border-neutral-800 flex items-center gap-2 text-xs font-mono">
                <button
                  onClick={() => setReviewTab('concepts')}
                  className={`pb-2 border-b-2 font-medium transition-all ${
                    reviewTab === 'concepts'
                      ? 'border-cyan-400 text-cyan-300'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Extracted Concepts ({ingestionReport.newNodesCreated.length})
                </button>
                <button
                  onClick={() => setReviewTab('thinkers')}
                  className={`pb-2 border-b-2 font-medium transition-all ${
                    reviewTab === 'thinkers'
                      ? 'border-amber-400 text-amber-300'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Matched Thinkers ({ingestionReport.thinkersLinked.length})
                </button>
                <button
                  onClick={() => setReviewTab('edges')}
                  className={`pb-2 border-b-2 font-medium transition-all ${
                    reviewTab === 'edges'
                      ? 'border-emerald-400 text-emerald-300'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Inferred Relations ({ingestionReport.newEdgesCreated.length})
                </button>
                <button
                  onClick={() => setReviewTab('insights')}
                  className={`pb-2 border-b-2 font-medium transition-all ${
                    reviewTab === 'insights'
                      ? 'border-purple-400 text-purple-300'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Constructive Insights ({ingestionReport.synthesizedInsights.length})
                </button>
              </div>

              {/* Detail Panels */}
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {reviewTab === 'concepts' &&
                  ingestionReport.newNodesCreated.map((node) => (
                    <div
                      key={node.id}
                      className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-neutral-200">{node.label}</div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">{node.description}</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-mono">
                        Shell {node.targetShellRadius === 220 ? '1 (220px)' : node.targetShellRadius === 420 ? '2 (420px)' : '4 (880px)'}
                      </span>
                    </div>
                  ))}

                {reviewTab === 'thinkers' &&
                  ingestionReport.thinkersLinked.map((thId) => (
                    <div
                      key={thId}
                      className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800 flex items-center justify-between text-xs"
                    >
                      <div className="font-semibold text-amber-300">{thId}</div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 border border-amber-500/30 text-amber-400 font-mono">
                        Canonical Invariant
                      </span>
                    </div>
                  ))}

                {reviewTab === 'edges' &&
                  ingestionReport.newEdgesCreated.map((edge) => (
                    <div
                      key={edge.id}
                      className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800 text-xs font-mono flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400">{edge.source}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-amber-400">{edge.relation}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-cyan-400">{edge.target}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">Weight: {edge.epistemicWeight}</span>
                    </div>
                  ))}

                {reviewTab === 'insights' &&
                  ingestionReport.synthesizedInsights.map((ins) => (
                    <div
                      key={ins.id}
                      className="p-3 rounded-lg bg-purple-950/20 border border-purple-500/30 text-xs space-y-1"
                    >
                      <div className="font-bold text-purple-300">{ins.label}</div>
                      <div className="text-neutral-300 text-[11px] leading-relaxed">{ins.description}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 flex items-center justify-between bg-[#050508]/80 text-xs">
          <div className="text-neutral-500 font-mono text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Append-only verification hash recorded • Zero manual node placement required
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
