import { useState, useRef } from 'react';
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileAnalyzed?: (analysis: any) => void;
  acceptedTypes?: string[];
}

export default function FileUpload({ onFileAnalyzed, acceptedTypes = ['.dwg', '.step', '.iges', '.obj', '.stl', '.ply'] }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return acceptedTypes.includes(extension);
    });

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      
      // Simulate file analysis
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        if (onFileAnalyzed) {
          onFileAnalyzed({
            fileName: validFiles[0].name,
            fileType: validFiles[0].type,
            analysis: 'File analyzed successfully',
            extractedDimensions: { width: 100, height: 50, depth: 25 },
            detectedType: 'architecture',
            processingRecommendations: ['Optimize mesh resolution', 'Apply material textures']
          });
        }
      }, 2000);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragging 
            ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20" 
            : "border-navy-600 bg-navy-800/30 hover:border-navy-500"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className="w-12 h-12 text-navy-400" />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-navy-200 mb-2">
              Upload CAD Files or Engineering Drawings
            </h3>
            <p className="text-navy-400 text-sm mb-4">
              Drag and drop files here or click to browse
            </p>
            <p className="text-xs text-navy-500">
              Supported formats: {acceptedTypes.join(', ')}
            </p>
          </div>
          
          <Button 
            onClick={openFileDialog}
            variant="outline" 
            className="border-navy-600 text-navy-300 hover:bg-navy-700"
          >
            Browse Files
          </Button>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-navy-300">Uploaded Files</h4>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-navy-800 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <File className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-navy-200">{file.name}</p>
                  <p className="text-xs text-navy-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {isAnalyzing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-navy-400">Analyzing...</span>
                  </div>
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFile(index)}
                  className="text-navy-400 hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analysis Results */}
      {isAnalyzing && (
        <div className="bg-navy-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-navy-200">Analyzing Files with AI...</span>
          </div>
          <p className="text-xs text-navy-400">
            Extracting dimensions, identifying components, and generating optimization recommendations
          </p>
        </div>
      )}
    </div>
  );
}