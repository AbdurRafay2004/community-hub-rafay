import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Plus, MapPin, Lock, Globe, Filter } from "lucide-react";

const Communities = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const communities = [
    { id: 1, name: "Green Valley", description: "A peaceful residential community focused on sustainable living", members: 450, type: "public", location: "Dhaka", image: null },
    { id: 2, name: "Downtown District", description: "Urban community for city center residents and businesses", members: 1200, type: "public", location: "Dhaka", image: null },
    { id: 3, name: "Tech Hub Community", description: "For tech enthusiasts and professionals to connect and collaborate", members: 320, type: "restricted", location: "Chattogram", image: null },
    { id: 4, name: "Riverside Association", description: "Community for riverside area residents with shared amenities", members: 180, type: "private", location: "Sylhet", image: null },
    { id: 5, name: "University Campus", description: "Student and faculty community for university activities", members: 2500, type: "restricted", location: "Dhaka", image: null },
    { id: 6, name: "Business Park Network", description: "Professional network for business park tenants", members: 650, type: "public", location: "Dhaka", image: null },
  ];

  const filteredCommunities = communities.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || c.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Communities</h1>
            <p className="text-muted-foreground mt-1">Discover and join communities near you</p>
          </div>
          <Link to="/create-community">
            <Button variant="hero">
              <Plus className="w-4 h-4" />
              Create Community
            </Button>
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-card"
            />
          </div>
          <div className="flex gap-2">
            {["all", "public", "restricted", "private"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  filterType === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Communities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => (
            <Link
              key={community.id}
              to={`/community/${community.id}`}
              className="group bg-card rounded-2xl shadow-soft border border-border overflow-hidden hover:shadow-medium hover:border-primary/20 transition-all duration-300"
            >
              {/* Cover Image */}
              <div className="h-32 bg-gradient-hero relative">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
                <div className="absolute bottom-4 left-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    community.type === 'public' ? 'bg-primary-foreground/20 text-primary-foreground' :
                    community.type === 'restricted' ? 'bg-accent/80 text-accent-foreground' :
                    'bg-card/80 text-foreground'
                  }`}>
                    {community.type === 'public' ? <Globe className="w-3 h-3" /> :
                     community.type === 'private' ? <Lock className="w-3 h-3" /> :
                     <Filter className="w-3 h-3" />}
                    {community.type}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {community.name}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {community.location}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center text-primary-foreground font-bold shrink-0">
                    {community.name.charAt(0)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {community.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{community.members} members</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredCommunities.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No communities found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
            <Link to="/create-community">
              <Button variant="hero">
                <Plus className="w-4 h-4" />
                Create a Community
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Communities;
