import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  ChartPie, 
  Group, 
  Network, 
  Wifi, 
  PlayCircle, 
  Store,
  User
} from "lucide-react";

const navigation = [
  { name: "Dashboard", path: "/dashboard", icon: ChartPie },
  { name: "Twin Creation", path: "/twins", icon: Group },
  { name: "Automation", path: "/automation", icon: Network },
  { name: "IoT Integration", path: "/iot", icon: Wifi },
  { name: "Live Simulation", path: "/simulation", icon: PlayCircle },
  { name: "Marketplace", path: "/marketplace", icon: Store },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-navy-800 border-r border-navy-600 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-navy-600">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center">
            <Group className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold">Stahiki</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        <div className="space-y-2 px-4">
          {navigation.map((item) => {
            const isActive = location === item.path || (location === "/" && item.path === "/dashboard");
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.path}>
                <button
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "navigation-active text-primary-blue"
                      : "hover:bg-navy-700 text-gray-400"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-primary-blue" : "text-gray-400")} />
                  <span>{item.name}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-navy-600">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-blue rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium">John Smith</p>
            <p className="text-xs text-gray-400">Lead Engineer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
