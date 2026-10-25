/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP v2
 * Advanced Graph Clustering & Community Detection Engine
 * Supports Louvain Modularity, K-Means Multi-Dimensional Feature Partitioning,
 * Convex Hull Boundary Generation, and Macro Inter-Cluster Relational Flow Analysis.
 */

import { GraphNode, GraphEdge, ThematicCluster, ClusterInterConnection, ClusteringAlgorithm, EdgeRelation } from '../types';
import * as d3 from 'd3';

// Curated philosophical palette for clusters
const CLUSTER_PALETTE = [
  '#f59e0b', // Amber (Active Nihilism / Zarathustrian)
  '#38bdf8', // Sky Blue (Phenomenological Void)
  '#a855f7', // Purple (Apophatic Theology / Mystical Gottheit)
  '#10b981', // Emerald (Kyoto Emptiness / Sunyata)
  '#f43f5e', // Rose (Cosmic Extinction / Speculative Realism)
  '#06b6d4', // Cyan (Kenotic Immanence / Death of God)
  '#ec4899', // Pink (Pessimism / Lucidity of Despair)
  '#84cc16', // Lime (Ontology of Groundlessness)
];

/**
 * Extract numerical feature vectors for K-Means clustering
 */
function extractNodeFeatureVector(
  node: GraphNode,
  adjacencyMap: Record<string, { target: string; relation: EdgeRelation; weight: number }[]>,
  totalNodes: number
): number[] {
  // 1. Degree & connectivity
  const connections = adjacencyMap[node.id] || [];
  const degreeNorm = connections.length / Math.max(totalNodes, 1);

  // 2. Epistemic Tier weight (0.0 to 1.0)
  const tierWeights: Record<string, number> = {
    CANONICAL_PROJECT_DEFINITION: 1.0,
    SOURCE_TEXT: 0.9,
    TEXTUAL_CLAIM: 0.7,
    PHENOMENOLOGICAL_DESCRIPTION: 0.6,
    NIHILTHEISTIC_RECONSTRUCTION: 0.8,
    INTERPRETATION: 0.5,
    SPECULATIVE_HYPOTHESIS: 0.4,
    COUNTER_READING: 0.3,
    OBJECTION: 0.2,
    UNRESOLVED_APORIA: 0.1,
  };
  const tierWeight = tierWeights[node.epistemicTier] ?? 0.5;

  // 3. Status weight
  const statusWeight = node.status === 'CANONICAL' ? 1.0 : node.status === 'PROMOTION_READY' ? 0.7 : 0.4;

  // 4. Lens hash / projection
  const lensHash = Math.abs(
    (node.lens || 'All').split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0) % 1000
  ) / 1000;

  // 5. Relational polarity (ratio of oppositional / deconstructive edges vs synthetic / grounding)
  let tensionCount = 0;
  let groundCount = 0;
  connections.forEach((c) => {
    if (['critiques', 'opposes', 'deconstructs', 'inverts'].includes(c.relation)) tensionCount++;
    if (['grounds', 'synthesizes', 'influences', 'apophatic_counterpart'].includes(c.relation)) groundCount++;
  });
  const tensionRatio = connections.length > 0 ? tensionCount / connections.length : 0.5;

  // 6. Node type one-hot encoding
  const typeIndices: Record<string, number> = {
    thinker: 0.1,
    concept: 0.3,
    claim: 0.5,
    text: 0.7,
    aporia: 0.9,
    phenomenology: 0.4,
    objection: 0.8,
  };
  const typeVal = typeIndices[node.type] ?? 0.5;

  return [degreeNorm * 2, tierWeight, statusWeight, lensHash * 1.5, tensionRatio * 1.8, typeVal];
}

/**
 * Standard K-Means Clustering Implementation on Multi-Dimensional Vector Space
 */
