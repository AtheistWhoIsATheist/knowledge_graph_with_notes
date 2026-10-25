/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP v2
 * Second Brain — Grounded Epistemic Research Assistant
 */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  SecondBrainQueryResponse,
} from '../types';
import {
  Brain,
  Search,
  Sparkles,
  BookOpen,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Layers,
  ArrowRight,
  Database
} from 'lucide-react';

interface SecondBrainProps {
  onQuerySecondBrain: (query: string) => Promise<SecondBrainQueryResponse | null>;
  onSelectNodeInGraph?: (nodeId: string) => void;
}

const SAMPLE_QUERIES = [
  'How does Keiji Nishitani transform Nietzschean nihilism into the field of Emptiness (Sunyata)?',
  'What is the distinction between Eckhart’s Gottheit and Böhme’s Ungrund?',
  'How does Ray Brassier’s extinction realism challenge the doctrine of the Sacred in Collapse?',
  'Explain the phenomenological reduction of despair according to Levinas and Cioran.',
  'Why can ethical obligation not be inferred directly from the groundless void (Invariant E-I7)?',
];

export const SecondBrain: React.FC<SecondBrainProps> = ({
  onQuerySecondBrain,
  onSelectNodeInGraph,
}) => {
  const [queryInput, setQueryInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<SecondBrainQueryResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleExecuteQuery = async (qText?: string) => {
    const q = (qText || queryInput).trim();
    if (!q) return;

    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await onQuerySecondBrain(q);
      if (res) {
        setResponse(res);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to retrieve grounded response from backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="second-brain-container" className="flex-1 flex flex-col h-full overflow-y-auto bg-neutral-950 text-neutral-200 p-4 md:p-6">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 border-b border-neutral-800 pb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-700 text-rose-400 mb-1 shadow-inner">
            <Brain className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-neutral-100">
            Epistemic Second Brain
          </h2>
          <p className="text-xs text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Corpus-grounded philosophical synthesis engine. All citations link directly to verified SQLite records across Journal314, REN, and the Epistemic Knowledge Graph.
          </p>
        </div>

        {/* Query Input Box */}
        <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-xl shadow-xl space-y-3">
          <div className="relative">
            <textarea
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleExecuteQuery();
                }
              }}
              rows={3}
              placeholder="Ask a deep philosophical question across the corpus (e.g. compare Nishitani and Eckhart on groundlessness)..."
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-rose-500 font-sans leading-relaxed resize-none"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-neutral-500 hidden sm:inline font-mono">
              Press ⌘+Enter or click Synthesize
            </span>

            <button
              onClick={() => handleExecuteQuery()}
              disabled={isLoading || !queryInput.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-rose-900 hover:bg-rose-800 disabled:opacity-50 text-rose-100 rounded-lg text-xs font-semibold transition-all shadow-md ml-auto"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-rose-300" />
                  <span>Synthesizing Corpus...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  <span>Ground & Synthesize</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Query Suggestions */}
          <div className="pt-2 border-t border-neutral-800/80">
            <span className="text-[11px] text-neutral-400 block mb-1.5 font-medium">
              Suggested Corpus Inquiries:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_QUERIES.map((sq, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQueryInput(sq);
                    handleExecuteQuery(sq);
                  }}
                  className="text-left text-[11px] px-2.5 py-1 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 transition-colors"
                >
                  "{sq}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Results Area */}
        {response && (
          <div className="space-y-6">
            {/* Meta & Performance Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Source of Truth: {response.sourceOfTruth}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Confidence: <strong className="text-amber-400">{response.epistemicConfidence}</strong></span>
                <span className="flex items-center gap-1 text-neutral-500">
                  <Clock className="w-3 h-3" />
                  {response.processingTimeMs}ms
                </span>
              </div>
            </div>

            {/* Synthesis Main Panel */}
            <div className="bg-neutral-900/90 border border-neutral-800 p-5 rounded-xl space-y-3 shadow-lg">
              <h3 className="font-serif font-bold text-base text-neutral-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                Corpus Grounded Synthesis
              </h3>
              <div className="prose prose-invert prose-rose max-w-none text-neutral-200 text-sm leading-relaxed">
                <ReactMarkdown>{response.synthesis}</ReactMarkdown>
              </div>
            </div>

            {/* Grounded Citation Cards */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-sm text-neutral-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Verified Corpus Grounding Citations ({response.groundedCitations.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {response.groundedCitations.map((cite) => (
                  <div
                    key={cite.id}
                    className="p-3.5 bg-neutral-900/80 border border-neutral-800 rounded-lg space-y-2 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif text-xs font-semibold text-neutral-100">
                        {cite.title}
                      </h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 border border-neutral-700 text-cyan-300">
                        {cite.type}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-300 italic leading-relaxed bg-neutral-950/60 p-2 rounded border border-neutral-800">
                      "{cite.quoteOrSnippet}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono pt-1">
                      <span className="truncate max-w-[180px]">Ref: {cite.sourceRef}</span>
                      <span className="text-amber-400">{cite.epistemicTier}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invariant Safeguards & Counter-Readings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Invariant Warnings */}
              <div className="p-4 bg-amber-950/20 border border-amber-900/40 rounded-xl space-y-2">
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Epistemic Invariant Enforcements
                </h4>
                <ul className="text-xs text-amber-200/90 space-y-1.5 list-disc list-inside">
                  {response.apophaticReflections.map((r, idx) => (
                    <li key={idx} className="leading-snug">{r}</li>
                  ))}
                </ul>
              </div>

              {/* Counter-Readings */}
              <div className="p-4 bg-rose-950/20 border border-rose-900/40 rounded-xl space-y-2">
                <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  Preserved Counter-Readings (Invariant E-I5)
                </h4>
                <ul className="text-xs text-rose-200/90 space-y-1.5 list-disc list-inside">
                  {response.counterReadings.map((c, idx) => (
                    <li key={idx} className="leading-snug">{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
