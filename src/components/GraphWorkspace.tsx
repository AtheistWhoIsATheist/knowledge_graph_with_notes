/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP Ω³
 * Dual-Engine Epistemic Knowledge Graph Canvas Workspace
 *
 * Production-Grade Systems Architecture:
 * 1. Mode A: 2D Stratified Radial Engine (D3.js force-directed, Concentric Radial Shells 0 to 4,
 *    Custom Rectangular Label Collision Force, Outlier-Filtered Convex Hulls).
 * 2. Mode B: 3D Volumetric Void Engine (Canvas 3D projection, Spherical Orbital Kinetics with Inertial Damping,
 *    Exponential Atmospheric Fog F(d), Depth Sorting, Radiant Bloom Halos, 1-Hop Focus Isolation).
 *
 * Invariant: Constructive Synthesis Over Adversarial Critique.
 * Confronting absolute groundlessness accesses a timeless otherworldly realm of pure potentiality akin to Plato's eternal Forms.
 * Strict 53-Thinker Canonical Invariant enforced. Cosmic Void & Dark Gunmetal Aesthetic.
 */

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import {
  GraphNode,
  GraphEdge,
  NodeType,
  OntologicalCategory,
  EpistemicTier,
  LifecycleStatus,
  EdgeRelation,
  GraphLayoutMode,
  GraphViewMode,
  ClusteringAlgorithm,
  ThematicCluster,
  ClusterInterConnection,
  WorkspaceTab,
} from '../types';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Layers,
  Compass,
  Plus,
  Trash2,
  Edit,
  ShieldCheck,
  Search,
  Route,
  Info,
  CheckCircle,
  AlertCircle,
  Activity,
  Download,
  Share2,
  Eye,
  EyeOff,
  Focus,
  BookOpen,
  Scale,
  Sparkles,
  Zap,
  Grid,
  Radio,
  Sliders,
  RotateCcw,
  Maximize,
  HelpCircle,
  Calendar,
  Split,
  GitBranch,
  Flame,
  Pin,
  CircleDot,
  Network,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  SlidersHorizontal,
  Box,
} from 'lucide-react';

import { GraphAnalyticsModal } from './GraphAnalyticsModal';
import { GraphExportModal } from './GraphExportModal';
import { GraphMinimap } from './GraphMinimap';
import { GraphPathNarrative } from './GraphPathNarrative';
import { ClusterDossierDrawer } from './ClusterDossierDrawer';
import { DialecticalComparisonModal } from './DialecticalComparisonModal';
import { GraphTimelineBar, TIMELINE_EPOCHS } from './GraphTimelineBar';
import {
  buildThematicClusters,
  calculateClusterConvexHull,
} from '../utils/graphClustering';

interface GraphWorkspaceProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onSelectNode: (node: GraphNode | null) => void;
  selectedNode: GraphNode | null;
  onOpenCreateNode: () => void;
  onOpenEditNode: (node: GraphNode) => void;
  onDeleteNode: (nodeId: string) => void;
  onCreateEdge: (source: string, target: string, relation: EdgeRelation, weight: number) => void;
  onDeleteEdge: (edgeId: string) => void;
  onPromoteNode: (node: GraphNode) => void;
  onNavigateToTab?: (tab: WorkspaceTab, contextNode?: GraphNode) => void;
  onSaveNode?: (nodeData: Partial<GraphNode>) => void;
  onOpenIngestionModal?: () => void;
  onDropFiles?: (files: File[]) => void;
}

const TRADITIONS = [
  'All',
  'Existential',
  'Christian',
  'Buddhist',
  'Postmodern',
  'Kabbalistic',
  'Sufi',
  'Daoist',
  'Hindu',
  'Phenomenological',
  'Counter-Enlightenment',
];

const ONTOLOGICAL_CATEGORIES: OntologicalCategory[] = [
  'All',
  'Root',
  'Chapter',
  'Theme',
  'Figure',
  'Stage',
  'Void Type',
  'Firewall',
  'Hyperedge',
  'Concept Forge Term',
];

const NODE_TYPES: { type: NodeType; label: string; color: string; glyph: string }[] = [
  { type: 'thinker', label: 'Thinker', color: '#f59e0b', glyph: 'Ω' },
  { type: 'concept', label: 'Concept', color: '#00f0ff', glyph: '⬡' },
  { type: 'claim', label: 'Claim', color: '#10b981', glyph: '∷' },
  { type: 'text', label: 'Text / Chapter', color: '#8b5cf6', glyph: '§' },
  { type: 'aporia', label: 'Aporia / Firewall', color: '#ef4444', glyph: '▲' },
  { type: 'phenomenology', label: 'Phenomenology', color: '#ec4899', glyph: '✦' },
  { type: 'tradition', label: 'Tradition', color: '#3b82f6', glyph: '◈' },
];

const RELATION_CATEGORIES: { relation: EdgeRelation; label: string; color: string }[] = [
  { relation: 'synthesizes', label: 'Synthesizes', color: '#00f0ff' },
  { relation: 'grounds', label: 'Grounds', color: '#10b981' },
  { relation: 'influences', label: 'Influences', color: '#60a5fa' },
  { relation: 'apophatic_counterpart', label: 'Apophatic Counterpart', color: '#a855f7' },
  { relation: 'phenomenologically_discloses', label: 'Discloses', color: '#ec4899' },
  { relation: 'radicalizes', label: 'Radicalizes', color: '#f97316' },
  { relation: 'inverts', label: 'Inverts', color: '#f59e0b' },
  { relation: 'deconstructs', label: 'Deconstructs', color: '#f43f5e' },
  { relation: 'critiques', label: 'Critiques', color: '#e11d48' },
  { relation: 'opposes', label: 'Opposes', color: '#ef4444' },
];

/**
 * Custom D3 Force: Rectangular Label & Node Collision Separation (forceLabelCollide)
 * Runs immediately after d3.forceCollide to enforce:
 * 1. Label-to-Label Non-Overlap:
 *    Calculates exact bounding box: [x_i - (charCount_i * 3.8 + 16) / 2, y_i + R_i + 6, charCount_i * 7.6 + 32, 22]
 *    (For Central Singularity: badge box [x_c - 142, y_c + 44, 284, 40])
 * 2. Circle-to-Label Non-Occlusion:
 *    Prevents node circles from drifting over any node's text label or the central singularity badge.
 */
