import { useState } from 'react';
import { Play, Plus, Save, Download, Settings, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WorkflowNode {
  id: string;
  type: string;
  label: string;
  icon: string;
  position: { x: number; y: number };
  color: string;
}

interface Connection {
  from: string;
  to: string;
}

function NodeLibrary({ onNodeAdd }: { onNodeAdd: (type: string) => void }) {
  const nodeTypes = [
    { type: 'input', label: 'File Input', icon: '📁', color: 'bg-blue-500' },
    { type: 'ai', label: 'AI Processor', icon: '🧠', color: 'bg-purple-500' },
    { type: '3d', label: '3D Generator', icon: '🎲', color: 'bg-green-500' },
    { type: 'output', label: 'Output', icon: '📤', color: 'bg-orange-500' },
    { type: 'filter', label: 'Data Filter', icon: '🔍', color: 'bg-cyan-500' },
    { type: 'transform', label: 'Transform', icon: '⚙️', color: 'bg-yellow-500' },
  ];

  return (
    <div className="bg-navy-800 rounded-lg p-4 w-64">
      <h3 className="text-lg font-semibold text-navy-200 mb-4">Node Library</h3>
      <div className="space-y-2">
        {nodeTypes.map((nodeType) => (
          <div
            key={nodeType.type}
            className="flex items-center space-x-3 p-3 bg-navy-700 rounded-lg cursor-pointer hover:bg-navy-600 transition-colors"
            onClick={() => onNodeAdd(nodeType.type)}
          >
            <div className={cn("w-8 h-8 rounded flex items-center justify-center text-white text-sm", nodeType.color)}>
              {nodeType.icon}
            </div>
            <span className="text-navy-200 text-sm">{nodeType.label}</span>
            <Plus className="w-4 h-4 text-navy-400 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkflowNode({ node, onRemove }: { node: WorkflowNode; onRemove: (id: string) => void }) {
  return (
    <div
      className="absolute bg-navy-700 rounded-lg p-3 border border-navy-600 cursor-move min-w-[120px] group"
      style={{ left: node.position.x, top: node.position.y }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={cn("w-6 h-6 rounded flex items-center justify-center text-white text-xs", node.color)}>
            {node.icon}
          </div>
          <span className="text-navy-200 text-sm font-medium">{node.label}</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="opacity-0 group-hover:opacity-100 transition-opacity text-navy-400 hover:text-red-400 p-1 h-auto"
          onClick={() => onRemove(node.id)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
      
      {/* Input/Output ports */}
      <div className="flex justify-between mt-2">
        <div className="w-2 h-2 bg-navy-500 rounded-full -ml-1"></div>
        <div className="w-2 h-2 bg-navy-500 rounded-full -mr-1"></div>
      </div>
    </div>
  );
}

function DropZone({ onDrop, children }: { onDrop: (position: { x: number; y: number }) => void; children: React.ReactNode }) {
  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onDrop({ x, y });
  };

  return (
    <div 
      className="relative flex-1 bg-navy-900 rounded-lg border border-navy-600 overflow-hidden"
      onClick={handleClick}
    >
      {children}
    </div>
  );
}

export default function WorkflowCanvas() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [nextId, setNextId] = useState(1);

  const nodeTypeMap = {
    input: { label: 'File Input', icon: '📁', color: 'bg-blue-500' },
    ai: { label: 'AI Processor', icon: '🧠', color: 'bg-purple-500' },
    '3d': { label: '3D Generator', icon: '🎲', color: 'bg-green-500' },
    output: { label: 'Output', icon: '📤', color: 'bg-orange-500' },
    filter: { label: 'Data Filter', icon: '🔍', color: 'bg-cyan-500' },
    transform: { label: 'Transform', icon: '⚙️', color: 'bg-yellow-500' },
  };

  const handleNodeAdd = (type: string) => {
    const nodeInfo = nodeTypeMap[type as keyof typeof nodeTypeMap];
    if (!nodeInfo) return;

    const newNode: WorkflowNode = {
      id: `node-${nextId}`,
      type,
      label: nodeInfo.label,
      icon: nodeInfo.icon,
      position: { x: 50 + (nextId * 20), y: 50 + (nextId * 20) },
      color: nodeInfo.color
    };

    setNodes(prev => [...prev, newNode]);
    setNextId(prev => prev + 1);
  };

  const handleDropZoneDrop = (position: { x: number; y: number }) => {
    // For now, just add a default AI processor when clicking in empty space
    const newNode: WorkflowNode = {
      id: `node-${nextId}`,
      type: 'ai',
      label: 'AI Processor',
      icon: '🧠',
      position,
      color: 'bg-purple-500'
    };

    setNodes(prev => [...prev, newNode]);
    setNextId(prev => prev + 1);
  };

  const handleNodeRemove = (id: string) => {
    setNodes(prev => prev.filter(node => node.id !== id));
    setConnections(prev => prev.filter(conn => conn.from !== id && conn.to !== id));
  };

  const handleSave = () => {
    const workflow = { nodes, connections };
    console.log('Saving workflow:', workflow);
    // In a real app, this would send to the backend
  };

  const handleRun = () => {
    console.log('Running workflow with nodes:', nodes);
    // In a real app, this would execute the workflow
  };

  return (
    <div className="flex h-full space-x-4">
      {/* Node Library */}
      <NodeLibrary onNodeAdd={handleNodeAdd} />

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between bg-navy-800 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-navy-200">Workflow Canvas</h3>
            <span className="text-sm text-navy-400">({nodes.length} nodes)</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleSave}
              className="border-navy-600 text-navy-300"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button 
              size="sm" 
              onClick={handleRun}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <DropZone onDrop={handleDropZoneDrop}>
          <div className="w-full h-96 relative">
            {nodes.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-navy-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-navy-400" />
                  </div>
                  <p className="text-navy-400 text-sm">Click on nodes from the library to add them</p>
                  <p className="text-navy-500 text-xs mt-1">Or click anywhere in this area to add an AI processor</p>
                </div>
              </div>
            ) : (
              <>
                {nodes.map((node) => (
                  <WorkflowNode 
                    key={node.id} 
                    node={node} 
                    onRemove={handleNodeRemove}
                  />
                ))}
                
                {/* Connection lines would be rendered here */}
                {connections.map((connection, index) => (
                  <div key={index} className="absolute border-t-2 border-navy-500 pointer-events-none">
                    {/* SVG lines for connections would go here */}
                  </div>
                ))}
              </>
            )}
          </div>
        </DropZone>

        {/* Properties Panel */}
        {nodes.length > 0 && (
          <div className="bg-navy-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-navy-200 mb-3">Workflow Properties</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-navy-400">Total Nodes:</span>
                <span className="text-navy-200 ml-2">{nodes.length}</span>
              </div>
              <div>
                <span className="text-navy-400">Connections:</span>
                <span className="text-navy-200 ml-2">{connections.length}</span>
              </div>
              <div>
                <span className="text-navy-400">Status:</span>
                <span className="text-green-400 ml-2">Ready</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}