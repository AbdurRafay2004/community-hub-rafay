import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Users, Bell, MessageCircle, MapPin, Settings, Share2, 
  ArrowLeft, Globe, Calendar, Clock, CheckCircle, UserPlus
} from "lucide-react";

const CommunityDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("notices");

  // Mock data
  const community = {
    id: 1,
    name: "Green Valley",
    description: "A peaceful residential community focused on sustainable living and eco-friendly practices. We organize regular events, share resources, and work together to make our neighborhood better.",
    members: 450,
    type: "public",
    location: "Gulshan, Dhaka",
    rules: [
      "Be respectful to all members",
      "No spam or promotional content",
      "Keep discussions relevant to the community",
      "Report any issues to moderators"
    ],
    admins: [
      { name: "John Doe", role: "Admin" },
      { name: "Jane Smith", role: "Moderator" }
    ]
  };

  const notices = [
    { id: 1, title: "Community Meeting - January 15th", content: "Join us for our monthly community meeting to discuss upcoming projects.", author: "John Doe", time: "2 hours ago", likes: 24 },
    { id: 2, title: "Park Cleanup Drive", content: "Volunteer for our weekend park cleanup initiative.", author: "Jane Smith", time: "1 day ago", likes: 18 },
    { id: 3, title: "New Recycling Guidelines", content: "Updated guidelines for waste segregation and recycling.", author: "John Doe", time: "3 days ago", likes: 45 },
  ];

  const members = [
    { id: 1, name: "John Doe", role: "Admin", joined: "Jan 2023" },
    { id: 2, name: "Jane Smith", role: "Moderator", joined: "Feb 2023" },
    { id: 3, name: "Mike Johnson", role: "Member", joined: "Mar 2023" },
    { id: 4, name: "Sarah Williams", role: "Member", joined: "Apr 2023" },
  ];

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        {/* Cover & Header */}
        <div className="relative">
          <div className="h-48 md:h-64 bg-gradient-hero">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          </div>
          <div className="absolute top-4 left-4">
            <Link to="/communities">
              <Button variant="glass" size="sm">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
          </div>
          <div className="absolute -bottom-16 left-6 md:left-8">
            <div className="w-32 h-32 bg-gradient-hero rounded-2xl border-4 border-background flex items-center justify-center text-primary-foreground text-4xl font-bold shadow-medium">
              {community.name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Community Info */}
        <div className="px-6 md:px-8 pt-20 pb-6 bg-card border-b border-border">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{community.name}</h1>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                  <Globe className="w-3 h-3" />
                  {community.type}
                </span>
              </div>
              <p className="text-muted-foreground flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {community.location}
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {community.members} members
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to={`/community-settings/${id}`}>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Link to="/join-community">
                <Button variant="hero">
                  <UserPlus className="w-4 h-4" />
                  Join Community
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 md:px-8 bg-card border-b border-border">
          <div className="flex gap-1 overflow-x-auto">
            {["notices", "members", "about"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8">
          {activeTab === "notices" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Community Notices</h2>
                <Link to="/create-notice">
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4" />
                    Post Notice
                  </Button>
                </Link>
              </div>
              {notices.map((notice) => (
                <div key={notice.id} className="bg-card rounded-2xl p-5 shadow-soft border border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                      {notice.author.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">{notice.author}</span>
                        <span className="text-xs text-muted-foreground">• {notice.time}</span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{notice.title}</h3>
                      <p className="text-muted-foreground">{notice.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "members" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Members ({community.members})</h2>
                <Link to={`/member-management/${id}`}>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                    Manage Members
                  </Button>
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {members.map((member) => (
                  <div key={member.id} className="bg-card rounded-xl p-4 shadow-soft border border-border flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">Joined {member.joined}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      member.role === 'Admin' ? 'bg-primary/10 text-primary' :
                      member.role === 'Moderator' ? 'bg-accent/10 text-accent' :
                      'bg-secondary text-muted-foreground'
                    }`}>
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">About</h2>
                <p className="text-muted-foreground">{community.description}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">Community Rules</h2>
                <ul className="space-y-2">
                  {community.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default CommunityDetail;
