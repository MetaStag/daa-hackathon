
import React from 'react';
import { RouteCalculationResult } from '@/utils/routeCalculator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from 'lucide-react';

interface ResultDisplayProps {
  result: RouteCalculationResult | null;
  planets: { id: number; name: string }[];
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, planets }) => {
  if (!result) {
    return null;
  }
  
  if (!result.success) {
    return (
      <Card className="bg-space-deep-blue border-space-danger-red">
        <CardHeader className="pb-2">
          <CardTitle className="text-space-danger-red flex items-center gap-2">
            <Navigation size={20} />
            Route Calculation Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white">{result.message}</p>
        </CardContent>
      </Card>
    );
  }

  const pathNames = result.path.map(id => {
    const planet = planets.find(p => p.id === id);
    return planet ? planet.name : `Unknown (${id})`;
  });

  return (
    <Card className="bg-space-deep-blue border-space-route-teal overflow-hidden">
      <CardHeader className="pb-2 bg-space-nebula-purple bg-opacity-30">
        <CardTitle className="text-space-route-teal flex items-center gap-2">
          <Navigation size={20} />
          Optimal Route Calculated
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4">
          <h3 className="text-space-star-yellow font-medium mb-1">Expected Cost:</h3>
          <p className="text-4xl font-bold text-space-route-teal">{result.expectedCost.toFixed(2)}</p>
        </div>
        
        <div>
          <h3 className="text-space-star-yellow font-medium mb-1">Path:</h3>
          <div className="flex flex-wrap items-center gap-2">
            {pathNames.map((name, index) => (
              <React.Fragment key={`path-${index}`}>
                <span className="px-3 py-1 bg-space-nebula-purple rounded-md text-white">
                  {name}
                </span>
                {index < pathNames.length - 1 && (
                  <span className="text-space-route-teal">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;