export function runKMeansClustering(
  nodes: GraphNode[],
  edges: GraphEdge[],
  k: number = 5,
  maxIterations: number = 25
): Map<string, string> {
  const nodeClusterMap = new Map<string, string>();
  if (nodes.length === 0) return nodeClusterMap;
  if (nodes.length <= k) {
    nodes.forEach((n, idx) => nodeClusterMap.set(n.id, `cluster-${idx + 1}`));
    return nodeClusterMap;
  }

  // Build Adjacency
  const adjacencyMap: Record<string, { target: string; relation: EdgeRelation; weight: number }[]> = {};
  nodes.forEach((n) => (adjacencyMap[n.id] = []));
  edges.forEach((e) => {
    const s = typeof e.source === 'object' ? (e.source as any).id : e.source;
    const t = typeof e.target === 'object' ? (e.target as any).id : e.target;
    if (adjacencyMap[s]) adjacencyMap[s].push({ target: t, relation: e.relation, weight: e.epistemicWeight || 1 });
    if (adjacencyMap[t]) adjacencyMap[t].push({ target: s, relation: e.relation, weight: e.epistemicWeight || 1 });
  });

  const vectors: { id: string; vec: number[] }[] = nodes.map((n) => ({
    id: n.id,
    vec: extractNodeFeatureVector(n, adjacencyMap, nodes.length),
  }));

  const dimensions = vectors[0].vec.length;

  // K-Means++ Seeding
  const centroids: number[][] = [];
  const firstCentroid = vectors[Math.floor(Math.random() * vectors.length)].vec;
  centroids.push([...firstCentroid]);

  while (centroids.length < k) {
    const distances = vectors.map((v) => {
      let minDist = Infinity;
      for (const c of centroids) {
        let dist = 0;
        for (let d = 0; d < dimensions; d++) {
          dist += (v.vec[d] - c[d]) ** 2;
        }
        if (dist < minDist) minDist = dist;
      }
      return minDist;
    });

    const sumDist = distances.reduce((a, b) => a + b, 0);
    if (sumDist === 0) break;
    let r = Math.random() * sumDist;
    let selectedIdx = 0;
    for (let i = 0; i < distances.length; i++) {
      r -= distances[i];
      if (r <= 0) {
        selectedIdx = i;
        break;
      }
    }
    centroids.push([...vectors[selectedIdx].vec]);
  }

  // Iterations
  let assignments = new Array(vectors.length).fill(0);
  for (let iter = 0; iter < maxIterations; iter++) {
    let changed = false;

    // Assignment Step
    for (let i = 0; i < vectors.length; i++) {
      let closestCluster = 0;
      let minDistance = Infinity;

      for (let c = 0; c < centroids.length; c++) {
        let dist = 0;
        for (let d = 0; d < dimensions; d++) {
          dist += (vectors[i].vec[d] - centroids[c][d]) ** 2;
        }
        if (dist < minDistance) {
          minDistance = dist;
          closestCluster = c;
        }
      }

      if (assignments[i] !== closestCluster) {
        assignments[i] = closestCluster;
        changed = true;
      }
    }

    if (!changed) break;

    // Update Centroids Step
    for (let c = 0; c < centroids.length; c++) {
      const clusterVectors = vectors.filter((_, idx) => assignments[idx] === c);
      if (clusterVectors.length > 0) {
        for (let d = 0; d < dimensions; d++) {
          const sum = clusterVectors.reduce((acc, v) => acc + v.vec[d], 0);
          centroids[c][d] = sum / clusterVectors.length;
        }
      }
    }
  }

  vectors.forEach((v, idx) => {
    nodeClusterMap.set(v.id, `cluster-${assignments[idx] + 1}`);
  });

  return nodeClusterMap;
}

/**
 * Community Detection via Modularity / Label Propagation with Edge Relations & Weights
 */
