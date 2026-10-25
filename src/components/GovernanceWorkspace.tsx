/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP v2
 * Governance, Promotion Gate & Sentinel Control Center
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  GovernanceRecord,
  SpotCheckRecord,
  GraphNode,
  ResearchNote,
  LibraryDocument,
} from '../types';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  Hash,
  Eye,
  RefreshCw,
  Search,
  ArrowRight,
  Database
} from 'lucide-react';

interface GovernanceWorkspaceProps {
  governanceLedger: GovernanceRecord[];
  spotChecks: SpotCheckRecord[];
  nodes: GraphNode[];
  notes: ResearchNote[];
  library: LibraryDocument[];
  onExecutePromotion: (payload: {
    entityId: string;
    entityType: 'node' | 'note' | 'library';
    confirmationPhrase: string;
    justification: string;
    conjunctiveChecks: {
      sourceVerified: boolean;
      textualFidelity: boolean;
      epistemicBoundaryChecked: boolean;
      noOntologicalOverreach: boolean;
      humanInspected: boolean;
    };
    agentRole: string;
  }) => Promise<boolean>;
  onExecuteSpotCheck: (entityId: string, action: 'pass' | 'flag' | 'demote', reason: string) => void;
  onReverifyNode: (entityId: string) => void;
}

export const GovernanceWorkspace: React.FC<GovernanceWorkspaceProps> = ({
  governanceLedger,
  spotChecks,
  nodes,
  notes,
  library,
  onExecutePromotion,
  onExecuteSpotCheck,
  onReverifyNode,
}) => {
  const [selectedTab, setSelectedTab] = useState<'pipeline' | 'ledger' | 'sentinel' | 'gate'>('pipeline');

  // Promotion Gate Form State
  const [targetEntityType, setTargetEntityType] = useState<'node' | 'note' | 'library'>('node');
  const [targetEntityId, setTargetEntityId] = useState<string>(nodes.find((n) => n.status !== 'CANONICAL')?.id || '');
  const [confirmationPhrase, setConfirmationPhrase] = useState<string>('');
  const [justification, setJustification] = useState<string>('');
  const [check1, setCheck1] = useState<boolean>(false);
  const [check2, setCheck2] = useState<boolean>(false);
  const [check3, setCheck3] = useState<boolean>(false);
  const [check4, setCheck4] = useState<boolean>(false);
  const [check5, setCheck5] = useState<boolean>(false);

  const [promotionError, setPromotionError] = useState<string>('');
  const [promotionSuccess, setPromotionSuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Spot-check form state
  const [spotTargetId, setSpotTargetId] = useState<string>(nodes[0]?.id || '');
  const [spotAction, setSpotAction] = useState<'pass' | 'flag' | 'demote'>('pass');
  const [spotReason, setSpotReason] = useState<string>('Routine source-hash integrity verification.');

  const handlePromoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromotionError('');
    setPromotionSuccess('');

    if (confirmationPhrase !== 'I HAVE INSPECTED THE SOURCE') {
      setPromotionError('Invariant G-I1 Error: Exact phrase "I HAVE INSPECTED THE SOURCE" must be typed.');
      return;
    }

    if (!justification.trim() || justification.trim().length < 15) {
      setPromotionError('Substantive epistemic justification required (minimum 15 characters).');
      return;
    }

    if (!check1 || !check2 || !check3 || !check4 || !check5) {
      setPromotionError('Invariant G-I2 Error: All 5 conjunctive verification checks must be checked.');
      return;
    }

    if (!targetEntityId) {
      setPromotionError('Please select a target entity to promote.');
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await onExecutePromotion({
        entityId: targetEntityId,
        entityType: targetEntityType,
        confirmationPhrase,
        justification,
        conjunctiveChecks: {
          sourceVerified: check1,
          textualFidelity: check2,
          epistemicBoundaryChecked: check3,
          noOntologicalOverreach: check4,
          humanInspected: check5,
        },
        agentRole: 'HUMAN_OPERATOR',
      });

      if (ok) {
        setPromotionSuccess('Canonical Promotion Authorized! Hash ledger and external anchor updated.');
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        setConfirmationPhrase('');
        setJustification('');
        setCheck1(false);
        setCheck2(false);
        setCheck3(false);
        setCheck4(false);
        setCheck5(false);
      }
    } catch (err: any) {
      setPromotionError(err.message || 'Promotion failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunSpotCheck = () => {
    if (!spotTargetId) return;
    onExecuteSpotCheck(spotTargetId, spotAction, spotReason);
  };

  return (
    <div id="governance-workspace-container" className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-950 text-neutral-200">
      {/* Governance Sub-header Navigation */}
      <div className="p-3 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-sm text-neutral-100">
              Epistemic Governance & Promotion Gate
            </h2>
            <p className="text-[11px] text-neutral-400">
              Enforcing Invariants G-I1 through G-I9 & E-I1 through E-I8
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs">
          <button
            onClick={() => setSelectedTab('pipeline')}
            className={`px-3 py-1 rounded transition-colors ${
              selectedTab === 'pipeline'
                ? 'bg-neutral-800 text-neutral-100 font-medium'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Orchestration Pipeline
          </button>
          <button
            onClick={() => setSelectedTab('gate')}
            className={`px-3 py-1 rounded transition-colors ${
              selectedTab === 'gate'
                ? 'bg-amber-950 border border-amber-800 text-amber-300 font-medium'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Human Promotion Gate
          </button>
          <button
            onClick={() => setSelectedTab('sentinel')}
            className={`px-3 py-1 rounded transition-colors ${
              selectedTab === 'sentinel'
                ? 'bg-rose-950 border border-rose-800 text-rose-300 font-medium'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Ω-Sentinel Audits
          </button>
          <button
            onClick={() => setSelectedTab('ledger')}
            className={`px-3 py-1 rounded transition-colors ${
              selectedTab === 'ledger'
                ? 'bg-neutral-800 text-neutral-100 font-medium'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Hash Chain Ledger ({governanceLedger.length})
          </button>
        </div>
      </div>

      {/* Main Governance Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* VIEW 1: ORCHESTRATION PIPELINE */}
        {selectedTab === 'pipeline' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-neutral-900/90 border border-neutral-800 p-5 rounded-xl space-y-4">
              <h3 className="font-serif font-bold text-base text-neutral-100">
                Epistemic Promotion Progression (Orchestration Lifecycle)
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                No provisional entity may bypass verification to enter the canonical knowledge graph without the strict 6-stage lifecycle progression and final human interruption.
              </p>

              {/* Step progression diagram */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-2 pt-2">
                {[
                  { role: 'Ω-Custodian', stage: 'INGESTION', desc: 'Raw text ingestion & SHA-256 fingerprinting' },
                  { role: 'Ω-Scout', stage: 'PROVISIONAL', desc: 'Discovery of philosophical nodes & citations' },
                  { role: 'Ω-Miner', stage: 'EXTRACT', desc: 'Extracts textual claims & argument premises' },
                  { role: 'Ω-Critic', stage: 'VERIFY', desc: 'Conjunctive verification & boundary check' },
                  { role: 'Ω-Scribe', stage: 'PROMOTION_READY', desc: 'Stages cryptographic payload for review' },
                  { role: 'HUMAN_OPERATOR', stage: 'INTERRUPT', desc: 'Exact "I HAVE INSPECTED THE SOURCE"' },
                  { role: 'CANONICAL', stage: 'CANONICAL', desc: 'Immutable append to ledger & anchor' },
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-center space-y-1.5 ${
                      step.stage === 'CANONICAL'
                        ? 'bg-amber-950/80 border-amber-700 text-amber-200'
                        : step.stage === 'INTERRUPT'
                        ? 'bg-rose-950/80 border-rose-700 text-rose-200 animate-pulse'
                        : 'bg-neutral-950/70 border-neutral-800 text-neutral-300'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-neutral-400">Step {idx + 1}</div>
                    <div className="font-bold text-xs">{step.role}</div>
                    <div className="text-[10px] font-mono uppercase text-amber-400">{step.stage}</div>
                    <div className="text-[10px] text-neutral-400 leading-tight">{step.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidates awaiting promotion */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-neutral-200">
                Entities Awaiting Review ({nodes.filter((n) => n.status !== 'CANONICAL').length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {nodes
                  .filter((n) => n.status !== 'CANONICAL')
                  .map((node) => (
                    <div
                      key={node.id}
                      className="p-3.5 bg-neutral-900/80 border border-neutral-800 rounded-lg flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-semibold text-xs text-neutral-100">
                            {node.label}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-cyan-300">
                            {node.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 line-clamp-2">
                          {node.description}
                        </p>
                        <div className="text-[10px] font-mono text-amber-400">
                          Status: {node.status}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setTargetEntityType('node');
                          setTargetEntityId(node.id);
                          setSelectedTab('gate');
                        }}
                        className="px-2.5 py-1.5 bg-amber-900/80 hover:bg-amber-800 border border-amber-700 text-amber-200 rounded text-xs whitespace-nowrap transition-colors"
                      >
                        Review
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: HUMAN PROMOTION GATE */}
        {selectedTab === 'gate' && (
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="bg-neutral-900/95 border border-amber-800/80 p-6 rounded-xl space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
                <Lock className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-serif font-bold text-base text-neutral-100">
                    Human Authorization Interrupt (Invariant G-I1)
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Direct human review and conjunctive verification for Canonical Promotion.
                  </p>
                </div>
              </div>

              {promotionError && (
                <div className="p-3 bg-rose-950/90 border border-rose-800 text-rose-200 text-xs rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{promotionError}</span>
                </div>
              )}

              {promotionSuccess && (
                <div className="p-3 bg-emerald-950/90 border border-emerald-800 text-emerald-200 text-xs rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{promotionSuccess}</span>
                </div>
              )}

              <form onSubmit={handlePromoteSubmit} className="space-y-4 text-xs">
                {/* Entity Selector */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-neutral-400 block mb-1">Entity Type:</label>
                    <select
                      value={targetEntityType}
                      onChange={(e) => setTargetEntityType(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-neutral-200"
                    >
                      <option value="node">Graph Node</option>
                      <option value="note">Research Note</option>
                      <option value="library">Library Document</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-neutral-400 block mb-1">Select Candidate:</label>
                    <select
                      value={targetEntityId}
                      onChange={(e) => setTargetEntityId(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-neutral-200"
                    >
                      <option value="">-- Choose entity --</option>
                      {targetEntityType === 'node' &&
                        nodes.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.label} ({n.status})
                          </option>
                        ))}
                      {targetEntityType === 'note' &&
                        notes.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.title} ({n.status})
                          </option>
                        ))}
                      {targetEntityType === 'library' &&
                        library.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.title} ({l.canonicalStatus})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* 5-Point Conjunctive Verification Checks */}
                <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800 space-y-2">
                  <label className="font-semibold text-amber-400 block uppercase tracking-wider text-[11px]">
                    Conjunctive Verification Requirements (Invariant G-I2)
                  </label>
                  <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={check1}
                      onChange={(e) => setCheck1(e.target.checked)}
                      className="rounded border-neutral-700 bg-neutral-900 text-amber-500"
                    />
                    <span>1. Primary source text directly located and cross-referenced.</span>
                  </label>
                  <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={check2}
                      onChange={(e) => setCheck2(e.target.checked)}
                      className="rounded border-neutral-700 bg-neutral-900 text-amber-500"
                    />
                    <span>2. Textual fidelity & original context verified (no cherry-picking).</span>
                  </label>
                  <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={check3}
                      onChange={(e) => setCheck3(e.target.checked)}
                      className="rounded border-neutral-700 bg-neutral-900 text-amber-500"
                    />
                    <span>3. Epistemic boundary preserved (distinct from subjective interpretation).</span>
                  </label>
                  <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={check4}
                      onChange={(e) => setCheck4(e.target.checked)}
                      className="rounded border-neutral-700 bg-neutral-900 text-amber-500"
                    />
                    <span>4. No ontological overreach (phenomenological intensity ≠ determinate deity).</span>
                  </label>
                  <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={check5}
                      onChange={(e) => setCheck5(e.target.checked)}
                      className="rounded border-neutral-700 bg-neutral-900 text-amber-500"
                    />
                    <span>5. Human researcher has personally inspected and validated the artifact.</span>
                  </label>
                </div>

                {/* Substantive Justification */}
                <div>
                  <label className="text-neutral-400 block mb-1">
                    Epistemic Justification (Minimum 15 characters):
                  </label>
                  <textarea
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    rows={3}
                    placeholder="Provide rigorous scholarly reason for canonical admission..."
                    className="w-full bg-neutral-950 border border-neutral-700 rounded p-2.5 text-neutral-200 text-xs"
                  />
                </div>

                {/* Exact Confirmation Phrase Input */}
                <div className="bg-amber-950/30 border border-amber-900/50 p-3.5 rounded-lg space-y-1.5">
                  <label className="text-amber-300 block font-semibold">
                    Type exact confirmation phrase to authorize:
                  </label>
                  <div className="text-[11px] font-mono text-amber-400 font-bold select-all">
                    I HAVE INSPECTED THE SOURCE
                  </div>
                  <input
                    type="text"
                    value={confirmationPhrase}
                    onChange={(e) => setConfirmationPhrase(e.target.value)}
                    placeholder="I HAVE INSPECTED THE SOURCE"
                    className="w-full bg-neutral-950 border border-amber-700/80 rounded p-2 font-mono text-xs text-amber-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-black font-bold rounded-lg transition-all shadow-lg text-xs tracking-wider uppercase"
                >
                  {isSubmitting ? 'Verifying & Appending Hash Chain...' : 'Authorize Canonical Promotion'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW 3: SENTINEL AUDITS */}
        {selectedTab === 'sentinel' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-neutral-900/90 border border-neutral-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <div>
                  <h3 className="font-serif font-bold text-base text-neutral-100">
                    Ω-Sentinel Integrity Auditor (Invariant G-I8)
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Sentinel performs automated hash checks and demotes mutated artifacts to REQUIRES_REVERIFICATION. Sentinel possesses NO promotion authority.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Target Node:</label>
                  <select
                    value={spotTargetId}
                    onChange={(e) => setSpotTargetId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-xs text-neutral-200"
                  >
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.label} ({n.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Audit Action:</label>
                  <select
                    value={spotAction}
                    onChange={(e) => setSpotAction(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-xs text-neutral-200"
                  >
                    <option value="pass">PASS (Hash Valid)</option>
                    <option value="flag">FLAG (Suspicious Mutation)</option>
                    <option value="demote">DEMOTE (Demote to REQUIRES_REVERIFICATION)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleRunSpotCheck}
                    className="w-full py-2 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 rounded text-xs font-semibold transition-colors"
                  >
                    Execute Sentinel Audit
                  </button>
                </div>
              </div>
            </div>

            {/* Spot check logs */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-neutral-200">
                Recent Sentinel Spot-Check Audit Records
              </h4>
              <div className="space-y-2">
                {spotChecks.map((spot) => (
                  <div
                    key={spot.id}
                    className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-lg flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-200">{spot.entityLabel}</span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                            spot.auditResult === 'PASS'
                              ? 'bg-emerald-950 border-emerald-800 text-emerald-300'
                              : 'bg-rose-950 border-rose-800 text-rose-300'
                          }`}
                        >
                          {spot.auditResult}
                        </span>
                      </div>
                      <p className="text-neutral-400 text-[11px]">{spot.reason}</p>
                      <div className="text-[10px] font-mono text-neutral-500">
                        Auditor: {spot.inspector} • {new Date(spot.timestamp).toLocaleString()}
                      </div>
                    </div>

                    {spot.auditResult === 'DEMOTED_TO_REVERIFICATION' && (
                      <button
                        onClick={() => onReverifyNode(spot.entityId)}
                        className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-200 rounded text-xs whitespace-nowrap"
                      >
                        Re-verify
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: HASH CHAIN LEDGER */}
        {selectedTab === 'ledger' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-neutral-100 flex items-center gap-2">
                <Hash className="w-4 h-4 text-amber-400" />
                Immutable Append-Only Governance Ledger
              </h3>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                ✓ SHA-256 Hash Chain Verified
              </span>
            </div>

            <div className="space-y-3">
              {governanceLedger.map((rec, idx) => (
                <div
                  key={rec.id}
                  className="p-4 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-2 font-mono text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-amber-400 font-bold font-serif text-sm">
                        #{idx + 1} {rec.entityLabel}
                      </span>
                      <span className="text-[10px] text-neutral-400 ml-2">
                        ({rec.previousStatus} → {rec.newStatus})
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-500">
                      {new Date(rec.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-neutral-300 font-sans text-xs bg-neutral-950 p-2.5 rounded border border-neutral-800">
                    "{rec.justification}"
                  </div>

                  <div className="text-[10px] space-y-0.5 text-neutral-400 pt-1 border-t border-neutral-800/80">
                    <div>Prev Hash: <span className="text-neutral-500">{rec.previousHash}</span></div>
                    <div>Record Hash: <span className="text-amber-300 font-bold">{rec.recordHash}</span></div>
                    <div>External Anchor: <span className="text-cyan-400">{rec.externalAnchorId}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
