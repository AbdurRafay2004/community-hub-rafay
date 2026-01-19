import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bell, Search, Plus, Filter, Calendar, AlertTriangle, 
  MessageCircle, ThumbsUp, Share2, MoreHorizontal, Clock
} from "lucide-react";

const Notices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const notices = [
    {
      id: 1,
      title: "Community Meeting - January 15th",
      content: "Join us for our monthly community meeting to discuss upcoming projects, budget allocations, and community initiatives. Refreshments will be provided.",
      author: { name: "John Doe", avatar: "JD" },
      community: "Green Valley",
      time: "2 hours ago",
      type: "event",
      likes: 24,
      comments: 8
    },
    {
      id: 2,
      title: "Emergency: Water Supply Disruption",
      content: "Due to maintenance work, water supply will be disrupted from 10 AM to 4 PM tomorrow. Please store water accordingly.",
      author: { name: "Admin", avatar: "AD" },
      community: "Riverside",
      time: "5 hours ago",
      type: "emergency",
      likes: 45,
      comments: 12
    },
    {
      id: 3,
      title: "Park Cleanup Drive",
      content: "Volunteer for our weekend park cleanup initiative. Meet at the main park entrance at 8 AM. Gloves and bags will be provided.",
      author: { name: "Jane Smith", avatar: "JS" },
      community: "Green Valley",
      time: "1 day ago",
      type: "event",
      likes: 18,
      comments: 5
    },
    {
      id: 4,
      title: "New Recycling Guidelines",
      content: "Updated guidelines for waste segregation and recycling have been released. Please review and follow the new protocols.",
      author: { name: "Mike Johnson", avatar: "MJ" },
      community: "Downtown District",
      time: "2 days ago",
      type: "info",
      likes: 32,
      comments: 15
    },
  ];

  const filteredNotices = notices.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || n.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notices</h1>
            <p className="text-muted-foreground mt-1">Stay updated with community announcements</p>
          </div>
          <Link to="/create-notice">
            <Button variant="hero">
              <Plus className="w-4 h-4" />
              Post Notice
            </Button>
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-card"
            />
          </div>
          <div className="flex gap-2">
            {["all", "event", "emergency", "info"].map((type) => (
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

        {/* Notices List */}
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <div key={notice.id} className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden hover:shadow-medium transition-shadow">
              {/* Notice Type Banner */}
              {notice.type === "emergency" && (
                <Link to="/emergency-alerts" className="bg-destructive/10 border-b border-destructive/20 px-5 py-2 flex items-center gap-2 hover:bg-destructive/20 transition-colors">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">Emergency Notice - View All Alerts →</span>
                </Link>
              )}
              
              <div className="p-5">
                {/* Author */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      notice.type === 'emergency' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                    }`}>
                      {notice.author.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{notice.author.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        {notice.community}
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        {notice.time}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Content */}
                <h2 className="text-lg font-semibold text-foreground mb-2">{notice.title}</h2>
                <p className="text-muted-foreground mb-4">{notice.content}</p>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    {notice.likes}
                  </button>
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    {notice.comments}
                  </button>
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors ml-auto">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotices.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No notices found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Notices;
