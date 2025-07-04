import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ListEnd, 
  Grid3X3, 
  ChevronLeft, 
  ChevronRight,
  Star,
  Download
} from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  rating: number;
  downloads: number;
  imagePath: string | null;
}

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [complexityFilter, setComplexityFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState("grid");

  const { toast } = useToast();

  const { data: templates = [] } = useQuery<Template[]>({
    queryKey: ["/api/workflow-templates", selectedCategory === "all" ? undefined : selectedCategory],
  });

  const categories = [
    { id: "all", name: "All Templates" },
    { id: "Architecture", name: "Architecture" },
    { id: "Industrial", name: "Industrial" },
    { id: "Agriculture", name: "Agriculture" },
    { id: "Urban Planning", name: "Urban Planning" },
    { id: "Smart Cities", name: "Smart Cities" },
  ];

  const handleUseTemplate = (template: Template) => {
    if (template.price > 0) {
      toast({
        title: "Purchase Required",
        description: `This template costs $${template.price}. Redirecting to payment...`,
      });
    } else {
      toast({
        title: "Template Applied",
        description: `${template.name} has been added to your workspace`,
      });
    }
  };

  const filteredTemplates = templates.filter(template => {
    if (priceFilter === "free" && template.price > 0) return false;
    if (priceFilter === "1-50" && (template.price < 1 || template.price > 50)) return false;
    if (priceFilter === "50+" && template.price < 50) return false;
    if (ratingFilter === "4+" && template.rating < 4) return false;
    if (ratingFilter === "3+" && template.rating < 3) return false;
    return true;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.id - a.id;
      case "rating":
        return b.rating - a.rating;
      case "price":
        return a.price - b.price;
      default: // popularity
        return b.downloads - a.downloads;
    }
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
      />
    ));
  };

  return (
    <>
      {/* Header */}
      <header className="bg-navy-800 border-b border-navy-600 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Marketplace</h1>
            <p className="text-gray-400 text-sm">Explore templates and digital twin components</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <Card className="bg-navy-700 border-navy-600">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category.id
                        ? "bg-primary-blue text-white"
                        : "hover:bg-navy-600 text-gray-300"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <hr className="border-navy-600 my-6" />

              <h4 className="font-medium mb-3">Filters</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Price Range</label>
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger className="bg-navy-600 border-navy-500 text-white text-sm focus:border-primary-blue">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-600 border-navy-500">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="1-50">$1 - $50</SelectItem>
                      <SelectItem value="50+">$50+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Complexity</label>
                  <Select value={complexityFilter} onValueChange={setComplexityFilter}>
                    <SelectTrigger className="bg-navy-600 border-navy-500 text-white text-sm focus:border-primary-blue">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-600 border-navy-500">
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Rating</label>
                  <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger className="bg-navy-600 border-navy-500 text-white text-sm focus:border-primary-blue">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-600 border-navy-500">
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="4+">4+ Stars</SelectItem>
                      <SelectItem value="3+">3+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Templates Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Digital Twin Templates</h2>
                <p className="text-gray-400">Explore pre-built templates to accelerate your development</p>
              </div>
              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-navy-600 border-navy-500 text-white text-sm focus:border-primary-blue w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-navy-600 border-navy-500">
                    <SelectItem value="popularity">Sort by Popularity</SelectItem>
                    <SelectItem value="newest">Sort by Newest</SelectItem>
                    <SelectItem value="rating">Sort by Rating</SelectItem>
                    <SelectItem value="price">Sort by Price</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-primary-blue" : "border-navy-500 text-gray-300 hover:bg-navy-600"}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-primary-blue" : "border-navy-500 text-gray-300 hover:bg-navy-600"}
                  >
                    <ListEnd className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {sortedTemplates.map((template) => (
                <Card key={template.id} className="bg-navy-700 border-navy-600 overflow-hidden hover-lift">
                  {viewMode === "grid" && (
                    <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <div className="text-6xl opacity-20">
                        {template.category === "Architecture" && "🏢"}
                        {template.category === "Industrial" && "🏭"}
                        {template.category === "Agriculture" && "🌾"}
                        {template.category === "Urban Planning" && "🏙️"}
                        {template.category === "Smart Cities" && "🌐"}
                      </div>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{template.name}</h3>
                        <p className="text-gray-400 text-sm">{template.category}</p>
                      </div>
                      <Badge className={template.price === 0 ? "bg-green-500 text-white" : "bg-primary-blue text-white"}>
                        {template.price === 0 ? "FREE" : `$${template.price}`}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{template.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {renderStars(template.rating)}
                        </div>
                        <span className="text-gray-400 text-xs ml-2">
                          {template.rating.toFixed(1)} ({formatNumber(Math.floor(template.rating * 25))})
                        </span>
                      </div>
                      <div className="flex items-center text-gray-400 text-xs">
                        <Download className="w-3 h-3 mr-1" />
                        {formatNumber(template.downloads)} downloads
                      </div>
                    </div>
                    <Button
                      onClick={() => handleUseTemplate(template)}
                      className="w-full bg-primary-blue hover:bg-primary-blue/80 text-white font-medium transition-colors"
                    >
                      {template.price === 0 ? "Use Template" : "Purchase & Use"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-navy-500 text-gray-300 hover:bg-navy-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  className="bg-primary-blue text-white"
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-navy-500 text-gray-300 hover:bg-navy-600"
                >
                  2
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-navy-500 text-gray-300 hover:bg-navy-600"
                >
                  3
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-navy-500 text-gray-300 hover:bg-navy-600"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
