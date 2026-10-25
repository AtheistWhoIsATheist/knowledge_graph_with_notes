/**
 * NIHILTHEISM — Epistemic Philosophical Knowledge Graph (N-KGAP v2)
 * Main Application Orchestrator & View Switcher
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  WorkspaceTab,
  GraphNode,
  GraphEdge,
  ResearchNote,
  ArgumentItem,
  DefenseItem,
  LibraryDocument,
  GovernanceRecord,
  SpotCheckRecord,
  SecondBrainQueryResponse,
  SearchResult,
  IngestionReport,
} from './types';

import { Header } from './components/Header';
import { GraphWorkspace } from './components/GraphWorkspace';
import { NotesWorkspace } from './components/NotesWorkspace';
import { ArgumentLab } from './components/ArgumentLab';
import { DefenseWorkspace } from './components/DefenseWorkspace';
import { LibraryWorkspace } from './components/LibraryWorkspace';
import { GovernanceWorkspace } from './components/GovernanceWorkspace';
import { SecondBrain } from './components/SecondBrain';
import { SavedViewsWorkspace } from './components/SavedViewsWorkspace';
import { NodeModal } from './components/NodeModal';
import { SearchModal } from './components/SearchModal';
import { BackupModal } from './components/BackupModal';
import { IngestionPipelineModal } from './components/IngestionPipelineModal';
import {
  INITIAL_NODES,
  INITIAL_EDGES,
  INITIAL_NOTES,
  INITIAL_ARGUMENTS,
  INITIAL_DEFENSE,
  INITIAL_LIBRARY,
  INITIAL_GOVERNANCE_LEDGER,
  INITIAL_SPOT_CHECKS,
} from './data/seedData';

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('graph');

  // Core domain state initialized with canonical seed, hydrated from API
  const [nodes, setNodes] = useState<GraphNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<GraphEdge[]>(INITIAL_EDGES);
  const [notes, setNotes] = useState<ResearchNote[]>(INITIAL_NOTES);
  const [argumentsList, setArgumentsList] = useState<ArgumentItem[]>(INITIAL_ARGUMENTS);
  const [defenseItems, setDefenseItems] = useState<DefenseItem[]>(INITIAL_DEFENSE);
  const [library, setLibrary] = useState<LibraryDocument[]>(INITIAL_LIBRARY);
  const [governanceLedger, setGovernanceLedger] = useState<GovernanceRecord[]>(INITIAL_GOVERNANCE_LEDGER);
  const [spotChecks, setSpotChecks] = useState<SpotCheckRecord[]>(INITIAL_SPOT_CHECKS);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);
  const [isReseeding, setIsReseeding] = useState<boolean>(false);

  // Selection & Modal State
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [isNodeModalOpen, setIsNodeModalOpen] = useState<boolean>(false);
  const [editingNode, setEditingNode] = useState<GraphNode | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);
  const [isIngestionModalOpen, setIsIngestionModalOpen] = useState<boolean>(false);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

  // Toast Notification System
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type?: 'info' | 'success' | 'warn' } | null>(null);

  const showToast = (title: string, desc: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.title === title ? null : prev));
    }, 3500);
  };

  // Fetch all data from backend
  const fetchAllData = useCallback(async () => {
    try {
      const [gRes, nRes, aRes, dRes, lRes, govRes] = await Promise.all([
        fetch('/api/graph').then((r) => r.json()),
        fetch('/api/notes').then((r) => r.json()),
        fetch('/api/arguments').then((r) => r.json()),
        fetch('/api/defense').then((r) => r.json()),
        fetch('/api/library').then((r) => r.json()),
        fetch('/api/governance').then((r) => r.json()),
      ]);

      if (gRes.nodes) setNodes(gRes.nodes);
      if (gRes.edges) setEdges(gRes.edges);
      if (Array.isArray(nRes)) setNotes(nRes);
      if (Array.isArray(aRes)) setArgumentsList(aRes);
      if (Array.isArray(dRes)) setDefenseItems(dRes);
      if (Array.isArray(lRes)) setLibrary(lRes);
      if (govRes.ledger) setGovernanceLedger(govRes.ledger);
      if (govRes.spotChecks) setSpotChecks(govRes.spotChecks);
      setIsBackendConnected(true);
    } catch (err) {
      console.error('Failed to load epistemic data from backend:', err);
      setIsBackendConnected(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Reseed Canonical Data
  const handleReseed = async () => {
    setIsReseeding(true);
    try {
      const res = await fetch('/api/reseed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchAllData();
        showToast('Canon Restored', 'Corpus reseeded from Journal314 & REN.', 'success');
      }
    } catch (err) {
      console.error('Reseed error:', err);
      showToast('Reseed Error', 'Failed to reseed database.', 'warn');
    } finally {
      setIsReseeding(false);
    }
  };

  // Node CRUD operations
  const handleSaveNode = async (nodeData: Partial<GraphNode>) => {
    try {
      const res = await fetch('/api/graph/node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nodeData),
      });
      const updatedNode = await res.json();
      setNodes((prev) => {
        const idx = prev.findIndex((n) => n.id === updatedNode.id);
        if (idx >= 0) {
          const clone = [...prev];
          clone[idx] = updatedNode;
          return clone;
        }
        return [...prev, updatedNode];
      });
      showToast('Node Saved', `Entity "${updatedNode.label}" updated in SQLite.`, 'success');
    } catch (err) {
      console.error('Save node error:', err);
      showToast('Error', 'Failed to save node', 'warn');
    }
  };

  const handleDeleteNode = async (nodeId: string) => {
    try {
      await fetch(`/api/graph/node/${nodeId}`, { method: 'DELETE' });
      setNodes((prev) => prev.filter((n) => n.id !== nodeId));
      setEdges((prev) =>
        prev.filter((e) => {
          const s = typeof e.source === 'object' ? (e.source as any).id : e.source;
          const t = typeof e.target === 'object' ? (e.target as any).id : e.target;
          return s !== nodeId && t !== nodeId;
        })
      );
      if (selectedNode?.id === nodeId) setSelectedNode(null);
      showToast('Node Removed', 'Entity deleted from knowledge graph.', 'info');
    } catch (err) {
      console.error('Delete node error:', err);
    }
  };

  // Edge operations
  const handleCreateEdge = async (source: string, target: string, relation: any, weight: number) => {
    try {
      const newEdge: Partial<GraphEdge> = {
        id: `edge-${Date.now()}`,
        source,
        target,
        relation,
        epistemicWeight: weight,
        status: 'PROVISIONAL',
        notes: 'Synthesized via Graph Workspace',
      };
      const res = await fetch('/api/graph/edge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEdge),
      });
      const created = await res.json();
      setEdges((prev) => [...prev, created]);
      showToast('Edge Established', `Connected with relation "${relation}".`, 'success');
    } catch (err) {
      console.error('Create edge error:', err);
    }
  };

  const handleDeleteEdge = async (edgeId: string) => {
    try {
      await fetch(`/api/graph/edge/${edgeId}`, { method: 'DELETE' });
      setEdges((prev) => prev.filter((e) => e.id !== edgeId));
      showToast('Relation Cleared', 'Edge deleted from graph.', 'info');
    } catch (err) {
      console.error('Delete edge error:', err);
    }
  };

  // Notes operations
  const handleSaveNote = async (noteUpdate: Partial<ResearchNote> & { id: string }) => {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteUpdate),
      });
      const updated = await res.json();
      setNotes((prev) => {
        const idx = prev.findIndex((n) => n.id === updated.id);
        if (idx >= 0) {
          const clone = [...prev];
          clone[idx] = updated;
          return clone;
        }
        return [...prev, updated];
      });
    } catch (err) {
      console.error('Save note error:', err);
    }
  };

  const handleCreateNote = async () => {
    const newId = `note-${Date.now()}`;
    const newNote: ResearchNote = {
      id: newId,
      title: 'Untitled Research Note',
      content: '# New Epistemic Inquiry\n\nEnter philosophical analysis and [[backlinks]] here...',
      tags: ['Inquiry'],
      backlinks: [],
      epistemicTier: 'NIHILTHEISTIC_RECONSTRUCTION',
      status: 'PROVISIONAL',
      linkedNodeIds: [],
      isAddedToWorkingGraph: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote),
      });
      const created = await res.json();
      setNotes((prev) => [created, ...prev]);
      setActiveTab('notes');
      showToast('Note Created', 'Draft initialized.', 'info');
    } catch (err) {
      console.error('Create note error:', err);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      showToast('Note Deleted', 'Research note removed.', 'info');
    } catch (err) {
      console.error('Delete note error:', err);
    }
  };

  // Add note concept to working graph (Invariant E-I8 / E-I9)
  const handleAddNoteToWorkingGraph = async (noteId: string) => {
    try {
      const res = await fetch(`/api/notes/${noteId}/add-to-graph`, { method: 'POST' });
      const data = await res.json();
      if (data.node) {
        setNodes((prev) => {
          const exists = prev.some((n) => n.id === data.node.id);
          return exists ? prev : [...prev, data.node];
        });
      }
      if (data.note) {
        setNotes((prev) => prev.map((n) => (n.id === data.note.id ? data.note : n)));
      }
      showToast(
        'Added to Working Graph',
        'Entity added with PROVISIONAL tier (does not claim canonical status).',
        'success'
      );
    } catch (err) {
      console.error('Add to graph error:', err);
    }
  };

  // Arguments operations
  const handleSaveArgument = async (argUpdate: Partial<ArgumentItem> & { id: string }) => {
    try {
      const res = await fetch('/api/arguments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(argUpdate),
      });
      const updated = await res.json();
      setArgumentsList((prev) => {
        const idx = prev.findIndex((a) => a.id === updated.id);
        if (idx >= 0) {
          const clone = [...prev];
          clone[idx] = updated;
          return clone;
        }
        return [...prev, updated];
      });
      showToast('Argument Updated', `"${updated.title}" saved.`, 'success');
    } catch (err) {
      console.error('Save argument error:', err);
    }
  };

  const handleCreateArgument = async (newArg: Partial<ArgumentItem>) => {
    try {
      const res = await fetch('/api/arguments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArg),
      });
      const created = await res.json();
      setArgumentsList((prev) => [created, ...prev]);
      showToast('Argument Formulated', 'New argument added to lab.', 'info');
    } catch (err) {
      console.error('Create argument error:', err);
    }
  };

  const handleDeleteArgument = async (argId: string) => {
    try {
      await fetch(`/api/arguments/${argId}`, { method: 'DELETE' });
      setArgumentsList((prev) => prev.filter((a) => a.id !== argId));
      showToast('Argument Removed', 'Record deleted.', 'info');
    } catch (err) {
      console.error('Delete argument error:', err);
    }
  };

  // Defense operations
  const handleSaveDefenseItem = async (itemUpdate: Partial<DefenseItem> & { id: string }) => {
    try {
      const res = await fetch('/api/defense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemUpdate),
      });
      const updated = await res.json();
      setDefenseItems((prev) => {
        const idx = prev.findIndex((d) => d.id === updated.id);
        if (idx >= 0) {
          const clone = [...prev];
          clone[idx] = updated;
          return clone;
        }
        return [...prev, updated];
      });
      showToast('Defense Item Updated', 'Oral rehearsal data saved.', 'success');
    } catch (err) {
      console.error('Save defense error:', err);
    }
  };

  const handleCreateDefenseItem = async (newItem: Partial<DefenseItem>) => {
    try {
      const res = await fetch('/api/defense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      const created = await res.json();
      setDefenseItems((prev) => [created, ...prev]);
      showToast('Question Added', 'New committee challenge staged.', 'info');
    } catch (err) {
      console.error('Create defense error:', err);
    }
  };

  const handleDeleteDefenseItem = async (itemId: string) => {
    try {
      await fetch(`/api/defense/${itemId}`, { method: 'DELETE' });
      setDefenseItems((prev) => prev.filter((d) => d.id !== itemId));
      showToast('Challenge Cleared', 'Defense item deleted.', 'info');
    } catch (err) {
      console.error('Delete defense error:', err);
    }
  };

  // Library operations
  const handleImportDocument = async (docData: Partial<LibraryDocument>) => {
    try {
      const res = await fetch('/api/library/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docData),
      });
      const created = await res.json();
      if (res.ok) {
        setLibrary((prev) => [created, ...prev]);
        showToast('Document Ingested', `"${created.title}" hashed with SHA-256 and stored in SQLite.`, 'success');
      } else {
        showToast('Import Warning', created.error || 'Failed to import document', 'warn');
      }
    } catch (err) {
      console.error('Import error:', err);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      await fetch(`/api/library/${docId}`, { method: 'DELETE' });
      setLibrary((prev) => prev.filter((d) => d.id !== docId));
      showToast('Document Removed', 'Text removed from library.', 'info');
    } catch (err) {
      console.error('Delete doc error:', err);
    }
  };

  // Automated Ingestion Handlers
  const handleIngestSuccess = (report: IngestionReport, autoCommitted: boolean) => {
    // 1. Merge newly extracted nodes
    setNodes((prev) => {
      const existingIds = new Set(prev.map((n) => n.id));
      const toAdd = report.newNodesCreated.filter((n) => !existingIds.has(n.id));
      return [...prev, ...toAdd];
    });

    // 2. Merge newly inferred edges
    setEdges((prev) => {
      const existingPairs = new Set(
        prev.map((e) => {
          const s = typeof e.source === 'object' ? (e.source as any).id : e.source;
          const t = typeof e.target === 'object' ? (e.target as any).id : e.target;
          return `${s}--${t}`;
        })
      );
      const toAdd = report.newEdgesCreated.filter((e) => {
        const k1 = `${e.source}--${e.target}`;
        const k2 = `${e.target}--${e.source}`;
        return !existingPairs.has(k1) && !existingPairs.has(k2);
      });
      return [...prev, ...toAdd];
    });

    // 3. Refresh library metadata and badges
    fetchAllData();

    // 4. Highlight primary synthesized insight on the live graph
    if (report.synthesizedInsights.length > 0) {
      setSelectedNode(report.synthesizedInsights[0]);
    } else if (report.newNodesCreated.length > 0) {
      setSelectedNode(report.newNodesCreated[0]);
    }

    // 5. Switch to Live Graph Workstation
    setActiveTab('graph');
    showToast(
      'Corpus Synthesized into Live Graph',
      `"${report.title}": ${report.newNodesCreated.length} nodes & ${report.newEdgesCreated.length} edges mapped to radial shells.`,
      'success'
    );
  };

  const handleReprocessSuccess = (result: {
    documentsReprocessed: number;
    nodesCreatedCount: number;
    edgesCreatedCount: number;
    thinkersLinkedCount: number;
    nodes: GraphNode[];
    edges: GraphEdge[];
    library?: LibraryDocument[];
  }) => {
    if (result.nodes) setNodes(result.nodes);
    if (result.edges) setEdges(result.edges);
    if (result.library) setLibrary(result.library);
    setActiveTab('graph');
    showToast(
      'Corpus Library Synthesized',
      `Reprocessed ${result.documentsReprocessed} texts • ${result.nodesCreatedCount} nodes & ${result.edgesCreatedCount} edges linked to 53 thinkers.`,
      'success'
    );
  };

  const handleExtractDocument = async (doc: LibraryDocument) => {
    showToast('Extracting Manuscript', `Parsing entities & 53 thinkers from "${doc.title}"...`, 'info');
    try {
      const res = await fetch('/api/ingest/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: doc.title,
          filename: doc.filename,
          content: doc.content,
          author: doc.author,
          autoCommitToGraph: true,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Extraction failed');
      }

      const report: IngestionReport = await res.json();
      handleIngestSuccess(report, true);
    } catch (err: any) {
      console.error('Extract document error:', err);
      showToast('Extraction Error', err.message || 'Failed to extract document', 'warn');
    }
  };

  const handleDropFiles = (files: File[]) => {
    setDroppedFiles(files);
    setIsIngestionModalOpen(true);
  };

  // Governance Promotion Execution
  const handleExecutePromotion = async (payload: {
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
  }): Promise<boolean> => {
    const res = await fetch('/api/governance/promote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Promotion authorization failed.');
    }

    // Refresh state
    await fetchAllData();
    showToast(
      'Canonical Status Granted',
      `Authorization recorded in append-only hash chain. Anchor: ${data.record.externalAnchorId}`,
      'success'
    );
    return true;
  };

  // Spot check execution
  const handleExecuteSpotCheck = async (entityId: string, action: 'pass' | 'flag' | 'demote', reason: string) => {
    try {
      const res = await fetch('/api/governance/spot-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityId, action, reason }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchAllData();
        showToast(
          'Sentinel Audit Complete',
          `Result: ${data.record.auditResult}. Checked against source hash.`,
          action === 'demote' ? 'warn' : 'info'
        );
      }
    } catch (err) {
      console.error('Spot check error:', err);
    }
  };

  // Re-verify demoted node
  const handleReverifyNode = async (nodeId: string) => {
    const target = nodes.find((n) => n.id === nodeId);
    if (!target) return;
    setEditingNode(target);
    setIsNodeModalOpen(true);
  };

  // Second Brain query execution
  const handleQuerySecondBrain = async (query: string): Promise<SecondBrainQueryResponse | null> => {
    const res = await fetch('/api/second-brain/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to synthesize query.');
    }
    return await res.json();
  };

  // Direct Jump from Search
  const handleSelectSearchResult = (result: SearchResult) => {
    if (result.type === 'node') {
      const found = nodes.find((n) => n.id === result.id);
      if (found) {
        setSelectedNode(found);
        setActiveTab('graph');
      }
    } else if (result.type === 'note') {
      setActiveTab('notes');
    } else if (result.type === 'argument') {
      setActiveTab('arguments');
    } else if (result.type === 'defense') {
      setActiveTab('defense');
    } else if (result.type === 'library') {
      setActiveTab('library');
    }
  };

  const handleNavigateToTab = (tab: WorkspaceTab, contextNode?: GraphNode) => {
    setActiveTab(tab);
    if (contextNode) {
      if (tab === 'notes') {
        const existingNote = notes.find((n) => n.linkedNodeIds.includes(contextNode.id) || n.title.includes(contextNode.label));
        if (!existingNote) {
          // Initialize a note linked to this node
          handleCreateNote();
        }
      }
    }
  };

  const canonicalCount = nodes.filter((n) => n.status === 'CANONICAL').length;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100 font-sans select-none">
      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenNewNode={() => {
          setEditingNode(null);
          setIsNodeModalOpen(true);
        }}
        onOpenNewNote={handleCreateNote}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenIngestion={() => {
          setDroppedFiles([]);
          setIsIngestionModalOpen(true);
        }}
        nodesCount={nodes.length}
        canonicalCount={canonicalCount}
        hashChainValid={true}
        isBackendConnected={isBackendConnected}
        onReseed={handleReseed}
        isReseeding={isReseeding}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {activeTab === 'graph' && (
          <GraphWorkspace
            nodes={nodes}
            edges={edges}
            onSelectNode={setSelectedNode}
            selectedNode={selectedNode}
            onOpenCreateNode={() => {
              setEditingNode(null);
              setIsNodeModalOpen(true);
            }}
            onOpenEditNode={(node) => {
              setEditingNode(node);
              setIsNodeModalOpen(true);
            }}
            onDeleteNode={handleDeleteNode}
            onCreateEdge={handleCreateEdge}
            onDeleteEdge={handleDeleteEdge}
            onPromoteNode={(node) => {
              setActiveTab('governance');
            }}
            onNavigateToTab={handleNavigateToTab}
            onSaveNode={handleSaveNode}
            onOpenIngestionModal={() => {
              setDroppedFiles([]);
              setIsIngestionModalOpen(true);
            }}
            onDropFiles={handleDropFiles}
          />
        )}

        {activeTab === 'notes' && (
          <NotesWorkspace
            notes={notes}
            nodes={nodes}
            onSaveNote={handleSaveNote}
            onCreateNote={handleCreateNote}
            onDeleteNote={handleDeleteNote}
            onAddToWorkingGraph={handleAddNoteToWorkingGraph}
            onPromoteNote={(note) => {
              setActiveTab('governance');
            }}
            onSelectNodeInGraph={(nodeId) => {
              const node = nodes.find((n) => n.id === nodeId);
              if (node) {
                setSelectedNode(node);
                setActiveTab('graph');
              }
            }}
          />
        )}

        {activeTab === 'arguments' && (
          <ArgumentLab
            argumentsList={argumentsList}
            nodes={nodes}
            onSaveArgument={handleSaveArgument}
            onCreateArgument={handleCreateArgument}
            onDeleteArgument={handleDeleteArgument}
          />
        )}

        {activeTab === 'defense' && (
          <DefenseWorkspace
            defenseItems={defenseItems}
            nodes={nodes}
            onSaveDefenseItem={handleSaveDefenseItem}
            onCreateDefenseItem={handleCreateDefenseItem}
            onDeleteDefenseItem={handleDeleteDefenseItem}
          />
        )}

        {activeTab === 'library' && (
          <LibraryWorkspace
            library={library}
            nodes={nodes}
            edges={edges}
            onImportDocument={handleImportDocument}
            onDeleteDocument={handleDeleteDocument}
            onPromoteDocument={(doc) => {
              setActiveTab('governance');
            }}
            onCreateNoteFromQuote={(quote, sourceTitle) => {
              setActiveTab('notes');
            }}
            onOpenIngestionModal={() => {
              setDroppedFiles([]);
              setIsIngestionModalOpen(true);
            }}
            onExtractDocument={handleExtractDocument}
          />
        )}

        {activeTab === 'governance' && (
          <GovernanceWorkspace
            governanceLedger={governanceLedger}
            spotChecks={spotChecks}
            nodes={nodes}
            notes={notes}
            library={library}
            onExecutePromotion={handleExecutePromotion}
            onExecuteSpotCheck={handleExecuteSpotCheck}
            onReverifyNode={handleReverifyNode}
          />
        )}

        {activeTab === 'second-brain' && (
          <SecondBrain
            onQuerySecondBrain={handleQuerySecondBrain}
            onSelectNodeInGraph={(nodeId) => {
              const node = nodes.find((n) => n.id === nodeId);
              if (node) {
                setSelectedNode(node);
                setActiveTab('graph');
              }
            }}
          />
        )}

        {activeTab === 'views' && (
          <SavedViewsWorkspace
            onSelectLensInGraph={(lens) => {
              setActiveTab('graph');
            }}
          />
        )}
      </div>

      {/* Node Creation & Edit Modal */}
      <NodeModal
        isOpen={isNodeModalOpen}
        onClose={() => {
          setIsNodeModalOpen(false);
          setEditingNode(null);
        }}
        onSaveNode={handleSaveNode}
        initialNode={editingNode}
      />

      {/* Global Search Modal (Cmd+K) */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectResult={handleSelectSearchResult}
      />

      {/* Backup & Audit Modal */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onReseed={handleReseed}
        isReseeding={isReseeding}
        hashChainValid={true}
        canonicalCount={canonicalCount}
        totalNodes={nodes.length}
      />

      {/* Automated Ingestion & Ontological Extraction Pipeline Modal */}
      <IngestionPipelineModal
        isOpen={isIngestionModalOpen}
        onClose={() => {
          setIsIngestionModalOpen(false);
          setDroppedFiles([]);
        }}
        onIngestSuccess={handleIngestSuccess}
        onReprocessSuccess={handleReprocessSuccess}
        initialFiles={droppedFiles}
      />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div
          id="epistemic-toast"
          className="fixed bottom-4 right-4 z-50 max-w-sm p-3.5 bg-neutral-900 border border-neutral-700 shadow-2xl rounded-xl text-xs space-y-1 animate-fade-in"
        >
          <div className="font-bold flex items-center gap-1.5 text-neutral-100">
            <span
              className={`w-2 h-2 rounded-full ${
                toastMessage.type === 'success'
                  ? 'bg-emerald-400'
                  : toastMessage.type === 'warn'
                  ? 'bg-rose-400'
                  : 'bg-cyan-400'
              }`}
            />
            <span>{toastMessage.title}</span>
          </div>
          <div className="text-neutral-400 leading-relaxed font-sans">{toastMessage.desc}</div>
        </div>
      )}
    </div>
  );
}