function forceLabelCollide(padding = 10) {
  let nodes: any[] = [];

  interface LabelBox {
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
  }

  function getLabelBox(d: any): LabelBox {
    const isCore = d.isCentralCore || d.id === 'nihiltheistic-realm-forms';
    if (isCore) {
      const width = 284;
      const height = 40;
      const top = d.y + 44;
      return {
        left: d.x - width / 2,
        right: d.x + width / 2,
        top,
        bottom: top + height,
        width,
        height,
        centerX: d.x,
        centerY: top + height / 2,
      };
    }

    const charCount = (d.label || '').length;
    const width = Math.max(64, charCount * 7.6 + 32);
    const height = 22;
    const top = d.y + (d.radius || 18) + 6;
    return {
      left: d.x - width / 2,
      right: d.x + width / 2,
      top,
      bottom: top + height,
      width,
      height,
      centerX: d.x,
      centerY: top + height / 2,
    };
  }

  function force(alpha: number) {
    const n = nodes.length;
    const boxes: (LabelBox | null)[] = new Array(n);
    for (let i = 0; i < n; i++) {
      const node = nodes[i];
      if (node.x === undefined || node.y === undefined || isNaN(node.x) || isNaN(node.y)) {
        boxes[i] = null;
      } else {
        boxes[i] = getLabelBox(node);
      }
    }

    for (let i = 0; i < n; i++) {
      const a = nodes[i];
      const boxA = boxes[i];
      if (!boxA || a.x === undefined || a.y === undefined) continue;
      const rA = a.isCentralCore ? 46 : (a.radius || 18);

      for (let j = i + 1; j < n; j++) {
        const b = nodes[j];
        const boxB = boxes[j];
        if (!boxB || b.x === undefined || b.y === undefined) continue;

        // Quick bounding rejection: skip if nodes are far apart
        const dxCenter = Math.abs(a.x - b.x);
        const dyCenter = Math.abs(a.y - b.y);
        if (dxCenter > 380 || dyCenter > 240) continue;

        const rB = b.isCentralCore ? 46 : (b.radius || 18);

        // 1. LabelBox A vs LabelBox B Collision (AABB vs AABB)
        const overlapX = (boxA.width + boxB.width) / 2 + padding - Math.abs(boxA.centerX - boxB.centerX);
        const overlapY = (boxA.height + boxB.height) / 2 + padding - Math.abs(boxA.centerY - boxB.centerY);

        if (overlapX > 0 && overlapY > 0) {
          const signX = boxA.centerX < boxB.centerX ? -1 : 1;
          const signY = boxA.centerY < boxB.centerY ? -1 : 1;
          const impulse = alpha * 0.55;

          if (overlapX < overlapY) {
            const moveX = signX * overlapX * impulse;
            if (a.fx && a.fy) {
              if (!b.fx) b.x -= moveX;
            } else if (b.fx && b.fy) {
              if (!a.fx) a.x += moveX;
            } else {
              if (!a.fx) a.x += moveX * 0.5;
              if (!b.fx) b.x -= moveX * 0.5;
            }
          } else {
            const moveY = signY * overlapY * impulse;
            if (a.fx && a.fy) {
              if (!b.fy) b.y -= moveY;
            } else if (b.fx && b.fy) {
              if (!a.fy) a.y += moveY;
            } else {
              if (!a.fy) a.y += moveY * 0.5;
              if (!b.fy) b.y -= moveY * 0.5;
            }
          }
        }

        // 2. Node Circle A vs LabelBox B Occlusion (Circle vs AABB)
        const rEffA = rA + padding;
        const clampBx = Math.max(boxB.left, Math.min(a.x, boxB.right));
        const clampBy = Math.max(boxB.top, Math.min(a.y, boxB.bottom));
        const diffAx = a.x - clampBx;
        const diffAy = a.y - clampBy;
        const distSqA = diffAx * diffAx + diffAy * diffAy;

        if (distSqA < rEffA * rEffA) {
          const distA = Math.sqrt(distSqA);
          let nx = 0;
          let ny = 0;
          let overlap = 0;

          if (distA > 1e-4) {
            nx = diffAx / distA;
            ny = diffAy / distA;
            overlap = rEffA - distA;
          } else {
            const dLeft = Math.abs(a.x - boxB.left);
            const dRight = Math.abs(boxB.right - a.x);
            const dTop = Math.abs(a.y - boxB.top);
            const dBottom = Math.abs(boxB.bottom - a.y);
            const minD = Math.min(dLeft, dRight, dTop, dBottom);
            if (minD === dLeft) { nx = -1; ny = 0; overlap = rEffA + dLeft; }
            else if (minD === dRight) { nx = 1; ny = 0; overlap = rEffA + dRight; }
            else if (minD === dTop) { nx = 0; ny = -1; overlap = rEffA + dTop; }
            else { nx = 0; ny = 1; overlap = rEffA + dBottom; }
          }

          const impulse = overlap * alpha * 0.65;
          if (b.fx && b.fy) {
            if (!a.fx) a.x += nx * impulse;
            if (!a.fy) a.y += ny * impulse;
          } else if (a.fx && a.fy) {
            if (!b.fx) b.x -= nx * impulse;
            if (!b.fy) b.y -= ny * impulse;
          } else {
            if (!a.fx) a.x += nx * impulse * 0.5;
            if (!a.fy) a.y += ny * impulse * 0.5;
            if (!b.fx) b.x -= nx * impulse * 0.5;
            if (!b.fy) b.y -= ny * impulse * 0.5;
          }
        }

        // 3. Node Circle B vs LabelBox A Occlusion (Circle vs AABB)
        const rEffB = rB + padding;
        const clampAx = Math.max(boxA.left, Math.min(b.x, boxA.right));
        const clampAy = Math.max(boxA.top, Math.min(b.y, boxA.bottom));
        const diffBx = b.x - clampAx;
        const diffBy = b.y - clampAy;
        const distSqB = diffBx * diffBx + diffBy * diffBy;

        if (distSqB < rEffB * rEffB) {
          const distB = Math.sqrt(distSqB);
          let nx = 0;
          let ny = 0;
          let overlap = 0;

          if (distB > 1e-4) {
            nx = diffBx / distB;
            ny = diffBy / distB;
            overlap = rEffB - distB;
          } else {
            const dLeft = Math.abs(b.x - boxA.left);
            const dRight = Math.abs(boxA.right - b.x);
            const dTop = Math.abs(b.y - boxA.top);
            const dBottom = Math.abs(boxA.bottom - b.y);
            const minD = Math.min(dLeft, dRight, dTop, dBottom);
            if (minD === dLeft) { nx = -1; ny = 0; overlap = rEffB + dLeft; }
            else if (minD === dRight) { nx = 1; ny = 0; overlap = rEffB + dRight; }
            else if (minD === dTop) { nx = 0; ny = -1; overlap = rEffB + dTop; }
            else { nx = 0; ny = 1; overlap = rEffB + dBottom; }
          }

          const impulse = overlap * alpha * 0.65;
          if (a.fx && a.fy) {
            if (!b.fx) b.x += nx * impulse;
            if (!b.fy) b.y += ny * impulse;
          } else if (b.fx && b.fy) {
            if (!a.fx) a.x -= nx * impulse;
            if (!a.fy) a.y -= ny * impulse;
          } else {
            if (!b.fx) b.x += nx * impulse * 0.5;
            if (!b.fy) b.y -= ny * impulse * 0.5;
            if (!a.fx) a.x -= nx * impulse * 0.5;
            if (!a.fy) a.y -= ny * impulse * 0.5;
          }
        }
      }
    }
  }
  force.initialize = (initNodes: any[]) => {
    nodes = initNodes;
  };
  return force;
}

