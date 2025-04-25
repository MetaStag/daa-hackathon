
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Planet, Route } from '@/utils/routeCalculator';
import { PlusCircle, MinusCircle, Route as RouteIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface InputFormProps {
  onSubmit: (planets: Planet[], routes: Route[], sourceId: number, destinationId: number) => void;
  useSampleData: () => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, useSampleData }) => {
  const [numPlanets, setNumPlanets] = useState<number>(5);
  const [planets, setPlanets] = useState<Planet[]>([
    { id: 0, name: 'Earth' },
    { id: 1, name: 'Mars' },
    { id: 2, name: 'Jupiter' },
    { id: 3, name: 'Saturn' },
    { id: 4, name: 'Zenith' }
  ]);
  
  const [routes, setRoutes] = useState<Route[]>([
    { from: 0, to: 1, cost: 10, failureProbability: 0.1 }
  ]);
  
  const [sourceId, setSourceId] = useState<number>(0);
  const [destinationId, setDestinationId] = useState<number>(4);

  const handlePlanetChange = (index: number, name: string) => {
    const updatedPlanets = [...planets];
    updatedPlanets[index] = { ...updatedPlanets[index], name };
    setPlanets(updatedPlanets);
  };

  const handleRouteChange = (index: number, field: keyof Route, value: any) => {
    const updatedRoutes = [...routes];
    updatedRoutes[index] = { ...updatedRoutes[index], [field]: value };
    setRoutes(updatedRoutes);
  };

  const addRoute = () => {
    setRoutes([...routes, { from: 0, to: 1, cost: 10, failureProbability: 0.1 }]);
  };

  const removeRoute = (index: number) => {
    const updatedRoutes = [...routes];
    updatedRoutes.splice(index, 1);
    setRoutes(updatedRoutes);
  };

  const handleNumPlanetsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Math.max(2, parseInt(e.target.value) || 0);
    setNumPlanets(num);
    
    // Adjust planets array
    if (num > planets.length) {
      // Add new planets
      const newPlanets = [...planets];
      for (let i = planets.length; i < num; i++) {
        newPlanets.push({ id: i, name: `Planet ${i}` });
      }
      setPlanets(newPlanets);
    } else if (num < planets.length) {
      // Remove planets and any routes using them
      const newPlanets = planets.slice(0, num);
      setPlanets(newPlanets);
      
      // Update routes to remove any involving deleted planets
      const newRoutes = routes.filter(
        route => route.from < num && route.to < num
      );
      setRoutes(newRoutes);
      
      // Update source and destination
      if (sourceId >= num) setSourceId(0);
      if (destinationId >= num) setDestinationId(num - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (sourceId === destinationId) {
      alert("Source and destination planets must be different.");
      return;
    }
    
    if (routes.length === 0) {
      alert("Please add at least one route.");
      return;
    }
    
    // Validate probability values
    for (const route of routes) {
      if (route.failureProbability < 0 || route.failureProbability >= 1) {
        alert("Failure probability must be between 0 and 1 (exclusive).");
        return;
      }
    }
    
    onSubmit(planets, routes, sourceId, destinationId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-space-cosmic-blue bg-opacity-30 p-6 rounded-lg backdrop-blur-sm border border-space-nebula-purple">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Network Configuration</h2>
        <Button
          type="button"
          variant="outline"
          onClick={useSampleData}
          className="bg-space-nebula-purple hover:bg-opacity-80 text-white border-space-route-teal"
        >
          Use Sample Data
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="numPlanets" className="text-space-star-yellow">Number of Planets</Label>
          <Input
            id="numPlanets"
            type="number"
            min="2"
            value={numPlanets}
            onChange={handleNumPlanetsChange}
            className="bg-space-deep-blue border-space-nebula-purple text-white"
          />
        </div>

        <div className="grid gap-4">
          <h3 className="text-lg font-semibold text-space-route-teal">Planet Names</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planets.map((planet, index) => (
              <div key={`planet-${index}`} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-space-cosmic-blue flex items-center justify-center text-white border border-space-route-teal">
                  {planet.id}
                </div>
                <Input
                  value={planet.name}
                  onChange={(e) => handlePlanetChange(index, e.target.value)}
                  placeholder={`Planet ${index} name`}
                  className="bg-space-deep-blue border-space-nebula-purple text-white"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-space-route-teal">Routes</h3>
            <Button
              type="button"
              variant="outline"
              onClick={addRoute}
              size="sm"
              className="bg-space-cosmic-blue hover:bg-opacity-80 text-white border-space-route-teal flex items-center gap-1"
            >
              <PlusCircle size={16} />
              Add Route
            </Button>
          </div>
          
          <div className="space-y-4">
            {routes.map((route, index) => (
              <Card key={`route-${index}`} className="bg-space-deep-blue border-space-nebula-purple">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <RouteIcon size={16} className="text-space-route-teal" />
                      <span className="text-white font-medium">Route {index + 1}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRoute(index)}
                      className="text-space-danger-red hover:text-white hover:bg-space-danger-red h-8"
                    >
                      <MinusCircle size={16} />
                      <span className="ml-1">Remove</span>
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <Label htmlFor={`route-from-${index}`} className="text-space-star-yellow">From</Label>
                      <select
                        id={`route-from-${index}`}
                        value={route.from}
                        onChange={(e) => handleRouteChange(index, 'from', parseInt(e.target.value))}
                        className="w-full h-9 px-3 py-2 rounded-md border border-space-nebula-purple bg-space-deep-blue text-white"
                      >
                        {planets.map((planet) => (
                          <option key={`from-${planet.id}`} value={planet.id}>
                            {planet.id}: {planet.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor={`route-to-${index}`} className="text-space-star-yellow">To</Label>
                      <select
                        id={`route-to-${index}`}
                        value={route.to}
                        onChange={(e) => handleRouteChange(index, 'to', parseInt(e.target.value))}
                        className="w-full h-9 px-3 py-2 rounded-md border border-space-nebula-purple bg-space-deep-blue text-white"
                      >
                        {planets.map((planet) => (
                          <option key={`to-${planet.id}`} value={planet.id}>
                            {planet.id}: {planet.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`route-cost-${index}`} className="text-space-star-yellow">Cost</Label>
                      <Input
                        id={`route-cost-${index}`}
                        type="number"
                        min="1"
                        value={route.cost}
                        onChange={(e) => handleRouteChange(index, 'cost', parseInt(e.target.value) || 0)}
                        className="bg-space-deep-blue border-space-nebula-purple text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`route-failure-${index}`} className="text-space-star-yellow">Failure Probability (0-0.99)</Label>
                      <Input
                        id={`route-failure-${index}`}
                        type="number"
                        min="0"
                        max="0.99"
                        step="0.01"
                        value={route.failureProbability}
                        onChange={(e) => handleRouteChange(index, 'failureProbability', parseFloat(e.target.value) || 0)}
                        className="bg-space-deep-blue border-space-nebula-purple text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sourceId" className="text-space-star-yellow">Source Planet</Label>
            <select
              id="sourceId"
              value={sourceId}
              onChange={(e) => setSourceId(parseInt(e.target.value))}
              className="w-full h-9 px-3 py-2 rounded-md border border-space-nebula-purple bg-space-deep-blue text-white"
            >
              {planets.map((planet) => (
                <option key={`source-${planet.id}`} value={planet.id}>
                  {planet.id}: {planet.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="destinationId" className="text-space-star-yellow">Destination Planet</Label>
            <select
              id="destinationId"
              value={destinationId}
              onChange={(e) => setDestinationId(parseInt(e.target.value))}
              className="w-full h-9 px-3 py-2 rounded-md border border-space-nebula-purple bg-space-deep-blue text-white"
            >
              {planets.map((planet) => (
                <option key={`dest-${planet.id}`} value={planet.id}>
                  {planet.id}: {planet.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            className="bg-space-route-teal hover:bg-opacity-80 text-space-deep-blue font-bold px-8 py-2 rounded-md text-lg"
          >
            Calculate Expected Route
          </Button>
        </div>
      </div>
    </form>
  );
};

export default InputForm;
