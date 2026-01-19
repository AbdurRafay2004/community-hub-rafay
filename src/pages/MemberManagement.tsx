import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, Search, MoreVertical, UserPlus, Shield, UserMinus, MessageSquare, Clock, CheckCircle2, XCircle, Users } from "lucide-react";

const members = [
  { id: 1, name: "Ahmed Rahman", email: "ahmed@email.com", role: "admin", joinedAt: "Jan 2024", status: "active" },
  { id: 2, name: "Fatima Khan", email: "fatima@email.com", role: "moderator", joinedAt: "Feb 2024", status: "active" },
  { id: 3, name: "Karim Hassan", email: "karim@email.com", role: "member", joinedAt: "Mar 2024", status: "active" },
  { id: 4, name: "Aisha Begum", email: "aisha@email.com", role: "member", joinedAt: "Apr 2024", status: "active" },
  { id: 5, name: "Rafiq Ali", email: "rafiq@email.com", role: "member", joinedAt: "May 2024", status: "inactive" },
];

const joinRequests = [
  { id: 1, name: "Sarah Ahmed", email: "sarah@email.com", requestedAt: "2 hours ago", message: "I live in Block A and would love to join the community." },
  { id: 2, name: "Imran Hossain", email: "imran@email.com", requestedAt: "1 day ago", message: "Recently moved to the area. Excited to be part of the community!" },
  { id: 3, name: "Nadia Sultana", email: "nadia@email.com", requestedAt: "3 days ago", message: "Referred by Ahmed Rahman." },
];

const MemberManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "default";
      case "moderator": return "secondary";
      default: return "outline";
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Member Management</h1>
            <p className="text-muted-foreground">Green Valley Community • {members.length} members</p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Members
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{members.length}</p>
              <p className="text-sm text-muted-foreground">Total Members</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-500">{members.filter(m => m.status === 'active').length}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-500">{joinRequests.length}</p>
              <p className="text-sm text-muted-foreground">Pending Requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-500">{members.filter(m => m.role === 'admin' || m.role === 'moderator').length}</p>
              <p className="text-sm text-muted-foreground">Admins/Mods</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="members">
          <TabsList>
            <TabsTrigger value="members">
              <Users className="h-4 w-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger value="requests">
              <Clock className="h-4 w-4 mr-2" />
              Join Requests
              {joinRequests.length > 0 && (
                <Badge className="ml-2 bg-orange-500">{joinRequests.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="mt-4 space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="moderator">Moderators</SelectItem>
                  <SelectItem value="member">Members</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Members List */}
            <div className="space-y-2">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-medium">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{member.name}</h4>
                          <Badge variant={getRoleBadgeVariant(member.role)} className="capitalize text-xs">
                            {member.role}
                          </Badge>
                          {member.status === 'inactive' && (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Joined {member.joinedAt}</p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="h-4 w-4 mr-2" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <UserMinus className="h-4 w-4 mr-2" />
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="mt-4 space-y-4">
            {joinRequests.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-500/50 mb-4" />
                  <p className="text-muted-foreground">No pending join requests</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {joinRequests.map((request) => (
                  <Card key={request.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-medium">
                          {request.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{request.name}</h4>
                            <span className="text-xs text-muted-foreground">• {request.requestedAt}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{request.email}</p>
                          {request.message && (
                            <div className="p-3 bg-muted/50 rounded-lg text-sm">
                              "{request.message}"
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-destructive border-destructive/50 hover:bg-destructive/10">
                            <XCircle className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                          <Button size="sm">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default MemberManagement;
