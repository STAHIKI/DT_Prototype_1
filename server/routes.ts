import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import multer from "multer";
import { storage } from "./storage";
import { 
  generateDigitalTwin, 
  optimizeDigitalTwin, 
  analyzeUploadedFile 
} from "./services/openai";
import { 
  insertDigitalTwinSchema, 
  insertIotDeviceSchema, 
  insertProjectSchema 
} from "@shared/schema";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    // Send initial connection message
    ws.send(JSON.stringify({ type: 'connected', message: 'Connected to digital twin platform' }));
    
    // Handle incoming messages
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log('Received WebSocket message:', message);
        
        // Echo back for now - implement real-time features as needed
        ws.send(JSON.stringify({ type: 'echo', data: message }));
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Simulate real-time IoT data updates
  setInterval(() => {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(JSON.stringify({
          type: 'iot_update',
          data: {
            deviceId: Math.floor(Math.random() * 4) + 1,
            value: Math.random() * 100,
            timestamp: new Date().toISOString()
          }
        }));
      }
    });
  }, 5000); // Every 5 seconds

  // Dashboard API
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const digitalTwins = await storage.getDigitalTwins(1); // Default user
      const iotDevices = await storage.getIotDevices();
      const projects = await storage.getProjects(1);
      
      const connectedDevices = iotDevices.filter(d => d.status === 'connected').length;
      const totalDataPoints = iotDevices.reduce((sum, device) => sum + (device.lastValue ? 1 : 0), 0) * 1000; // Simulate data points
      
      res.json({
        activeTwins: digitalTwins.length,
        activeTwinsGrowth: "+12%",
        dataPoints: `${(totalDataPoints / 1000).toFixed(1)}M`,
        dataPointsGrowth: "+8%",
        processingTime: "3.2h",
        processingTimeChange: "-24%",
        accuracyRate: "98.7%",
        accuracyRateChange: "+1.2%"
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects(1); // Default user
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Digital Twins API
  app.get("/api/digital-twins", async (req, res) => {
    try {
      const twins = await storage.getDigitalTwins(1); // Default user
      res.json(twins);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/digital-twins/:id", async (req, res) => {
    try {
      const twin = await storage.getDigitalTwin(parseInt(req.params.id));
      if (!twin) {
        return res.status(404).json({ error: "Digital twin not found" });
      }
      res.json(twin);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/digital-twins", async (req, res) => {
    try {
      const validatedData = insertDigitalTwinSchema.parse(req.body);
      const twin = await storage.createDigitalTwin(validatedData);
      res.status(201).json(twin);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/digital-twins/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const twin = await storage.updateDigitalTwin(id, req.body);
      if (!twin) {
        return res.status(404).json({ error: "Digital twin not found" });
      }
      res.json(twin);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // AI Generation API
  app.post("/api/ai/generate-twin", async (req, res) => {
    try {
      const { prompt, type, specifications } = req.body;
      
      if (!prompt || !type) {
        return res.status(400).json({ error: "Prompt and type are required" });
      }

      const result = await generateDigitalTwin({ prompt, type, specifications });
      
      // Create the digital twin in storage
      const twin = await storage.createDigitalTwin({
        name: result.name,
        description: result.description,
        type: result.type,
        userId: 1, // Default user
        properties: result.properties
      });

      res.json({ ...result, id: twin.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/optimize-twin/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { useCase } = req.body;
      
      const result = await optimizeDigitalTwin(id, useCase);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // File Upload API
  app.post("/api/upload/analyze", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const analysis = await analyzeUploadedFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      res.json(analysis);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // IoT Devices API
  app.get("/api/iot-devices", async (req, res) => {
    try {
      const twinId = req.query.twinId ? parseInt(req.query.twinId as string) : undefined;
      const devices = await storage.getIotDevices(twinId);
      res.json(devices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/iot-devices", async (req, res) => {
    try {
      const validatedData = insertIotDeviceSchema.parse(req.body);
      const device = await storage.createIotDevice(validatedData);
      res.status(201).json(device);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/iot-devices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const device = await storage.updateIotDevice(id, req.body);
      if (!device) {
        return res.status(404).json({ error: "IoT device not found" });
      }
      res.json(device);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Workflow Templates API
  app.get("/api/workflow-templates", async (req, res) => {
    try {
      const category = req.query.category as string;
      const templates = await storage.getWorkflowTemplates(category);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/workflow-templates/:id", async (req, res) => {
    try {
      const template = await storage.getWorkflowTemplate(parseInt(req.params.id));
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Simulation API
  app.get("/api/simulation/:twinId/metrics", async (req, res) => {
    try {
      const twinId = parseInt(req.params.twinId);
      const twin = await storage.getDigitalTwin(twinId);
      
      if (!twin) {
        return res.status(404).json({ error: "Digital twin not found" });
      }

      // Simulate real-time metrics
      const metrics = {
        productionRate: `${Math.floor(Math.random() * 200) + 700} units/hr`,
        energyEfficiency: `${Math.floor(Math.random() * 10) + 85}%`,
        equipmentHealth: `${Math.floor(Math.random() * 10) + 90}%`,
        safetyScore: `${Math.floor(Math.random() * 5) + 95}%`,
      };

      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
