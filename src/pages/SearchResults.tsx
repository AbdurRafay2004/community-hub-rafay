import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, FileText, MessageSquare, MapPin, Filter } from "lucide-react";

const searchResults = {
  communities: [
    { id: 1, name: "Green Valley Community", members: 234, location: "Dhaka", type: "Residential" },
    { id: 2, name: "Tech Hub District", members: 567, location: "Dhaka", type: "Professional" },
    { id: 3, name: "University Heights", members: 890, location: "Chittagong", type: "Educational" },
  ],
  notices: [
    { id: 1, title: "Monthly Meeting Reminder", community: "Green Valley", date: "Dec 15, 2025" },
    { id: 2, title: "Community Clean-up Day", community: "Green Valley", date: "Dec 20, 2025" },
    { id: 3, title: "Emergency Contact Update", community: "Tech Hub", date: "Dec 18, 2025" },
  ],
  members: [
    { id: 1, name: "Ahmed Rahman", role: "Admin", community: "Green Valley" },
    { id: 2, name: "Fatima Khan", role: "Member", community: "Green Valley" },
    { id: 3, name: "Karim Hassan", role: "Moderator", community: "Tech Hub" },
  ],
};

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery });
  };

  const totalResults = 
    searchResults.communities.length + 
    searchResults.notices.length + 
    searchResults.members.length;

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Search Header */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search communities, notices, members..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button type="submit">Search</Button>
        </form>

        {/* Results Summary */}
        {query && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Showing {totalResults} results for</span>
            <Badge variant="secondary">"{query}"</Badge>
          </div>
        )}

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-1.5 text-xs">{totalResults}</Badge>
            </TabsTrigger>
            <TabsTrigger value="communities">
              Communities
              <Badge variant="secondary" className="ml-1.5 text-xs">{searchResults.communities.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="notices">
              Notices
              <Badge variant="secondary" className="ml-1.5 text-xs">{searchResults.notices.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="members">
              Members
              <Badge variant="secondary" className="ml-1.5 text-xs">{searchResults.members.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-6">
            {/* Communities Section */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Communities
              </h3>
              <div className="space-y-2">
                {searchResults.communities.map((community) => (
                  <Card key={community.id} className="hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold">
                          {community.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{community.name}</h4>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              {community.members} members
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {community.location}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary">{community.type}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Notices Section */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notices
              </h3>
              <div className="space-y-2">
                {searchResults.notices.map((notice) => (
                  <Card key={notice.id} className="hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{notice.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {notice.community} • {notice.date}
                          </p>
                        </div>
                        <Badge variant="outline">Notice</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Members Section */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Members
              </h3>
              <div className="space-y-2">
                {searchResults.members.map((member) => (
                  <Card key={member.id} className="hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-accent-foreground font-medium">
                          {member.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">{member.community}</p>
                        </div>
                        <Badge variant="secondary">{member.role}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="communities" className="mt-4 space-y-2">
            {searchResults.communities.map((community) => (
              <Card key={community.id} className="hover:shadow-md transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold">
                      {community.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{community.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {community.members} members
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {community.location}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary">{community.type}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="notices" className="mt-4 space-y-2">
            {searchResults.notices.map((notice) => (
              <Card key={notice.id} className="hover:shadow-md transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{notice.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {notice.community} • {notice.date}
                      </p>
                    </div>
                    <Badge variant="outline">Notice</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="members" className="mt-4 space-y-2">
            {searchResults.members.map((member) => (
              <Card key={member.id} className="hover:shadow-md transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-accent-foreground font-medium">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.community}</p>
                    </div>
                    <Badge variant="secondary">{member.role}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SearchResults;
