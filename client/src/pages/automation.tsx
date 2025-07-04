import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkflowCanvas from "@/components/WorkflowCanvas";

export default function Automation() {
  const [activeTab, setActiveTab] = useState("workflow");

  return (
    <>
      {/* Header */}
      <header className="bg-navy-800 border-b border-navy-600 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Automation</h1>
            <p className="text-gray-400 text-sm">Automate your digital twin creation process with prebuilt nodes and custom code editor</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-navy-700 border border-navy-600">
              <TabsTrigger 
                value="workflow" 
                className="data-[state=active]:bg-primary-blue data-[state=active]:text-white"
              >
                Workflow Builder
              </TabsTrigger>
              <TabsTrigger 
                value="custom" 
                className="data-[state=active]:bg-primary-blue data-[state=active]:text-white"
              >
                Custom Node Editor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="workflow" className="mt-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Drag and Drop Workflow Builder</h2>
                  <p className="text-gray-400 text-sm mb-6">
                    Use prebuilt nodes to automate your digital twin creation process. Drag and drop nodes to create your workflow.
                    Enhanced with industry-specific nodes: Architectural nodes for building code compliance and energy efficiency analysis;
                    Industrial nodes for supply chain optimization and predictive maintenance; Agricultural nodes for irrigation scheduling and
                    yield prediction. The node library is expanded to include smart city planning elements like traffic flow analysis and smart
                    grid management.
                  </p>
                </div>
                <WorkflowCanvas />
              </div>
            </TabsContent>

            <TabsContent value="custom" className="mt-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Custom Node Editor</h2>
                  <p className="text-gray-400 text-sm mb-6">
                    Define custom automation flows for industry-specific use cases. Create, edit, and manage your custom nodes.
                  </p>
                </div>
                
                <div className="bg-navy-700 rounded-xl p-6 border border-navy-600">
                  <div className="bg-navy-800 rounded-lg h-96 relative overflow-hidden border border-navy-600">
                    {/* Code Editor Placeholder */}
                    <div className="absolute inset-0 p-4 font-mono text-sm">
                      <div className="space-y-2">
                        <div className="text-green-400">// Custom Node: Industrial Sensor Processor</div>
                        <div className="text-blue-400">function <span className="text-yellow-400">processSensorData</span>(data) {'{'}
                        </div>
                        <div className="ml-4 text-gray-300">
                          <div>const filtered = data.filter(reading ={'>'} reading.quality {'>'} 0.8);</div>
                          <div>const normalized = filtered.map(r ={'>'} normalize(r));</div>
                          <div>return analyzePattern(normalized);</div>
                        </div>
                        <div className="text-blue-400">{'}'}</div>
                        <div className="mt-4 text-gray-500">// Export configuration</div>
                        <div className="text-purple-400">module.exports = {'{'}
                        </div>
                        <div className="ml-4 text-gray-300">
                          <div>name: "Industrial Sensor Processor",</div>
                          <div>category: "industrial",</div>
                          <div>inputs: ["sensor_data"],</div>
                          <div>outputs: ["processed_data"],</div>
                          <div>process: processSensorData</div>
                        </div>
                        <div className="text-purple-400">{'}'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
