import AppLayout from "@/components/AppLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Users, Bell, MessageCircle, MapPin, Plus, ArrowRight, 
  TrendingUp, Calendar, AlertTriangle, CheckCircle 
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    { label: "Communities", value: "12", icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Notices", value: "48", icon: Bell, color: "text-accent", bg: "bg-accent/10" },
    { label: "Messages", value: "156", icon: MessageCircle, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active Members", value: "2.4K", icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
  ];

  const recentNotices = [
    { id: 1, title: "Community Meeting - January 15th", community: "Green Valley", time: "2 hours ago", type: "event" },
    { id: 2, title: "Road Maintenance Notice", community: "Downtown District", time: "5 hours ago", type: "info" },
    { id: 3, title: "Emergency: Water Supply Disruption", community: "Riverside", time: "1 day ago", type: "emergency" },
  ];

  const myCommunities = [
    { id: 1, name: "Green Valley", members: 450, role: "Admin" },
    { id: 2, name: "Downtown District", members: 1200, role: "Member" },
    { id: 3, name: "Tech Hub Community", members: 320, role: "Moderator" },
  ];

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, John! Here's what's happening.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/create-notice">
              <Button variant="outline">
                <Bell className="w-4 h-4" />
                Post Notice
              </Button>
            </Link>
            <Link to="/create-community">
              <Button variant="hero">
                <Plus className="w-4 h-4" />
                New Community
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-2xl p-5 shadow-soft border border-border">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Notices */}
          <div className="lg:col-span-2 bg-card rounded-2xl shadow-soft border border-border">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Recent Notices</h2>
              <Link to="/notices" className="text-sm text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentNotices.map((notice) => (
                <div key={notice.id} className="p-5 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      notice.type === 'emergency' ? 'bg-destructive/10' : 
                      notice.type === 'event' ? 'bg-primary/10' : 'bg-accent/10'
                    }`}>
                      {notice.type === 'emergency' ? (
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                      ) : notice.type === 'event' ? (
                        <Calendar className="w-5 h-5 text-primary" />
                      ) : (
                        <Bell className="w-5 h-5 text-accent" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{notice.title}</h3>
                      <p className="text-sm text-muted-foreground">{notice.community} • {notice.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Communities */}
          <div className="bg-card rounded-2xl shadow-soft border border-border">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">My Communities</h2>
              <Link to="/communities" className="text-sm text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {myCommunities.map((community) => (
                <Link key={community.id} to={`/community/${community.id}`} className="block p-5 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center text-primary-foreground font-bold">
                      {community.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{community.name}</h3>
                      <p className="text-sm text-muted-foreground">{community.members} members</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      community.role === 'Admin' ? 'bg-primary/10 text-primary' : 
                      community.role === 'Moderator' ? 'bg-accent/10 text-accent' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {community.role}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="p-4">
              <Link to="/create-community">
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4" />
                  Create New Community
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-hero rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-primary-foreground">Need Help?</h3>
              <p className="text-primary-foreground/80 mt-1">Check out the emergency alert system for urgent community communications.</p>
            </div>
            <Link to="/emergency-alerts">
              <Button variant="glass" size="lg">
                <AlertTriangle className="w-5 h-5" />
                Emergency Alerts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
