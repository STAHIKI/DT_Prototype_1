import { 
  users, 
  digitalTwins, 
  iotDevices, 
  workflowTemplates, 
  projects,
  type User, 
  type InsertUser,
  type DigitalTwin,
  type InsertDigitalTwin,
  type IotDevice,
  type InsertIotDevice,
  type WorkflowTemplate,
  type InsertWorkflowTemplate,
  type Project,
  type InsertProject
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Digital Twins
  getDigitalTwins(userId: number): Promise<DigitalTwin[]>;
  getDigitalTwin(id: number): Promise<DigitalTwin | undefined>;
  createDigitalTwin(twin: InsertDigitalTwin): Promise<DigitalTwin>;
  updateDigitalTwin(id: number, updates: Partial<DigitalTwin>): Promise<DigitalTwin | undefined>;
  
  // IoT Devices
  getIotDevices(twinId?: number): Promise<IotDevice[]>;
  getIotDevice(id: number): Promise<IotDevice | undefined>;
  createIotDevice(device: InsertIotDevice): Promise<IotDevice>;
  updateIotDevice(id: number, updates: Partial<IotDevice>): Promise<IotDevice | undefined>;
  
  // Workflow Templates
  getWorkflowTemplates(category?: string): Promise<WorkflowTemplate[]>;
  getWorkflowTemplate(id: number): Promise<WorkflowTemplate | undefined>;
  createWorkflowTemplate(template: InsertWorkflowTemplate): Promise<WorkflowTemplate>;
  
  // Projects
  getProjects(userId: number): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private digitalTwins: Map<number, DigitalTwin>;
  private iotDevices: Map<number, IotDevice>;
  private workflowTemplates: Map<number, WorkflowTemplate>;
  private projects: Map<number, Project>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.digitalTwins = new Map();
    this.iotDevices = new Map();
    this.workflowTemplates = new Map();
    this.projects = new Map();
    this.currentId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample user
    const sampleUser: User = {
      id: 1,
      username: "john_smith",
      password: "hashed_password",
      email: "john.smith@example.com",
      role: "engineer",
      createdAt: new Date(),
    };
    this.users.set(1, sampleUser);

    // Sample digital twins
    const sampleTwins: DigitalTwin[] = [
      {
        id: 1,
        name: "Downtown Office Complex",
        description: "Modern office building with smart systems",
        type: "architecture",
        userId: 1,
        status: "active",
        properties: {
          dimensions: { width: 45, height: 75, depth: 30 },
          floors: 15,
          materials: ["glass", "steel", "concrete"]
        },
        modelPath: "/models/office-complex.glb",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Smart Factory Line",
        description: "Industrial manufacturing facility",
        type: "industrial",
        userId: 1,
        status: "active",
        properties: {
          dimensions: { width: 120, height: 8, depth: 80 },
          machinery: ["robots", "conveyors", "sensors"]
        },
        modelPath: "/models/factory.glb",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "Precision Agriculture Farm",
        description: "Smart farming with IoT sensors",
        type: "agriculture",
        userId: 1,
        status: "active",
        properties: {
          dimensions: { width: 500, height: 2, depth: 300 },
          crops: ["wheat", "corn", "soybeans"]
        },
        modelPath: "/models/farm.glb",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    sampleTwins.forEach(twin => this.digitalTwins.set(twin.id, twin));

    // Sample IoT devices
    const sampleDevices: IotDevice[] = [
      {
        id: 1,
        name: "Temperature Sensor #1",
        type: "temperature",
        location: "Building Floor 12",
        twinId: 1,
        status: "connected",
        lastValue: 23.5,
        unit: "°C",
        lastUpdate: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      },
      {
        id: 2,
        name: "Humidity Monitor",
        type: "humidity",
        location: "HVAC System",
        twinId: 1,
        status: "connected",
        lastValue: 45,
        unit: "%",
        lastUpdate: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
      },
      {
        id: 3,
        name: "Power Monitor",
        type: "power",
        location: "Main Electrical Panel",
        twinId: 1,
        status: "connected",
        lastValue: 2.3,
        unit: "kW",
        lastUpdate: new Date(Date.now() - 30 * 1000), // 30 seconds ago
      },
      {
        id: 4,
        name: "Vibration Sensor",
        type: "vibration",
        location: "Machine Tool #3",
        twinId: 2,
        status: "disconnected",
        lastValue: null,
        unit: "Hz",
        lastUpdate: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      }
    ];

    sampleDevices.forEach(device => this.iotDevices.set(device.id, device));

    // Sample workflow templates
    const sampleTemplates: WorkflowTemplate[] = [
      {
        id: 1,
        name: "Modern Office Complex",
        category: "Architecture",
        description: "Complete digital twin template for modern office buildings with HVAC, lighting, and security systems.",
        price: 0,
        rating: 4.9,
        downloads: 2300,
        imagePath: "/templates/office-complex.jpg",
        template: { nodes: [], connections: [] },
        createdAt: new Date(),
      },
      {
        id: 2,
        name: "Smart Factory Template",
        category: "Industrial",
        description: "Industrial manufacturing template with IoT sensors, predictive maintenance, and production optimization.",
        price: 49,
        rating: 4.7,
        downloads: 1800,
        imagePath: "/templates/smart-factory.jpg",
        template: { nodes: [], connections: [] },
        createdAt: new Date(),
      },
      {
        id: 3,
        name: "Precision Agriculture",
        category: "Agriculture",
        description: "Comprehensive farm management template with crop monitoring, irrigation control, and yield prediction.",
        price: 29,
        rating: 4.8,
        downloads: 956,
        imagePath: "/templates/agriculture.jpg",
        template: { nodes: [], connections: [] },
        createdAt: new Date(),
      }
    ];

    sampleTemplates.forEach(template => this.workflowTemplates.set(template.id, template));

    // Sample projects
    const sampleProjects: Project[] = [
      {
        id: 1,
        name: "Downtown Office Complex",
        type: "Architecture",
        userId: 1,
        twinId: 1,
        progress: 75,
        status: "active",
        lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: 2,
        name: "Smart Factory Line",
        type: "Industrial",
        userId: 1,
        twinId: 2,
        progress: 45,
        status: "active",
        lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        id: 3,
        name: "Precision Agriculture Farm",
        type: "Agriculture",
        userId: 1,
        twinId: 3,
        progress: 90,
        status: "active",
        lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      }
    ];

    sampleProjects.forEach(project => this.projects.set(project.id, project));

    this.currentId = 10; // Start IDs from 10 to avoid conflicts
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Digital Twin methods
  async getDigitalTwins(userId: number): Promise<DigitalTwin[]> {
    return Array.from(this.digitalTwins.values()).filter(twin => twin.userId === userId);
  }

  async getDigitalTwin(id: number): Promise<DigitalTwin | undefined> {
    return this.digitalTwins.get(id);
  }

  async createDigitalTwin(insertTwin: InsertDigitalTwin): Promise<DigitalTwin> {
    const id = this.currentId++;
    const twin: DigitalTwin = {
      ...insertTwin,
      id,
      status: "processing",
      modelPath: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.digitalTwins.set(id, twin);
    return twin;
  }

  async updateDigitalTwin(id: number, updates: Partial<DigitalTwin>): Promise<DigitalTwin | undefined> {
    const twin = this.digitalTwins.get(id);
    if (!twin) return undefined;
    
    const updatedTwin = { ...twin, ...updates, updatedAt: new Date() };
    this.digitalTwins.set(id, updatedTwin);
    return updatedTwin;
  }

  // IoT Device methods
  async getIotDevices(twinId?: number): Promise<IotDevice[]> {
    const devices = Array.from(this.iotDevices.values());
    return twinId ? devices.filter(device => device.twinId === twinId) : devices;
  }

  async getIotDevice(id: number): Promise<IotDevice | undefined> {
    return this.iotDevices.get(id);
  }

  async createIotDevice(insertDevice: InsertIotDevice): Promise<IotDevice> {
    const id = this.currentId++;
    const device: IotDevice = {
      ...insertDevice,
      id,
      status: "connected",
      lastValue: null,
      lastUpdate: new Date(),
    };
    this.iotDevices.set(id, device);
    return device;
  }

  async updateIotDevice(id: number, updates: Partial<IotDevice>): Promise<IotDevice | undefined> {
    const device = this.iotDevices.get(id);
    if (!device) return undefined;
    
    const updatedDevice = { ...device, ...updates, lastUpdate: new Date() };
    this.iotDevices.set(id, updatedDevice);
    return updatedDevice;
  }

  // Workflow Template methods
  async getWorkflowTemplates(category?: string): Promise<WorkflowTemplate[]> {
    const templates = Array.from(this.workflowTemplates.values());
    return category ? templates.filter(template => template.category === category) : templates;
  }

  async getWorkflowTemplate(id: number): Promise<WorkflowTemplate | undefined> {
    return this.workflowTemplates.get(id);
  }

  async createWorkflowTemplate(insertTemplate: InsertWorkflowTemplate): Promise<WorkflowTemplate> {
    const id = this.currentId++;
    const template: WorkflowTemplate = {
      ...insertTemplate,
      id,
      rating: 0,
      downloads: 0,
      imagePath: null,
      createdAt: new Date(),
    };
    this.workflowTemplates.set(id, template);
    return template;
  }

  // Project methods
  async getProjects(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.userId === userId);
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentId++;
    const project: Project = {
      ...insertProject,
      id,
      progress: 0,
      status: "active",
      lastUpdated: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...updates, lastUpdated: new Date() };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
}

export const storage = new MemStorage();
