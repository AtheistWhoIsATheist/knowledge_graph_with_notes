/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP v2
 * Backup, Restore & Integrity Audit Modal
 */

import React, { useState } from 'react';
import { Database, Download, Upload, ShieldCheck, AlertCircle, RefreshCw, X } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReseed: () => void;
  isReseeding: boolean;
  hashChainValid: boolean;
  canonicalCount: number;
  totalNodes: number;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onReseed,
  isReseeding,
  hashChainValid,
  canonicalCount,
  totalNodes,
}) => {
  const [exporting, setExporting] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<string>('');

  if (!isOpen) return null;

  const handleDownloadBackup = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/backup/export');
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nihiltheism_nkgap_backup_${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Backup export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const res = await fetch('/api/backup/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed),
        });
        const result = await res.json();
        if (result.success) {
          setImportStatus('Backup successfully restored! Reloading database state...');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          setImportStatus(`Restore Error: ${result.error || 'Invalid backup structure'}`);
        }
      } catch (err) {
        setImportStatus('Failed to parse JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h3 className="font-serif font-bold text-lg text-neutral-100 flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-400" />
            Corpus Backup & Epistemic Audit
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {importStatus && (
          <div className="p-3 bg-neutral-950 border border-neutral-700 text-xs rounded-lg text-neutral-200 font-mono">
            {importStatus}
          </div>
        )}

        {/* Epistemic Health Summary */}
        <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800 space-y-2 text-xs">
          <div className="font-semibold text-neutral-300 flex items-center justify-between">
            <span>Cryptographic Integrity Status</span>
            <span
              className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                hashChainValid ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}
            >
              {hashChainValid ? '✓ Hash Chain Valid' : '⚠️ Hash Chain Compromised'}
            </span>
          </div>
          <div className="text-neutral-400 flex justify-between font-mono text-[11px]">
            <span>Canonical Entities:</span>
            <span className="text-amber-400">{canonicalCount} of {totalNodes}</span>
          </div>
          <div className="text-neutral-400 flex justify-between font-mono text-[11px]">
            <span>Storage Backend:</span>
            <span className="text-cyan-400">SQLite (Durable File Persistence)</span>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="space-y-3 pt-1">
          {/* Download JSON Backup */}
          <button
            onClick={handleDownloadBackup}
            disabled={exporting}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-100 rounded-lg text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4 text-purple-400" />
            <span>{exporting ? 'Generating JSON Backup...' : 'Export Complete Database (.json)'}</span>
          </button>

          {/* Upload Backup */}
          <label className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-100 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Restore from Backup (.json)</span>
            <input type="file" accept=".json" onChange={handleUploadBackup} className="hidden" />
          </label>

          {/* Reseed Canonical Corpus */}
          <button
            onClick={onReseed}
            disabled={isReseeding}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg text-xs transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-amber-400 ${isReseeding ? 'animate-spin' : ''}`} />
            <span>Reseed Canonical Journal314 & REN Canon</span>
          </button>
        </div>

        <div className="flex justify-end pt-2 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
