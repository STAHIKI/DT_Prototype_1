import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Database, 
  Clock, 
  Target,
  Plus,
  Upload,
  Bot,
  Link,
  Bell,
  Settings
} from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

interface DashboardStats {
  activeTwins: number;
  activeTwinsGrowth: string;
  dataPoints: string;
  dataPointsGrowth: string;
  processingTime: string;
  processingTimeChange: string;
  accuracyRate: string;
  accuracyRateChange: string;
}

export default function Dashboard() {
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  const statCards = [
    {
      title: "Active Twins",
      value: stats?.activeTwins || 127,
      growth: stats?.activeTwinsGrowth || "+12%",
      icon: Target,
      iconColor: "text-primary-blue",
      bgColor: "bg-primary-blue/20",
      isPositive: true,
    },
    {
      title: "Data Points",
      value: stats?.dataPoints || "2.4M",
      growth: stats?.dataPointsGrowth || "+8%",
      icon: Database,
      iconColor: "text-green-500",
      bgColor: "bg-green-500/20",
      isPositive: true,
    },
    {
      title: "Processing Time",
      value: stats?.processingTime || "3.2h",
      growth: stats?.processingTimeChange || "-24%",
      icon: Clock,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-500/20",
      isPositive: false,
    },
    {
      title: "Accuracy Rate",
      value: stats?.accuracyRate || "98.7%",
      growth: stats?.accuracyRateChange || "+1.2%",
      icon: Target,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-500/20",
      isPositive: true,
    },
  ];

  const quickActions = [
    { label: "Create New Twin", icon: Plus, color: "bg-primary-blue hover:bg-primary-blue/80" },
    { label: "Upload CAD Files", icon: Upload, color: "bg-navy-600 hover:bg-navy-500" },
    { label: "AI Generation", icon: Bot, color: "bg-navy-600 hover:bg-navy-500" },
    { label: "Connect IoT Device", icon: Link, color: "bg-navy-600 hover:bg-navy-500" },
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-navy-800 border-b border-navy-600 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-400 text-sm">Monitor and manage your digital twins</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="bg-navy-700 border-navy-600 hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  {stat.isPositive ? (
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                  )}
                  <span className={stat.isPositive ? "text-green-400" : "text-red-400"}>
                    {stat.growth}
                  </span>
                  <span className="text-gray-400 ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Projects & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-navy-700 border-navy-600">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects?.map((project: any) => (
                    <div key={project.id} className="flex items-center space-x-4 p-4 bg-navy-600 rounded-lg hover-lift cursor-pointer">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">
                          {project.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-gray-400 text-sm">{project.type}</p>
                        <div className="flex items-center mt-2">
                          <div className="w-full bg-navy-500 rounded-full h-2">
                            <div 
                              className="bg-primary-blue h-2 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-400 ml-3">{project.progress}%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">
                          {formatTimeAgo(new Date(project.lastUpdated))}
                        </p>
                        <div className={`w-2 h-2 rounded-full ${
                          project.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-navy-700 border-navy-600">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      className={`w-full ${action.color} text-white py-3 px-4 font-medium transition-colors`}
                    >
                      <action.icon className="w-5 h-5 mr-2" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
