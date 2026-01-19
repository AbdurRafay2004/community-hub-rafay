import { Link, useLocation } from "react-router-dom";
import { 
  Compass, 
  LayoutDashboard, 
  Users, 
  Bell, 
  MessageCircle, 
  User, 
  Settings, 
  LogOut,
  MapPin,
  Plus,
  AlertTriangle,
  ClipboardList,
  BellRing
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Communities", href: "/communities" },
  { icon: Bell, label: "Notices", href: "/notices" },
  { icon: ClipboardList, label: "Surveys", href: "/surveys" },
  { icon: MessageCircle, label: "Chat", href: "/chat" },
  { icon: MapPin, label: "Map", href: "/map" },
  { icon: AlertTriangle, label: "Emergency", href: "/emergency-alerts" },
  { icon: BellRing, label: "Notifications", href: "/notifications" },
  { icon: User, label: "Profile", href: "/profile" },
];

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const user = useQuery(api.users.viewer);
  const { signOut } = useAuthActions();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-card border-r border-border">
      {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-glow">
                <Compass className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">Community</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-border">
          <Link to="/create-community">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-secondary hover:bg-secondary/80 rounded-xl text-sm font-medium text-foreground transition-colors">
              <Plus className="w-5 h-5" />
              New Community
            </button>
          </Link>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center text-primary-foreground font-semibold">
              {user?.name?.charAt(0) ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.name ?? "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email ?? ""}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/profile" className="flex-1">
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </Link>
            <button
              onClick={() => signOut()}
              className="flex-1 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border z-50">
        <nav className="flex items-center justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
