import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/dashboard";
import TwinCreation from "@/pages/twin-creation";
import Automation from "@/pages/automation";
import IoTIntegration from "@/pages/iot-integration";
import LiveSimulation from "@/pages/live-simulation";
import Marketplace from "@/pages/marketplace";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/twins" component={TwinCreation} />
        <Route path="/automation" component={Automation} />
        <Route path="/iot" component={IoTIntegration} />
        <Route path="/simulation" component={LiveSimulation} />
        <Route path="/marketplace" component={Marketplace} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
