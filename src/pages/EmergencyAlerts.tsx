import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Bell, MapPin, Clock, Send, Plus, Shield, Flame, Droplets, Car, Users, UserPlus } from "lucide-react";

const alertTypes = [
  { id: "fire", label: "Fire Emergency", icon: Flame, color: "text-red-500" },
  { id: "flood", label: "Flood Warning", icon: Droplets, color: "text-blue-500" },
  { id: "accident", label: "Accident", icon: Car, color: "text-orange-500" },
  { id: "security", label: "Security Alert", icon: Shield, color: "text-purple-500" },
  { id: "gathering", label: "Emergency Gathering", icon: Users, color: "text-green-500" },
  { id: "other", label: "Other Emergency", icon: AlertTriangle, color: "text-yellow-500" },
];

const recentAlerts = [
  {
    id: 1,
    type: "security",
    title: "Suspicious Activity Reported",
    description: "Unknown individuals spotted near Block C parking area. Please be vigilant.",
    community: "Green Valley",
    time: "10 minutes ago",
    status: "active",
  },
  {
    id: 2,
    type: "flood",
    title: "Heavy Rain Warning",
    description: "Expected heavy rainfall in the next 2 hours. Please secure outdoor items.",
    community: "Riverside Community",
    time: "1 hour ago",
    status: "active",
  },
  {
    id: 3,
    type: "fire",
    title: "Kitchen Fire - Resolved",
    description: "Small kitchen fire in Building 5 has been contained. No injuries reported.",
    community: "Tech Hub District",
    time: "3 hours ago",
    status: "resolved",
  },
];

const EmergencyAlerts = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  const getAlertIcon = (type: string) => {
    const alertType = alertTypes.find(a => a.id === type);
    if (!alertType) return AlertTriangle;
    return alertType.icon;
  };

  const getAlertColor = (type: string) => {
    const alertType = alertTypes.find(a => a.id === type);
    return alertType?.color || "text-yellow-500";
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Emergency Alerts</h1>
            <p className="text-muted-foreground">Stay informed and alert your community</p>
          </div>
          <div className="flex gap-2">
            <Link to="/sos">
              <Button className="bg-red-500 hover:bg-red-600">
                <AlertTriangle className="h-4 w-4 mr-2" />
                SOS Panic Button
              </Button>
            </Link>
            <Link to="/emergency-contacts">
              <Button variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                My SOS Contacts
              </Button>
            </Link>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-500 hover:bg-red-600">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Send Alert
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-500">
                  <AlertTriangle className="h-5 w-5" />
                  Create Emergency Alert
                </DialogTitle>
                <DialogDescription>
                  This will notify all members in the selected community immediately.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Alert Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {alertTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            selectedType === type.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <Icon className={`h-5 w-5 mx-auto mb-1 ${type.color}`} />
                          <p className="text-xs text-center">{type.label.split(' ')[0]}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Community</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select community" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="green-valley">Green Valley</SelectItem>
                      <SelectItem value="tech-hub">Tech Hub District</SelectItem>
                      <SelectItem value="riverside">Riverside Community</SelectItem>
                      <SelectItem value="all">All My Communities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Alert Title</label>
                  <Input placeholder="Brief description of the emergency" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Details</label>
                  <Textarea 
                    placeholder="Provide more details about the emergency..."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location (Optional)</label>
                  <div className="flex gap-2">
                    <Input placeholder="Enter location or address" className="flex-1" />
                    <Button variant="outline" size="icon">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button className="bg-red-500 hover:bg-red-600">
                  <Send className="h-4 w-4 mr-2" />
                  Send Alert Now
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Quick Alert Buttons */}
        <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-red-500" />
              Quick Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {alertTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button 
                    key={type.id} 
                    variant="outline" 
                    size="sm"
                    className="border-red-200 hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-900/50"
                  >
                    <Icon className={`h-4 w-4 mr-2 ${type.color}`} />
                    {type.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Alerts</h2>
          {recentAlerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            return (
              <Card 
                key={alert.id} 
                className={`transition-all hover:shadow-md ${
                  alert.status === 'active' 
                    ? 'border-l-4 border-l-red-500' 
                    : 'opacity-75'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-full ${
                      alert.status === 'active' 
                        ? 'bg-red-100 dark:bg-red-900/50' 
                        : 'bg-muted'
                    }`}>
                      <Icon className={`h-5 w-5 ${getAlertColor(alert.type)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{alert.title}</h3>
                        <Badge 
                          variant={alert.status === 'active' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {alert.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.community}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.time}
                        </span>
                      </div>
                    </div>
                    {alert.status === 'active' && (
                      <Button variant="outline" size="sm">Mark Resolved</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default EmergencyAlerts;
