/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP v2
 * Comprehensive Epistemic & Workspace Type System
 */

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

export type EpistemicTier =
  | 'SOURCE_TEXT'
  | 'TEXTUAL_CLAIM'
  | 'PHENOMENOLOGICAL_DESCRIPTION'
  | 'INTERPRETATION'
  | 'NIHILTHEISTIC_RECONSTRUCTION'
  | 'COUNTER_READING'
  | 'OBJECTION'
  | 'SPECULATIVE_HYPOTHESIS'
  | 'CANONICAL_PROJECT_DEFINITION'
  | 'UNRESOLVED_APORIA';

export type LifecycleStatus =
  | 'INGESTED'
  | 'PROVISIONAL'
  | 'VERIFIED'
  | 'PROMOTION_READY'
  | 'CANONICAL'
  | 'REJECTED'
  | 'HUMAN_ESCALATION'
  | 'REQUIRES_REVERIFICATION'
  | 'REVOKED'
  | 'SUPERSEDED';

export type NodeType =
  | 'thinker'
  | 'concept'
  | 'text'
  | 'claim'
  | 'aporia'
  | 'tradition'
  | 'phenomenology'
  | 'objection';

export type OntologicalCategory =
  | 'All'
  | 'Theme'
  | 'Stage'
  | 'Void Type'
  | 'Firewall'
  | 'Hyperedge'
  | 'Concept Forge Term'
  | 'Figure'
  | 'Root'
  | 'Source Memory'
  | 'Chapter'
  | 'Residue'
  | 'Synthesis';

export type EdgeRelation =
  | 'influences'
  | 'critiques'
  | 'inverts'
  | 'apophatic_counterpart'
  | 'grounds'
  | 'deconstructs'
  | 'radicalizes'
  | 'synthesizes'
  | 'opposes'
  | 'textual_witness'
  | 'phenomenologically_discloses'
  | 'speculative_leap'
  | 'kenotic_emptying'
  | 'constructive_synthesis'
  | 'apophatic_disclosure'
  | 'grounds_in_ungrund'
  | 'deconstructs_normative'
  | 'exemplifies'
  | 'dialectical_tension';

export type GraphLayoutMode = 'force' | 'radial' | 'cluster' | 'hierarchy' | 'timeline';
export type GraphViewMode = 'node' | 'thematic_cluster';
export type ClusteringAlgorithm = 'modularity' | 'kmeans' | 'thematic_lens' | 'tradition';

export interface ThematicCluster {
  id: string;
  name: string;
  subtitle: string;
  dominantTradition: string;
  color: string;
  nodeIds: string[];
  centroid: { x: number; y: number };
  hullPoints?: [number, number][];
  summary: string;
  coreThesis: string;
  keyThinkerIds: string[];
  keyThinkerLabels: string[];
  aporiaCount: number;
  epistemicHealth: 'Robust' | 'Moderate' | 'Critical Aporia';
  internalTensionScore: number; // 0 to 100
  dominantRelation: EdgeRelation;
  internalEdgeCount: number;
  totalConfidence: number;
}

export interface ClusterInterConnection {
  id: string;
  sourceClusterId: string;
  targetClusterId: string;
  weight: number;
  dominantRelation: EdgeRelation;
  edgeCount: number;
  connectingNodePairs: { sourceNodeId: string; targetNodeId: string; relation: EdgeRelation }[];
}

export interface DialecticalTriad {
  id: string;
  type: 'aporia_loop' | 'thesis_antithesis_synthesis' | 'apophatic_tension' | 'genealogical_descent';
  nodeIds: string[];
  labels: string[];
  description: string;
  tensionLevel: 'Harmonized' | 'Dialectical Tension' | 'Radical Aporia';
}

export interface GraphAnalyticsMetrics {
  totalNodes: number;
  totalEdges: number;
  canonicalRatio: number;
  provisionalCount: number;
  reverificationCount: number;
  aporiaCount: number;
  avgDegree: number;
  density: number;
  isolatedNodeCount: number;
  topHubs: { id: string; label: string; type: NodeType; degree: number; tier: EpistemicTier }[];
  detectedTriads: DialecticalTriad[];
  tierDistribution: Record<string, number>;
  relationDistribution: Record<string, number>;
}

export interface NodeProvenance {
  origin: 'canonical_corpus' | 'working_graph' | 'user_note' | 'library_ingest' | 'document_ingestion';
  creator: string;
  createdAt: string;
  updatedAt: string;
  sourceReference?: string;
  sourceHash?: string;
  verificationHash?: string;
  externalAnchor?: string;
  epistemicJustification?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  epistemicTier: EpistemicTier;
  status: LifecycleStatus;
  description: string;
  tradition?: string;
  period?: string;
  keyWorks?: string[];
  confidence: number; // 0.0 to 1.0
  sourceReference?: string;
  sourceHash?: string;
  tags: string[];
  lens: string;
  category?: OntologicalCategory;
  badge?: string;
  isCentralCore?: boolean;
  depth?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  targetShellRadius?: number;
  provenance: NodeProvenance;
}

export interface GraphEdge {
  id: string;
  source: string; // node ID or node object in D3
  target: string; // node ID or node object in D3
  relation: EdgeRelation;
  epistemicWeight: number; // 0.0 to 1.0
  notes?: string;
  citation?: string;
  status: LifecycleStatus;
}

export interface ResearchNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  backlinks: string[];
  linkedNodeIds: string[];
  epistemicTier: EpistemicTier;
  status: LifecycleStatus;
  createdAt: string;
  updatedAt: string;
  isAddedToWorkingGraph?: boolean;
}

