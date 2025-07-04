import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Square, 
  Settings, 
  ZoomIn, 
  ZoomOut, 
  Home, 
  RotateCcw, 
  Eye, 
  Camera,
  AlertTriangle,
  Flame,
  TrendingUp,
  Wrench
} from "lucide-react";
import ModelViewer from "@/components/ModelViewer";
import { useToast } from "@/hooks/use-toast";

interface SimulationMetrics {
  productionRate: string;
  energyEfficiency: string;
  equipmentHealth: string;
  safetyScore: string;
}

export default function LiveSimulation() {
  const [selectedTwin, setSelectedTwin] = useState(2); // Default to Smart Factory
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState([1]);
  const [timeRange, setTimeRange] = useState("24h");
  const [environment, setEnvironment] = useState("normal");
  const [realTimeMetrics, setRealTimeMetrics] = useState<SimulationMetrics>({
    productionRate: "847 units/hr",
    energyEfficiency: "92%",
    equipmentHealth: "95%",
    safetyScore: "98%"
  });

  const { toast } = useToast();

  const { data: twin } = useQuery({
    queryKey: ["/api/digital-twins", selectedTwin],
    enabled: !!selectedTwin,
  });

  const { data: metrics } = useQuery<SimulationMetrics>({
    queryKey: ["/api/simulation", selectedTwin, "metrics"],
    enabled: !!selectedTwin && isSimulationRunning,
    refetchInterval: isSimulationRunning ? 2000 : false,
  });

  // WebSocket connection for real-time simulation updates
  useEffect(() => {
    if (!isSimulationRunning) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'simulation_update') {
          setRealTimeMetrics(prev => ({
            ...prev,
            [message.data.metric]: message.data.value
          }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    return () => socket.close();
  }, [isSimulationRunning]);

  const handleStartSimulation = () => {
    setIsSimulationRunning(true);
    toast({
      title: "Simulation started",
      description: "Real-time simulation is now running",
    });
  };

  const handleStopSimulation = () => {
    setIsSimulationRunning(false);
    toast({
      title: "Simulation stopped",
      description: "Real-time simulation has been stopped",
    });
  };

  const handleScenarioTest = (scenario: string) => {
    toast({
      title: `${scenario} scenario activated`,
      description: "Simulation environment has been updated",
    });
    setEnvironment(scenario.toLowerCase().replace(' ', '_'));
  };

  const currentMetrics = metrics || realTimeMetrics;

  const getProgressValue = (value: string): number => {
    const numMatch = value.match(/(\d+)/);
    return numMatch ? parseInt(numMatch[1]) : 0;
  };

  const scenarioButtons = [
    { 
      label: "Equipment Failure Test", 
      icon: AlertTriangle, 
      color: "bg-yellow-500 hover:bg-yellow-600",
      scenario: "Equipment Failure"
    },
    { 
      label: "Emergency Scenario", 
      icon: Flame, 
      color: "bg-orange-500 hover:bg-orange-600",
      scenario: "Emergency"
    },
    { 
      label: "Peak Load Test", 
      icon: TrendingUp, 
      color: "bg-blue-500 hover:bg-blue-600",
      scenario: "Peak Load"
    },
    { 
      label: "Maintenance Mode", 
      icon: Wrench, 
      color: "bg-purple-500 hover:bg-purple-600",
      scenario: "Maintenance"
    },
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-navy-800 border-b border-navy-600 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Live Simulation</h1>
            <p className="text-gray-400 text-sm">Run real-time simulations with live data integration</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          {/* 3D Simulation View */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-navy-700 border-navy-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">3D Simulation Environment</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleStartSimulation}
                      disabled={isSimulationRunning}
                      className="bg-green-500 hover:bg-green-600 text-white"
                      size="sm"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                    <Button
                      onClick={handleStopSimulation}
                      disabled={!isSimulationRunning}
                      className="bg-red-500 hover:bg-red-600 text-white"
                      size="sm"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-navy-500 text-gray-300 hover:bg-navy-600"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <ModelViewer 
                    modelType="industrial"
                    className="h-80"
                  />
                  
                  {/* Simulation Status Overlay */}
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-lg p-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        isSimulationRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                      }`}></div>
                      <span className={`text-sm font-medium ${
                        isSimulationRunning ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {isSimulationRunning ? 'Simulation Active' : 'Simulation Stopped'}
                      </span>
                    </div>
                  </div>

                  {/* Real-time Data Points Overlay */}
                  {isSimulationRunning && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 left-4 bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
                      <div className="absolute top-8 left-8 text-xs text-white bg-black bg-opacity-70 px-2 py-1 rounded">23.5°C</div>
                      
                      <div className="absolute top-16 left-32 bg-blue-500 w-3 h-3 rounded-full animate-pulse"></div>
                      <div className="absolute top-20 left-36 text-xs text-white bg-black bg-opacity-70 px-2 py-1 rounded">45% RH</div>
                      
                      <div className="absolute bottom-16 right-16 bg-orange-500 w-3 h-3 rounded-full animate-pulse"></div>
                      <div className="absolute bottom-20 right-20 text-xs text-white bg-black bg-opacity-70 px-2 py-1 rounded">2.3kW</div>
                    </div>
                  )}
                </div>

                {/* Simulation Controls */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div>
                    <Label className="block text-sm text-gray-400 mb-2">Simulation Speed</Label>
                    <Slider
                      value={simulationSpeed}
                      onValueChange={setSimulationSpeed}
                      max={5}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0.1x</span>
                      <span className="font-medium">{simulationSpeed[0]}x</span>
                      <span>5x</span>
                    </div>
                  </div>
                  <div>
                    <Label className="block text-sm text-gray-400 mb-2">Time Range</Label>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="bg-navy-600 border-navy-500 text-white focus:border-primary-blue">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-navy-600 border-navy-500">
                        <SelectItem value="1h">Last Hour</SelectItem>
                        <SelectItem value="24h">Last 24 Hours</SelectItem>
                        <SelectItem value="7d">Last Week</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="block text-sm text-gray-400 mb-2">Environment</Label>
                    <Select value={environment} onValueChange={setEnvironment}>
                      <SelectTrigger className="bg-navy-600 border-navy-500 text-white focus:border-primary-blue">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-navy-600 border-navy-500">
                        <SelectItem value="normal">Normal Conditions</SelectItem>
                        <SelectItem value="high_load">High Load</SelectItem>
                        <SelectItem value="emergency">Emergency Scenario</SelectItem>
                        <SelectItem value="maintenance">Maintenance Mode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Properties and Analytics */}
          <div className="space-y-6">
            {/* Twin Properties */}
            <Card className="bg-navy-700 border-navy-600">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Twin Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="block text-sm text-gray-400 mb-1">Name</Label>
                    <Input
                      value={twin?.name || "Smart Factory Line"}
                      className="bg-navy-600 border-navy-500 text-white focus:border-primary-blue"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <Label className="block text-sm text-gray-400 mb-1">Type</Label>
                    <Input
                      value={twin?.type || "Industrial Manufacturing"}
                      className="bg-navy-600 border-navy-500 text-white"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <Label className="block text-sm text-gray-400 mb-1">Status</Label>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        isSimulationRunning ? 'bg-green-500' : 'bg-gray-500'
                      }`}></div>
                      <span className={`text-sm ${
                        isSimulationRunning ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {isSimulationRunning ? 'Running' : 'Stopped'}
                      </span>
                    </div>
                  </div>
                </div>

                <hr className="border-navy-600 my-4" />

                <div className="space-y-3">
                  <h4 className="font-medium">Dimensions</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-400">Width:</span>
                      <span className="text-white ml-2">120m</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Height:</span>
                      <span className="text-white ml-2">8m</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Depth:</span>
                      <span className="text-white ml-2">80m</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Area:</span>
                      <span className="text-white ml-2">9,600m²</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Real-time Metrics */}
            <Card className="bg-navy-700 border-navy-600">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Real-time Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-navy-600 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Production Rate</span>
                      <span className="text-white font-medium">{currentMetrics.productionRate}</span>
                    </div>
                    <Progress value={getProgressValue(currentMetrics.productionRate) * 0.84} className="h-2" />
                  </div>

                  <div className="bg-navy-600 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Energy Efficiency</span>
                      <span className="text-white font-medium">{currentMetrics.energyEfficiency}</span>
                    </div>
                    <Progress 
                      value={getProgressValue(currentMetrics.energyEfficiency)} 
                      className="h-2"
                    />
                  </div>

                  <div className="bg-navy-600 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Equipment Health</span>
                      <span className="text-white font-medium">{currentMetrics.equipmentHealth}</span>
                    </div>
                    <Progress 
                      value={getProgressValue(currentMetrics.equipmentHealth)} 
                      className="h-2"
                    />
                  </div>

                  <div className="bg-navy-600 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Safety Score</span>
                      <span className="text-white font-medium">{currentMetrics.safetyScore}</span>
                    </div>
                    <Progress 
                      value={getProgressValue(currentMetrics.safetyScore)} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scenario Controls */}
            <Card className="bg-navy-700 border-navy-600">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Scenario Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scenarioButtons.map((button) => (
                    <Button
                      key={button.scenario}
                      onClick={() => handleScenarioTest(button.scenario)}
                      className={`w-full ${button.color} text-white font-medium transition-colors`}
                      size="sm"
                    >
                      <button.icon className="w-4 h-4 mr-2" />
                      {button.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
