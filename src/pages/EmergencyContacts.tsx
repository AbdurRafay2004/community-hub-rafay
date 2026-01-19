import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  UserPlus, 
  Phone, 
  Mail, 
  Edit2, 
  Trash2, 
  Shield, 
  MessageSquare, 
  Bell,
  Heart,
  Users,
  Briefcase,
  User,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  relationship: string;
  notifyBySms: boolean;
  notifyByEmail: boolean;
  notifyByApp: boolean;
  isPrimary: boolean;
}

const relationshipIcons: Record<string, any> = {
  spouse: Heart,
  parent: Users,
  sibling: Users,
  friend: User,
  colleague: Briefcase,
  other: User,
};

const EmergencyContacts = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      email: "sarah.j@email.com",
      relationship: "spouse",
      notifyBySms: true,
      notifyByEmail: true,
      notifyByApp: true,
      isPrimary: true,
    },
    {
      id: "2",
      name: "Michael Chen",
      phone: "+1 (555) 987-6543",
      email: "m.chen@email.com",
      relationship: "friend",
      notifyBySms: true,
      notifyByEmail: false,
      notifyByApp: true,
      isPrimary: false,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    relationship: "friend",
    notifyBySms: true,
    notifyByEmail: true,
    notifyByApp: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      relationship: "friend",
      notifyBySms: true,
      notifyByEmail: true,
      notifyByApp: true,
    });
    setEditingContact(null);
  };

  const handleOpenDialog = (contact?: EmergencyContact) => {
    if (contact) {
      setEditingContact(contact);
      setFormData({
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        relationship: contact.relationship,
        notifyBySms: contact.notifyBySms,
        notifyByEmail: contact.notifyByEmail,
        notifyByApp: contact.notifyByApp,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSaveContact = () => {
    if (!formData.name || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a name and phone number.",
        variant: "destructive",
      });
      return;
    }

    if (editingContact) {
      setContacts(contacts.map(c => 
        c.id === editingContact.id 
          ? { ...c, ...formData }
          : c
      ));
      toast({
        title: "Contact Updated",
        description: `${formData.name} has been updated.`,
      });
    } else {
      if (contacts.length >= 5) {
        toast({
          title: "Maximum Contacts Reached",
          description: "You can only add up to 5 emergency contacts.",
          variant: "destructive",
        });
        return;
      }
      const newContact: EmergencyContact = {
        id: Date.now().toString(),
        ...formData,
        isPrimary: contacts.length === 0,
      };
      setContacts([...contacts, newContact]);
      toast({
        title: "Contact Added",
        description: `${formData.name} has been added to your emergency contacts.`,
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDeleteContact = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    setContacts(contacts.filter(c => c.id !== id));
    toast({
      title: "Contact Removed",
      description: `${contact?.name} has been removed from your emergency contacts.`,
    });
  };

  const handleSetPrimary = (id: string) => {
    setContacts(contacts.map(c => ({
      ...c,
      isPrimary: c.id === id,
    })));
    const contact = contacts.find(c => c.id === id);
    toast({
      title: "Primary Contact Updated",
      description: `${contact?.name} is now your primary emergency contact.`,
    });
  };

  const getRelationshipLabel = (relationship: string) => {
    const labels: Record<string, string> = {
      spouse: "Spouse/Partner",
      parent: "Parent",
      sibling: "Sibling",
      friend: "Friend",
      colleague: "Colleague",
      other: "Other",
    };
    return labels[relationship] || relationship;
  };

  const RelationshipIcon = ({ relationship }: { relationship: string }) => {
    const Icon = relationshipIcons[relationship] || User;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <AppLayout>
      <div className="container max-w-4xl py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Emergency Contacts
            </h1>
            <p className="text-muted-foreground mt-1">
              These contacts will be notified when you trigger an SOS alert
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} disabled={contacts.length >= 5}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingContact ? "Edit Contact" : "Add Emergency Contact"}
                </DialogTitle>
                <DialogDescription>
                  {editingContact 
                    ? "Update the contact information below."
                    : "Add someone you trust to be notified in emergencies."
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Select 
                    value={formData.relationship} 
                    onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse/Partner</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="colleague">Colleague</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3 pt-2">
                  <Label className="text-sm font-medium">Notification Preferences</Label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">SMS Message</span>
                    </div>
                    <Switch
                      checked={formData.notifyBySms}
                      onCheckedChange={(checked) => setFormData({ ...formData, notifyBySms: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Email</span>
                    </div>
                    <Switch
                      checked={formData.notifyByEmail}
                      onCheckedChange={(checked) => setFormData({ ...formData, notifyByEmail: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">In-App Notification</span>
                    </div>
                    <Switch
                      checked={formData.notifyByApp}
                      onCheckedChange={(checked) => setFormData({ ...formData, notifyByApp: checked })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveContact}>
                  {editingContact ? "Save Changes" : "Add Contact"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Info Banner */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="flex items-start gap-3 py-4">
            <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">How SOS Alerts Work</p>
              <p className="text-muted-foreground mt-1">
                When you trigger an SOS, all contacts below will receive your location and emergency message 
                via their preferred notification methods. Your primary contact will be notified first.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contacts List */}
        <div className="space-y-3">
          {contacts.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Shield className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg">No Emergency Contacts</h3>
                <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                  Add trusted contacts who will be notified when you trigger an SOS alert.
                </p>
                <Button className="mt-4" onClick={() => handleOpenDialog()}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Your First Contact
                </Button>
              </CardContent>
            </Card>
          ) : (
            contacts.map((contact, index) => (
              <Card key={contact.id} className={contact.isPrimary ? "border-primary/50 bg-primary/5" : ""}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${contact.isPrimary ? "bg-primary/20" : "bg-muted"}`}>
                        <RelationshipIcon relationship={contact.relationship} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{contact.name}</h3>
                          {contact.isPrimary && (
                            <Badge variant="default" className="text-xs">
                              Primary
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {getRelationshipLabel(contact.relationship)}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {contact.phone}
                          </span>
                          {contact.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 pt-1">
                          {contact.notifyBySms && (
                            <Badge variant="secondary" className="text-xs">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              SMS
                            </Badge>
                          )}
                          {contact.notifyByEmail && (
                            <Badge variant="secondary" className="text-xs">
                              <Mail className="h-3 w-3 mr-1" />
                              Email
                            </Badge>
                          )}
                          {contact.notifyByApp && (
                            <Badge variant="secondary" className="text-xs">
                              <Bell className="h-3 w-3 mr-1" />
                              App
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!contact.isPrimary && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleSetPrimary(contact.id)}
                          title="Set as primary"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleOpenDialog(contact)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteContact(contact.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer Info */}
        {contacts.length > 0 && contacts.length < 5 && (
          <p className="text-sm text-muted-foreground text-center">
            You can add up to {5 - contacts.length} more emergency contact{5 - contacts.length !== 1 ? "s" : ""}.
          </p>
        )}
      </div>
    </AppLayout>
  );
};

export default EmergencyContacts;
