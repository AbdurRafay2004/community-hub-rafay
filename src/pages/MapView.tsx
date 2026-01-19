import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Search, Filter, Navigation, Users, Star } from "lucide-react";

const communities = [
  { id: 1, name: "Green Valley", members: 234, lat: 23.8103, lng: 90.4125, type: "Residential" },
  { id: 2, name: "Tech Hub District", members: 567, lat: 23.7925, lng: 90.4078, type: "Professional" },
  { id: 3, name: "University Heights", members: 890, lat: 23.8256, lng: 90.4189, type: "Educational" },
  { id: 4, name: "Riverside Community", members: 345, lat: 23.7789, lng: 90.3987, type: "Residential" },
  { id: 5, name: "Downtown Collective", members: 678, lat: 23.8045, lng: 90.4234, type: "Mixed" },
];

const MapView = () => {
  const [selectedCommunity, setSelectedCommunity] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selected = communities.find(c => c.id === selectedCommunity);

  return (
    <AppLayout>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search communities near you..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button size="icon" className="bg-primary">
              <Navigation className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative bg-muted/30">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Map Pins */}
          {communities.map((community, index) => (
            <button
              key={community.id}
              onClick={() => setSelectedCommunity(community.id)}
              className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200 ${
                selectedCommunity === community.id ? 'scale-125 z-20' : 'hover:scale-110 z-10'
              }`}
              style={{
                left: `${20 + (index * 15)}%`,
                top: `${30 + (index % 3) * 20}%`
              }}
            >
              <div className={`relative ${selectedCommunity === community.id ? 'animate-bounce' : ''}`}>
                <MapPin 
                  className={`h-10 w-10 drop-shadow-lg ${
                    selectedCommunity === community.id 
                      ? 'text-accent fill-accent' 
                      : 'text-primary fill-primary'
                  }`} 
                />
                <div className="absolute -top-1 -right-1 bg-background rounded-full px-1.5 py-0.5 text-xs font-medium shadow-sm border">
                  {community.members}
                </div>
              </div>
            </button>
          ))}

          {/* Selected Community Card */}
          {selected && (
            <div className="absolute bottom-4 left-4 right-4 animate-fade-in">
              <Card className="bg-background/95 backdrop-blur-md shadow-xl border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-2xl font-bold">
                      {selected.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{selected.name}</h3>
                        <Badge variant="secondary" className="text-xs">{selected.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {selected.members} members
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          4.8
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">View Community</Button>
                        <Button size="sm" variant="outline">Get Directions</Button>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedCommunity(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Map Legend */}
          <div className="absolute top-4 right-4">
            <Card className="bg-background/90 backdrop-blur-sm">
              <CardContent className="p-3">
                <p className="text-xs font-medium mb-2">Community Types</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span>Residential</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <span>Professional</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary" />
                    <span>Educational</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MapView;
