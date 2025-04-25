import PriorityQueue from "./priority";

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
  const expectedDistance = Array(numPlanets).fill(Infinity);
  const visited = Array(numPlanets).fill(false);
  const previous = Array(numPlanets).fill(-1);

  expectedDistance[sourceId] = 0;

  // Build adjacency list
  const adjacencyList: { to: number; cost: number; failureProbability: number }[][] =
    Array(numPlanets).fill(null).map(() => []);
  for (const route of network.routes) {
    adjacencyList[route.from].push({
      to: route.to,
      cost: route.cost,
      failureProbability: route.failureProbability
    });
  }

  // Min-heap priority queue for efficient next-node selection
  const pq = new PriorityQueue<[number, number]>(); // [nodeId, currentExpectedCost]
  pq.enqueue([sourceId, 0], 0);

  while (!pq.isEmpty()) {
    const [current] = pq.dequeue()!;
    if (visited[current]) continue;
    visited[current] = true;

    if (current === destinationId) break;

    for (const route of adjacencyList[current]) {
      const { to, cost, failureProbability } = route;

      const directExpectedCost = (1 - failureProbability) * cost;
      const newExpectedCost = expectedDistance[current] + directExpectedCost;

      if (newExpectedCost < expectedDistance[to]) {
        expectedDistance[to] = newExpectedCost;
        previous[to] = current;
        pq.enqueue([to, newExpectedCost], newExpectedCost);
      }
    }
  }

  if (expectedDistance[destinationId] === Infinity) {
    return {
      expectedCost: 0,
      path: [],
      success: false,
      message: "No viable path exists to the destination."
    };
  }

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
        message: "Path reconstruction error."
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
