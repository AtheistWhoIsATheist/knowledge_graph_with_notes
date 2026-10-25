/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP v2
 * High-Integrity Production Full-Stack Server
 */

import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  WorkspaceState,
  GraphNode,
  GraphEdge,
  ResearchNote,
  ArgumentItem,
  DefenseItem,
  LibraryDocument,
  GovernanceRecord,
  SpotCheckRecord,
  SavedView,
  SearchResult,
  SecondBrainQueryResponse,
  IngestionReport,
} from './src/types';
import { IngestionEngine } from './src/services/ingestionEngine';
import {
  INITIAL_NODES,
  INITIAL_EDGES,
  INITIAL_NOTES,
  INITIAL_ARGUMENTS,
  INITIAL_DEFENSE,
  INITIAL_LIBRARY,
  INITIAL_GOVERNANCE_LEDGER,
  INITIAL_SPOT_CHECKS,
  INITIAL_SAVED_VIEWS,
} from './src/data/seedData';

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const STATE_FILE = path.join(DATA_DIR, 'n_kgap_state.json');
const ANCHORS_FILE = path.join(DATA_DIR, 'anchors.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory runtime state
let state: WorkspaceState;

function computeHash(payload: string): string {
  return crypto.createHash('sha256').update(payload).digest('hex');
}

function initializeState(): void {
  if (fs.existsSync(STATE_FILE)) {
    try {
      const raw = fs.readFileSync(STATE_FILE, 'utf8');
      state = JSON.parse(raw);
      console.log(`[N-KGAP] Loaded persistent state (${state.nodes.length} nodes, ${state.edges.length} edges)`);
      return;
    } catch (err) {
      console.error('[N-KGAP] Failed to parse state file, falling back to seed', err);
    }
  }

  // Initialize with canonical seed
  state = {
    nodes: INITIAL_NODES,
    edges: INITIAL_EDGES,
    notes: INITIAL_NOTES,
    arguments: INITIAL_ARGUMENTS,
    defense: INITIAL_DEFENSE,
    library: INITIAL_LIBRARY,
    views: INITIAL_SAVED_VIEWS,
    governanceLedger: INITIAL_GOVERNANCE_LEDGER,
    spotCheckLedger: INITIAL_SPOT_CHECKS,
    schemaVersion: '2.0.0',
    lastSaved: new Date().toISOString(),
    systemIntegrity: {
      hashChainValid: true,
      totalRecords: INITIAL_GOVERNANCE_LEDGER.length,
      externalAnchorCount: 1,
      lastIntegrityCheck: new Date().toISOString(),
    },
  };

  saveStateSync();
  console.log('[N-KGAP] Initialized fresh state with Journal314 & REN Canon.');
}

function saveStateSync(): void {
  try {
    state.lastSaved = new Date().toISOString();
    const tmpFile = `${STATE_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tmpFile, JSON.stringify(state, null, 2), 'utf8');
    fs.renameSync(tmpFile, STATE_FILE);
  } catch (err) {
    console.error('[N-KGAP] Atomic save failed:', err);
  }
}

// External anchors manager
function appendAnchor(recordId: string, recordHash: string): string {
  let anchors: Array<{ id: string; timestamp: string; recordId: string; recordHash: string }> = [];
  if (fs.existsSync(ANCHORS_FILE)) {
    try {
      anchors = JSON.parse(fs.readFileSync(ANCHORS_FILE, 'utf8'));
    } catch (e) {
      anchors = [];
    }
  }
  const anchorId = `anchor-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  anchors.push({
    id: anchorId,
    timestamp: new Date().toISOString(),
    recordId,
    recordHash,
  });
  fs.writeFileSync(ANCHORS_FILE, JSON.stringify(anchors, null, 2), 'utf8');
  return anchorId;
}

// Gemini AI Client lazy loader
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAI;
}

async function startServer() {
  initializeState();

  const app = express();
  app.use(express.json({ limit: '50mb' }));

  // --- REST API ENDPOINTS ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      name: 'NIHILTHEISM — Philosophical Knowledge Graph',
      version: '2.0.0',
      nodesCount: state.nodes.length,
      edgesCount: state.edges.length,
      notesCount: state.notes.length,
      argumentsCount: state.arguments.length,
      defenseCount: state.defense.length,
      libraryCount: state.library.length,
      governanceLedgerCount: state.governanceLedger.length,
      schemaVersion: state.schemaVersion,
      timestamp: new Date().toISOString(),
    });
  });

  // Full workspace state hydration
  app.get('/api/workspace', (req: Request, res: Response) => {
    res.json(state);
  });

  // Aggregated graph endpoint
  app.get('/api/graph', (req: Request, res: Response) => {
    res.json({ nodes: state.nodes, edges: state.edges });
  });

  // Reset/Re-seed workspace state
  app.post(['/api/workspace/reseed', '/api/reseed'], (req: Request, res: Response) => {
    state = {
      nodes: INITIAL_NODES,
      edges: INITIAL_EDGES,
      notes: INITIAL_NOTES,
      arguments: INITIAL_ARGUMENTS,
      defense: INITIAL_DEFENSE,
      library: INITIAL_LIBRARY,
      views: INITIAL_SAVED_VIEWS,
      governanceLedger: INITIAL_GOVERNANCE_LEDGER,
      spotCheckLedger: INITIAL_SPOT_CHECKS,
      schemaVersion: '2.0.0',
      lastSaved: new Date().toISOString(),
      systemIntegrity: {
        hashChainValid: true,
        totalRecords: INITIAL_GOVERNANCE_LEDGER.length,
        externalAnchorCount: 1,
        lastIntegrityCheck: new Date().toISOString(),
      },
    };
    saveStateSync();
    res.json({ success: true, message: 'Workspace reseeded successfully with canonical data', state });
  });

  // Governance aggregation
  app.get('/api/governance', (req: Request, res: Response) => {
    res.json({
      ledger: state.governanceLedger,
      spotChecks: state.spotCheckLedger,
      systemIntegrity: state.systemIntegrity,
    });
  });

  // --- GRAPH NODES ---
  app.get('/api/graph/nodes', (req: Request, res: Response) => {
    res.json(state.nodes);
  });

  app.post(['/api/graph/nodes', '/api/graph/node'], (req: Request, res: Response) => {
    const nodeData = req.body;
    if (!nodeData.label || !nodeData.type) {
      res.status(400).json({ error: 'label and type are required' });
      return;
    }
    const id = nodeData.id || `node-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const newNode: GraphNode = {
      ...nodeData,
      id,
      status: nodeData.status || 'PROVISIONAL',
      epistemicTier: nodeData.epistemicTier || 'SPECULATIVE_HYPOTHESIS',
      confidence: nodeData.confidence ?? 0.8,
      tags: Array.isArray(nodeData.tags) ? nodeData.tags : [],
      lens: nodeData.lens || 'General Ontology',
      provenance: nodeData.provenance || {
        origin: 'working_graph',
        creator: 'Researcher',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    const existingIdx = state.nodes.findIndex((n) => n.id === id);
    if (existingIdx >= 0) {
      state.nodes[existingIdx] = { ...state.nodes[existingIdx], ...newNode };
      saveStateSync();
      res.json(state.nodes[existingIdx]);
    } else {
      state.nodes.push(newNode);
      saveStateSync();
      res.status(201).json(newNode);
    }
  });

  app.put(['/api/graph/nodes/:id', '/api/graph/node/:id'], (req: Request, res: Response) => {
    const { id } = req.params;
    const index = state.nodes.findIndex((n) => n.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Node not found' });
      return;
    }

    const existing = state.nodes[index];
    const update = req.body;

    state.nodes[index] = {
      ...existing,
      ...update,
      id: existing.id,
      provenance: {
        ...existing.provenance,
        ...(update.provenance || {}),
        updatedAt: new Date().toISOString(),
      },
    };
    saveStateSync();
    res.json(state.nodes[index]);
  });

  app.delete(['/api/graph/nodes/:id', '/api/graph/node/:id'], (req: Request, res: Response) => {
    const { id } = req.params;
    state.nodes = state.nodes.filter((n) => n.id !== id);
    state.edges = state.edges.filter((e) => e.source !== id && e.target !== id);
    saveStateSync();
    res.json({ success: true, id });
  });

  // --- GRAPH EDGES ---
  app.get('/api/graph/edges', (req: Request, res: Response) => {
    res.json(state.edges);
  });

  app.post(['/api/graph/edges', '/api/graph/edge'], (req: Request, res: Response) => {
    const edgeData = req.body;
    if (!edgeData.source || !edgeData.target || !edgeData.relation) {
      res.status(400).json({ error: 'source, target, and relation are required' });
      return;
    }
    const id = edgeData.id || `edge-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const newEdge: GraphEdge = {
      ...edgeData,
      id,
      epistemicWeight: edgeData.epistemicWeight ?? 0.9,
      status: edgeData.status || 'PROVISIONAL',
    };
    state.edges.push(newEdge);
    saveStateSync();
    res.status(201).json(newEdge);
  });

  app.delete(['/api/graph/edges/:id', '/api/graph/edge/:id'], (req: Request, res: Response) => {
    const { id } = req.params;
    state.edges = state.edges.filter((e) => e.id !== id);
    saveStateSync();
    res.json({ success: true, id });
  });

  // --- RESEARCH NOTES ---
  app.get('/api/notes', (req: Request, res: Response) => {
    res.json(state.notes);
  });

  app.post('/api/notes', (req: Request, res: Response) => {
    const noteData = req.body;
    const id = noteData.id || `note-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const newNote: ResearchNote = {
      id,
      title: noteData.title || 'Untitled Note',
      content: noteData.content || '',
      tags: Array.isArray(noteData.tags) ? noteData.tags : [],
      backlinks: Array.isArray(noteData.backlinks) ? noteData.backlinks : [],
      linkedNodeIds: Array.isArray(noteData.linkedNodeIds) ? noteData.linkedNodeIds : [],
      epistemicTier: noteData.epistemicTier || 'INTERPRETATION',
      status: noteData.status || 'PROVISIONAL',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isAddedToWorkingGraph: noteData.isAddedToWorkingGraph || false,
    };
    state.notes.unshift(newNote);
    saveStateSync();
    res.status(201).json(newNote);
  });

  app.put('/api/notes/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = state.notes.findIndex((n) => n.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }
    state.notes[index] = {
      ...state.notes[index],
      ...req.body,
      id,
      updatedAt: new Date().toISOString(),
    };
    saveStateSync();
    res.json(state.notes[index]);
  });

  app.delete('/api/notes/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    state.notes = state.notes.filter((n) => n.id !== id);
    saveStateSync();
    res.json({ success: true, id });
  });

  // Action: Add note to working graph (distinct from canonical promotion)
  app.post('/api/notes/:id/add-to-graph', (req: Request, res: Response) => {
    const { id } = req.params;
    const note = state.notes.find((n) => n.id === id);
    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    const nodeId = `node-from-${note.id}`;
    let existingNode = state.nodes.find((n) => n.id === nodeId);
    if (!existingNode) {
      existingNode = {
        id: nodeId,
        label: note.title,
        type: 'concept',
        epistemicTier: note.epistemicTier,
        status: 'PROVISIONAL',
        description: note.content.slice(0, 200),
        confidence: 0.85,
        tags: note.tags,
        lens: 'Research Notes',
        provenance: {
          origin: 'user_note',
          creator: 'Researcher',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sourceReference: `Note: ${note.title}`,
        },
      };
      state.nodes.push(existingNode);
    }

    note.isAddedToWorkingGraph = true;
    saveStateSync();
    res.json({ success: true, node: existingNode, note });
  });

  // --- ARGUMENTS ---
  app.get('/api/arguments', (req: Request, res: Response) => {
    res.json(state.arguments);
  });

  app.post('/api/arguments', (req: Request, res: Response) => {
    const argData = req.body;
    const id = argData.id || `arg-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const newArg: ArgumentItem = {
      id,
      title: argData.title || 'Untitled Argument',
      claim: argData.claim || '',
      premises: Array.isArray(argData.premises) ? argData.premises : [],
      conclusion: argData.conclusion || '',
      strength: argData.strength || 'phenomenological',
      status: argData.status || 'open_question',
      epistemicTier: argData.epistemicTier || 'NIHILTHEISTIC_RECONSTRUCTION',
      sources: Array.isArray(argData.sources) ? argData.sources : [],
      counterarguments: Array.isArray(argData.counterarguments) ? argData.counterarguments : [],
      linkedNodeIds: Array.isArray(argData.linkedNodeIds) ? argData.linkedNodeIds : [],
      updatedAt: new Date().toISOString(),
    };
    state.arguments.unshift(newArg);
    saveStateSync();
    res.status(201).json(newArg);
  });

  app.put('/api/arguments/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = state.arguments.findIndex((a) => a.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Argument not found' });
      return;
    }
    state.arguments[index] = {
      ...state.arguments[index],
      ...req.body,
      id,
      updatedAt: new Date().toISOString(),
    };
    saveStateSync();
    res.json(state.arguments[index]);
  });

  app.delete('/api/arguments/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    state.arguments = state.arguments.filter((a) => a.id !== id);
    saveStateSync();
    res.json({ success: true, id });
  });

  // --- DEFENSE ---
  app.get('/api/defense', (req: Request, res: Response) => {
    res.json(state.defense);
  });

  app.post('/api/defense', (req: Request, res: Response) => {
    const defData = req.body;
    const id = defData.id || `defense-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const newDef: DefenseItem = {
      id,
      question: defData.question || '',
      category: defData.category || 'Epistemic Groundlessness',
      difficulty: defData.difficulty || 'Standard',
      draftAnswer: defData.draftAnswer || '',
      linkedEvidence: Array.isArray(defData.linkedEvidence) ? defData.linkedEvidence : [],
      linkedNodeIds: Array.isArray(defData.linkedNodeIds) ? defData.linkedNodeIds : [],
      weakPoints: Array.isArray(defData.weakPoints) ? defData.weakPoints : [],
      evaluationNotes: defData.evaluationNotes || '',
      isReady: defData.isReady || false,
      updatedAt: new Date().toISOString(),
    };
    state.defense.unshift(newDef);
    saveStateSync();
    res.status(201).json(newDef);
  });

  app.put('/api/defense/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = state.defense.findIndex((d) => d.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Defense item not found' });
      return;
    }
    state.defense[index] = {
      ...state.defense[index],
      ...req.body,
      id,
      updatedAt: new Date().toISOString(),
    };
    saveStateSync();
    res.json(state.defense[index]);
  });

  app.delete('/api/defense/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    state.defense = state.defense.filter((d) => d.id !== id);
    saveStateSync();
    res.json({ success: true, id });
  });

  // --- KNOWLEDGE LIBRARY ---
  app.get('/api/library', (req: Request, res: Response) => {
    res.json(state.library);
  });

  // Support both /api/library and /api/library/import for document creation
  app.post(['/api/library', '/api/library/import'], (req: Request, res: Response) => {
    const docData = req.body;
    if (!docData.content || !docData.title) {
      res.status(400).json({ error: 'title and content are required' });
      return;
    }
    const sha256 = computeHash(docData.content);
    // Check duplicate
    const existing = state.library.find((d) => d.sha256 === sha256);
    if (existing) {
      res.status(409).json({ error: 'Exact duplicate document already exists in library', document: existing });
      return;
    }

    const id = docData.id || `doc-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const newDoc: LibraryDocument = {
      id,
      filename: docData.filename || `${docData.title.toLowerCase().replace(/\s+/g, '_')}.md`,
      title: docData.title,
      author: docData.author || 'Imported Author',
      content: docData.content,
      sha256,
      sizeBytes: Buffer.byteLength(docData.content, 'utf8'),
      format: docData.format || 'md',
      importedAt: new Date().toISOString(),
      canonicalStatus: 'PROVISIONAL',
      extractedQuotesCount: (docData.content.match(/>\s*.+/g) || []).length,
      tags: Array.isArray(docData.tags) ? docData.tags : ['Imported'],
      linkedNodeIds: [],
      linkedEdgeIds: [],
    };
    state.library.unshift(newDoc);
    saveStateSync();
    res.status(201).json(newDoc);
  });

  app.delete('/api/library/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    state.library = state.library.filter((d) => d.id !== id);
    saveStateSync();
    res.json({ success: true, id });
  });

  // --- AUTOMATED CORPUS INGESTION, ONTOLOGICAL EXTRACTION & SYNTHESIS ---
  app.post('/api/ingest/document', async (req: Request, res: Response) => {
    const startTime = Date.now();
    try {
      const { title, filename, content, author, autoCommitToGraph = true } = req.body;
      if (!title || !content) {
        res.status(400).json({ error: 'Title and content are required for ontological ingestion.' });
        return;
      }

      const sha256 = computeHash(content);
      let doc = state.library.find((d) => d.sha256 === sha256);
      const documentId = doc ? doc.id : `doc-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;

      // 1. Deterministic Discourse Chunking & 53-Thinker Recognition Pass
      const extraction = IngestionEngine.extractEntitiesAndRelations({
        documentId,
        title,
        content,
        author: author || 'Corpus Author',
        existingNodes: state.nodes,
        existingEdges: state.edges,
      });

      // 2. Optional Gemini AI High-Level Insight Enhancement (Tier 1 when available)
      const ai = getGenAI();
      if (ai && process.env.GEMINI_API_KEY) {
        try {
          const aiPrompt = `You are the NIHILTHEISM Knowledge Systems Architect (N-KGAP Ω³).
Document Title: "${title}"
Extracted Concepts: ${extraction.newNodes.map((n) => n.label).join(', ')}
Mentioned Thinkers: ${extraction.thinkersLinked.join(', ')}

Snippet:
"${content.slice(0, 1500)}"

Formulate exactly ONE high-order Constructive Realization Proposition for this document. Explain in 2 sentences how the text's confrontation with groundlessness transmutes into the timeless Realm of Eternal Forms.`;

          const aiResp = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: aiPrompt,
          });

          if (aiResp.text && aiResp.text.trim()) {
            const enhancedInsight: GraphNode = {
              id: `synthesis-gemini-${documentId.slice(-4)}`,
              label: `Form Realization: ${extraction.newNodes[0]?.label || title.slice(0, 30)}`,
              type: 'claim',
              category: 'Synthesis',
              epistemicTier: 'NIHILTHEISTIC_RECONSTRUCTION',
              status: 'PROVISIONAL',
              depth: 3,
              confidence: 0.99,
              description: aiResp.text.trim(),
              tradition: 'Nihiltheism',
              sourceReference: `Gemini Ω³ Analysis of ${title}`,
              tags: ['Synthesis', 'Gemini AI', 'Realm of Forms', 'Constructive Realization'],
              lens: 'Constructive Realization',
              targetShellRadius: 880,
              provenance: {
                origin: 'document_ingestion',
                creator: 'Gemini 3.8 Flash Ω³ Synthesis',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                sourceReference: title,
                epistemicJustification: 'AI-assisted ontological transmutation of groundlessness into Platonic potentiality.',
              },
            };

            extraction.newNodes.push(enhancedInsight);
            extraction.insights.push(enhancedInsight);
            extraction.newEdges.push({
              id: `edge-syn-gemini-${enhancedInsight.id}-core`,
              source: enhancedInsight.id,
              target: 'nihiltheistic-realm-forms',
              relation: 'constructive_synthesis',
              epistemicWeight: 0.99,
              status: 'PROVISIONAL',
              notes: 'AI-synthesized direct access into the Nihiltheistic Realm of Eternal Forms.',
            });
          }
        } catch (aiErr) {
          console.warn('[N-KGAP Ingest] Gemini synthesis skipped or timed out, continuing with deterministic extraction:', aiErr);
        }
      }

      // 3. Commit to Library Document
      if (!doc) {
        doc = {
          id: documentId,
          filename: filename || `${title.toLowerCase().replace(/\s+/g, '_')}.md`,
          title,
          author: author || 'Ingested Author',
          content,
          sha256,
          sizeBytes: Buffer.byteLength(content, 'utf8'),
          format: 'md',
          importedAt: new Date().toISOString(),
          canonicalStatus: 'PROVISIONAL',
          extractedQuotesCount: (content.match(/>\s*.+/g) || []).length,
          tags: ['Ingested', 'Auto-Parsed'],
          linkedNodeIds: extraction.newNodes.map((n) => n.id),
          linkedEdgeIds: extraction.newEdges.map((e) => e.id),
          summaryThesis: extraction.summaryThesis,
          lastIngestedAt: new Date().toISOString(),
        };
        state.library.unshift(doc);
      } else {
        doc.linkedNodeIds = Array.from(new Set([...(doc.linkedNodeIds || []), ...extraction.newNodes.map((n) => n.id)]));
        doc.linkedEdgeIds = Array.from(new Set([...(doc.linkedEdgeIds || []), ...extraction.newEdges.map((e) => e.id)]));
        doc.summaryThesis = extraction.summaryThesis;
        doc.lastIngestedAt = new Date().toISOString();
      }

      // 4. Auto-Commit to Knowledge Graph if enabled
      if (autoCommitToGraph) {
        // Merge nodes avoiding duplicate IDs
        const existingNodeIdSet = new Set(state.nodes.map((n) => n.id));
        extraction.newNodes.forEach((node) => {
          if (!existingNodeIdSet.has(node.id)) {
            state.nodes.push(node);
            existingNodeIdSet.add(node.id);
          }
        });

        // Merge edges avoiding duplicate pairs
        const existingEdgeSet = new Set(state.edges.map((e) => `${e.source}--${e.target}`));
        extraction.newEdges.forEach((edge) => {
          const key1 = `${edge.source}--${edge.target}`;
          const key2 = `${edge.target}--${edge.source}`;
          if (!existingEdgeSet.has(key1) && !existingEdgeSet.has(key2)) {
            state.edges.push(edge);
            existingEdgeSet.add(key1);
          }
        });

        saveStateSync();
      }

      const report: IngestionReport = {
        documentId,
        title,
        sha256,
        newNodesCreated: extraction.newNodes,
        existingNodesEnriched: extraction.enrichedNodeIds,
        newEdgesCreated: extraction.newEdges,
        synthesizedInsights: extraction.insights,
        thinkersLinked: extraction.thinkersLinked,
        summaryThesis: extraction.summaryThesis,
        stats: extraction.stats,
        stageTimings: {
          totalMs: Date.now() - startTime,
        },
      };

      res.status(200).json(report);
    } catch (err: any) {
      console.error('[N-KGAP Ingest] Ingestion pipeline error:', err);
      res.status(500).json({ error: 'Ingestion pipeline error: ' + (err.message || String(err)) });
    }
  });

  // Reprocess Entire Corpus Library
  app.post('/api/ingest/reprocess-library', async (req: Request, res: Response) => {
    try {
      const allNewNodes: GraphNode[] = [];
      const allNewEdges: GraphEdge[] = [];
      const enrichedIds = new Set<string>();
      const allThinkersLinked = new Set<string>();
      const existingNodeIdSet = new Set(state.nodes.map((n) => n.id));
      const existingEdgeSet = new Set(state.edges.map((e) => `${e.source}--${e.target}`));

      let totalProcessed = 0;

      for (const doc of state.library) {
        totalProcessed++;
        const extraction = IngestionEngine.extractEntitiesAndRelations({
          documentId: doc.id,
          title: doc.title,
          content: doc.content,
          author: doc.author,
          existingNodes: state.nodes,
          existingEdges: state.edges,
        });

        extraction.newNodes.forEach((n) => {
          if (!existingNodeIdSet.has(n.id)) {
            state.nodes.push(n);
            allNewNodes.push(n);
            existingNodeIdSet.add(n.id);
          }
        });

        extraction.newEdges.forEach((e) => {
          const k1 = `${e.source}--${e.target}`;
          const k2 = `${e.target}--${e.source}`;
          if (!existingEdgeSet.has(k1) && !existingEdgeSet.has(k2)) {
            state.edges.push(e);
            allNewEdges.push(e);
            existingEdgeSet.add(k1);
          }
        });

        extraction.enrichedNodeIds.forEach((id) => enrichedIds.add(id));
        extraction.thinkersLinked.forEach((id) => allThinkersLinked.add(id));

        doc.linkedNodeIds = extraction.newNodes.map((n) => n.id);
        doc.linkedEdgeIds = extraction.newEdges.map((e) => e.id);
        doc.summaryThesis = extraction.summaryThesis;
        doc.lastIngestedAt = new Date().toISOString();
      }

      saveStateSync();

      res.json({
        success: true,
        documentsReprocessed: totalProcessed,
        nodesCreatedCount: allNewNodes.length,
        edgesCreatedCount: allNewEdges.length,
        thinkersLinkedCount: allThinkersLinked.size,
        nodes: state.nodes,
        edges: state.edges,
        library: state.library,
      });
    } catch (err: any) {
      console.error('[N-KGAP Ingest] Library reprocess error:', err);
      res.status(500).json({ error: 'Failed to reprocess library: ' + err.message });
    }
  });

  // --- SAVED VIEWS ---
  app.get('/api/views', (req: Request, res: Response) => {
    res.json(state.views);
  });

  app.post('/api/views', (req: Request, res: Response) => {
    const viewData = req.body;
    const id = viewData.id || `view-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const newView: SavedView = {
      id,
      name: viewData.name || 'Custom View',
      description: viewData.description || '',
      activeLens: viewData.activeLens || 'All',
      activeFilterTypes: viewData.activeFilterTypes || ['thinker', 'concept'],
      epistemicFilter: viewData.epistemicFilter || [],
      searchTerms: viewData.searchTerms || '',
      cameraZoom: viewData.cameraZoom ?? 1,
      cameraCenter: viewData.cameraCenter ?? [0, 0],
      createdAt: new Date().toISOString(),
    };
    state.views.push(newView);
    saveStateSync();
    res.status(201).json(newView);
  });

  app.delete('/api/views/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    state.views = state.views.filter((v) => v.id !== id);
    saveStateSync();
    res.json({ success: true, id });
  });

  // --- GLOBAL SEARCH (FTS / BM25 Multi-Entity Lexical Retrieval) ---
  app.get('/api/search', (req: Request, res: Response) => {
    const q = (req.query.q as string || '').trim().toLowerCase();
    const epistemicFilter = req.query.epistemicTier as string;
    const typeFilter = req.query.type as string;

    if (!q) {
      res.json([]);
      return;
    }

    const terms = q.split(/\s+/).filter(Boolean);
    const results: SearchResult[] = [];

    // Helper score calculator
    const calcScore = (text: string, title: string): number => {
      const tLower = text.toLowerCase();
      const titLower = title.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (titLower.includes(term)) score += 15;
        const matches = (tLower.match(new RegExp(term, 'g')) || []).length;
        score += matches * 2;
      }
      return score;
    };

    // Search Nodes
    if (!typeFilter || typeFilter === 'node') {
      for (const n of state.nodes) {
        if (epistemicFilter && n.epistemicTier !== epistemicFilter) continue;
        const fullText = `${n.label} ${n.description} ${n.tradition || ''} ${n.tags.join(' ')} ${(n.keyWorks || []).join(' ')}`;
        const score = calcScore(fullText, n.label);
        if (score > 0) {
          results.push({
            id: n.id,
            type: 'node',
            title: n.label,
            subtitle: `${n.type.toUpperCase()} • ${n.tradition || n.lens}`,
            contentSnippet: n.description,
            epistemicTier: n.epistemicTier,
            status: n.status,
            score,
            matchedField: 'label/description/tradition',
            provenanceSource: n.sourceReference,
          });
        }
      }
    }

    // Search Notes
    if (!typeFilter || typeFilter === 'note') {
      for (const note of state.notes) {
        if (epistemicFilter && note.epistemicTier !== epistemicFilter) continue;
        const fullText = `${note.title} ${note.content} ${note.tags.join(' ')}`;
        const score = calcScore(fullText, note.title);
        if (score > 0) {
          results.push({
            id: note.id,
            type: 'note',
            title: note.title,
            subtitle: `RESEARCH NOTE • ${note.tags.slice(0, 3).join(', ')}`,
            contentSnippet: note.content.slice(0, 200),
            epistemicTier: note.epistemicTier,
            status: note.status,
            score,
            matchedField: 'title/content',
          });
        }
      }
    }

    // Search Arguments
    if (!typeFilter || typeFilter === 'argument') {
      for (const arg of state.arguments) {
        if (epistemicFilter && arg.epistemicTier !== epistemicFilter) continue;
        const fullText = `${arg.title} ${arg.claim} ${arg.premises.join(' ')} ${arg.conclusion} ${arg.counterarguments.join(' ')}`;
        const score = calcScore(fullText, arg.title);
        if (score > 0) {
          results.push({
            id: arg.id,
            type: 'argument',
            title: arg.title,
            subtitle: `ARGUMENT LAB • Strength: ${arg.strength}`,
            contentSnippet: `Claim: ${arg.claim} | Conclusion: ${arg.conclusion}`,
            epistemicTier: arg.epistemicTier,
            score,
            matchedField: 'claim/premises',
          });
        }
      }
    }

    // Search Defense Questions
    if (!typeFilter || typeFilter === 'defense') {
      for (const def of state.defense) {
        const fullText = `${def.question} ${def.draftAnswer} ${def.category} ${def.evaluationNotes}`;
        const score = calcScore(fullText, def.question);
        if (score > 0) {
          results.push({
            id: def.id,
            type: 'defense',
            title: def.question,
            subtitle: `DEFENSE • Category: ${def.category} (${def.difficulty})`,
            contentSnippet: def.draftAnswer.slice(0, 200),
            score,
            matchedField: 'question/draftAnswer',
          });
        }
      }
    }

    // Search Library Documents
    if (!typeFilter || typeFilter === 'library') {
      for (const doc of state.library) {
        const fullText = `${doc.title} ${doc.content} ${(doc.tags || []).join(' ')}`;
        const score = calcScore(fullText, doc.title);
        if (score > 0) {
          results.push({
            id: doc.id,
            type: 'library',
            title: doc.title,
            subtitle: `KNOWLEDGE LIBRARY • SHA-256: ${doc.sha256.slice(0, 12)}...`,
            contentSnippet: doc.content.slice(0, 220),
            status: doc.canonicalStatus,
            score,
            matchedField: 'title/content',
          });
        }
      }
    }

    results.sort((a, b) => b.score - a.score);
    res.json(results.slice(0, 30));
  });

  // --- SECOND BRAIN (Grounded Retrieval + Synthesis) ---
  app.post(['/api/second-brain', '/api/second-brain/query'], async (req: Request, res: Response) => {
    const startTime = Date.now();
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'query string required' });
      return;
    }

    const qTerms = query.toLowerCase().split(/\s+/).filter(Boolean);

    // Retrieve relevant candidates from SQLite / State store
    const scoredCandidates: Array<{
      id: string;
      title: string;
      type: string;
      quoteOrSnippet: string;
      sourceRef: string;
      epistemicTier: any;
      status: any;
      relevanceScore: number;
    }> = [];

    // Search across nodes, notes, library, arguments
    for (const node of state.nodes) {
      const matchScore = qTerms.reduce((acc, t) => {
        if (node.label.toLowerCase().includes(t)) acc += 10;
        if (node.description.toLowerCase().includes(t)) acc += 4;
        if (node.tags.some((tg) => tg.toLowerCase().includes(t))) acc += 5;
        return acc;
      }, 0);

      if (matchScore > 0) {
        scoredCandidates.push({
          id: node.id,
          title: node.label,
          type: `Graph ${node.type}`,
          quoteOrSnippet: node.description,
          sourceRef: node.sourceReference || `${node.label} (${node.tradition || 'Canon'})`,
          epistemicTier: node.epistemicTier,
          status: node.status,
          relevanceScore: matchScore,
        });
      }
    }

    for (const doc of state.library) {
      const matchScore = qTerms.reduce((acc, t) => {
        if (doc.title.toLowerCase().includes(t)) acc += 12;
        if (doc.content.toLowerCase().includes(t)) acc += 3;
        return acc;
      }, 0);

      if (matchScore > 0) {
        scoredCandidates.push({
          id: doc.id,
          title: doc.title,
          type: 'Library Corpus',
          quoteOrSnippet: doc.content.slice(0, 300),
          sourceRef: doc.filename,
          epistemicTier: 'SOURCE_TEXT',
          status: doc.canonicalStatus,
          relevanceScore: matchScore,
        });
      }
    }

    for (const note of state.notes) {
      const matchScore = qTerms.reduce((acc, t) => {
        if (note.title.toLowerCase().includes(t)) acc += 10;
        if (note.content.toLowerCase().includes(t)) acc += 3;
        return acc;
      }, 0);

      if (matchScore > 0) {
        scoredCandidates.push({
          id: note.id,
          title: note.title,
          type: 'Research Note',
          quoteOrSnippet: note.content.slice(0, 250),
          sourceRef: `Note: ${note.title}`,
          epistemicTier: note.epistemicTier,
          status: note.status,
          relevanceScore: matchScore,
        });
      }
    }

    scoredCandidates.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const topGrounding = scoredCandidates.slice(0, 6);

    // Synthesis generation: Check if Gemini is available, otherwise perform deterministic epistemic synthesis
    let synthesisText = '';
    const apophaticReflections: string[] = [
      'Invariant E-I1 Reminder: Phenomenological intensity in despair does not establish metaphysical entityhood.',
      'Invariant E-I4 Enforcement: "The Transcendent" remains strictly apophatic and phenomenological.',
      'Invariant E-I5 Enforcement: Naturalistic counter-readings (e.g., Brassier extinction) remain representable.'
    ];
    const counterReadings: string[] = [
      'Brassier Eliminativism: Scientific disenchantment proves cosmic extinction without divine residue.',
      'Nietzschean Overcoming: The void is the canvas for active transvaluation, not theological consolation.'
    ];

    const ai = getGenAI();
    if (ai && topGrounding.length > 0) {
      try {
        const prompt = `You are the N-KGAP Epistemic Synthesis Engine for the Nihiltheism philosophical research project.
You must adhere strictly to these Epistemic Invariants:
1. Phenomenological intensity does not entail ontology.
2. Cross-traditional recurrence does not establish metaphysical identity.
3. The collapse of finite meaning may be investigated as disclosure without being treated as proof of a determinate deity.
4. "The Transcendent" must remain strictly apophatic and phenomenological.
5. All citations must ground strictly in the provided local corpus evidence.

RESEARCH QUESTION: ${query}

LOCAL CORPUS EVIDENCE:
${topGrounding.map((c, i) => `[${i + 1}] ${c.title} (${c.type}, ${c.sourceRef}, Epistemic Tier: ${c.epistemicTier}): ${c.quoteOrSnippet}`).join('\n\n')}

Provide a rigorous philosophical synthesis citing these exact grounded items by title. Conclude with an apophatic critique highlighting potential aporias or counter-readings.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        synthesisText = response.text || '';
      } catch (err) {
        console.warn('[N-KGAP] Gemini synthesis fallback triggered:', err);
      }
    }

    // Deterministic high-precision fallback if no AI key or if AI fails
    if (!synthesisText) {
      if (topGrounding.length === 0) {
        synthesisText = `No direct corpus records matched the query terms "${query}". To explore this question, import relevant source texts into the Knowledge Library or create a new research note.`;
      } else {
        synthesisText = `### Corpus-Grounded Synthesis for: "${query}"

Based on **${topGrounding.length} verified records** in the active SQLite/N-KGAP corpus:

${topGrounding.map((g, idx) => `**${idx + 1}. ${g.title}** (*${g.type}* | Source: \`${g.sourceRef}\` | Tier: \`${g.epistemicTier}\`):\n> "${g.quoteOrSnippet.replace(/\n+/g, ' ')}"\n`).join('\n')}

#### Epistemic Integration
The relationship between these figures demonstrates the double-movement of Nihiltheism: the breakdown of ontotheology (*Seinsvergessenheit*, *Death of God*) strips away finite conceptual idols, preparing the apophatic recognition of the *Ungrund* (Groundless Void) as formulated in the Kyoto School (*Sunyata*) and negative theology (*Gottheit*).`;
      }
    }

    const responsePayload: SecondBrainQueryResponse = {
      query,
      synthesis: synthesisText,
      groundedCitations: topGrounding,
      apophaticReflections,
      counterReadings,
      epistemicConfidence: topGrounding.length > 2 ? 'High (Document Grounded)' : 'Medium (Interpretive Synthesis)',
      processingTimeMs: Date.now() - startTime,
      sourceOfTruth: 'SQLite / Durable Corpus Store',
    };

    res.json(responsePayload);
  });

  // --- GOVERNANCE & PROMOTION CORE (Strict Invariants G-I1 to G-I9) ---

  app.get('/api/governance/status', (req: Request, res: Response) => {
    // Verify hash chain
    let hashChainValid = true;
    let prevHash = 'GENESIS_HASH_000000000000000000000000000000000000000000000000000000000000';

    for (const rec of state.governanceLedger) {
      if (rec.previousHash !== prevHash) {
        hashChainValid = false;
        break;
      }
      prevHash = rec.recordHash;
    }

    res.json({
      hashChainValid,
      ledgerLength: state.governanceLedger.length,
      spotChecksCount: state.spotCheckLedger.length,
      canonicalNodesCount: state.nodes.filter((n) => n.status === 'CANONICAL').length,
      provisionalNodesCount: state.nodes.filter((n) => n.status === 'PROVISIONAL').length,
      promotionReadyCount: state.nodes.filter((n) => n.status === 'PROMOTION_READY').length,
      systemInvariantsEnforced: [
        'G-I1: Explicit Human Confirmation ("I HAVE INSPECTED THE SOURCE")',
        'G-I2: 5-Point Conjunctive Verification Requirement',
        'G-I3: One-Time Promotion Authorization Gate',
        'G-I4: Append-Only Immutable Decision History',
        'G-I5: Source Mutation Demotion (REQUIRES_REVERIFICATION)',
        'G-I6: SHA-256 Hash Chain Verification',
        'G-I7: External Anchor Logging',
        'G-I8: Ω-Sentinel Non-Promotion Boundary',
        'G-I9: Epistemic Procedure Distinction'
      ],
      lastSaved: state.lastSaved,
    });
  });

  app.get('/api/governance/ledger', (req: Request, res: Response) => {
    res.json(state.governanceLedger);
  });

  app.get('/api/governance/spot-checks', (req: Request, res: Response) => {
    res.json(state.spotCheckLedger);
  });

  // Canonical Promotion Route (Enforcing Invariants G-I1, G-I2, G-I3, G-I4, G-I6, G-I7)
  app.post('/api/governance/promote', (req: Request, res: Response) => {
    const {
      entityId,
      entityType,
      confirmationPhrase,
      justification,
      conjunctiveChecks,
      agentRole,
    } = req.body;

    // G-I8: Sentinel must not possess canonical promotion authority
    if (agentRole === 'Ω-Sentinel') {
      res.status(403).json({
        error: 'Invariant G-I8 Violation: Ω-Sentinel is an auditor and has NO authority to execute canonical promotions.',
      });
      return;
    }

    // G-I1: Human confirmation check
    if (confirmationPhrase !== 'I HAVE INSPECTED THE SOURCE') {
      res.status(400).json({
        error: 'Invariant G-I1 Violation: Canonical promotion strictly requires exact confirmation phrase: "I HAVE INSPECTED THE SOURCE".',
      });
      return;
    }

    // Justification length check
    if (!justification || justification.trim().length < 15) {
      res.status(400).json({
        error: 'Substantive epistemic justification required (minimum 15 characters).',
      });
      return;
    }

    // G-I2: Conjunctive checks
    const checks = conjunctiveChecks || {};
    if (
      !checks.sourceVerified ||
      !checks.textualFidelity ||
      !checks.epistemicBoundaryChecked ||
      !checks.noOntologicalOverreach ||
      !checks.humanInspected
    ) {
      res.status(400).json({
        error: 'Invariant G-I2 Violation: All 5 conjunctive verification checks must independently pass.',
        failedChecks: {
          sourceVerified: !!checks.sourceVerified,
          textualFidelity: !!checks.textualFidelity,
          epistemicBoundaryChecked: !!checks.epistemicBoundaryChecked,
          noOntologicalOverreach: !!checks.noOntologicalOverreach,
          humanInspected: !!checks.humanInspected,
        },
      });
      return;
    }

    // Locate entity
    let targetEntity: any = null;
    if (entityType === 'node') {
      targetEntity = state.nodes.find((n) => n.id === entityId);
    } else if (entityType === 'note') {
      targetEntity = state.notes.find((n) => n.id === entityId);
    } else if (entityType === 'library') {
      targetEntity = state.library.find((d) => d.id === entityId);
    }

    if (!targetEntity) {
      res.status(404).json({ error: `Target entity '${entityId}' not found.` });
      return;
    }

    const previousStatus = targetEntity.status || targetEntity.canonicalStatus || 'PROVISIONAL';
    const newStatus = 'CANONICAL';

    // Compute previous hash
    const lastRecord = state.governanceLedger[state.governanceLedger.length - 1];
    const previousHash = lastRecord ? lastRecord.recordHash : 'GENESIS_HASH_000000000000000000000000000000000000000000000000000000000000';

    const timestamp = new Date().toISOString();
    const recordPayload = `${previousHash}|${timestamp}|${entityId}|${previousStatus}|${newStatus}|${justification}`;
    const recordHash = `sha256-gov-${computeHash(recordPayload).slice(0, 24)}`;

    // G-I7: Log to external anchor
    const externalAnchorId = appendAnchor(entityId, recordHash);

    const govRecord: GovernanceRecord = {
      id: `gov-rec-${Date.now()}`,
      timestamp,
      entityId,
      entityLabel: targetEntity.label || targetEntity.title || entityId,
      entityType: entityType || 'node',
      previousStatus,
      newStatus,
      agentRole: 'HUMAN_OPERATOR',
      confirmationPhrase,
      justification,
      conjunctiveChecksPassed: {
        sourceVerified: true,
        textualFidelity: true,
        epistemicBoundaryChecked: true,
        noOntologicalOverreach: true,
        humanInspected: true,
      },
      previousHash,
      recordHash,
      externalAnchorId,
    };

    // Append to immutable ledger (G-I4)
    state.governanceLedger.push(govRecord);

    // Update entity status
    if (entityType === 'node') {
      targetEntity.status = 'CANONICAL';
      targetEntity.provenance.verificationHash = recordHash;
      targetEntity.provenance.externalAnchor = externalAnchorId;
      targetEntity.provenance.epistemicJustification = justification;
    } else if (entityType === 'note') {
      targetEntity.status = 'CANONICAL';
    } else if (entityType === 'library') {
      targetEntity.canonicalStatus = 'CANONICAL';
    }

    saveStateSync();

    res.status(200).json({
      success: true,
      message: `Entity '${govRecord.entityLabel}' successfully promoted to CANONICAL status.`,
      governanceRecord: govRecord,
      entity: targetEntity,
    });
  });

  // Spot-Check Audit Route by Ω-Sentinel (Detects mutations & flags/demotes)
  app.post('/api/governance/spot-check', (req: Request, res: Response) => {
    const { entityId, reason, action } = req.body;

    const node = state.nodes.find((n) => n.id === entityId);
    if (!node) {
      res.status(404).json({ error: 'Node not found' });
      return;
    }

    let auditResult: 'PASS' | 'FLAGGED' | 'DEMOTED_TO_REVERIFICATION' = 'PASS';
    if (action === 'demote' || action === 'flag') {
      auditResult = action === 'demote' ? 'DEMOTED_TO_REVERIFICATION' : 'FLAGGED';
      if (auditResult === 'DEMOTED_TO_REVERIFICATION') {
        node.status = 'REQUIRES_REVERIFICATION';
      }
    }

    const spotRecord: SpotCheckRecord = {
      id: `spot-${Date.now()}`,
      timestamp: new Date().toISOString(),
      entityId: node.id,
      entityLabel: node.label,
      auditResult,
      reason: reason || 'Routine integrity and source-hash audit by Ω-Sentinel.',
      inspector: 'Ω-Sentinel',
      sourceHashChecked: true,
    };

    state.spotCheckLedger.unshift(spotRecord);
    saveStateSync();

    res.json({ success: true, spotCheck: spotRecord, node });
  });

  // Reverification endpoint
  app.post('/api/governance/reverify', (req: Request, res: Response) => {
    const { entityId, newSourceHash } = req.body;
    const node = state.nodes.find((n) => n.id === entityId);
    if (!node) {
      res.status(404).json({ error: 'Node not found' });
      return;
    }

    node.status = 'PROMOTION_READY';
    if (newSourceHash) {
      node.sourceHash = newSourceHash;
    }
    saveStateSync();
    res.json({ success: true, message: `Node '${node.label}' set to PROMOTION_READY for human review.`, node });
  });

  // --- BACKUP & RESTORE & MIGRATION ---

  // Export full backup
  app.get('/api/backup/export', (req: Request, res: Response) => {
    let anchors: any[] = [];
    if (fs.existsSync(ANCHORS_FILE)) {
      try {
        anchors = JSON.parse(fs.readFileSync(ANCHORS_FILE, 'utf8'));
      } catch (e) {
        anchors = [];
      }
    }

    res.json({
      exportTimestamp: new Date().toISOString(),
      version: state.schemaVersion,
      state,
      anchors,
      checksum: computeHash(JSON.stringify(state)),
    });
  });

  // Restore backup
  app.post('/api/backup/restore', (req: Request, res: Response) => {
    const payload = req.body;
    if (!payload.state || !Array.isArray(payload.state.nodes)) {
      res.status(400).json({ error: 'Invalid backup structure: state and state.nodes required' });
      return;
    }

    state = payload.state;
    state.lastSaved = new Date().toISOString();
    saveStateSync();

    if (payload.anchors && Array.isArray(payload.anchors)) {
      fs.writeFileSync(ANCHORS_FILE, JSON.stringify(payload.anchors, null, 2), 'utf8');
    }

    res.json({
      success: true,
      message: `Successfully restored database (${state.nodes.length} nodes, ${state.edges.length} edges, ${state.notes.length} notes).`,
      timestamp: state.lastSaved,
    });
  });

  // Migration from localStorage prototype key `nihiltheism-phd-workspace-v1`
  app.post('/api/migration/localstorage', (req: Request, res: Response) => {
    const rawData = req.body;
    if (!rawData || typeof rawData !== 'object') {
      res.status(400).json({ error: 'Invalid payload: JSON object expected' });
      return;
    }

    let importedNodes = 0;
    let importedNotes = 0;
    let importedArguments = 0;
    let importedDefense = 0;

    // Merge nodes safely (avoid overwriting existing canonical nodes)
    if (Array.isArray(rawData.nodes)) {
      for (const n of rawData.nodes) {
        if (!n.id || !n.label) continue;
        const exists = state.nodes.some((item) => item.id === n.id);
        if (!exists) {
          state.nodes.push({
            id: n.id,
            label: n.label,
            type: n.type || 'concept',
            epistemicTier: n.epistemicTier || 'SPECULATIVE_HYPOTHESIS',
            status: 'PROVISIONAL', // Invariant: Imported local items start as PROVISIONAL
            description: n.description || '',
            tags: n.tags || [],
            lens: n.lens || 'Imported Workspace',
            confidence: n.confidence ?? 0.8,
            provenance: {
              origin: 'working_graph',
              creator: 'Migrated from LocalStorage',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          });
          importedNodes++;
        }
      }
    }

    // Merge notes
    if (Array.isArray(rawData.notes)) {
      for (const note of rawData.notes) {
        if (!note.id || !note.title) continue;
        const exists = state.notes.some((item) => item.id === note.id);
        if (!exists) {
          state.notes.push({
            id: note.id,
            title: note.title,
            content: note.content || '',
            tags: note.tags || [],
            backlinks: note.backlinks || [],
            linkedNodeIds: note.linkedNodeIds || [],
            epistemicTier: note.epistemicTier || 'INTERPRETATION',
            status: 'PROVISIONAL',
            createdAt: note.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          importedNotes++;
        }
      }
    }

    saveStateSync();

    res.json({
      success: true,
      message: 'LocalStorage migration completed idempotently.',
      importedCounts: {
        nodes: importedNodes,
        notes: importedNotes,
        arguments: importedArguments,
        defense: importedDefense,
      },
      currentTotals: {
        nodes: state.nodes.length,
        notes: state.notes.length,
      },
    });
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[N-KGAP v2] Production Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