export interface ArgumentItem {
  id: string;
  title: string;
  claim: string;
  premises: string[];
  conclusion: string;
  strength: 'deductive' | 'inductive' | 'abductive' | 'phenomenological' | 'apophatic';
  status: 'support' | 'challenge' | 'open_question' | 'unresolved_aporia';
  epistemicTier: EpistemicTier;
  sources: string[];
  counterarguments: string[];
  linkedNodeIds: string[];
  updatedAt: string;
}

export interface DefenseItem {
  id: string;
  question: string;
  category:
    | 'Ontological Void'
    | 'Epistemic Groundlessness'
    | 'Ethics & Nihilism'
    | 'Cross-Traditional Comparative'
    | 'Apophatic Theology'
    | 'Methodological Boundary';
  difficulty: 'Standard' | 'Hostile Committee' | 'Deep Aporia';
  draftAnswer: string;
  linkedEvidence: string[];
  linkedNodeIds: string[];
  weakPoints: string[];
  evaluationNotes: string;
  isReady: boolean;
  updatedAt: string;
}

export interface LibraryDocument {
  id: string;
  filename: string;
  title: string;
  author?: string;
  content: string;
  sha256: string;
  sizeBytes: number;
  format: 'md' | 'txt' | 'corpus';
  importedAt: string;
  canonicalStatus: LifecycleStatus;
  extractedQuotesCount: number;
  tags: string[];
  linkedNodeIds?: string[];
  linkedEdgeIds?: string[];
  summaryThesis?: string;
  lastIngestedAt?: string;
}

export interface IngestionReport {
  documentId: string;
  title: string;
  sha256: string;
  newNodesCreated: GraphNode[];
  existingNodesEnriched: string[];
  newEdgesCreated: GraphEdge[];
  synthesizedInsights: GraphNode[];
  thinkersLinked: string[];
  summaryThesis: string;
  stats: {
    wordsParsed: number;
    paragraphsCount: number;
    conceptsExtracted: number;
    thinkersRecognized: number;
    edgesInferred: number;
    insightsGenerated: number;
  };
  stageTimings?: Record<string, number>;
}

export type IngestionStage =
  | 'idle'
  | 'hashing_chunking'
  | 'entity_thinker_recognition'
  | 'relational_edge_inference'
  | 'constructive_synthesis'
  | 'radial_shell_assignment'
  | 'completed'
  | 'error';

export interface GovernanceRecord {
  id: string;
  timestamp: string;
  entityId: string;
  entityLabel: string;
  entityType: 'node' | 'edge' | 'note' | 'argument' | 'document';
  previousStatus: LifecycleStatus;
  newStatus: LifecycleStatus;
  agentRole:
    | 'Ω-Custodian'
    | 'Ω-Scout'
    | 'Ω-Miner'
    | 'Ω-Critic'
    | 'Ω-Scribe'
    | 'Ω-Sentinel'
    | 'HUMAN_OPERATOR';
  confirmationPhrase?: string;
  justification: string;
  conjunctiveChecksPassed: {
    sourceVerified: boolean;
    textualFidelity: boolean;
    epistemicBoundaryChecked: boolean;
    noOntologicalOverreach: boolean;
    humanInspected: boolean;
  };
  previousHash: string;
  recordHash: string;
  externalAnchorId: string;
}

export interface SpotCheckRecord {
  id: string;
  timestamp: string;
  entityId: string;
  entityLabel: string;
  auditResult: 'PASS' | 'FLAGGED' | 'DEMOTED_TO_REVERIFICATION';
  reason: string;
  inspector: 'Ω-Sentinel';
  sourceHashChecked: boolean;
}

export interface SavedView {
  id: string;
  name: string;
  description: string;
  activeLens: string;
  activeFilterTypes: NodeType[];
  epistemicFilter: EpistemicTier[];
  searchTerms: string;
  cameraZoom: number;
  cameraCenter: [number, number];
  createdAt: string;
}

export interface SearchResult {
  id: string;
  type: 'node' | 'note' | 'argument' | 'defense' | 'library' | 'governance';
  title: string;
  subtitle: string;
  contentSnippet: string;
  epistemicTier?: EpistemicTier;
  status?: LifecycleStatus;
  score: number;
  matchedField: string;
  provenanceSource?: string;
}

export interface SecondBrainQueryResponse {
  query: string;
  synthesis: string;
  groundedCitations: {
    id: string;
    title: string;
    type: string;
    quoteOrSnippet: string;
    sourceRef: string;
    epistemicTier: EpistemicTier;
    status: LifecycleStatus;
    relevanceScore: number;
  }[];
  apophaticReflections: string[];
  counterReadings: string[];
  epistemicConfidence: 'High (Document Grounded)' | 'Medium (Interpretive Synthesis)' | 'Provisional';
  processingTimeMs: number;
  sourceOfTruth: 'SQLite / Durable Corpus Store';
}

export interface WorkspaceState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  notes: ResearchNote[];
  arguments: ArgumentItem[];
  defense: DefenseItem[];
  library: LibraryDocument[];
  views: SavedView[];
  governanceLedger: GovernanceRecord[];
  spotCheckLedger: SpotCheckRecord[];
  schemaVersion: string;
  lastSaved: string;
  systemIntegrity: {
    hashChainValid: boolean;
    totalRecords: number;
    externalAnchorCount: number;
    lastIntegrityCheck: string;
  };
}
