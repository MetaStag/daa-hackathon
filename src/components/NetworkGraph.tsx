import React, { useEffect, useRef } from 'react';
import { Network } from '@/utils/routeCalculator';

interface NetworkGraphProps {
  network: Network;
  sourceId?: number;
  destinationId?: number;
  path?: number[];
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ 
  network, 
  sourceId, 
  destinationId,
  path = [] 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Check if a route is part of the shortest path
  const isInPath = (from: number, to: number): boolean => {
    if (!path || path.length < 2) return false;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (path[i] === from && path[i + 1] === to) {
        return true;
      }
    }
    return false;
  };

  // Generate random stars for the background
  const generateStars = (count: number) => {
    const stars = [];
    const svgWidth = 600;
    const svgHeight = 600;
    
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 2 + 1;
      const x = Math.random() * svgWidth;
      const y = Math.random() * svgHeight;
      const opacity = Math.random() * 0.7 + 0.3;
      const duration = Math.random() * 3 + 2;
      
      stars.push(
        <div
          key={i}
          className="star"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${x}px`,
            top: `${y}px`,
            opacity,
            '--twinkle-duration': `${duration}s`
          } as React.CSSProperties}
        />
      );
    }
    
    return stars;
  };

  useEffect(() => {
    // Animation for path highlighting could be added here
  }, [network, path]);

  return (
    <div className="relative w-full h-[600px] bg-transparent rounded-lg overflow-hidden border border-space-nebula-purple">
      {/* Stars background */}
      {generateStars(100)}
      
      <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 600 600">
        {/* Draw routes first so they're behind planets */}
        {network.routes.map((route, index) => {
          const fromPlanet = network.planets.find(p => p.id === route.from);
          const toPlanet = network.planets.find(p => p.id === route.to);
          
          if (!fromPlanet || !toPlanet || !fromPlanet.x || !fromPlanet.y || !toPlanet.x || !toPlanet.y) {
            return null;
          }
          
          const isPathSegment = isInPath(route.from, route.to);
          
          return (
            <g key={`route-${index}`}>
              {/* Failure probability indicator */}
              <line
                x1={fromPlanet.x}
                y1={fromPlanet.y}
                x2={toPlanet.x}
                y2={toPlanet.y}
                stroke={isPathSegment ? 'url(#pathGradient)' : '#3A4A7B'}
                strokeWidth={isPathSegment ? 4 : 2}
                strokeOpacity={isPathSegment ? 1 : 0.6}
                className={`edge ${isPathSegment ? 'animate-glow' : ''}`}
              />
              
              {/* Route cost label */}
              <text
                x={(fromPlanet.x + toPlanet.x) / 2}
                y={(fromPlanet.y + toPlanet.y) / 2 - 10}
                textAnchor="middle"
                fill={isPathSegment ? '#F9DC5C' : '#8899BB'}
                fontSize={isPathSegment ? 14 : 12}
                fontWeight={isPathSegment ? 'bold' : 'normal'}
              >
                {route.cost}
              </text>
              
              {/* Failure probability label */}
              <text
                x={(fromPlanet.x + toPlanet.x) / 2}
                y={(fromPlanet.y + toPlanet.y) / 2 + 10}
                textAnchor="middle"
                fill={isPathSegment ? '#FF5E5B' : '#8899BB'}
                fontSize={12}
              >
                {(route.failureProbability * 100).toFixed(0)}%
              </text>
            </g>
          );
        })}
        
        {/* Draw planets */}
        {network.planets.map((planet) => {
          if (!planet.x || !planet.y) return null;
          
          const isSource = planet.id === sourceId;
          const isDestination = planet.id === destinationId;
          const isInPathPlanet = path.includes(planet.id);
          
          let fillColor = '#3A4A7B';
          let strokeColor = '#5973C0';
          let size = 20;
          
          if (isSource) {
            fillColor = '#00EAD3';
            strokeColor = '#7AE582';
            size = 25;
          } else if (isDestination) {
            fillColor = '#F9DC5C';
            strokeColor = '#FF9F1C';
            size = 25;
          } else if (isInPathPlanet) {
            fillColor = '#A36AF9';
            strokeColor = '#D467FF';
          }
          
          return (
            <g key={`planet-${planet.id}`} className="node">
              <circle
                cx={planet.x}
                cy={planet.y}
                r={size}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={2}
                className={isInPathPlanet ? 'animate-glow' : ''}
              />
              <text
                x={planet.x}
                y={planet.y}
                textAnchor="middle"
                dy="0.3em"
                fill="#FFFFFF"
                fontSize={12}
                fontWeight="bold"
              >
                {planet.id}
              </text>
              <text
                x={planet.x}
                y={planet.y + size + 15}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize={12}
              >
                {planet.name}
              </text>
            </g>
          );
        })}
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00EAD3" />
            <stop offset="100%" stopColor="#7AE582" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default NetworkGraph;