export const GraphWorkspace: React.FC<GraphWorkspaceProps> = ({
  nodes,
  edges,
  onSelectNode,
  selectedNode,
  onOpenCreateNode,
  onOpenEditNode,
  onDeleteNode,
  onCreateEdge,
  onDeleteEdge,
  onPromoteNode,
  onNavigateToTab,
  onSaveNode,
  onOpenIngestionModal,
  onDropFiles,
}) => {
  const [isDraggingFileOver, setIsDraggingFileOver] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvas3DRef = useRef<HTMLCanvasElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const currentTransformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);
  const simulationRef = useRef<d3.Simulation<any, any> | null>(null);

  // Position Cache: Keeps stable node coordinates across state changes / re-renders
  const nodePositionCache = useRef<
    Map<string, { x: number; y: number; vx: number; vy: number; fx?: number | null; fy?: number | null; z?: number }>
  >(new Map());

  // Cached simNodes ref for bounding box calculations during Fit View
  const simNodesRef = useRef<any[]>([]);

  // Tradition bar container ref & smooth scroll handler
  const traditionContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollTraditions = (direction: 'left' | 'right') => {
    if (!traditionContainerRef.current) return;
    const offset = direction === 'left' ? -180 : 180;
    traditionContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  // View Engine Mode: 2D Stratified SVG vs 3D Volumetric Void
  const [engineMode, setEngineMode] = useState<'2d' | '3d'>('2d');

  // View Mode: Individual Node View vs Thematic Cluster Macro-Graph
  const [viewMode, setViewMode] = useState<GraphViewMode>('node');

  // Clustering Algorithm & Settings
  const [clusteringAlgorithm, setClusteringAlgorithm] = useState<ClusteringAlgorithm>('modularity');
  const [clusterK, setClusterK] = useState<number>(5);
  const [showClusterHulls, setShowClusterHulls] = useState<boolean>(true);
  const [selectedCluster, setSelectedCluster] = useState<ThematicCluster | null>(null);

  // Layout & Filtering State
  const [layoutMode, setLayoutMode] = useState<GraphLayoutMode>('radial');
  const [activeLens, setActiveLens] = useState<string>('All');
  const [activeCategory, setActiveCategory] = useState<OntologicalCategory>('All');
  const [activeTradition, setActiveTradition] = useState<string>('All');
  const [activeDepth, setActiveDepth] = useState<number | 'all'>('all');
  const [activeEpoch, setActiveEpoch] = useState<string | null>(null);

  const [selectedTypes, setSelectedTypes] = useState<NodeType[]>([
    'thinker',
    'concept',
    'claim',
    'text',
    'aporia',
    'phenomenology',
    'tradition',
  ]);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [thinkerSearchTerm, setThinkerSearchTerm] = useState<string>('');
  const [activeRelations, setActiveRelations] = useState<Set<string>>(
    new Set(RELATION_CATEGORIES.map((r) => r.relation))
  );

  // Advanced Visual Enhancements
  const [showTensionHeatmap, setShowTensionHeatmap] = useState<boolean>(false);
  const [focusHorizon, setFocusHorizon] = useState<'all' | '1-hop' | '2-hop'>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Interactive Edge Creation
  const [connectSourceNode, setConnectSourceNode] = useState<GraphNode | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [newEdgeRelation, setNewEdgeRelation] = useState<EdgeRelation>('synthesizes');

  // Semantic Path Tracing State
  const [pathStartNode, setPathStartNode] = useState<string>('');
  const [pathEndNode, setPathEndNode] = useState<string>('');
  const [activePathNodeIds, setActivePathNodeIds] = useState<Set<string>>(new Set());
  const [activePathEdgeIds, setActivePathEdgeIds] = useState<Set<string>>(new Set());

  // Modals & Panels
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);
  const [comparePartnerNode, setComparePartnerNode] = useState<GraphNode | null>(null);

  // Hover Tooltip State
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // 3D Engine Camera State
  const camera3DRef = useRef({
    theta: 0.35,
    phi: 0.25,
    distance: 1400,
    panX: 0,
    panY: 0,
    vTheta: 0,
    vPhi: 0,
    isDragging: false,
    dragButton: 0,
    lastMouseX: 0,
    lastMouseY: 0,
  });

  // Calculate 1-hop and 2-hop neighborhood of selected node
  const neighborIds = useMemo(() => {
    if (!selectedNode || focusHorizon === 'all') return null;

    const hop1 = new Set<string>([selectedNode.id]);
    edges.forEach((e) => {
      const s = typeof e.source === 'object' ? (e.source as any).id : e.source;
      const t = typeof e.target === 'object' ? (e.target as any).id : e.target;
      if (s === selectedNode.id) hop1.add(t);
      if (t === selectedNode.id) hop1.add(s);
    });

    if (focusHorizon === '1-hop') return hop1;

    const hop2 = new Set<string>(hop1);
    edges.forEach((e) => {
      const s = typeof e.source === 'object' ? (e.source as any).id : e.source;
      const t = typeof e.target === 'object' ? (e.target as any).id : e.target;
      if (hop1.has(s)) hop2.add(t);
      if (hop1.has(t)) hop2.add(s);
    });

    return hop2;
  }, [selectedNode, edges, focusHorizon]);

  // All 53 Canonical Thinkers list for sidebar (strict invariant)
  const canonicalThinkers = useMemo(() => {
    const thinkers = nodes.filter((n) => n.type === 'thinker' || n.category === 'Figure');
    if (!thinkerSearchTerm) return thinkers;
    const term = thinkerSearchTerm.toLowerCase();
    return thinkers.filter(
      (t) =>
        t.label.toLowerCase().includes(term) ||
        (t.tradition && t.tradition.toLowerCase().includes(term)) ||
        (t.period && t.period.toLowerCase().includes(term)) ||
        t.tags.some((tag) => tag.toLowerCase().includes(term))
    );
  }, [nodes, thinkerSearchTerm]);

  // Filtered nodes based on active filters
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      // Category filter
      if (activeCategory !== 'All') {
        if (activeCategory === 'Figure') {
          if (node.type !== 'thinker' && node.category !== 'Figure') return false;
        } else if (node.category !== activeCategory) {
          return false;
        }
      }

      // Tradition filter
      if (activeTradition !== 'All') {
        const matchesTradition =
          (node.tradition && node.tradition.toLowerCase().includes(activeTradition.toLowerCase())) ||
          node.tags.some((t) => t.toLowerCase().includes(activeTradition.toLowerCase()));
        if (!matchesTradition && !node.isCentralCore) return false;
      }

      // Depth filter
      if (activeDepth !== 'all' && node.depth !== undefined) {
        if (node.depth > activeDepth && !node.isCentralCore) return false;
      }

      // Lens filter
      if (activeLens !== 'All' && node.lens !== activeLens && !node.isCentralCore) return false;

      // Type filter
      if (!selectedTypes.includes(node.type) && !node.isCentralCore) return false;

      // Status filter
      if (selectedStatus !== 'ALL' && node.status !== selectedStatus) return false;

      // Timeline Epoch
      if (activeEpoch && node.period) {
        const epoch = TIMELINE_EPOCHS.find((e) => e.id === activeEpoch);
        if (epoch) {
          const match = node.period.match(/(\d{3,4})/);
          if (match) {
            const year = parseInt(match[1]);
            if (year < epoch.startYear || year > epoch.endYear) return false;
          }
        }
      }

      // Search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesLabel = node.label.toLowerCase().includes(term);
        const matchesDesc = node.description.toLowerCase().includes(term);
        const matchesTags = node.tags.some((t) => t.toLowerCase().includes(term));
        if (!matchesLabel && !matchesDesc && !matchesTags) return false;
      }

      return true;
    });
  }, [nodes, activeCategory, activeTradition, activeDepth, activeLens, selectedTypes, selectedStatus, searchTerm, activeEpoch]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);

  // Filtered edges (validating endpoints exist in visible nodes)
  const filteredEdges = useMemo(() => {
    return edges.filter((edge) => {
      const sourceId = typeof edge.source === 'object' ? (edge.source as any).id : edge.source;
      const targetId = typeof edge.target === 'object' ? (edge.target as any).id : edge.target;
      if (!filteredNodeIds.has(sourceId) || !filteredNodeIds.has(targetId)) return false;
      if (!activeRelations.has(edge.relation)) return false;
      return true;
    });
  }, [edges, filteredNodeIds, activeRelations]);

  // Thematic Clusters
  const { clusters: computedClusters, interConnections } = useMemo(() => {
    return buildThematicClusters(filteredNodes, filteredEdges, clusteringAlgorithm, clusterK);
  }, [filteredNodes, filteredEdges, clusteringAlgorithm, clusterK]);

  // Semantic Path Tracing (BFS)
  const calculatePath = useCallback(() => {
    if (!pathStartNode || !pathEndNode || pathStartNode === pathEndNode) {
      setActivePathNodeIds(new Set());
      setActivePathEdgeIds(new Set());
      return;
    }

    const adjacency: Record<string, { neighbor: string; edgeId: string }[]> = {};
    edges.forEach((e) => {
      const s = typeof e.source === 'object' ? (e.source as any).id : e.source;
      const t = typeof e.target === 'object' ? (e.target as any).id : e.target;
      if (!adjacency[s]) adjacency[s] = [];
      if (!adjacency[t]) adjacency[t] = [];
      adjacency[s].push({ neighbor: t, edgeId: e.id });
      adjacency[t].push({ neighbor: s, edgeId: e.id });
    });

    const queue: { node: string; path: string[]; edgePath: string[] }[] = [
      { node: pathStartNode, path: [pathStartNode], edgePath: [] },
    ];
    const visited = new Set<string>([pathStartNode]);
    let foundResult: { path: string[]; edgePath: string[] } | null = null;

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.node === pathEndNode) {
        foundResult = { path: current.path, edgePath: current.edgePath };
        break;
      }

      for (const edge of adjacency[current.node] || []) {
        if (!visited.has(edge.neighbor)) {
          visited.add(edge.neighbor);
          queue.push({
            node: edge.neighbor,
            path: [...current.path, edge.neighbor],
            edgePath: [...current.edgePath, edge.edgeId],
          });
        }
      }
    }

    if (foundResult) {
      setActivePathNodeIds(new Set(foundResult.path));
      setActivePathEdgeIds(new Set(foundResult.edgePath));
    } else {
      setActivePathNodeIds(new Set());
      setActivePathEdgeIds(new Set());
    }
  }, [pathStartNode, pathEndNode, edges]);

  // Fit Graph to View
  const handleFitView = useCallback(() => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const width = containerRef.current?.clientWidth || 950;
    const height = containerRef.current?.clientHeight || 700;

    const visibleCoords = simNodesRef.current
      .filter((n) => n.x !== undefined && n.y !== undefined && !isNaN(n.x) && !isNaN(n.y))
      .map((n) => ({ x: n.x!, y: n.y!, r: n.radius || 24 }));

    if (visibleCoords.length === 0) {
      d3.select(svgRef.current).transition().duration(600).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
      return;
    }

    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;

    visibleCoords.forEach((p) => {
      minX = Math.min(minX, p.x - p.r);
      maxX = Math.max(maxX, p.x + p.r);
      minY = Math.min(minY, p.y - p.r);
      maxY = Math.max(maxY, p.y + p.r);
    });

    const graphWidth = maxX - minX || 100;
    const graphHeight = maxY - minY || 100;
    const padding = 60;

    const scaleX = (width - padding * 2) / graphWidth;
    const scaleY = (height - padding * 2) / graphHeight;
    const scale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.18), 1.6);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const transform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(scale)
      .translate(-centerX, -centerY);

    d3.select(svgRef.current)
      .transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .call(zoomBehaviorRef.current.transform, transform);
  }, []);

  // Reset Camera View
  const handleResetZoom = useCallback(() => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const transform = d3.zoomIdentity.translate(0, 0).scale(1);
    d3.select(svgRef.current)
      .transition()
      .duration(600)
      .ease(d3.easeCubicOut)
      .call(zoomBehaviorRef.current.transform, transform);
  }, []);

  // Smooth Zoom In / Out
  const handleZoom = (factor: number) => {
    if (engineMode === '3d') {
      camera3DRef.current.distance = Math.max(400, Math.min(3500, camera3DRef.current.distance * (factor > 1 ? 0.8 : 1.25)));
      return;
    }
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, factor);
  };

  // Focus Camera onto a Specific Node
  const handleFocusOnNode = (node: GraphNode) => {
    if (engineMode === '3d') {
      onSelectNode(node);
      const cached = nodePositionCache.current.get(node.id);
      if (cached) {
        camera3DRef.current.panX = -cached.x;
        camera3DRef.current.panY = -cached.y;
      }
      return;
    }

    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const width = containerRef.current?.clientWidth || 950;
    const height = containerRef.current?.clientHeight || 700;

    const cached = nodePositionCache.current.get(node.id);
    const x = cached?.x ?? node.x ?? width / 2;
    const y = cached?.y ?? node.y ?? height / 2;

    const targetScale = 1.4;
    const transform = d3.zoomIdentity.translate(width / 2 - x * targetScale, height / 2 - y * targetScale).scale(targetScale);

    d3.select(svgRef.current)
      .transition()
      .duration(650)
      .ease(d3.easeCubicOut)
      .call(zoomBehaviorRef.current.transform, transform);

    onSelectNode(node);
  };

  const handleOpenComparison = (targetNode?: GraphNode) => {
    if (targetNode) {
      setComparePartnerNode(targetNode);
    }
    setIsComparisonOpen(true);
  };

  // -------------------------------------------------------------
  // MODE A: D3 2D STRATIFIED FORCE-DIRECTED ENGINE
  // -------------------------------------------------------------
  useEffect(() => {
    if (engineMode !== '2d' || !svgRef.current) return;

    const width = containerRef.current?.clientWidth || 950;
    const height = containerRef.current?.clientHeight || 700;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Defs: Multi-layer Glow Filters & Arrowheads
    const defs = svg.append('defs');

    // Sunburst Celestial Core Glow (Central Singularity)
    const coreFilter = defs
      .append('filter')
      .attr('id', 'glow-core')
      .attr('x', '-100%')
      .attr('y', '-100%')
      .attr('width', '300%')
      .attr('height', '300%');
    coreFilter.append('feGaussianBlur').attr('stdDeviation', '10').attr('result', 'blur1');
    coreFilter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur2');
    const feCoreMerge = coreFilter.append('feMerge');
    feCoreMerge.append('feMergeNode').attr('in', 'blur1');
    feCoreMerge.append('feMergeNode').attr('in', 'blur2');
    feCoreMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Canonical Gold Glow Filter
    const filter = defs
      .append('filter')
      .attr('id', 'glow-canonical')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Firewall Crimson Glow Filter
    const firewallFilter = defs
      .append('filter')
      .attr('id', 'glow-firewall')
      .attr('x', '-60%')
      .attr('y', '-60%')
      .attr('width', '220%')
      .attr('height', '220%');
    firewallFilter.append('feGaussianBlur').attr('stdDeviation', '5').attr('result', 'fBlur');
    const fMerge = firewallFilter.append('feMerge');
    fMerge.append('feMergeNode').attr('in', 'fBlur');
    fMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Arrowhead Markers
    const createMarker = (id: string, color: string, refX = 24) => {
      defs
        .append('marker')
        .attr('id', id)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', refX)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', color);
    };

    createMarker('arrow-default', '#334155', 24);
    createMarker('arrow-active', '#00f0ff', 26);
    createMarker('arrow-path', '#10b981', 26);
    createMarker('arrow-tension', '#ef4444', 26);
    createMarker('arrow-cluster', '#00f0ff', 34);

    const rootG = svg.append('g').attr('class', 'graph-root');

    // Deep Gunmetal Celestial Grid Backdrop
    const gridG = rootG.append('g').attr('class', 'grid-background');
    const gridSize = 56;
    const gridSpan = Math.max(width, height) * 4;
    for (let x = -gridSpan / 2; x < gridSpan / 2; x += gridSize) {
      gridG
        .append('line')
        .attr('x1', x)
        .attr('y1', -gridSpan / 2)
        .attr('x2', x)
        .attr('y2', gridSpan / 2)
        .attr('stroke', '#0c1017')
        .attr('stroke-width', 0.5);
    }
    for (let y = -gridSpan / 2; y < gridSpan / 2; y += gridSize) {
      gridG
        .append('line')
        .attr('x1', -gridSpan / 2)
        .attr('y1', y)
        .attr('x2', gridSpan / 2)
        .attr('y2', y)
        .attr('stroke', '#0c1017')
        .attr('stroke-width', 0.5);
    }

    // Zoom behavior preserving authoritative transform
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4.0])
      .on('zoom', (event) => {
        currentTransformRef.current = event.transform;
        rootG.attr('transform', event.transform);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    if (currentTransformRef.current !== d3.zoomIdentity) {
      svg.call(zoom.transform, currentTransformRef.current);
      rootG.attr('transform', currentTransformRef.current as any);
    }

    // Prepare simulation nodes with Concentric Shell Coordinates
    const thinkersList = filteredNodes.filter((n) => n.type === 'thinker' || n.category === 'Figure');
    const renChapters = filteredNodes.filter((n) => n.category === 'Chapter');
    const formativePillars = filteredNodes.filter((n) => n.category === 'Theme');

    // Sort REN chapters canonically in order 1..6 for 60-degree equidistant placement
    const sortedRenChapters = [...renChapters].sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, '') || '0') || 0;
      const numB = parseInt(b.id.replace(/\D/g, '') || '0') || 0;
      return numA - numB;
    });

    // Sort Formative Concepts / Pillars alphabetically for stable equidistant placement
    const sortedFormativePillars = [...formativePillars].sort((a, b) => a.label.localeCompare(b.label));

    // Sort 53 Canonical Thinkers by philosophical tradition so thinkers cluster near their affinities
    const traditionOrder = [
      'Christian',
      'Kabbalistic',
      'Sufi',
      'Hindu',
      'Daoist',
      'Buddhist',
      'Counter-Enlightenment',
      'Existential',
      'Phenomenological',
      'Postmodern',
    ];
    const sortedThinkers = [...thinkersList].sort((a, b) => {
      const tradA = a.tradition || '';
      const tradB = b.tradition || '';
      const idxA = traditionOrder.findIndex((t) => tradA.toLowerCase().includes(t.toLowerCase()));
      const idxB = traditionOrder.findIndex((t) => tradB.toLowerCase().includes(t.toLowerCase()));
      const orderA = idxA >= 0 ? idxA : 999;
      const orderB = idxB >= 0 ? idxB : 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.label.localeCompare(b.label);
    });

    // Shell 4: Syntheses, Bridges, States, Firewalls, Void Types
    const shell4Nodes = filteredNodes.filter(
      (n) =>
        !n.isCentralCore &&
        n.id !== 'nihiltheistic-realm-forms' &&
        n.category !== 'Chapter' &&
        n.category !== 'Theme' &&
        n.type !== 'thinker' &&
        n.category !== 'Figure'
    );

    const simNodes: any[] = filteredNodes.map((n) => {
      const cached = nodePositionCache.current.get(n.id);
      const isCore = n.isCentralCore || n.id === 'nihiltheistic-realm-forms';
      const radius = isCore
        ? 34
        : n.category === 'Chapter'
        ? 24
        : n.category === 'Theme'
        ? 20
        : n.type === 'thinker'
        ? 18
        : 15;

      // Concentric Shell Radii:
      // Shell 0: r = 0 (Fixed Central Singularity at fx = W/2, fy = H/2)
      // Shell 1: r = 220px (6 REN Chapters distributed at 60-degree angular intervals)
      // Shell 2: r = 420px (15 Formative Pillars/Concepts distributed at 24-degree angular intervals)
      // Shell 3: r = 680px (53 Canonical Thinkers clustered angularly by philosophical tradition)
      // Shell 4: r = 880px (Constructive Syntheses, Bridges, States, Firewalls, Void Types)
      let targetShellRadius = 880;
      let targetAngle = 0;

      if (isCore) {
        targetShellRadius = 0;
        targetAngle = 0;
      } else if (n.category === 'Chapter') {
        targetShellRadius = 220;
        const chIdx = sortedRenChapters.findIndex((c) => c.id === n.id);
        const count = Math.max(sortedRenChapters.length, 6);
        targetAngle = ((chIdx >= 0 ? chIdx : 0) / count) * 2 * Math.PI - Math.PI / 2;
      } else if (n.category === 'Theme') {
        targetShellRadius = 420;
        const pilIdx = sortedFormativePillars.findIndex((p) => p.id === n.id);
        const count = Math.max(sortedFormativePillars.length, 15);
        targetAngle = ((pilIdx >= 0 ? pilIdx : 0) / count) * 2 * Math.PI - Math.PI / 2;
      } else if (n.type === 'thinker' || n.category === 'Figure') {
        targetShellRadius = 680;
        const thIdx = sortedThinkers.findIndex((t) => t.id === n.id);
        const count = Math.max(sortedThinkers.length, 53);
        targetAngle = ((thIdx >= 0 ? thIdx : 0) / count) * 2 * Math.PI - Math.PI / 2;
      } else {
        targetShellRadius = 880;
        const s4Idx = shell4Nodes.findIndex((s) => s.id === n.id);
        const count4 = Math.max(shell4Nodes.length, 1);
        targetAngle = ((s4Idx >= 0 ? s4Idx : 0) / count4) * 2 * Math.PI - Math.PI / 2;
      }

      const initialX = isCore ? width / 2 : width / 2 + Math.cos(targetAngle) * targetShellRadius;
      const initialY = isCore ? height / 2 : height / 2 + Math.sin(targetAngle) * targetShellRadius;

      if (cached) {
        return {
          ...n,
          x: cached.x,
          y: cached.y,
          vx: cached.vx,
          vy: cached.vy,
          fx: isCore ? width / 2 : cached.fx,
          fy: isCore ? height / 2 : cached.fy,
          radius,
          targetShellRadius,
        };
      }

      return {
        ...n,
        x: initialX,
        y: initialY,
        fx: isCore ? width / 2 : null,
        fy: isCore ? height / 2 : null,
        radius,
        targetShellRadius,
      };
    });

    simNodesRef.current = simNodes;

    // Filter valid edge endpoints
    const validNodeIdSet = new Set(simNodes.map((n) => n.id));
    const simEdges: any[] = filteredEdges
      .map((e) => {
        const sId = typeof e.source === 'object' ? (e.source as any).id : e.source;
        const tId = typeof e.target === 'object' ? (e.target as any).id : e.target;
        return {
          ...e,
          source: sId,
          target: tId,
        };
      })
      .filter((e) => validNodeIdSet.has(e.source) && validNodeIdSet.has(e.target));

    // Parallel edge calculations
    const edgePairCounts = new Map<string, number>();
    const edgePairIndices = new Map<string, number>();

    simEdges.forEach((e) => {
      const s = e.source;
      const t = e.target;
      const key = s < t ? `${s}--${t}` : `${t}--${s}`;
      edgePairCounts.set(key, (edgePairCounts.get(key) || 0) + 1);
    });

    simEdges.forEach((e) => {
      const s = e.source;
      const t = e.target;
      const key = s < t ? `${s}--${t}` : `${t}--${s}`;
      const idx = edgePairIndices.get(key) || 0;
      e.pairIndex = idx;
      e.pairTotal = edgePairCounts.get(key) || 1;
      edgePairIndices.set(key, idx + 1);
    });

    // Concentric Radial Shell Force Simulation
    const simulation = d3
      .forceSimulation(simNodes)
      .force(
        'radial',
        d3
          .forceRadial((d: any) => d.targetShellRadius ?? 880, width / 2, height / 2)
          .strength(layoutMode === 'radial' ? 0.78 : 0.35)
      )
      .force(
        'link',
        d3
          .forceLink(simEdges)
          .id((d: any) => d.id)
          .distance((d: any) => {
            const isCoreS = d.source.isCentralCore || d.source.id === 'nihiltheistic-realm-forms';
            const isCoreT = d.target.isCentralCore || d.target.id === 'nihiltheistic-realm-forms';
            if (isCoreS || isCoreT) return 220;
            if (d.source.category === 'Chapter' || d.target.category === 'Chapter') return 200;
            if (d.source.type === 'thinker' || d.target.type === 'thinker') return 240;
            return d.epistemicWeight ? 180 - d.epistemicWeight * 30 : 160;
          })
          .strength(layoutMode === 'radial' ? 0.18 : 0.32)
      )
      .force(
        'charge',
        d3
          .forceManyBody()
          .strength((d: any) => {
            if (d.isCentralCore) return -1800;
            if (d.category === 'Chapter') return -800;
            if (d.category === 'Theme') return -450;
            if (d.type === 'thinker' || d.category === 'Figure') return -280;
            return -220;
          })
          .distanceMax(850)
      )
      .force(
        'collision',
        d3.forceCollide().radius((d: any) => (d.radius || 20) + (d.isCentralCore ? 48 : 24)).strength(0.85)
      )
      .force('labelCollide', forceLabelCollide(12));

    simulationRef.current = simulation;

    // Cluster Hulls Layer
    const hullGroup = rootG.append('g').attr('class', 'cluster-hulls');

    // Concentric Background Shell Rings for 2D View
    const shellGuideGroup = rootG.append('g').attr('class', 'shell-guides');
    const shellRadii = [220, 420, 680, 880];
    const shellLabels = ['REN Chapters', 'Formative Concepts', '53 Thinkers', 'Syntheses & States'];

    shellRadii.forEach((r, idx) => {
      shellGuideGroup
        .append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', '#1e293b')
        .attr('stroke-width', 0.75)
        .attr('stroke-dasharray', '4,6')
        .attr('opacity', 0.4);

      shellGuideGroup
        .append('text')
        .attr('x', width / 2 + r + 8)
        .attr('y', height / 2 - 6)
        .attr('fill', '#475569')
        .attr('font-size', '9px')
        .attr('font-mono', 'true')
        .attr('opacity', 0.6)
        .text(`Shell ${idx + 1}: ${shellLabels[idx]}`);
    });

    // Links Layer
    const linkGroup = rootG.append('g').attr('class', 'links');
    const link = linkGroup
      .selectAll('path')
      .data(simEdges)
      .enter()
      .append('path')
      .attr('stroke', (d: any) => {
        if (activePathEdgeIds.has(d.id)) return '#00f0ff';
        if (showTensionHeatmap && ['critiques', 'opposes', 'deconstructs'].includes(d.relation)) {
          return '#ef4444';
        }
        if (selectedNode) {
          const s = d.source.id || d.source;
          const t = d.target.id || d.target;
          if (s === selectedNode.id || t === selectedNode.id) return '#00f0ff';
        }
        const relMatch = RELATION_CATEGORIES.find((r) => r.relation === d.relation);
        return relMatch ? relMatch.color : '#334155';
      })
      .attr('stroke-width', (d: any) => {
        if (activePathEdgeIds.has(d.id)) return 3.2;
        if (selectedNode) {
          const s = d.source.id || d.source;
          const t = d.target.id || d.target;
          if (s === selectedNode.id || t === selectedNode.id) return 2.6;
        }
        return Math.max(1, (d.epistemicWeight || 0.8) * 1.6);
      })
      .attr('stroke-opacity', (d: any) => {
        if (neighborIds) {
          const s = d.source.id || d.source;
          const t = d.target.id || d.target;
          return neighborIds.has(s) && neighborIds.has(t) ? 0.95 : 0.12;
        }
        return 0.7;
      })
      .attr('stroke-dasharray', (d: any) => {
        if (d.relation === 'apophatic_counterpart' || d.relation === 'deconstructs') return '4,4';
        if (d.relation === 'inverts') return '6,3';
        return 'none';
      })
      .attr('fill', 'none')
      .attr('marker-end', (d: any) => {
        if (activePathEdgeIds.has(d.id)) return 'url(#arrow-path)';
        if (selectedNode) {
          const s = d.source.id || d.source;
          const t = d.target.id || d.target;
          if (s === selectedNode.id || t === selectedNode.id) return 'url(#arrow-active)';
        }
        return 'url(#arrow-default)';
      });

    // Link Text Labels
    const linkText = linkGroup
      .selectAll('text')
      .data(simEdges)
      .enter()
      .append('text')
      .text((d: any) => d.relation.replace(/_/g, ' '))
      .attr('font-size', '8px')
      .attr('font-family', 'monospace')
      .attr('text-anchor', 'middle')
      .attr('dy', -3)
      .attr('fill', '#94a3b8')
      .attr('opacity', (d: any) => {
        if (activePathEdgeIds.has(d.id)) return 1.0;
        if (selectedNode) {
          const s = d.source.id || d.source;
          const t = d.target.id || d.target;
          if (s === selectedNode.id || t === selectedNode.id) return 1.0;
        }
        return 0;
      });

    // Drag Interaction Handler
    let dragStartX = 0;
    let dragStartY = 0;
    let hasDragged = false;

    const drag = d3
      .drag<SVGGElement, any>()
      .on('start', (event, d) => {
        event.sourceEvent.stopPropagation();
        dragStartX = event.x;
        dragStartY = event.y;
        hasDragged = false;
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        const distSq = (event.x - dragStartX) ** 2 + (event.y - dragStartY) ** 2;
        if (distSq > 16) hasDragged = true;
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        if (!d.isCentralCore && !d.pinned) {
          d.fx = null;
          d.fy = null;
        } else if (d.isCentralCore && !d.pinned) {
          d.fx = width / 2;
          d.fy = height / 2;
        }
      });

    // Nodes Rendering Layer
    const nodeGroup = rootG.append('g').attr('class', 'nodes');
    const node = nodeGroup
      .selectAll('g.node')
      .data(simNodes)
      .enter()
      .append('g')
      .attr('class', 'node cursor-pointer select-none')
      .call(drag)
      .on('click', (event, d) => {
        event.stopPropagation();
        if (hasDragged) return;

        if (isConnecting && connectSourceNode) {
          if (connectSourceNode.id !== d.id) {
            onCreateEdge(connectSourceNode.id, d.id, newEdgeRelation, 0.9);
          }
          setIsConnecting(false);
          setConnectSourceNode(null);
          return;
        }
        onSelectNode(d);
      })
      .on('mouseenter', (event, d) => {
        setHoveredNode(d);
        setMousePos({ x: event.clientX, y: event.clientY });
      })
      .on('mousemove', (event) => {
        setMousePos({ x: event.clientX, y: event.clientY });
      })
      .on('mouseleave', () => {
        setHoveredNode(null);
      });

    // Central Singularity Luminous Bloom Ring
    node
      .filter((d: any) => d.isCentralCore)
      .append('circle')
      .attr('r', 44)
      .attr('fill', 'none')
      .attr('stroke', '#00f0ff')
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '5,3')
      .attr('filter', 'url(#glow-core)');

    // Canonical Outer Gold Ring
    node
      .filter((d: any) => d.status === 'CANONICAL' && !d.isCentralCore)
      .append('circle')
      .attr('r', (d: any) => (d.radius || 20) + 4)
      .attr('fill', 'none')
      .attr('stroke', '#f59e0b')
      .attr('stroke-width', 1.8)
      .attr('stroke-dasharray', '3,2')
      .attr('filter', 'url(#glow-canonical)');

    // Firewall Warning Aura Ring
    node
      .filter((d: any) => d.category === 'Firewall')
      .append('circle')
      .attr('r', (d: any) => (d.radius || 20) + 5)
      .attr('fill', 'none')
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 2)
      .attr('filter', 'url(#glow-firewall)');

    // Base Node Circle
    node
      .append('circle')
      .attr('r', (d: any) => d.radius || 18)
      .attr('fill', (d: any) => {
        if (d.isCentralCore) return '#050508';
        if (d.category === 'Chapter') return '#1e1b4b';
        if (d.category === 'Theme') return '#0f172a';
        if (d.category === 'Firewall') return '#450a0a';
        if (d.type === 'thinker') return '#291b00';
        return '#090b10';
      })
      .attr('stroke', (d: any) => {
        if (selectedNode?.id === d.id) return '#ffffff';
        if (d.isCentralCore) return '#00f0ff';
        if (d.category === 'Chapter') return '#818cf8';
        if (d.category === 'Theme') return '#38bdf8';
        if (d.category === 'Firewall') return '#ef4444';
        if (d.type === 'thinker') return '#f59e0b';
        if (activePathNodeIds.has(d.id)) return '#10b981';
        return '#475569';
      })
      .attr('stroke-width', (d: any) => (selectedNode?.id === d.id ? 3.5 : d.isCentralCore ? 3.2 : 2.0))
      .attr('opacity', (d: any) => {
        if (neighborIds && !neighborIds.has(d.id)) return 0.15;
        return 1.0;
      });

    // Node Center Glyph
    node
      .append('text')
      .text((d: any) => {
        if (d.isCentralCore) return 'Ω³';
        if (d.category === 'Chapter') return '§';
        if (d.category === 'Firewall') return '▲';
        if (d.type === 'thinker') return 'Ω';
        const match = NODE_TYPES.find((t) => t.type === d.type);
        return match ? match.glyph : '⬡';
      })
      .attr('text-anchor', 'middle')
      .attr('dy', 4.5)
      .attr('fill', (d: any) => (d.isCentralCore ? '#00f0ff' : d.type === 'thinker' ? '#fbbf24' : '#e2e8f0'))
      .attr('font-size', (d: any) => (d.isCentralCore ? '15px' : '11px'))
      .attr('font-weight', 'bold')
      .attr('font-family', 'serif');

    // Node Primary Text Label with Halo (for non-singularity nodes)
    node
      .filter((d: any) => !d.isCentralCore)
      .append('text')
      .text((d: any) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', (d: any) => (d.radius || 18) + 16)
      .attr('font-size', (d: any) => (d.category === 'Chapter' ? '11.5px' : '10.5px'))
      .attr('font-family', 'sans-serif')
      .attr('font-weight', (d: any) => (selectedNode?.id === d.id ? 'bold' : 'normal'))
      .attr('fill', (d: any) => {
        if (selectedNode?.id === d.id) return '#fef08a';
        if (activePathNodeIds.has(d.id)) return '#6ee7b7';
        if (d.category === 'Chapter') return '#c7d2fe';
        if (d.type === 'thinker') return '#fed7aa';
        return '#f1f5f9';
      })
      .attr('stroke', '#050508')
      .attr('stroke-width', 3.5)
      .attr('paint-order', 'stroke')
      .attr('stroke-linejoin', 'round')
      .attr('opacity', (d: any) => (neighborIds && !neighborIds.has(d.id) ? 0.2 : 1.0));

    // Elevated Collision-Protected Badge for Central Singularity
    const singularityBadge = node
      .filter((d: any) => d.isCentralCore)
      .append('g')
      .attr('class', 'singularity-badge')
      .attr('transform', 'translate(0, 46)');

    singularityBadge
      .append('rect')
      .attr('x', -140)
      .attr('y', 0)
      .attr('width', 280)
      .attr('height', 36)
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('fill', '#090B10')
      .attr('stroke', '#00f0ff')
      .attr('stroke-width', 1.6)
      .attr('filter', 'url(#glow-core)');

    singularityBadge
      .append('text')
      .text('THE NIHILTHEISTIC REALM OF ETERNAL FORMS')
      .attr('text-anchor', 'middle')
      .attr('x', 0)
      .attr('y', 15)
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('letter-spacing', '0.06em')
      .attr('fill', '#00f0ff');

    singularityBadge
      .append('text')
      .text('Pure Potentiality • Constructive Realization')
      .attr('text-anchor', 'middle')
      .attr('x', 0)
      .attr('y', 27)
      .attr('font-size', '8.5px')
      .attr('font-mono', 'true')
      .attr('fill', '#94a3b8');

    // Simulation Tick Updates
    let tickCount = 0;
    simulation.on('tick', () => {
      tickCount++;

      // Curved link paths
      link.attr('d', (d: any) => {
        const sx = d.source.x;
        const sy = d.source.y;
        const tx = d.target.x;
        const ty = d.target.y;

        if (d.source.id === d.target.id) {
          const r = (d.source.radius || 20) + 14;
          return `M${sx},${sy} C${sx + r * 2},${sy - r} ${sx + r},${sy - r * 2} ${sx},${sy - r}`;
        }

        if (d.pairTotal === 1) {
          return `M${sx},${sy} L${tx},${ty}`;
        }

        const dx = tx - sx;
        const dy = ty - sy;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const offset = (d.pairIndex - (d.pairTotal - 1) / 2) * 22;
        const cx = (sx + tx) / 2 + nx * offset;
        const cy = (sy + ty) / 2 + ny * offset;

        return `M${sx},${sy} Q${cx},${cy} ${tx},${ty}`;
      });

      linkText
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);

      // Coordinate cache update
      simNodes.forEach((n) => {
        if (n.x !== undefined && n.y !== undefined) {
          nodePositionCache.current.set(n.id, {
            x: n.x,
            y: n.y,
            vx: n.vx || 0,
            vy: n.vy || 0,
            fx: n.fx,
            fy: n.fy,
          });
        }
      });

      // Update Cluster Hulls with Outlier Filtering & Min-Y Anchored Titles
      if (showClusterHulls && computedClusters.length > 0 && tickCount % 2 === 0) {
        hullGroup.selectAll('*').remove();

        // Deduplicate clusters by cluster.id
        const uniqueClusters = Array.from(new Map(computedClusters.map((c) => [c.id, c])).values());

        uniqueClusters.forEach((cluster) => {
          const clusterNodes = simNodes.filter(
            (n) => cluster.nodeIds.includes(n.id) && n.x !== undefined && n.y !== undefined
          );
          if (clusterNodes.length < 3) return;

          // Calculate centroid
          const meanX = d3.mean(clusterNodes, (n) => n.x!) || 0;
          const meanY = d3.mean(clusterNodes, (n) => n.y!) || 0;

          // Calculate standard deviation of distance to centroid
          const dists = clusterNodes.map((n) => Math.hypot(n.x! - meanX, n.y! - meanY));
          const sigma = d3.deviation(dists) || 100;

          // Filter spatial outliers (> 1.8 sigma)
          const validCoords: [number, number][] = clusterNodes
            .filter((_, idx) => dists[idx] <= 1.8 * sigma)
            .map((n) => [n.x!, n.y!]);

          if (validCoords.length >= 3) {
            const hull = calculateClusterConvexHull(validCoords, 36);
            if (hull && hull.length >= 3) {
              const lineGen = d3.line().curve(d3.curveCatmullRomClosed);
              const pathData = lineGen(hull);

              if (pathData) {
                hullGroup
                  .append('path')
                  .attr('d', pathData)
                  .attr('fill', cluster.color)
                  .attr('fill-opacity', 0.06)
                  .attr('stroke', cluster.color)
                  .attr('stroke-width', 1.2)
                  .attr('stroke-dasharray', '5,4')
                  .attr('class', 'cursor-pointer hover:fill-opacity-15 transition-all')
                  .on('click', (event) => {
                    event.stopPropagation();
                    setSelectedCluster(cluster);
                  });

                // Title Pill anchored at minY - 18
                const minY = Math.min(...validCoords.map((c) => c[1]));
                const titleG = hullGroup
                  .append('g')
                  .attr('transform', `translate(${meanX}, ${minY - 18})`)
                  .attr('class', 'cursor-pointer select-none')
                  .on('click', (event) => {
                    event.stopPropagation();
                    setSelectedCluster(cluster);
                  });

                const titleW = cluster.name.length * 6.5 + 16;
                titleG
                  .append('rect')
                  .attr('rx', 4)
                  .attr('ry', 4)
                  .attr('x', -titleW / 2)
                  .attr('y', -9)
                  .attr('width', titleW)
                  .attr('height', 18)
                  .attr('fill', '#050508')
                  .attr('stroke', cluster.color)
                  .attr('stroke-width', 1);

                titleG
                  .append('text')
                  .text(cluster.name)
                  .attr('text-anchor', 'middle')
                  .attr('dy', 3.5)
                  .attr('font-size', '9px')
                  .attr('font-mono', 'true')
                  .attr('font-weight', 'bold')
                  .attr('fill', cluster.color);
              }
            }
          }
        });
      }
    });

    return () => {
      simulation.stop();
    };
  }, [engineMode, filteredNodes, filteredEdges, layoutMode, showClusterHulls, computedClusters, activePathEdgeIds, activePathNodeIds, showTensionHeatmap, selectedNode, neighborIds]);

  // -------------------------------------------------------------
  // MODE B: 3D VOLUMETRIC VOID ENGINE (Canvas Projection)
  // -------------------------------------------------------------
  useEffect(() => {
    if (engineMode !== '3d' || !canvas3DRef.current) return;

    const canvas = canvas3DRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isRunning = true;

    // Resize handler
    const updateCanvasSize = () => {
      const width = containerRef.current?.clientWidth || 950;
      const height = containerRef.current?.clientHeight || 700;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Initialize 3D Node Coordinates with shell-based radial & vertical distribution
    const nodes3D = filteredNodes.map((n) => {
      const isCore = n.isCentralCore || n.id === 'nihiltheistic-realm-forms';
      let r = 850;
      let angle = Math.random() * 2 * Math.PI;
      let z = (Math.random() - 0.5) * 400;

      if (isCore) {
        r = 0;
        z = 0;
      } else if (n.category === 'Chapter') {
        r = 240;
        z = (Math.random() - 0.5) * 80;
      } else if (n.category === 'Theme') {
        r = 450;
        z = (Math.random() - 0.5) * 160;
      } else if (n.type === 'thinker' || n.category === 'Figure') {
        r = 700;
        z = (Math.random() - 0.5) * 320;
      }

      const cached = nodePositionCache.current.get(n.id);
      const x = cached ? cached.x - (containerRef.current?.clientWidth || 950) / 2 : Math.cos(angle) * r;
      const y = cached ? cached.y - (containerRef.current?.clientHeight || 700) / 2 : Math.sin(angle) * r;

      return {
        ...n,
        x3: x,
        y3: y,
        z3: cached?.z ?? z,
        radius: isCore ? 28 : n.type === 'thinker' ? 16 : 14,
      };
    });

    const node3DMap = new Map(nodes3D.map((n) => [n.id, n]));

    const edges3D = filteredEdges
      .map((e) => {
        const sId = typeof e.source === 'object' ? (e.source as any).id : e.source;
        const tId = typeof e.target === 'object' ? (e.target as any).id : e.target;
        return {
          ...e,
          sNode: node3DMap.get(sId),
          tNode: node3DMap.get(tId),
        };
      })
      .filter((e) => e.sNode && e.tNode);

    // Mouse Interaction for 3D Camera
    const camera = camera3DRef.current;

    const onMouseDown = (e: MouseEvent) => {
      camera.isDragging = true;
      camera.dragButton = e.button;
      camera.lastMouseX = e.clientX;
      camera.lastMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (camera.isDragging) {
        const dx = e.clientX - camera.lastMouseX;
        const dy = e.clientY - camera.lastMouseY;
        camera.lastMouseX = e.clientX;
        camera.lastMouseY = e.clientY;

        if (camera.dragButton === 0 && !e.shiftKey) {
          // Orbit rotation
          camera.theta += dx * 0.005;
          camera.phi = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, camera.phi - dy * 0.005));
          camera.vTheta = dx * 0.005;
          camera.vPhi = -dy * 0.005;
        } else {
          // Pan
          camera.panX += dx;
          camera.panY += dy;
        }
      } else {
        // Hit-test nodes on hover
        let hit: any = null;
        for (let i = nodes3D.length - 1; i >= 0; i--) {
          const n = (nodes3D[i] as any).screenProj;
          if (n && n.visible) {
            const dist = Math.hypot(mouseX - n.sx, mouseY - n.sy);
            if (dist <= n.screenRadius + 4) {
              hit = nodes3D[i];
              break;
            }
          }
        }
        setHoveredNode(hit);
        if (hit) setMousePos({ x: e.clientX, y: e.clientY });
      }
    };

    const onMouseUp = () => {
      camera.isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
      camera.distance = Math.max(400, Math.min(3200, camera.distance * zoomFactor));
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      for (let i = nodes3D.length - 1; i >= 0; i--) {
        const n = (nodes3D[i] as any).screenProj;
        if (n && n.visible) {
          const dist = Math.hypot(mouseX - n.sx, mouseY - n.sy);
          if (dist <= n.screenRadius + 5) {
            onSelectNode(nodes3D[i]);
            return;
          }
        }
      }
      onSelectNode(null);
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('click', onClick);

    // 3D Render Loop
    const focalLength = 800;

    const render3D = () => {
      if (!isRunning) return;

      const width = containerRef.current?.clientWidth || 950;
      const height = containerRef.current?.clientHeight || 700;

      // Inertial Damping
      if (!camera.isDragging) {
        camera.theta += camera.vTheta;
        camera.phi += camera.vPhi;
        camera.vTheta *= 0.92;
        camera.vPhi *= 0.92;
      }

      ctx.clearRect(0, 0, width, height);

      // Deep Cosmic Void Fill
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, width, height);

      // Starfield / Micro-Dust Background
      const cosT = Math.cos(camera.theta);
      const sinT = Math.sin(camera.theta);
      const cosP = Math.cos(camera.phi);
      const sinP = Math.sin(camera.phi);

      // Project Nodes to 2D
      nodes3D.forEach((n: any) => {
        // Orbit rotation around center
        const x1 = n.x3 * cosT + n.z3 * sinT;
        const z1 = -n.x3 * sinT + n.z3 * cosT;
        const y1 = n.y3 * cosP - z1 * sinP;
        const z2 = n.y3 * sinP + z1 * cosP;

        const depthDist = camera.distance + z2;
        if (depthDist <= 50) {
          n.screenProj = { visible: false };
          return;
        }

        const scale = focalLength / depthDist;
        const sx = width / 2 + x1 * scale + camera.panX;
        const sy = height / 2 + y1 * scale + camera.panY;
        const screenRadius = Math.max(3, n.radius * scale);

        // Atmospheric Fog Attenuation: F(d) = e^{-(0.0004 * d)^2}
        const fog = Math.exp(-Math.pow(0.00045 * depthDist, 2));

        n.screenProj = {
          visible: true,
          sx,
          sy,
          screenRadius,
          zDepth: z2,
          fog,
          scale,
        };
      });

      // Sort Elements by Depth (Back to Front)
      const renderableNodes = nodes3D.filter((n: any) => n.screenProj && n.screenProj.visible);
      renderableNodes.sort((a: any, b: any) => b.screenProj.zDepth - a.screenProj.zDepth);

      // Render 3D Edges
      edges3D.forEach((e: any) => {
        const sProj = e.sNode.screenProj;
        const tProj = e.tNode.screenProj;
        if (!sProj || !tProj || !sProj.visible || !tProj.visible) return;

        const avgFog = (sProj.fog + tProj.fog) * 0.5;
        const isNeighbor = neighborIds ? neighborIds.has(e.sNode.id) && neighborIds.has(e.tNode.id) : true;
        const alpha = (isNeighbor ? 0.65 : 0.08) * avgFog;

        ctx.beginPath();
        ctx.moveTo(sProj.sx, sProj.sy);
        ctx.lineTo(tProj.sx, tProj.sy);

        const relMatch = RELATION_CATEGORIES.find((r) => r.relation === e.relation);
        ctx.strokeStyle = relMatch ? relMatch.color : '#334155';
        ctx.globalAlpha = alpha;
        ctx.lineWidth = Math.max(0.5, (e.epistemicWeight || 0.8) * 1.5 * ((sProj.scale + tProj.scale) * 0.5));
        ctx.stroke();
      });

      ctx.globalAlpha = 1.0;

      // Render 3D Nodes
      renderableNodes.forEach((n: any) => {
        const { sx, sy, screenRadius, fog } = n.screenProj;
        const isSelected = selectedNode?.id === n.id;
        const isNeighbor = neighborIds ? neighborIds.has(n.id) : true;
        const alpha = (isNeighbor ? 1.0 : 0.15) * fog;

        ctx.globalAlpha = alpha;

        // Radiant Bloom for Central Singularity
        if (n.isCentralCore) {
          const grad = ctx.createRadialGradient(sx, sy, screenRadius * 0.5, sx, sy, screenRadius * 3.2);
          grad.addColorStop(0, 'rgba(0, 240, 255, 0.8)');
          grad.addColorStop(0.5, 'rgba(0, 240, 255, 0.2)');
          grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(sx, sy, screenRadius * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Base Circle
        ctx.beginPath();
        ctx.arc(sx, sy, screenRadius, 0, Math.PI * 2);

        if (n.isCentralCore) {
          ctx.fillStyle = '#050508';
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 3;
        } else if (n.category === 'Chapter') {
          ctx.fillStyle = '#1e1b4b';
          ctx.strokeStyle = '#818cf8';
          ctx.lineWidth = 2;
        } else if (n.category === 'Theme') {
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.8;
        } else if (n.type === 'thinker') {
          ctx.fillStyle = '#291b00';
          ctx.strokeStyle = isSelected ? '#ffffff' : '#f59e0b';
          ctx.lineWidth = 2;
        } else {
          ctx.fillStyle = '#090b10';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1.5;
        }

        ctx.fill();
        ctx.stroke();

        // Node Title Text
        if (screenRadius > 5 && fog > 0.35) {
          ctx.fillStyle = n.isCentralCore ? '#00f0ff' : n.type === 'thinker' ? '#fed7aa' : '#e2e8f0';
          ctx.font = `${n.isCentralCore ? 'bold 12px' : '10px'} sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(n.label, sx, sy + screenRadius + 4);
        }
      });

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render3D);
    };

    animId = requestAnimationFrame(render3D);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateCanvasSize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('click', onClick);
    };
  }, [engineMode, filteredNodes, filteredEdges, selectedNode, neighborIds]);

  return (
    <div
      ref={containerRef}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingFileOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingFileOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingFileOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          const files = Array.from(e.dataTransfer.files);
          if (onDropFiles) {
            onDropFiles(files);
          } else if (onOpenIngestionModal) {
            onOpenIngestionModal();
          }
        }
      }}
      className="flex-1 flex overflow-hidden relative bg-[#050508] text-slate-100 font-sans select-none"
    >
      {/* Global Drag-and-Drop Ingestion Celestial Overlay */}
      {isDraggingFileOver && (
        <div className="absolute inset-0 z-50 bg-[#050508]/85 backdrop-blur-md border-2 border-dashed border-cyan-400 flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/90 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-2xl shadow-cyan-500/50 mb-3 animate-bounce">
            <Zap className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-base font-serif font-bold text-neutral-100">
            Drop Manuscripts Here to Auto-Extract into Knowledge Graph
          </h3>
          <p className="text-xs text-cyan-300 font-mono mt-1">
            Triggers 5-stage automated entity recognition, 53-thinker cross-linking & live radial shell layout
          </p>
        </div>
      )}

      {/* 2D Canvas SVG Layer */}
      {engineMode === '2d' && (
        <svg
          ref={svgRef}
          className="w-full h-full cursor-grab active:cursor-grabbing block"
          style={{ background: '#050508' }}
        />
      )}

      {/* 3D Volumetric Void Canvas Layer */}
      {engineMode === '3d' && (
        <canvas
          ref={canvas3DRef}
          className="w-full h-full cursor-grab active:cursor-grabbing block"
        />
      )}

      {/* Top Controls Bar: Viewport Mode Toggle + Tradition Filter Bar */}
      <div className="absolute top-3 left-4 right-4 z-20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pointer-events-none">
        {/* Left: Quick Search & Filters */}
        <div className="flex items-center gap-2 pointer-events-auto bg-[#090B10]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 shadow-xl">
          <Search className="w-4 h-4 text-cyan-400" />
          <input
            type="text"
            placeholder="Search concepts, thinkers, chapters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none w-52"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-200">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Center: Purged Scrollbar Tradition Filter Bar with Chevron Controls and Fade Masks */}
        <div className="pointer-events-auto relative flex items-center bg-[#090B10]/90 backdrop-blur-md rounded-xl border border-slate-800 shadow-xl max-w-xl px-1 py-1">
          <button
            onClick={() => scrollTraditions('left')}
            className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-colors z-10 flex-shrink-0"
            title="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Left Fade Mask */}
          <div className="pointer-events-none absolute left-7 top-0 bottom-0 w-4 bg-gradient-to-r from-[#090B10] to-transparent z-10" />

          {/* Scrollable Container */}
          <div
            ref={traditionContainerRef}
            className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-2 scroll-smooth"
          >
            {TRADITIONS.map((trad) => {
              const isActive = activeTradition === trad;
              return (
                <button
                  key={trad}
                  onClick={() => setActiveTradition(trad)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  {trad}
                </button>
              );
            })}
          </div>

          {/* Right Fade Mask */}
          <div className="pointer-events-none absolute right-7 top-0 bottom-0 w-4 bg-gradient-to-l from-[#090B10] to-transparent z-10" />

          <button
            onClick={() => scrollTraditions('right')}
            className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-colors z-10 flex-shrink-0"
            title="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Engine Mode Toggle [ 2D Stratified | 3D Volumetric Void ] + Actions */}
        <div className="flex items-center gap-2 pointer-events-auto bg-[#090B10]/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-xl">
          <div className="flex items-center p-0.5 bg-[#050508] rounded-lg border border-slate-800">
            <button
              onClick={() => setEngineMode('2d')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                engineMode === '2d'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2D Stratified</span>
            </button>
            <button
              onClick={() => setEngineMode('3d')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                engineMode === '3d'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Volumetric Void</span>
            </button>
          </div>

          <button
            onClick={() => handleOpenComparison()}
            title="Open Constructive Dialectical Synthesis Engine"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-medium transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Synthesis Lab</span>
          </button>

          {onOpenIngestionModal && (
            <button
              onClick={onOpenIngestionModal}
              title="Automated Corpus Ingestion & Ontological Extraction Engine"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-medium transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)]"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Ingest Documents</span>
            </button>
          )}

          <button
            onClick={() => setIsAnalyticsOpen(true)}
            title="Graph Analytics"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Activity className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Left Collapsible Thinkers & Ontological Categories Sidebar */}
      <div
        className={`absolute top-16 bottom-4 left-4 z-20 transition-all duration-300 flex flex-col pointer-events-auto ${
          isSidebarOpen ? 'w-72' : 'w-10'
        }`}
      >
        {isSidebarOpen ? (
          <div className="flex-1 bg-[#090B10]/95 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
            {/* Sidebar Header */}
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span className="font-serif font-bold text-xs text-slate-100 uppercase tracking-wider">
                  Canon Architecture
                </span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Stats Banner */}
            <div className="p-2.5 bg-[#050508] border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-cyan-400 font-bold">{nodes.length}</span>{' '}
                <span className="text-slate-400 text-[10px]">Nodes</span>
              </div>
              <div className="h-3 w-[1px] bg-slate-800" />
              <div>
                <span className="text-amber-400 font-bold">{canonicalThinkers.length}</span>{' '}
                <span className="text-slate-400 text-[10px]">Thinkers</span>
              </div>
              <div className="h-3 w-[1px] bg-slate-800" />
              <div>
                <span className="text-emerald-400 font-bold">{edges.length}</span>{' '}
                <span className="text-slate-400 text-[10px]">Edges</span>
              </div>
            </div>

            {/* Thinker Search */}
            <div className="p-2.5 border-b border-slate-800">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-[#050508] rounded-lg border border-slate-800">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter 53 Canonical Thinkers..."
                  value={thinkerSearchTerm}
                  onChange={(e) => setThinkerSearchTerm(e.target.value)}
                  className="bg-transparent border-none text-[11px] text-slate-100 placeholder:text-slate-500 focus:outline-none w-full"
                />
              </div>
            </div>

            {/* 53 Thinkers List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-2 py-1 font-bold">
                53 Canonical Thinkers ({canonicalThinkers.length})
              </div>
              {canonicalThinkers.map((thinker) => {
                const isSelected = selectedNode?.id === thinker.id;
                return (
                  <button
                    key={thinker.id}
                    onClick={() => handleFocusOnNode(thinker)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between group transition-all text-xs ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      <span className="truncate">{thinker.label}</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 group-hover:text-slate-400 flex-shrink-0">
                      {thinker.tradition || thinker.period}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-[#090B10]/95 backdrop-blur-md rounded-xl border border-slate-800 shadow-xl text-slate-400 hover:text-slate-100 transition-colors"
            title="Open Canon Sidebar"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Floating Bottom Viewport Navigation Controls */}
      <div className="absolute bottom-5 right-5 z-20 flex items-center gap-1.5 p-1.5 bg-[#090B10]/90 backdrop-blur-md rounded-xl border border-slate-800 shadow-2xl pointer-events-auto">
        <button
          onClick={() => handleZoom(1.25)}
          title="Zoom In"
          className="p-2 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(0.8)}
          title="Zoom Out"
          className="p-2 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="h-4 w-[1px] bg-slate-800" />
        <button
          onClick={handleFitView}
          title="Fit View"
          className="p-2 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          title="Reset View"
          className="p-2 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="h-4 w-[1px] bg-slate-800" />
        <button
          onClick={() => setShowClusterHulls(!showClusterHulls)}
          title="Toggle Thematic Cluster Boundaries"
          className={`p-2 rounded-lg transition-colors ${
            showClusterHulls ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Node Hover Tooltip Card */}
      {hoveredNode && (
        <div
          className="fixed z-40 pointer-events-none p-3 bg-[#090B10]/95 backdrop-blur-md rounded-xl border border-cyan-500/40 shadow-2xl max-w-xs transition-opacity duration-150 animate-fade-in"
          style={{
            left: `${Math.min(mousePos.x + 14, window.innerWidth - 300)}px`,
            top: `${Math.min(mousePos.y + 14, window.innerHeight - 180)}px`,
          }}
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-serif font-bold text-xs text-slate-100 truncate">
              {hoveredNode.label}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              {hoveredNode.category || hoveredNode.type}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-1.5">
            {hoveredNode.description}
          </p>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
            <span>{hoveredNode.tradition || hoveredNode.lens}</span>
            <span className="text-amber-400">{hoveredNode.status}</span>
          </div>
        </div>
      )}

      {/* Modals & Dossiers */}
      <DialecticalComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        nodes={nodes}
        edges={edges}
        initialNodeA={selectedNode}
        initialNodeB={comparePartnerNode}
        onCreateEdge={onCreateEdge}
        onSelectNode={onSelectNode}
        onCommitSynthesis={(newNode, edgeA, edgeB) => {
          if (onSaveNode) {
            onSaveNode(newNode);
          }
          onCreateEdge(edgeA.source, edgeA.target, edgeA.relation, edgeA.weight);
          onCreateEdge(edgeB.source, edgeB.target, edgeB.relation, edgeB.weight);
        }}
      />

      <GraphAnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        nodes={nodes}
        edges={edges}
        onSelectNode={onSelectNode}
      />

      <ClusterDossierDrawer
        cluster={selectedCluster}
        onClose={() => setSelectedCluster(null)}
        nodes={nodes}
        edges={edges}
        interConnections={interConnections}
        onSelectNode={onSelectNode}
        onFilterToCluster={(c) => setSelectedCluster(c)}
        onNavigateToTab={onNavigateToTab}
      />
    </div>
  );
};
