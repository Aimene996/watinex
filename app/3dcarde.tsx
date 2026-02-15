"use client";

import { useState } from "react";

type Connection = { from: string; to: string; id: string };

export default function InteractiveShippingCardsWithMap() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Card positions in proportional space (0–100). Inset from edges so cards stay fully on screen (no clipping).
  const cards = [
    { id: "CHN", label: "CHN", color: "from-slate-700 to-slate-800", x: 78, y: 26, delay: 0, mapCoords: { x: 75, y: 35 } },
    { id: "DXB", label: "DXB", color: "from-slate-600 to-slate-700", x: 22, y: 55, delay: 1, mapCoords: { x: 55, y: 45 } },
    { id: "DZA", label: "DZA", color: "from-slate-800 to-slate-900", x: 72, y: 76, delay: 2, mapCoords: { x: 28, y: 42 } },
  ];

  // Define connections (triangle)
  const connections = [
    { from: "CHN", to: "DXB", id: "chn-dxb" },
    { from: "DXB", to: "DZA", id: "dxb-dza" },
    { from: "DZA", to: "CHN", id: "dza-chn" },
  ];

  const isConnectionActive = (connection: Connection) => {
    if (!hoveredCard) return false;
    return connection.from === hoveredCard || connection.to === hoveredCard;
  };

  // Generate curved path for connections
  const getCurvedPath = (x1: number, y1: number, x2: number, y2: number) => {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    // Calculate control point for curve (offset perpendicular to the line)
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const curvature = 0.2; // Adjust this for more/less curve
    const offsetX = (-dy / length) * length * curvature;
    const offsetY = (dx / length) * length * curvature;
    const controlX = midX + offsetX;
    const controlY = midY + offsetY;
    
    return `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;
  };

  return (
    <div className="relative h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden p-6 sm:p-8 md:p-10 lg:p-12">
      {/* World Map Background Layer - more visible in dark mode so it doesn't vanish */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-15 sm:opacity-20 dark:opacity-25 dark:sm:opacity-30">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 60"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.5" />
            </linearGradient>
            
            <pattern id="dots" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.3" fill="#334155" opacity="0.3" />
            </pattern>
          </defs>

          <g fill="url(#mapGradient)" stroke="#475569" strokeWidth="0.15" opacity="0.8">
            <path d="M 20,35 L 25,28 L 28,25 L 35,25 L 38,28 L 40,35 L 38,45 L 35,52 L 28,55 L 25,52 L 22,45 Z" />
            <path d="M 28,20 L 35,18 L 40,20 L 42,25 L 38,28 L 35,27 L 30,25 Z" />
            <path d="M 45,15 L 55,12 L 65,15 L 75,18 L 82,25 L 85,32 L 82,40 L 75,45 L 65,42 L 55,38 L 48,32 L 45,25 Z" />
            <path d="M 42,28 L 48,27 L 52,30 L 55,35 L 52,40 L 48,42 L 42,40 L 40,35 Z" />
          </g>

          <rect x="0" y="0" width="100" height="60" fill="url(#dots)" />

          {/* Map routes: light theme (black/slate) */}
          <g className="dark:hidden">
            {connections.map((connection) => {
              const fromCard = cards.find((c) => c.id === connection.from);
              const toCard = cards.find((c) => c.id === connection.to);
              if (!fromCard || !toCard) return null;
              const isActive = isConnectionActive(connection);
              return (
                <path
                  key={`map-route-light-${connection.id}`}
                  d={`M ${fromCard.mapCoords.x} ${fromCard.mapCoords.y} Q ${
                    (fromCard.mapCoords.x + toCard.mapCoords.x) / 2
                  } ${
                    (fromCard.mapCoords.y + toCard.mapCoords.y) / 2 - 5
                  } ${toCard.mapCoords.x} ${toCard.mapCoords.y}`}
                  fill="none"
                  stroke={isActive ? "#1e293b" : "#475569"}
                  strokeWidth={isActive ? "0.4" : "0.2"}
                  strokeDasharray="1 1"
                  opacity={isActive ? "0.7" : "0.4"}
                  className="transition-all duration-500"
                />
              );
            })}
          </g>
          {/* Map routes: dark theme (blue/cyan) */}
          <g className="hidden dark:block">
            {connections.map((connection) => {
              const fromCard = cards.find((c) => c.id === connection.from);
              const toCard = cards.find((c) => c.id === connection.to);
              if (!fromCard || !toCard) return null;
              const isActive = isConnectionActive(connection);
              return (
                <path
                  key={`map-route-dark-${connection.id}`}
                  d={`M ${fromCard.mapCoords.x} ${fromCard.mapCoords.y} Q ${
                    (fromCard.mapCoords.x + toCard.mapCoords.x) / 2
                  } ${
                    (fromCard.mapCoords.y + toCard.mapCoords.y) / 2 - 5
                  } ${toCard.mapCoords.x} ${toCard.mapCoords.y}`}
                  fill="none"
                  stroke={isActive ? "#06b6d4" : "#3b82f6"}
                  strokeWidth={isActive ? "0.4" : "0.2"}
                  strokeDasharray="1 1"
                  opacity={isActive ? "0.8" : "0.3"}
                  className="transition-all duration-500"
                />
              );
            })}
          </g>
          {/* Map markers: light theme */}
          <g className="dark:hidden">
            {cards.map((card) => {
              const isHovered = hoveredCard === card.id;
              return (
                <g key={`map-marker-light-${card.id}`}>
                  <circle
                    cx={card.mapCoords.x}
                    cy={card.mapCoords.y}
                    r={isHovered ? "1.2" : "0.8"}
                    fill={isHovered ? "#1e293b" : "#475569"}
                    opacity={isHovered ? "1" : "0.6"}
                    className="transition-all duration-500"
                  />
                  {isHovered && (
                    <circle
                      cx={card.mapCoords.x}
                      cy={card.mapCoords.y}
                      r="2"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="0.3"
                      opacity="0.5"
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}
          </g>
          {/* Map markers: dark theme */}
          <g className="hidden dark:block">
            {cards.map((card) => {
              const isHovered = hoveredCard === card.id;
              return (
                <g key={`map-marker-${card.id}`}>
                  <circle
                    cx={card.mapCoords.x}
                    cy={card.mapCoords.y}
                    r={isHovered ? "1.2" : "0.8"}
                    fill={isHovered ? "#06b6d4" : "#3b82f6"}
                    opacity={isHovered ? "1" : "0.6"}
                    className="transition-all duration-500"
                  />
                  {isHovered && (
                    <circle
                      cx={card.mapCoords.x}
                      cy={card.mapCoords.y}
                      r="2"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="0.3"
                      opacity="0.5"
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}
          </g>

          <g stroke="#475569" strokeWidth="0.05" opacity="0.2">
            {[...Array(10)].map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 10}
                y1="0"
                x2={i * 10}
                y2="60"
              />
            ))}
            {[...Array(6)].map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * 10}
                x2="100"
                y2={i * 10}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Explosion / Burst Effect - black/slate in light mode, blue/cyan in dark mode */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="explosion-burst absolute w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-r from-slate-600/35 to-slate-800/40 blur-3xl dark:from-blue-400/40 dark:to-cyan-400/40" />
        <div className="explosion-burst-delay absolute w-28 h-28 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 rounded-full bg-slate-700/25 blur-2xl dark:bg-cyan-300/30" />
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-16 sm:h-24 md:h-32 bg-gradient-to-b from-slate-600/45 to-transparent dark:from-cyan-400/50 explosion-ray"
            style={{
              left: "50%",
              bottom: "50%",
              marginLeft: -1,
              ["--ray-rotate" as string]: `${i * 30}deg`,
              animationDelay: `${i * 0.05}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Single SVG in proportional space (0 0 100 100) – lines stay connected at any viewport size */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Dark theme: blue/cyan gradients */}
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="lineGrad3" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0">
              <animate attributeName="offset" values="0;1;0" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="1">
              <animate attributeName="offset" values="0;1;0" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0">
              <animate attributeName="offset" values="0;1;0" dur="3s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
          {/* Light theme: black/slate gradients */}
          <linearGradient id="lineGrad1Light" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="lineGrad2Light" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <linearGradient id="lineGrad3Light" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="pulseGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#475569" stopOpacity="0">
              <animate attributeName="offset" values="0;1;0" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#334155" stopOpacity="1">
              <animate attributeName="offset" values="0;1;0" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#475569" stopOpacity="0">
              <animate attributeName="offset" values="0;1;0" dur="3s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Light theme: connector lines and pulse (black/slate) */}
        <g className="dark:hidden">
          {connections.map((connection, idx) => {
            const fromCard = cards.find((c) => c.id === connection.from);
            const toCard = cards.find((c) => c.id === connection.to);
            if (!fromCard || !toCard) return null;
            const isActive = isConnectionActive(connection);
            const isFaded = hoveredCard && !isActive;
            const path = getCurvedPath(fromCard.x, fromCard.y, toCard.x, toCard.y);
            return (
              <g key={`light-${connection.id}`}>
                <path
                  d={path}
                  fill="none"
                  stroke={`url(#lineGrad${idx + 1}Light)`}
                  strokeWidth={isActive ? "1.2" : "0.8"}
                  strokeLinecap="round"
                  strokeDasharray="2 1.5"
                  className={`connector-line transition-all duration-500 ${
                    isFaded ? "opacity-20" : isActive ? "opacity-100" : "opacity-50"
                  }`}
                  style={{ animationDelay: `${idx * 0.4}s` }}
                  filter={isActive ? "url(#glow)" : "none"}
                />
                {isActive && (
                  <>
                    <circle r="1.2" fill="url(#pulseGradientLight)">
                      <animateMotion dur="3s" repeatCount="indefinite" path={path} />
                    </circle>
                    <circle r="0.7" fill="#334155" opacity="0.7">
                      <animateMotion dur="3s" repeatCount="indefinite" begin="0.5s" path={path} />
                    </circle>
                  </>
                )}
              </g>
            );
          })}
        </g>
        {/* Dark theme: connector lines and pulse (blue/cyan) */}
        <g className="hidden dark:block">
          {connections.map((connection, idx) => {
            const fromCard = cards.find((c) => c.id === connection.from);
            const toCard = cards.find((c) => c.id === connection.to);
            if (!fromCard || !toCard) return null;
            const isActive = isConnectionActive(connection);
            const isFaded = hoveredCard && !isActive;
            const path = getCurvedPath(fromCard.x, fromCard.y, toCard.x, toCard.y);
            return (
              <g key={connection.id}>
                <path
                  d={path}
                  fill="none"
                  stroke={`url(#lineGrad${idx + 1})`}
                  strokeWidth={isActive ? "1.2" : "0.8"}
                  strokeLinecap="round"
                  strokeDasharray="2 1.5"
                  className={`connector-line transition-all duration-500 ${
                    isFaded ? "opacity-20" : isActive ? "opacity-100" : "opacity-50"
                  }`}
                  style={{ animationDelay: `${idx * 0.4}s` }}
                  filter={isActive ? "url(#glow)" : "none"}
                />
                {isActive && (
                  <>
                    <circle r="1.2" fill="url(#pulseGradient)">
                      <animateMotion dur="3s" repeatCount="indefinite" path={path} />
                    </circle>
                    <circle r="0.7" fill="#06b6d4" opacity="0.6">
                      <animateMotion dur="3s" repeatCount="indefinite" begin="0.5s" path={path} />
                    </circle>
                  </>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* 3D Container Cards - positions match SVG (0–100) so lines stay connected at any size. Light in dark mode so they stay visible. */}
      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 w-20 h-14 sm:w-28 sm:h-18 md:w-32 md:h-20 lg:w-40 lg:h-24 bg-gradient-to-br ${cards[0].color} dark:from-slate-400 dark:to-slate-500 rounded-lg shadow-2xl transform transition-all duration-500 cursor-pointer z-20 ${
          hoveredCard === "CHN" ? "scale-125 z-30" : hoveredCard ? "scale-95 opacity-60" : "scale-100"
        }`}
        style={{
          left: `${cards[0].x}%`,
          top: `${cards[0].y}%`,
          animation: `containerFloat ${3 + cards[0].delay}s ease-in-out infinite`,
          animationDelay: `${cards[0].delay}s`,
          animationPlayState: hoveredCard === "CHN" ? "paused" : "running",
        }}
        onMouseEnter={() => setHoveredCard("CHN")}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 to-transparent"></div>

        {hoveredCard === "CHN" && (
          <>
            <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-blue-400/50 via-cyan-400/50 to-blue-400/50 blur-xl animate-pulse"></div>
            <div className="absolute -inset-4 rounded-lg bg-cyan-400/30 blur-2xl"></div>
          </>
        )}

        <div className="relative flex h-full items-center justify-center text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white dark:text-slate-900 tracking-wider z-10">
          CHN
        </div>

        <div
          className="absolute -top-1 sm:-top-2 left-1 sm:left-2 right-1 sm:right-2 h-1 sm:h-2 bg-black/20 dark:bg-white/20 rounded-t-lg"
          style={{ transform: "rotateX(60deg)" }}
        ></div>

        <div
          className="absolute top-1 sm:top-2 -right-1 sm:-right-2 bottom-1 sm:bottom-2 w-1 sm:w-2 bg-black/30 dark:bg-white/20 rounded-r-lg"
          style={{ transform: "rotateY(60deg)" }}
        ></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              hoveredCard === "CHN"
                ? "bg-cyan-400 shadow-lg shadow-cyan-400/50 animate-ping"
                : "bg-white/30 dark:bg-slate-900/40"
            }`}
          ></div>
        </div>
      </div>

      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 w-20 h-14 sm:w-28 sm:h-18 md:w-32 md:h-20 lg:w-40 lg:h-24 bg-gradient-to-br ${cards[1].color} dark:from-slate-300 dark:to-slate-400 rounded-lg shadow-2xl transform transition-all duration-500 cursor-pointer z-20 ${
          hoveredCard === "DXB" ? "scale-125 z-30" : hoveredCard ? "scale-95 opacity-60" : "scale-100"
        }`}
        style={{
          left: `${cards[1].x}%`,
          top: `${cards[1].y}%`,
          animation: `containerFloat ${3 + cards[1].delay}s ease-in-out infinite`,
          animationDelay: `${cards[1].delay}s`,
          animationPlayState: hoveredCard === "DXB" ? "paused" : "running",
        }}
        onMouseEnter={() => setHoveredCard("DXB")}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 to-transparent"></div>

        {hoveredCard === "DXB" && (
          <>
            <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-blue-400/50 via-cyan-400/50 to-blue-400/50 blur-xl animate-pulse"></div>
            <div className="absolute -inset-4 rounded-lg bg-cyan-400/30 blur-2xl"></div>
          </>
        )}

        <div className="relative flex h-full items-center justify-center text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white dark:text-slate-900 tracking-wider z-10">
          DXB
        </div>

        <div
          className="absolute -top-1 sm:-top-2 left-1 sm:left-2 right-1 sm:right-2 h-1 sm:h-2 bg-black/20 dark:bg-white/20 rounded-t-lg"
          style={{ transform: "rotateX(60deg)" }}
        ></div>

        <div
          className="absolute top-1 sm:top-2 -right-1 sm:-right-2 bottom-1 sm:bottom-2 w-1 sm:w-2 bg-black/30 dark:bg-white/20 rounded-r-lg"
          style={{ transform: "rotateY(60deg)" }}
        ></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              hoveredCard === "DXB"
                ? "bg-cyan-400 shadow-lg shadow-cyan-400/50 animate-ping"
                : "bg-white/30 dark:bg-slate-900/40"
            }`}
          ></div>
        </div>
      </div>

      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 w-20 h-14 sm:w-28 sm:h-18 md:w-32 md:h-20 lg:w-40 lg:h-24 bg-gradient-to-br ${cards[2].color} dark:from-slate-500 dark:to-slate-600 rounded-lg shadow-2xl transform transition-all duration-500 cursor-pointer z-20 ${
          hoveredCard === "DZA" ? "scale-125 z-30" : hoveredCard ? "scale-95 opacity-60" : "scale-100"
        }`}
        style={{
          left: `${cards[2].x}%`,
          top: `${cards[2].y}%`,
          animation: `containerFloat ${3 + cards[2].delay}s ease-in-out infinite`,
          animationDelay: `${cards[2].delay}s`,
          animationPlayState: hoveredCard === "DZA" ? "paused" : "running",
        }}
        onMouseEnter={() => setHoveredCard("DZA")}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 to-transparent"></div>

        {hoveredCard === "DZA" && (
          <>
            <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-blue-400/50 via-cyan-400/50 to-blue-400/50 blur-xl animate-pulse"></div>
            <div className="absolute -inset-4 rounded-lg bg-cyan-400/30 blur-2xl"></div>
          </>
        )}

        <div className="relative flex h-full items-center justify-center text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white dark:text-slate-900 tracking-wider z-10">
          DZA
        </div>

        <div
          className="absolute -top-1 sm:-top-2 left-1 sm:left-2 right-1 sm:right-2 h-1 sm:h-2 bg-black/20 dark:bg-white/20 rounded-t-lg"
          style={{ transform: "rotateX(60deg)" }}
        ></div>

        <div
          className="absolute top-1 sm:top-2 -right-1 sm:-right-2 bottom-1 sm:bottom-2 w-1 sm:w-2 bg-black/30 dark:bg-white/20 rounded-r-lg"
          style={{ transform: "rotateY(60deg)" }}
        ></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              hoveredCard === "DZA"
                ? "bg-cyan-400 shadow-lg shadow-cyan-400/50 animate-ping"
                : "bg-white/30 dark:bg-slate-900/40"
            }`}
          ></div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes containerFloat {
          0%, 100% {
            transform: translateY(0) rotateX(0) rotateY(0);
          }
          50% {
            transform: translateY(-10px) rotateX(5deg) rotateY(-5deg);
          }
        }
        
        @keyframes dashMove {
          to {
            stroke-dashoffset: -4;
          }
        }
        
        .connector-line {
          animation: dashMove 2.5s linear infinite;
        }
        
        @keyframes explosionBurst {
          0%, 100% {
            transform: scale(0.6);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.6;
          }
        }
        
        @keyframes explosionRay {
          0%, 100% {
            opacity: 0.2;
            transform: rotate(var(--ray-rotate)) scaleY(0.6);
          }
          50% {
            opacity: 0.6;
            transform: rotate(var(--ray-rotate)) scaleY(1);
          }
        }
        
        .explosion-burst {
          animation: explosionBurst 3s ease-in-out infinite;
        }
        
        .explosion-burst-delay {
          animation: explosionBurst 3s ease-in-out infinite 0.5s;
        }
        
        .explosion-ray {
          --ray-rotate: 0deg;
          animation: explosionRay 2s ease-in-out infinite;
          transform-origin: center bottom;
        }
      `}</style>
    </div>
  );
}