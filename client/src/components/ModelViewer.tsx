import { useState } from "react";
import { Expand, RotateCcw, Camera, ZoomIn, ZoomOut, Home, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModelViewerProps {
  modelType?: 'architecture' | 'industrial' | 'agriculture';
  isLoading?: boolean;
  className?: string;
}

function BuildingModel() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg border-2 border-dashed border-navy-600">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-navy-700 rounded-lg flex items-center justify-center">
          <Home className="w-12 h-12 text-blue-400" />
        </div>
        <p className="text-navy-300 text-sm">Architecture Twin Model</p>
        <p className="text-navy-400 text-xs mt-1">3D visualization rendering...</p>
      </div>
    </div>
  );
}

function IndustrialModel() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-lg border-2 border-dashed border-navy-600">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-navy-700 rounded-lg flex items-center justify-center">
          <div className="grid grid-cols-2 gap-1">
            <div className="w-4 h-4 bg-orange-400 rounded"></div>
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <div className="w-4 h-4 bg-orange-400 rounded"></div>
          </div>
        </div>
        <p className="text-navy-300 text-sm">Industrial Twin Model</p>
        <p className="text-navy-400 text-xs mt-1">3D visualization rendering...</p>
      </div>
    </div>
  );
}

function AgricultureModel() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-lg border-2 border-dashed border-navy-600">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-navy-700 rounded-lg flex items-center justify-center">
          <div className="space-y-1">
            <div className="flex space-x-1">
              <div className="w-2 h-6 bg-green-400 rounded-full"></div>
              <div className="w-2 h-4 bg-green-500 rounded-full mt-2"></div>
              <div className="w-2 h-5 bg-green-400 rounded-full mt-1"></div>
            </div>
            <div className="w-12 h-2 bg-amber-600 rounded"></div>
          </div>
        </div>
        <p className="text-navy-300 text-sm">Agriculture Twin Model</p>
        <p className="text-navy-400 text-xs mt-1">3D visualization rendering...</p>
      </div>
    </div>
  );
}

export default function ModelViewer({ modelType = 'architecture', isLoading = false, className = "" }: ModelViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'perspective' | 'orthographic'>('perspective');

  const renderModel = () => {
    if (isLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-navy-300">Loading 3D model...</p>
          </div>
        </div>
      );
    }

    switch (modelType) {
      case 'industrial':
        return <IndustrialModel />;
      case 'agriculture':
        return <AgricultureModel />;
      default:
        return <BuildingModel />;
    }
  };

  return (
    <div className={cn("relative bg-navy-900 rounded-lg overflow-hidden", className)}>
      {/* 3D Viewport */}
      <div className="relative h-full">
        {renderModel()}
        
        {/* Overlay Controls */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setViewMode(viewMode === 'perspective' ? 'orthographic' : 'perspective')}
            className="bg-navy-800/80 hover:bg-navy-700 text-white"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-navy-800/80 hover:bg-navy-700 text-white"
          >
            <Expand className="w-4 h-4" />
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <Button
            size="sm"
            variant="secondary"
            className="bg-navy-800/80 hover:bg-navy-700 text-white"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-navy-800/80 hover:bg-navy-700 text-white"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-navy-800/80 hover:bg-navy-700 text-white"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-navy-800/80 hover:bg-navy-700 text-white"
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>

        {/* Status Bar */}
        <div className="absolute bottom-4 left-4 text-xs text-navy-400">
          {viewMode} | {modelType} twin
        </div>
      </div>
    </div>
  );
}