import React, { useState } from 'react';
import { 
  Network, 
  Planet, 
  Route, 
  calculateExpectedShortestPath,
  calculateNetworkLayout,
  generateSampleNetwork,
  RouteCalculationResult
} from '@/utils/routeCalculator';
import NetworkGraph from '@/components/NetworkGraph';
import InputForm from '@/components/InputForm';
import ResultDisplay from '@/components/ResultDisplay';
import { Navigation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [network, setNetwork] = useState<Network | null>(null);
  const [sourceId, setSourceId] = useState<number | undefined>(undefined);
  const [destinationId, setDestinationId] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<RouteCalculationResult | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = (
    planets: Planet[],
    routes: Route[],
    source: number,
    destination: number
  ) => {
    // Build the network
    const newNetwork: Network = { planets, routes };
    
    // Calculate layout for visualization
    const layoutNetwork = calculateNetworkLayout(newNetwork);
    
    // Calculate expected shortest path
    const calculationResult = calculateExpectedShortestPath(
      newNetwork,
      source,
      destination
    );
    
    // Update state
    setNetwork(layoutNetwork);
    setSourceId(source);
    setDestinationId(destination);
    setResult(calculationResult);
    
    // Show toast notification
    if (calculationResult.success) {
      toast({
        title: "Route Calculated",
        description: `Expected cost: ${calculationResult.expectedCost.toFixed(2)}`,
        variant: "default",
      });
    } else {
      toast({
        title: "Calculation Error",
        description: calculationResult.message,
        variant: "destructive",
      });
    }
  };

  const handleUseSampleData = () => {
    const sampleNetwork = generateSampleNetwork();
    const layoutNetwork = calculateNetworkLayout(sampleNetwork);
    const calculationResult = calculateExpectedShortestPath(
      sampleNetwork,
      0, // Earth
      4  // Zenith
    );
    
    setNetwork(layoutNetwork);
    setSourceId(0);
    setDestinationId(4);
    setResult(calculationResult);
    
    toast({
      title: "Sample Data Loaded",
      description: "A sample network with 5 planets has been loaded.",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-space-gradient relative">
      {/* Starry background */}
      <div className="stars-container">
        {Array.from({ length: 200 }).map((_, index) => (
          <div
            key={index}
            className="star"
            style={{
              top: `${Math.random() * 100}vh`,
              left: `${Math.random() * 100}vw`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="py-6 px-4 border-b border-space-nebula-purple backdrop-blur-sm bg-space-deep-blue bg-opacity-30">
        <div className="container mx-auto">
          <div className="flex items-center justify-center text-center">
            <Navigation size={32} className="text-space-route-teal mr-3 animate-glow" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Galactic Trade Route <span className="text-space-route-teal">Disruption Calculator</span>
            </h1>
          </div>
          <p className="text-center text-gray-300 mt-2 max-w-2xl mx-auto">
            Calculate the expected cost of the shortest path between planets while accounting for routes that may randomly disappear due to alien interference.
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Input form */}
          <div>
            <InputForm onSubmit={handleFormSubmit} useSampleData={handleUseSampleData} />
          </div>

          {/* Right column - Visualization and results */}
          <div className="space-y-6">
            {network && (
              <div className="rounded-lg overflow-hidden">
                <div className="bg-space-cosmic-blue bg-opacity-30 p-4 backdrop-blur-sm border border-space-nebula-purple rounded-lg">
                  <h2 className="text-2xl font-bold text-white mb-4">Network Visualization</h2>
                  <NetworkGraph
                    network={network}
                    sourceId={sourceId}
                    destinationId={destinationId}
                    path={result?.path || []}
                  />
                </div>
              </div>
            )}
            
            {result && (
              <ResultDisplay result={result} planets={network?.planets || []} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-space-nebula-purple text-center text-gray-400">
        <div className="container mx-auto">
          <p>Galactic Trade Route Disruption Calculator - Using Dijkstra with Expectation for Probabilistic Graphs</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
