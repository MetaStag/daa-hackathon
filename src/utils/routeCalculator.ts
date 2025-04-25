
// Data types for the interplanetary network
export interface Planet {
  id: number;
  name: string;
  x?: number;
  y?: number;
}

export interface Route {
  from: number;
  to: number;
  cost: number;
  failureProbability: number;
}

export interface Network {
  planets: Planet[];
  routes: Route[];
}

export interface RouteCalculationResult {
  expectedCost: number;
  path: number[];
  success: boolean;
  message?: string;
}

// Calculate the expected shortest path using a hybrid Dijkstra-DP approach
export function calculateExpectedShortestPath(
  network: Network,
  sourceId: number,
  destinationId: number
): RouteCalculationResult {
  const numPlanets = network.planets.length;
  
  // Initialize arrays for expected distance and visited status
  const expectedDistance = Array(numPlanets).fill(Infinity);
  const visited = Array(numPlanets).fill(false);
  const previous = Array(numPlanets).fill(-1);
  
  // Start from source
  expectedDistance[sourceId] = 0;
  
  // Create adjacency list for faster access
  const adjacencyList: { to: number; cost: number; failureProbability: number }[][] = 
    Array(numPlanets).fill(null).map(() => []);
  
  // Fill adjacency list
  for (const route of network.routes) {
    adjacencyList[route.from].push({
      to: route.to,
      cost: route.cost,
      failureProbability: route.failureProbability
    });
  }
  
  for (let i = 0; i < numPlanets; i++) {
    // Find the planet with the minimum expected distance
    let minDistance = Infinity;
    let minIndex = -1;
    
    for (let j = 0; j < numPlanets; j++) {
      if (!visited[j] && expectedDistance[j] < minDistance) {
        minDistance = expectedDistance[j];
        minIndex = j;
      }
    }
    
    // If we can't reach any more planets or we've reached the destination
    if (minIndex === -1 || minIndex === destinationId) break;
    
    // Mark as visited
    visited[minIndex] = true;
    
    // Update expected distances for all neighbors
    for (const route of adjacencyList[minIndex]) {
      const { to, cost, failureProbability } = route;
      
      // Calculate expected cost: (1-p) * direct + p * (current + alternative)
      // For simplicity, we're assuming if a route fails, we take the current best path again
      const directExpectedCost = (1 - failureProbability) * cost;
      const failureExpectedCost = failureProbability * (expectedDistance[minIndex] + expectedDistance[to]);
      
      const newExpectedCost = expectedDistance[minIndex] + directExpectedCost;
      
      // If this path is better, update it
      if (newExpectedCost < expectedDistance[to]) {
        expectedDistance[to] = newExpectedCost;
        previous[to] = minIndex;
      }
    }
  }
  
  // Check if destination is reachable
  if (expectedDistance[destinationId] === Infinity) {
    return {
      expectedCost: 0,
      path: [],
      success: false,
      message: "No viable path exists to the destination."
    };
  }
  
  // Reconstruct the path
  const path: number[] = [];
  let current = destinationId;
  while (current !== sourceId) {
    path.unshift(current);
    current = previous[current];
    if (current === -1) {
      return {
        expectedCost: 0,
        path: [],
        success: false,
        message: "Path reconstruction error. Please check your network configuration."
      };
    }
  }
  path.unshift(sourceId);
  
  return {
    expectedCost: expectedDistance[destinationId],
    path,
    success: true
  };
}

// Calculate layout positions for visualizing the network
export function calculateNetworkLayout(network: Network): Network {
  const updatedNetwork = { ...network };
  const numPlanets = network.planets.length;
  
  // Simple circular layout
  updatedNetwork.planets = network.planets.map((planet, index) => ({
    ...planet,
    x: 300 + 250 * Math.cos(2 * Math.PI * index / numPlanets),
    y: 300 + 250 * Math.sin(2 * Math.PI * index / numPlanets)
  }));
  
  return updatedNetwork;
}

// Generate a sample network for demonstration
export function generateSampleNetwork(): Network {
  const planets: Planet[] = [
    { id: 0, name: "Earth" },
    { id: 1, name: "Mars" },
    { id: 2, name: "Jupiter" },
    { id: 3, name: "Saturn" },
    { id: 4, name: "Zenith" }
  ];
  
  const routes: Route[] = [
    { from: 0, to: 1, cost: 10, failureProbability: 0.1 },
    { from: 0, to: 2, cost: 15, failureProbability: 0.2 },
    { from: 1, to: 3, cost: 12, failureProbability: 0.1 },
    { from: 1, to: 2, cost: 5, failureProbability: 0.05 },
    { from: 2, to: 4, cost: 20, failureProbability: 0.15 },
    { from: 3, to: 4, cost: 8, failureProbability: 0.3 }
  ];
  
  return { planets, routes };
}
