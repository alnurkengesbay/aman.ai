"use client"

import { useEffect, useState } from "react"

export function NeuralVisual() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Neural network nodes positioned in brain-like shape
  const nodes = [
    { x: 200, y: 80, delay: 0 },
    { x: 320, y: 60, delay: 0.2 },
    { x: 440, y: 90, delay: 0.1 },
    { x: 150, y: 180, delay: 0.3 },
    { x: 280, y: 160, delay: 0.15 },
    { x: 400, y: 150, delay: 0.25 },
    { x: 500, y: 180, delay: 0.35 },
    { x: 180, y: 280, delay: 0.4 },
    { x: 320, y: 260, delay: 0.2 },
    { x: 450, y: 270, delay: 0.3 },
    { x: 250, y: 350, delay: 0.5 },
    { x: 380, y: 340, delay: 0.45 },
  ]

  // Connections between nodes
  const connections = [
    [0, 1],
    [1, 2],
    [0, 3],
    [1, 4],
    [2, 5],
    [2, 6],
    [3, 4],
    [4, 5],
    [5, 6],
    [3, 7],
    [4, 8],
    [5, 9],
    [7, 8],
    [8, 9],
    [7, 10],
    [8, 10],
    [8, 11],
    [9, 11],
    [10, 11],
    [0, 4],
    [1, 5],
    [4, 9],
    [3, 8],
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        viewBox="0 0 600 420"
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[500px] opacity-[0.08]"
        style={{ transform: "translateY(-50%) translateX(10%)" }}
      >
        {/* Connection lines */}
        {connections.map(([from, to], i) => (
          <line
            key={`line-${i}`}
            x1={nodes[from].x}
            y1={nodes[from].y}
            x2={nodes[to].x}
            y2={nodes[to].y}
            stroke="currentColor"
            strokeWidth="1"
            className="animate-draw-line"
            style={{ animationDelay: `${Math.max(nodes[from].delay, nodes[to].delay) + 0.5}s` }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={`node-${i}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r="8"
              fill="currentColor"
              className="animate-pulse-dot"
              style={{ animationDelay: `${node.delay + 1}s` }}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.3"
              className="animate-fade-in"
              style={{ animationDelay: `${node.delay + 1.2}s` }}
            />
          </g>
        ))}
      </svg>
    </div>
  )
}