export function runModularityCommunityDetection(
  nodes: GraphNode[],
  edges: GraphEdge[]
): Map<string, string> {
  const nodeClusterMap = new Map<string, string>();
  if (nodes.length === 0) return nodeClusterMap;

  // Initialize each node with its own community
  const labels: Record<string, string> = {};
  nodes.forEach((n, i) => {
    labels[n.id] = n.lens ? `comm-${n.lens.replace(/\s+/g, '-').toLowerCase()}` : `comm-${i}`;
  });

  // Build Weighted Graph Adjacency
  const adj: Record<string, { target: string; weight: number }[]> = {};
  nodes.forEach((n) => (adj[n.id] = []));

  edges.forEach((e) => {
    const s = typeof e.source === 'object' ? (e.source as any).id : e.source;
    const t = typeof e.target === 'object' ? (e.target as any).id : e.target;
    let w = e.epistemicWeight || 1.0;
    // Boost affinity for strong dialectical integration
    if (['grounds', 'synthesizes', 'influences', 'apophatic_counterpart'].includes(e.relation)) {
      w *= 1.5;
    }
    if (adj[s]) adj[s].push({ target: t, weight: w });
    if (adj[t]) adj[t].push({ target: s, weight: w });
  });

  // Iterative Label Propagation
  const maxPasses = 15;
  for (let pass = 0; pass < maxPasses; pass++) {
    let changeCount = 0;
    // Shuffle nodes for unbiased propagation
    const shuffledNodes = [...nodes].sort(() => Math.random() - 0.5);

    for (const node of shuffledNodes) {
      const neighbors = adj[node.id] || [];
      if (neighbors.length === 0) continue;

      const labelWeights: Record<string, number> = {};
      for (const n of neighbors) {
        const neighborLabel = labels[n.target];
        labelWeights[neighborLabel] = (labelWeights[neighborLabel] || 0) + n.weight;
      }

      let maxWeight = -1;
      let dominantLabel = labels[node.id];

      for (const [l, weight] of Object.entries(labelWeights)) {
        if (weight > maxWeight) {
          maxWeight = weight;
          dominantLabel = l;
        }
      }

      if (dominantLabel !== labels[node.id]) {
        labels[node.id] = dominantLabel;
        changeCount++;
      }
    }

    if (changeCount === 0) break;
  }

  // Renumber clusters cleanly
  const uniqueLabels = Array.from(new Set(Object.values(labels)));
  const clusterIdMap: Record<string, string> = {};
  uniqueLabels.forEach((l, idx) => {
    clusterIdMap[l] = `cluster-${idx + 1}`;
  });

  nodes.forEach((n) => {
    nodeClusterMap.set(n.id, clusterIdMap[labels[n.id]] || 'cluster-1');
  });

  return nodeClusterMap;
}

/**
 * Cluster Synthesizer: Builds full ThematicCluster objects with philosophical summaries,
 * core theses, metrics, and convex polygon hulls.
 */
