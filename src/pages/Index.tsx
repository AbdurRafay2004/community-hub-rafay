import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, Users, Bell, MapPin, MessageCircle, Shield, ArrowRight, CheckCircle } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Users,
      title: "Community Management",
      description: "Create and manage communities with customizable profiles and settings"
    },
    {
      icon: Bell,
      title: "Smart Notices",
      description: "Post and view community notices with real-time updates"
    },
    {
      icon: MapPin,
      title: "Location-Based",
      description: "Discover communities near you with integrated map visualization"
    },
    {
      icon: MessageCircle,
      title: "Instant Chat",
      description: "Connect with community members through secure messaging"
    },
    {
      icon: Shield,
      title: "Emergency Alerts",
      description: "Rapid notification system for community-wide emergencies"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-glow">
              <Compass className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Community Compass</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/communities" className="text-muted-foreground hover:text-foreground transition-colors">Communities</Link>
            <Link to="/notices" className="text-muted-foreground hover:text-foreground transition-colors">Notices</Link>
            <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">Login</Link>
            <Link to="/register">
              <Button variant="hero" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-warm" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
        
        <div className="container mx-auto relative">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <CheckCircle className="w-4 h-4" />
              Empowering Communities Together
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Your <span className="text-gradient">Community</span>,<br />
              Connected & Organized
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Streamline community management, enhance communication, and build stronger 
              neighborhoods with Community Compass.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Start Your Community
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/communities">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Explore Communities
                </Button>
              </Link>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl shadow-medium border border-border overflow-hidden">
              <div className="bg-secondary/50 px-4 py-3 flex items-center gap-2 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
              </div>
              <div className="p-6 bg-gradient-card">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1 space-y-4">
                    <div className="h-12 bg-secondary rounded-lg animate-pulse" />
                    <div className="h-32 bg-secondary rounded-lg" />
                    <div className="h-24 bg-secondary rounded-lg" />
                  </div>
                  <div className="col-span-2 space-y-4">
                    <div className="h-40 bg-secondary rounded-lg" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 bg-secondary rounded-lg" />
                      <div className="h-24 bg-secondary rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to bring communities together
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const featureLinks: { [key: string]: string } = {
                "Community Management": "/communities",
                "Smart Notices": "/notices",
                "Location-Based": "/map",
                "Instant Chat": "/chat",
                "Emergency Alerts": "/emergency-alerts",
              };
              const link = featureLinks[feature.title] || "/dashboard";
              
              return (
                <Link
                  key={feature.title}
                  to={link}
                  className="group p-6 bg-card rounded-2xl shadow-soft border border-border hover:shadow-medium hover:border-primary/20 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-hero rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Transform Your Community?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Join thousands of communities already using Community Compass
              </p>
              <Link to="/register">
                <Button variant="glass" size="xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-secondary/20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <Compass className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Community Compass</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/communities" className="hover:text-foreground transition-colors">Communities</Link>
              <Link to="/notices" className="hover:text-foreground transition-colors">Notices</Link>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
