# STAHIKI - Digital Twin Platform 🚀

---

## Introduction

STAHIKI is an innovative, AI-powered digital twin platform designed for creating, managing, and simulating digital replicas of real-world assets. Built with a modern tech stack including React, Vite, Node.js, and TypeScript, the platform supports multiple domains such as architecture, industrial, and agriculture. It features advanced AI integration for twin generation and file analysis, real-time simulation, IoT device management, and a workflow automation system for seamless process optimization. This repository (DT_Prototype_1) provides a prototype implementation that demonstrates the core capabilities of the digital twin ecosystem fileciteturn0file8.

---

## Features

- Digital Twin Generation   • Create digital twins from text prompts or CAD file uploads using AI-powered specifications generation.  • Supports multiple types: architecture (buildings), industrial (factories), and agriculture (farms) fileciteturn0file1.
- AI File Analysis &amp; Optimization   • Upload and analyze engineering drawings or 3D models with AI to extract dimensions and key specifications.  • Receive optimization suggestions to enhance digital twin performance fileciteturn0file6.
- IoT Device Integration   • Manage various sensor data from IoT devices (temperature, humidity, power, vibration, etc.).  • Real-time monitoring and status tracking with WebSocket connectivity fileciteturn0file5.
- Workflow Automation &amp; Marketplace   • Build automation workflows with a drag-and-drop interface, featuring pre-built nodes and custom code editors.  • Leverage a marketplace for prebuilt workflow templates tailored for different industries fileciteturn0file11.
- Real-time Simulation &amp; Visualization   • Simulate performance metrics such as production rates, energy efficiency, and equipment health.  • Interactive 3D model viewer powered by React Three Fiber for immersive visualization fileciteturn0file3.

Digital Twin Generation<br>
• Create digital twins from text prompts or CAD file uploads using AI-powered specifications generation.<br>
• Supports multiple types: architecture (buildings), industrial (factories), and agriculture (farms) fileciteturn0file1.

AI File Analysis &amp; Optimization<br>
• Upload and analyze engineering drawings or 3D models with AI to extract dimensions and key specifications.<br>
• Receive optimization suggestions to enhance digital twin performance fileciteturn0file6.

IoT Device Integration<br>
• Manage various sensor data from IoT devices (temperature, humidity, power, vibration, etc.).<br>
• Real-time monitoring and status tracking with WebSocket connectivity fileciteturn0file5.

Workflow Automation &amp; Marketplace<br>
• Build automation workflows with a drag-and-drop interface, featuring pre-built nodes and custom code editors.<br>
• Leverage a marketplace for prebuilt workflow templates tailored for different industries fileciteturn0file11.

Real-time Simulation &amp; Visualization<br>
• Simulate performance metrics such as production rates, energy efficiency, and equipment health.<br>
• Interactive 3D model viewer powered by React Three Fiber for immersive visualization fileciteturn0file3.

---

## Requirements

| Component | Version / Requirement | Details |
| --- | --- | --- |
| Node.js | ≥ 14.x | Server runtime environment |
| npm / Yarn | Latest stable release | Package manager |
| TypeScript | 4.x or above | Language for both frontend and backend |
| PostgreSQL | 10 or above | Production database (Drizzle ORM ensures type-safe queries) |
| Environment Variables | DATABASE_URL, GEMINI_API_KEY, etc. | Configuration for DB and AI API integration |

---

## Installation

1. Clone the Repository  Open your terminal and run:

```plaintext

```

git clone <a href="https://github.com/STAHIKI/DT_Prototype_1.git">https://github.com/STAHIKI/DT_Prototype_1.git</a>
cd DT_Prototype_1

1. Install Dependencies  Install backend and frontend dependencies. For example, using npm:

```plaintext

```

npm install

1. Set Up Environment Variables   Create a <code> .env </code> file in the root directory and configure the following variables:
    1. DATABASE_URL = your PostgreSQL connection string
    1. GEMINI_API_KEY = your Google Gemini API key
    1. PORT = desired port number for the backend server
1. Build the Client  The frontend is built with Vite and React. To build it for development:

Set Up Environment Variables<br>
Create a <code>.env</code> file in the root directory and configure the following variables:

Build the Client<br>
The frontend is built with Vite and React. To build it for development:

```plaintext

```

npm run dev

1. Start the Server  Run the server-side application (Express with ES modules):

```plaintext

```

