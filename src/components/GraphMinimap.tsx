/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP v2
 * Interactive Graph Minimap & Viewport Radar
 */

import React, { useEffect, useRef } from 'react';
import { GraphNode } from '../types';

interface GraphMinimapProps {
  nodes: GraphNode[];
  selectedNode: GraphNode | null;
  activeLens: string;
}

export const GraphMinimap: React.FC<GraphMinimapProps> = ({
  nodes,
  selectedNode,
  activeLens,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, width, height);

    // Draw subtle grid lines
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (nodes.length === 0) return;

    // Find bounding box of nodes
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;

    nodes.forEach((n) => {
      const x = n.x ?? 0;
      const y = n.y ?? 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    });

    const padding = 30;
    const spanX = Math.max(maxX - minX, 100);
    const spanY = Math.max(maxY - minY, 100);

    const scaleX = (width - padding * 2) / spanX;
    const scaleY = (height - padding * 2) / spanY;
    const scale = Math.min(scaleX, scaleY);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Render node points
    nodes.forEach((n) => {
      const nx = n.x ?? 0;
      const ny = n.y ?? 0;
      const cx = width / 2 + (nx - centerX) * scale;
      const cy = height / 2 + (ny - centerY) * scale;

      const isSelected = selectedNode?.id === n.id;
      const isCanonical = n.status === 'CANONICAL';

      ctx.beginPath();
      ctx.arc(cx, cy, isSelected ? 4 : isCanonical ? 2.5 : 1.5, 0, 2 * Math.PI);

      if (isSelected) {
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 6;
      } else if (isCanonical) {
        ctx.fillStyle = '#f59e0b';
        ctx.shadowBlur = 0;
      } else if (n.type === 'concept') {
        ctx.fillStyle = '#38bdf8';
        ctx.shadowBlur = 0;
      } else if (n.type === 'aporia') {
        ctx.fillStyle = '#f43f5e';
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = '#71717a';
        ctx.shadowBlur = 0;
      }
      ctx.fill();
    });

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw viewport boundary frame
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 1;
    ctx.strokeRect(1, 1, width - 2, height - 2);
  }, [nodes, selectedNode, activeLens]);

  return (
    <div className="bg-neutral-950/90 border border-neutral-800/90 rounded-lg p-1.5 shadow-xl backdrop-blur-sm pointer-events-auto">
      <div className="flex items-center justify-between px-1 pb-1 text-[10px] font-mono text-neutral-400">
        <span>RADAR / MINIMAP</span>
        <span className="text-amber-400">{nodes.length} N</span>
      </div>
      <canvas
        ref={canvasRef}
        width={130}
        height={90}
        className="rounded border border-neutral-800/80 block"
      />
    </div>
  );
};