export function buildThematicClusters(
  nodes: GraphNode[],
  edges: GraphEdge[],
  algorithm: ClusteringAlgorithm = 'modularity',
  k: number = 5
): { clusters: ThematicCluster[]; interConnections: ClusterInterConnection[] } {
  if (nodes.length === 0) return { clusters: [], interConnections: [] };

  let nodeClusterMap: Map<string, string>;

  if (algorithm === 'kmeans') {
    nodeClusterMap = runKMeansClustering(nodes, edges, k);
  } else if (algorithm === 'thematic_lens') {
    nodeClusterMap = new Map();
    const lenses = Array.from(new Set(nodes.map((n) => n.lens || 'Ontology of Collapse')));
    lenses.forEach((l, idx) => {
      nodes.filter((n) => (n.lens || 'Ontology of Collapse') === l).forEach((n) => {
        nodeClusterMap.set(n.id, `cluster-${idx + 1}`);
      });
    });
  } else if (algorithm === 'tradition') {
    nodeClusterMap = new Map();
    const traditions = Array.from(new Set(nodes.map((n) => n.tradition || 'Continental Metaphysics')));
    traditions.forEach((t, idx) => {
      nodes.filter((n) => (n.tradition || 'Continental Metaphysics') === t).forEach((n) => {
        nodeClusterMap.set(n.id, `cluster-${idx + 1}`);
      });
    });
  } else {
    // Default to Modularity Community Detection
    nodeClusterMap = runModularityCommunityDetection(nodes, edges);
  }

  // Group nodes by cluster ID
  const clusterGroups: Record<string, GraphNode[]> = {};
  nodes.forEach((n) => {
    const cId = nodeClusterMap.get(n.id) || 'cluster-1';
    if (!clusterGroups[cId]) clusterGroups[cId] = [];
    clusterGroups[cId].push(n);
  });

  // Calculate Thematic Metadata for each cluster
  const clusters: ThematicCluster[] = Object.entries(clusterGroups).map(([cId, cNodes], index) => {
    const color = CLUSTER_PALETTE[index % CLUSTER_PALETTE.length];
    const nodeIds = cNodes.map((n) => n.id);
    const nodeIdSet = new Set(nodeIds);

    // Identify Thinkers & Concepts
    const thinkers = cNodes.filter((n) => n.type === 'thinker');
    const concepts = cNodes.filter((n) => n.type === 'concept');
    const aporias = cNodes.filter((n) => n.type === 'aporia');

    const keyThinkerIds = thinkers.map((t) => t.id).slice(0, 4);
    const keyThinkerLabels = thinkers.map((t) => t.label).slice(0, 4);

    // Dominant Tradition / Lens
    const traditionCounts: Record<string, number> = {};
    cNodes.forEach((n) => {
      const key = n.tradition || n.lens || 'Continental Speculation';
      traditionCounts[key] = (traditionCounts[key] || 0) + 1;
    });
    const dominantTradition =
      Object.entries(traditionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Dialectical Speculation';

    // Internal Edges & Relational Profile
    let internalEdgeCount = 0;
    const relationCounts: Record<string, number> = {};
    let tensionScoreSum = 0;

    edges.forEach((e) => {
      const s = typeof e.source === 'object' ? (e.source as any).id : e.source;
      const t = typeof e.target === 'object' ? (e.target as any).id : e.target;
      if (nodeIdSet.has(s) && nodeIdSet.has(t)) {
        internalEdgeCount++;
        relationCounts[e.relation] = (relationCounts[e.relation] || 0) + 1;
        if (['critiques', 'opposes', 'deconstructs'].includes(e.relation)) {
          tensionScoreSum += 35;
        } else if (e.relation === 'inverts' || e.relation === 'radicalizes') {
          tensionScoreSum += 20;
        }
      }
    });

    const dominantRelation =
      (Object.entries(relationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as EdgeRelation) || 'grounds';

    const internalTensionScore = Math.min(
      100,
      Math.round((tensionScoreSum / Math.max(internalEdgeCount, 1)) * 2.5 + aporias.length * 15)
    );

    const epistemicHealth: 'Robust' | 'Moderate' | 'Critical Aporia' =
      internalTensionScore > 65 || aporias.length >= 2
        ? 'Critical Aporia'
        : internalTensionScore > 35
        ? 'Moderate'
        : 'Robust';

    // Derive Dynamic Thematic Name & Subtitle
    let name = '';
    let subtitle = '';
    let coreThesis = '';

    if (thinkers.some((t) => t.label.includes('Nishitani') || t.label.includes('Nishida')) || dominantTradition.includes('Kyoto')) {
      name = 'Kyoto Emptiness & Absolute Sunyata';
      subtitle = 'Mahayana Groundlessness & Trans-Nihilistic Reversion';
      coreThesis =
        'Transvalues Western passive despair by converting the void (nihil) into the affirmative openness of Sunyata (Absolute Nothingness).';
    } else if (thinkers.some((t) => t.label.includes('Eckhart') || t.label.includes('Böhme')) || dominantTradition.includes('Mysticism')) {
      name = 'Apophatic Gottheit & Divine Ungrund';
      subtitle = 'Rhineland Decreation & The Dark Source of Light';
      coreThesis =
        'The unnamable Godhead (Gottheit) precedes Being, realized only through total radical detachment (Gelassenheit) and decreation.';
    } else if (thinkers.some((t) => t.label.includes('Nietzsche') || t.label.includes('Cioran') || t.label.includes('Mainländer'))) {
      name = 'Active Transvaluation & Existential Abyss';
      subtitle = 'Death of God, Cosmic Collapse & Lucidity';
      coreThesis =
        'Diagnoses the collapse of transcendent foundations, formulating active nihilism and tragic joy as the crucible of self-overcoming.';
    } else if (thinkers.some((t) => t.label.includes('Brassier') || t.label.includes('Land')) || dominantTradition.includes('Speculative')) {
      name = 'Cosmic Extinction & Speculative Realism';
      subtitle = 'Transcendental Real of Solar Annihilation';
      coreThesis =
        'Extinction is not a distant future event but the already operative transcendental condition of thought; nothingness is metaphysically fundamental.';
    } else if (thinkers.some((t) => t.label.includes('Heidegger') || t.label.includes('Levinas'))) {
      name = 'Phenomenological Das Nichts & Ereignis';
      subtitle = 'Ontological Difference & The Revelation of Being';
      coreThesis =
        'Anxiety discloses the nothing (das Nichts), dissolving beings to unveil the primordial presencing of Being itself.';
    } else {
      const topConcept = concepts[0]?.label || cNodes[0]?.label || 'Dialectical Constellation';
      name = `${topConcept} Constellation`;
      subtitle = `${dominantTradition} • ${cNodes.length} Entities`;
      coreThesis = `A dense conceptual network grounded in ${dominantTradition}, articulating ${cNodes.slice(0, 3).map((n) => n.label).join(', ')}.`;
    }

    const summary = `${cNodes.length} entities (${thinkers.length} thinkers, ${concepts.length} concepts, ${aporias.length} aporias). Internal cohesion is driven by ${dominantRelation.replace(/_/g, ' ')}.`;

    // Centroid calculation
    const validCoords = cNodes.filter((n) => n.x !== undefined && n.y !== undefined);
    const centroid =
      validCoords.length > 0
        ? {
            x: validCoords.reduce((sum, n) => sum + (n.x || 0), 0) / validCoords.length,
            y: validCoords.reduce((sum, n) => sum + (n.y || 0), 0) / validCoords.length,
          }
        : { x: 0, y: 0 };

    const totalConfidence =
      cNodes.reduce((sum, n) => sum + (n.confidence || 0.9), 0) / Math.max(cNodes.length, 1);

    return {
      id: cId,
      name,
      subtitle,
      dominantTradition,
      color,
      nodeIds,
      centroid,
      summary,
      coreThesis,
      keyThinkerIds,
      keyThinkerLabels,
      aporiaCount: aporias.length,
      epistemicHealth,
      internalTensionScore,
      dominantRelation,
      internalEdgeCount,
      totalConfidence,
    };
  });

  // Calculate Inter-Cluster Connections (Macro-Graph)
  const interMap: Record<
    string,
    {
      source: string;
      target: string;
      weight: number;
      relationCounts: Record<string, number>;
      pairs: { sourceNodeId: string; targetNodeId: string; relation: EdgeRelation }[];
    }
  > = {};

  edges.forEach((e) => {
    const sNodeId = typeof e.source === 'object' ? (e.source as any).id : e.source;
    const tNodeId = typeof e.target === 'object' ? (e.target as any).id : e.target;
    const sCluster = nodeClusterMap.get(sNodeId);
    const tCluster = nodeClusterMap.get(tNodeId);

    if (sCluster && tCluster && sCluster !== tCluster) {
      // Directed inter-connection key
      const key = `${sCluster}__${tCluster}`;
      if (!interMap[key]) {
        interMap[key] = {
          source: sCluster,
          target: tCluster,
          weight: 0,
          relationCounts: {},
          pairs: [],
        };
      }
      interMap[key].weight += e.epistemicWeight || 1.0;
      interMap[key].relationCounts[e.relation] = (interMap[key].relationCounts[e.relation] || 0) + 1;
      interMap[key].pairs.push({ sourceNodeId: sNodeId, targetNodeId: tNodeId, relation: e.relation });
    }
  });

  const interConnections: ClusterInterConnection[] = Object.entries(interMap).map(([key, data]) => {
    const dominantRel =
      (Object.entries(data.relationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as EdgeRelation) ||
      'influences';

    return {
      id: `inter-${key}`,
      sourceClusterId: data.source,
      targetClusterId: data.target,
      weight: data.weight,
      dominantRelation: dominantRel,
      edgeCount: data.pairs.length,
      connectingNodePairs: data.pairs,
    };
  });

  return { clusters, interConnections };
}

/**
 * Generate smooth padded 2D polygon hull around a set of 2D points
 */
export function calculateClusterConvexHull(points: [number, number][], padding: number = 36): [number, number][] | null {
  if (points.length < 3) {
    if (points.length === 1) {
      const [x, y] = points[0];
      return [
        [x - padding, y - padding],
        [x + padding, y - padding],
        [x + padding, y + padding],
        [x - padding, y + padding],
      ];
    }
    if (points.length === 2) {
      const [x1, y1] = points[0];
      const [x2, y2] = points[1];
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const px = (-dy / len) * padding;
      const py = (dx / len) * padding;
      return [
        [x1 + px, y1 + py],
        [x2 + px, y2 + py],
        [x2 - px, y2 - py],
        [x1 - px, y1 - py],
      ];
    }
    return null;
  }

  const rawHull = d3.polygonHull(points);
  if (!rawHull) return null;

  // Expand polygon outward by padding from its center
  const center = d3.polygonCentroid(rawHull);
  const expandedHull: [number, number][] = rawHull.map(([x, y]) => {
    const dx = x - center[0];
    const dy = y - center[1];
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const factor = (dist + padding) / dist;
    return [center[0] + dx * factor, center[1] + dy * factor];
  });

  return expandedHull;
}