npm run start

---

## Usage

- Digital Twin Creation:   Navigate to the twin creation page from the frontend. Enter a prompt or upload a CAD file to generate a digital twin. The system will call the AI API to generate specifications and update the UI in real-time fileciteturn0file10.
- IoT Device Management:   Use the provided API endpoints to register, update, and monitor IoT devices linked to your digital twins. Data streams enable live metrics and simulations.
- Workflow Builder:   Engage with the drag-and-drop workflow automation builder to chain together preconfigured nodes and custom code. The marketplace displays available templates to accelerate your setup fileciteturn0file12.
- 3D Visualization:   Utilize the model viewer component to interact with generated digital twins in a 3D space, enhancing the simulation experience.

Digital Twin Creation:<br>
Navigate to the twin creation page from the frontend. Enter a prompt or upload a CAD file to generate a digital twin. The system will call the AI API to generate specifications and update the UI in real-time fileciteturn0file10.

IoT Device Management:<br>
Use the provided API endpoints to register, update, and monitor IoT devices linked to your digital twins. Data streams enable live metrics and simulations.

Workflow Builder:<br>
Engage with the drag-and-drop workflow automation builder to chain together preconfigured nodes and custom code. The marketplace displays available templates to accelerate your setup fileciteturn0file12.

3D Visualization:<br>
Utilize the model viewer component to interact with generated digital twins in a 3D space, enhancing the simulation experience.

---

## Configuration

STAHIKI uses a combination of configuration files and environment variables to adjust behavior across development and production. Key configurations include:

- Environment Variables (.env):
    - DATABASE_URL – PostgreSQL connection details.
    - GEMINI_API_KEY – Your API key for Google Gemini (used in AI twin generation and file analysis).
    - PORT – The port for the Express server.
- Client Configuration:   The frontend configuration is managed via Vite. Update the <code> vite.config.js </code> if necessary for different environments or custom setups.
- Tailwind CSS:   Customize styling by modifying <code> tailwind.config.js </code> and <code> postcss.config.js </code> files to adjust themes and color schemes.
- API Endpoints:   The Express server defines endpoints for AI generation, IoT devices, digital twins, and workflow templates. Adjust these in the server code if custom behavior is desired fileciteturn0file0.

Environment Variables (.env):

Client Configuration:<br>
The frontend configuration is managed via Vite. Update the <code>vite.config.js</code> if necessary for different environments or custom setups.

Tailwind CSS:<br>
Customize styling by modifying <code>tailwind.config.js</code> and <code>postcss.config.js</code> files to adjust themes and color schemes.

API Endpoints:<br>
The Express server defines endpoints for AI generation, IoT devices, digital twins, and workflow templates. Adjust these in the server code if custom behavior is desired fileciteturn0file0.

---

## Contributing

Contributions are welcome and greatly appreciated! To get started:

1. Fork the Repository:   Create your own fork of the repository to begin work on new features or bug fixes.
1. Create a Feature Branch:   Branch off from <code> main </code> for your contributions:

Fork the Repository:<br>
Create your own fork of the repository to begin work on new features or bug fixes.

Create a Feature Branch:<br>
Branch off from <code>main</code> for your contributions:

```plaintext

```

git checkout -b feature/your-feature-name

1. Develop and Test:   Write clean, well-documented code in TypeScript. Ensure that you update any related documentation and tests.
1. Submit a Pull Request:   Once your changes are complete, submit a pull request. Please include a detailed description of your changes and why they benefit the project.
1. Follow Code Style:   Maintain consistent code formatting and organization. Use existing patterns and conventions as a guide.
1. Issue Reporting:   If you have suggestions or encounter bugs, please open an issue with detailed reproduction steps. All issues and feedback help improve the platform’s quality.

Develop and Test:<br>
Write clean, well-documented code in TypeScript. Ensure that you update any related documentation and tests.

Submit a Pull Request:<br>
Once your changes are complete, submit a pull request. Please include a detailed description of your changes and why they benefit the project.

Follow Code Style:<br>
Maintain consistent code formatting and organization. Use existing patterns and conventions as a guide.

Issue Reporting:<br>
If you have suggestions or encounter bugs, please open an issue with detailed reproduction steps. All issues and feedback help improve the platform’s quality.

Thank you for making STAHIKI better—happy coding! 🎉

---

Enjoy building the future of digital twin technology with STAHIKI!
