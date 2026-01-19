import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  User, Settings, Edit2, Camera, MapPin, Mail, Phone, 
  Briefcase, GraduationCap, Heart, AlertTriangle, ArrowRight,
  Bell, MessageCircle, Users, Calendar
} from "lucide-react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("activity");

  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+880 1712-345678",
    location: "Gulshan, Dhaka",
    bio: "Community enthusiast and tech professional. Passionate about sustainable living and building stronger neighborhoods.",
    education: "BSc in Computer Science, BUET",
    work: "Software Engineer at Tech Corp",
    interests: ["Technology", "Environment", "Community Service", "Photography"],
    memberSince: "January 2023"
  };

  const activities = [
    { id: 1, type: "notice", text: "Posted a notice in Green Valley", time: "2 hours ago" },
    { id: 2, type: "community", text: "Joined Downtown District community", time: "1 day ago" },
    { id: 3, type: "message", text: "Started a conversation with Jane Smith", time: "2 days ago" },
    { id: 4, type: "notice", text: "Commented on 'Community Meeting' notice", time: "3 days ago" },
  ];

  const listings = [
    { id: 1, title: "Community Meeting - January 15th", community: "Green Valley", date: "Jan 15, 2024", status: "active" },
    { id: 2, title: "Park Cleanup Drive", community: "Green Valley", date: "Jan 20, 2024", status: "active" },
    { id: 3, title: "Tech Workshop", community: "Tech Hub", date: "Dec 28, 2023", status: "completed" },
  ];

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="relative">
          <div className="h-40 md:h-52 bg-gradient-hero">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          </div>
          <div className="absolute -bottom-16 left-6 md:left-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-hero rounded-2xl border-4 border-background flex items-center justify-center text-primary-foreground text-4xl font-bold shadow-medium">
                JD
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center shadow-soft hover:shadow-medium transition-shadow">
                <Camera className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="px-6 md:px-8 pt-20 pb-6 bg-card border-b border-border">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{user.name}</h1>
              <p className="text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                {user.location}
              </p>
              <p className="text-muted-foreground mt-2 max-w-xl">{user.bio}</p>
            </div>
            <div className="flex gap-3">
              <Link to="/edit-profile">
                <Button variant="outline">
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </Button>
              </Link>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            {[
              { label: "Communities", value: "12", icon: Users },
              { label: "Notices", value: "28", icon: Bell },
              { label: "Messages", value: "156", icon: MessageCircle },
              { label: "Events", value: "8", icon: Calendar },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 md:px-8 bg-card border-b border-border">
          <div className="flex gap-1 overflow-x-auto">
            {["activity", "listings", "about"].map((tab) => (
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
          {activeTab === "activity" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'notice' ? 'bg-primary/10' :
                    activity.type === 'community' ? 'bg-accent/10' : 'bg-secondary'
                  }`}>
                    {activity.type === 'notice' ? <Bell className="w-5 h-5 text-primary" /> :
                     activity.type === 'community' ? <Users className="w-5 h-5 text-accent" /> :
                     <MessageCircle className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground">{activity.text}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "listings" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">My Listings</h2>
                <Link to="/create-notice">
                  <Button variant="outline" size="sm">Create New</Button>
                </Link>
              </div>
              {listings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Bell className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground">{listing.community} • {listing.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      listing.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {listing.status}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "about" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Contact Information</h2>
                <div className="bg-card rounded-xl p-5 border border-border space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{user.location}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Background</h2>
                <div className="bg-card rounded-xl p-5 border border-border space-y-4">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{user.education}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{user.work}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest) => (
                    <span key={interest} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Safety & Emergency</h2>
                <Link to="/emergency-contacts">
                  <div className="bg-card rounded-xl p-5 border border-border hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Emergency Contacts</p>
                          <p className="text-sm text-muted-foreground">Manage your SOS contacts</p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
