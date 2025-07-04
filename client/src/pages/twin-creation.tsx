import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Cog, Sprout } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import FileUpload from "@/components/FileUpload";
import ModelViewer from "@/components/ModelViewer";

interface TwinProperties {
  name: string;
  description: string;
  type: 'architecture' | 'industrial' | 'agriculture';
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

export default function TwinCreation() {
  const [prompt, setPrompt] = useState("");
  const [twinProperties, setTwinProperties] = useState<TwinProperties>({
    name: "Downtown Office Complex",
    description: "",
    type: "architecture",
    dimensions: { width: 45, height: 75, depth: 30 }
  });
  const [activeModule, setActiveModule] = useState("architecture");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateTwinMutation = useMutation({
    mutationFn: async (data: { prompt: string; type: string }) => {
      const response = await apiRequest('POST', '/api/ai/generate-twin', data);
      return response.json();
    },
    onSuccess: (data) => {
      setTwinProperties({
        name: data.name,
        description: data.description,
        type: data.type,
        dimensions: data.properties.dimensions
      });
      setIsGenerating(false);
      toast({
        title: "Digital twin generated successfully",
        description: `Created ${data.name}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/digital-twins"] });
    },
    onError: (error: any) => {
      setIsGenerating(false);
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a description for your digital twin",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    generateTwinMutation.mutate({
      prompt,
      type: twinProperties.type
    });
  };

  const handleOptimize = () => {
    toast({
      title: "Optimization started",
      description: "AI is analyzing your twin for improvements",
    });
    // Implementation would call the optimize API
  };

  const handleFileAnalyzed = (analysis: any) => {
    console.log('File analysis:', analysis);
    if (analysis.extractedDimensions) {
      setTwinProperties(prev => ({
        ...prev,
        dimensions: analysis.extractedDimensions
      }));
    }
    toast({
      title: "File processed",
      description: `Detected: ${analysis.detectedType}`,
    });
  };

  const industryModules = [
    {
      id: "architecture",
      title: "Building Design",
      description: "Tools for architectural design and project management.",
      icon: Building,
    },
    {
      id: "industrial",
      title: "Process Optimization",
      description: "Features for optimizing industrial processes and monitoring equipment.",
      icon: Cog,
    },
    {
      id: "agriculture",
      title: "Crop Simulation",
      description: "Options for simulating crop growth and managing resources.",
      icon: Sprout,
    },
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-navy-800 border-b border-navy-600 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Twin Creation</h1>
            <p className="text-gray-400 text-sm">Create and design digital twins with AI assistance</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Smart AI Input Panel */}
            <Card className="bg-navy-700 border-navy-600">
              <CardHeader>
                <CardTitle>Smart AI Input Panel</CardTitle>
                <p className="text-gray-400 text-sm">
                  An intuitive, fluid, and powerful interface for digital twin creation that combines workflow automation with 3D modeling capabilities.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-lg font-medium mb-3 block">Prompt Box</Label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full bg-navy-600 border-navy-500 text-white placeholder-gray-400 resize-none focus:border-primary-blue"
                    rows={4}
                    placeholder="Enter text commands for AI to generate realistic twin models"
                  />
                  <Button 
                    onClick={handleGenerate}
                    disabled={generateTwinMutation.isPending || isGenerating}
                    className="mt-3 bg-primary-blue hover:bg-primary-blue/80 text-white"
                  >
                    {generateTwinMutation.isPending || isGenerating ? "Generating..." : "Generate"}
                  </Button>
                </div>

                <div>
                  <Label className="text-lg font-medium mb-3 block">Scan-to-Twin Interface</Label>
                  <FileUpload onFileAnalyzed={handleFileAnalyzed} />
                  <Button className="mt-3 bg-primary-blue hover:bg-primary-blue/80 text-white">
                    Convert
                  </Button>
                </div>

                <div>
                  <Label className="text-lg font-medium mb-3 block">Auto-Optimization Suggestions</Label>
                  <p className="text-gray-400 text-sm mb-3">AI dynamically enhances models based on use cases.</p>
                  <Button 
                    onClick={handleOptimize}
                    className="bg-primary-blue hover:bg-primary-blue/80 text-white"
                  >
                    Optimize
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Industry-Specific Modules */}
            <Card className="bg-navy-700 border-navy-600">
              <CardHeader>
                <CardTitle>Industry-Specific Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeModule} onValueChange={setActiveModule} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-navy-600">
                    <TabsTrigger value="architecture" className="data-[state=active]:bg-primary-blue">
                      Architecture
                    </TabsTrigger>
                    <TabsTrigger value="industrial" className="data-[state=active]:bg-primary-blue">
                      Industrial
                    </TabsTrigger>
                    <TabsTrigger value="agriculture" className="data-[state=active]:bg-primary-blue">
                      Agriculture
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-6">
                    <div className="grid grid-cols-1 gap-4">
                      {industryModules
                        .filter(module => module.id === activeModule)
                        .map((module) => (
                          <div key={module.id} className="bg-navy-600 rounded-lg p-4 hover-lift cursor-pointer">
                            <div className="flex items-center space-x-3 mb-2">
                              <module.icon className="w-5 h-5 text-primary-blue" />
                              <h4 className="font-medium">{module.title}</h4>
                            </div>
                            <p className="text-gray-400 text-sm">{module.description}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Model Preview */}
          <Card className="bg-navy-700 border-navy-600">
            <CardHeader>
              <CardTitle>Model Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <ModelViewer 
                modelType={twinProperties.type}
                isLoading={isGenerating || generateTwinMutation.isPending}
                className="h-96 mb-6"
              />

              {/* Twin Properties Panel */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Twin Properties</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm text-gray-400 mb-1">Name</Label>
                    <Input
                      value={twinProperties.name}
                      onChange={(e) => setTwinProperties(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-navy-600 border-navy-500 text-white focus:border-primary-blue"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm text-gray-400 mb-1">Type</Label>
                    <Select 
                      value={twinProperties.type} 
                      onValueChange={(value: any) => setTwinProperties(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="bg-navy-600 border-navy-500 text-white focus:border-primary-blue">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-navy-600 border-navy-500">
                        <SelectItem value="architecture">Architecture</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="agriculture">Agriculture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="block text-sm text-gray-400 mb-1">Width (m)</Label>
                    <Input
                      type="number"
                      value={twinProperties.dimensions.width}
                      onChange={(e) => setTwinProperties(prev => ({
                        ...prev,
                        dimensions: { ...prev.dimensions, width: Number(e.target.value) }
                      }))}
                      className="bg-navy-600 border-navy-500 text-white focus:border-primary-blue"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm text-gray-400 mb-1">Height (m)</Label>
                    <Input
                      type="number"
                      value={twinProperties.dimensions.height}
                      onChange={(e) => setTwinProperties(prev => ({
                        ...prev,
                        dimensions: { ...prev.dimensions, height: Number(e.target.value) }
                      }))}
                      className="bg-navy-600 border-navy-500 text-white focus:border-primary-blue"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm text-gray-400 mb-1">Depth (m)</Label>
                    <Input
                      type="number"
                      value={twinProperties.dimensions.depth}
                      onChange={(e) => setTwinProperties(prev => ({
                        ...prev,
                        dimensions: { ...prev.dimensions, depth: Number(e.target.value) }
                      }))}
                      className="bg-navy-600 border-navy-500 text-white focus:border-primary-blue"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
