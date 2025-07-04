import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Thermometer, 
  Droplets, 
  Zap, 
  AlertTriangle,
  Plus,
  Wifi,
  WifiOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatTimeAgo, getStatusColor, getStatusBgColor } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

interface IoTDevice {
  id: number;
  name: string;
  type: string;
  location: string;
  status: string;
  lastValue: number | null;
  unit: string;
  lastUpdate: string;
}

export default function IoTIntegration() {
  const [realTimeData, setRealTimeData] = useState<Record<number, number>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: devices = [] } = useQuery<IoTDevice[]>({
    queryKey: ["/api/iot-devices"],
  });

  // WebSocket connection for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'iot_update') {
          setRealTimeData(prev => ({
            ...prev,
            [message.data.deviceId]: message.data.value
          }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    return () => socket.close();
  }, []);

  const deviceIcons = {
    temperature: Thermometer,
    humidity: Droplets,
    power: Zap,
    vibration: AlertTriangle,
  };

  const deviceColors = {
    temperature: "text-green-500 bg-green-500/20",
    humidity: "text-blue-500 bg-blue-500/20",
    power: "text-orange-500 bg-orange-500/20",
    vibration: "text-red-500 bg-red-500/20",
  };

  const addDeviceMutation = useMutation({
    mutationFn: async (deviceData: any) => {
      const response = await apiRequest('POST', '/api/iot-devices', deviceData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Device added successfully",
        description: "New IoT device has been connected",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/iot-devices"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add device",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddDevice = () => {
    // For demo purposes, add a random device
    const deviceTypes = ['temperature', 'humidity', 'power', 'vibration'];
    const randomType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    
    addDeviceMutation.mutate({
      name: `${randomType.charAt(0).toUpperCase() + randomType.slice(1)} Sensor #${devices.length + 1}`,
      type: randomType,
      location: `Location ${devices.length + 1}`,
      twinId: 1, // Default twin
      unit: randomType === 'temperature' ? '°C' : randomType === 'humidity' ? '%' : randomType === 'power' ? 'kW' : 'Hz'
    });
  };

  return (
    <>
      {/* Header */}
      <header className="bg-navy-800 border-b border-navy-600 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">IoT Integration</h1>
            <p className="text-gray-400 text-sm">Connect and manage IoT devices for real-time data streaming</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Device Management */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-navy-700 border-navy-600">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">Connected Devices</CardTitle>
                <Button 
                  onClick={handleAddDevice}
                  disabled={addDeviceMutation.isPending}
                  className="bg-primary-blue hover:bg-primary-blue/80 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Device
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {devices.map((device) => {
                    const IconComponent = deviceIcons[device.type as keyof typeof deviceIcons] || AlertTriangle;
                    const colorClass = deviceColors[device.type as keyof typeof deviceColors] || "text-gray-500 bg-gray-500/20";
                    const currentValue = realTimeData[device.id] ?? device.lastValue;
                    
                    return (
                      <div key={device.id} className="bg-navy-600 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-medium">{device.name}</h4>
                            <p className="text-gray-400 text-sm">{device.location}</p>
                            <div className="flex items-center space-x-2">
                              {device.status === 'connected' ? (
                                <Wifi className="w-4 h-4 text-green-400" />
                              ) : (
                                <WifiOff className="w-4 h-4 text-red-400" />
                              )}
                              <Badge variant="outline" className={`text-xs ${getStatusColor(device.status)}`}>
                                {device.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            {currentValue !== null ? `${currentValue.toFixed(1)}${device.unit}` : '--'}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {formatTimeAgo(new Date(device.lastUpdate))}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Data Stream Configuration */}
            <Card className="bg-navy-700 border-navy-600">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Data Stream Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="block text-sm text-gray-400 mb-2">Protocol</Label>
                    <Select defaultValue="mqtt">
                      <SelectTrigger className="bg-navy-600 border-navy-500 text-white focus:border-primary-blue">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-navy-600 border-navy-500">
                        <SelectItem value="mqtt">MQTT</SelectItem>
                        <SelectItem value="http">HTTP REST</SelectItem>
                        <SelectItem value="websocket">WebSocket</SelectItem>
                        <SelectItem value="coap">CoAP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="block text-sm text-gray-400 mb-2">Sampling Rate</Label>
                    <Select defaultValue="realtime">
                      <SelectTrigger className="bg-navy-600 border-navy-500 text-white focus:border-primary-blue">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-navy-600 border-navy-500">
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="30s">Every 30 seconds</SelectItem>
                        <SelectItem value="1m">Every minute</SelectItem>
                        <SelectItem value="5m">Every 5 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="block text-sm text-gray-400 mb-2">Broker URL</Label>
                    <Input
                      className="bg-navy-600 border-navy-500 text-white focus:border-primary-blue"
                      placeholder="mqtt://broker.example.com"
                      defaultValue="mqtt://localhost:1883"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm text-gray-400 mb-2">Topic Pattern</Label>
                    <Input
                      className="bg-navy-600 border-navy-500 text-white focus:border-primary-blue"
                      placeholder="/sensors/{deviceId}/data"
                      defaultValue="/sensors/+/data"
                    />
                  </div>
                </div>

                <Button className="mt-6 bg-primary-blue hover:bg-primary-blue/80 text-white">
                  Update Configuration
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Analytics */}
          <div>
            <Card className="bg-navy-700 border-navy-600">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Real-time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Live Chart Placeholder */}
                <div className="bg-navy-600 rounded-lg p-4 mb-6">
                  <h4 className="font-medium mb-3">Temperature Trends</h4>
                  <div className="h-32 bg-navy-500 rounded flex items-center justify-center">
                    <p className="text-gray-400 text-sm">Live Chart Visualization</p>
                  </div>
                </div>

                {/* Alerts */}
                <div className="space-y-3">
                  <h4 className="font-medium">Active Alerts</h4>
                  
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-red-400 text-sm font-medium">High Temperature</span>
                    </div>
                    <p className="text-gray-300 text-xs mt-1">Floor 12 sensor reading 28.5°C</p>
                  </div>

                  <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="text-yellow-400 text-sm font-medium">Device Offline</span>
                    </div>
                    <p className="text-gray-300 text-xs mt-1">Vibration sensor disconnected</p>
                  </div>
                </div>

                {/* Statistics */}
                <div className="mt-6 pt-6 border-t border-navy-600">
                  <h4 className="font-medium mb-3">Statistics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Devices:</span>
                      <span className="text-white">{devices.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Online:</span>
                      <span className="text-green-400">
                        {devices.filter(d => d.status === 'connected').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Data Points/sec:</span>
                      <span className="text-white">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Uptime:</span>
                      <span className="text-white">99.7%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
