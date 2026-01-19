import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Settings, Shield, Bell, Users, Trash2, Upload, Globe, Lock, Eye } from "lucide-react";

const CommunitySettings = () => {
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState("restricted");

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Community Settings</h1>
              <p className="text-muted-foreground">Manage Green Valley Community settings</p>
            </div>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">
                <Settings className="h-4 w-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Shield className="h-4 w-4 mr-2" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="members">
                <Users className="h-4 w-4 mr-2" />
                Members
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Community Profile</CardTitle>
                  <CardDescription>Update your community's public information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Community Name</Label>
                    <Input defaultValue="Green Valley Community" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      defaultValue="A vibrant residential community focused on sustainable living and neighborhood harmony."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input defaultValue="Dhaka, Bangladesh" />
                  </div>
                  <div className="space-y-2">
                    <Label>Community Photo</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-2xl font-bold">
                        G
                      </div>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Welcome Message</CardTitle>
                  <CardDescription>Message shown to new members</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    defaultValue="Welcome to Green Valley Community! We're glad to have you here."
                    className="min-h-[80px]"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Community Rules</CardTitle>
                  <CardDescription>Guidelines for community members</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    defaultValue="1. Be respectful to all members&#10;2. No spam or promotional content&#10;3. Participate in community events&#10;4. Report suspicious activities&#10;5. Keep shared spaces clean"
                    className="min-h-[150px]"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visibility</CardTitle>
                  <CardDescription>Control who can see and join your community</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { value: "public", label: "Public", icon: Globe, desc: "Anyone can see and join" },
                      { value: "restricted", label: "Restricted", icon: Eye, desc: "Anyone can see, approval required to join" },
                      { value: "private", label: "Private", icon: Lock, desc: "Only members can see, invite only" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        onClick={() => setVisibility(option.value)}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          visibility === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <option.icon className={`h-5 w-5 ${visibility === option.value ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div className="flex-1">
                          <p className="font-medium">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Member Permissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Members can post notices</Label>
                      <p className="text-sm text-muted-foreground">Allow members to create community notices</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Members can invite others</Label>
                      <p className="text-sm text-muted-foreground">Allow members to invite new people</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Members can create events</Label>
                      <p className="text-sm text-muted-foreground">Allow members to create community events</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Notifications</CardTitle>
                  <CardDescription>Configure when you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New join requests</Label>
                      <p className="text-sm text-muted-foreground">When someone requests to join</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New posts/notices</Label>
                      <p className="text-sm text-muted-foreground">When members post new content</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Emergency alerts</Label>
                      <p className="text-sm text-muted-foreground">When emergency alerts are sent</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Member reports</Label>
                      <p className="text-sm text-muted-foreground">When content is reported</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Members Settings */}
            <TabsContent value="members" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Member Management</CardTitle>
                  <CardDescription>Configure membership settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Maximum Members</Label>
                    <Select defaultValue="unlimited">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100 members</SelectItem>
                        <SelectItem value="500">500 members</SelectItem>
                        <SelectItem value="1000">1000 members</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require approval for new members</Label>
                      <p className="text-sm text-muted-foreground">Manually approve join requests</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow member directory</Label>
                      <p className="text-sm text-muted-foreground">Members can see other members</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Delete Community</Label>
                      <p className="text-sm text-muted-foreground">Permanently delete this community</p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CommunitySettings;
