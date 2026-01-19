import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Clock, Users, CheckCircle2, BarChart3, Vote } from "lucide-react";

const surveys = [
  {
    id: 1,
    title: "Community Park Renovation",
    description: "Vote on the proposed changes to our community park",
    community: "Green Valley",
    totalVotes: 156,
    totalMembers: 234,
    status: "active",
    endDate: "Dec 25, 2025",
    options: [
      { label: "Add playground equipment", votes: 78 },
      { label: "Build gazebo area", votes: 45 },
      { label: "Install fitness equipment", votes: 33 },
    ],
    hasVoted: false,
  },
  {
    id: 2,
    title: "Monthly Meeting Time",
    description: "Choose the best time for our monthly community meetings",
    community: "Green Valley",
    totalVotes: 89,
    totalMembers: 234,
    status: "active",
    endDate: "Dec 20, 2025",
    options: [
      { label: "Saturday 10 AM", votes: 45 },
      { label: "Sunday 4 PM", votes: 30 },
      { label: "Friday 7 PM", votes: 14 },
    ],
    hasVoted: true,
    userVote: "Saturday 10 AM",
  },
  {
    id: 3,
    title: "Security Camera Installation",
    description: "Should we install CCTV cameras in common areas?",
    community: "Tech Hub District",
    totalVotes: 234,
    totalMembers: 567,
    status: "closed",
    endDate: "Dec 10, 2025",
    options: [
      { label: "Yes, install cameras", votes: 189 },
      { label: "No, privacy concerns", votes: 45 },
    ],
    hasVoted: true,
    userVote: "Yes, install cameras",
  },
];

const Surveys = () => {
  const navigate = useNavigate();
  const [votedSurveys, setVotedSurveys] = useState<{ [key: number]: string }>({
    2: "Saturday 10 AM",
    3: "Yes, install cameras",
  });

  const handleVote = (surveyId: number, option: string) => {
    setVotedSurveys(prev => ({ ...prev, [surveyId]: option }));
  };

  const getPercentage = (votes: number, total: number) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Community Surveys</h1>
            <p className="text-muted-foreground">Vote and participate in community decisions</p>
          </div>
          <Button onClick={() => navigate('/create-survey')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Survey
          </Button>
        </div>

        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="voted">Voted</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 mt-4">
            {surveys.filter(s => s.status === 'active' && !votedSurveys[s.id]).map((survey) => (
              <Card key={survey.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{survey.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{survey.description}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {survey.community}
                    </span>
                    <span className="flex items-center gap-1">
                      <Vote className="h-3.5 w-3.5" />
                      {survey.totalVotes} votes
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Ends {survey.endDate}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {survey.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleVote(survey.id, option.label)}
                      className="w-full p-3 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="voted" className="space-y-4 mt-4">
            {surveys.filter(s => s.status === 'active' && votedSurveys[s.id]).map((survey) => (
              <Card key={survey.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {survey.title}
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{survey.description}</p>
                    </div>
                    <Badge variant="secondary">Voted</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {survey.community}
                    </span>
                    <span className="flex items-center gap-1">
                      <Vote className="h-3.5 w-3.5" />
                      {survey.totalVotes} votes
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Ends {survey.endDate}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {survey.options.map((option, index) => {
                    const percentage = getPercentage(option.votes, survey.totalVotes);
                    const isUserVote = votedSurveys[survey.id] === option.label;
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          isUserVote ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-medium ${isUserVote ? 'text-primary' : ''}`}>
                            {option.label}
                            {isUserVote && <span className="text-xs ml-2">(Your vote)</span>}
                          </span>
                          <span className="text-sm font-medium">{percentage}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">{option.votes} votes</p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="closed" className="space-y-4 mt-4">
            {surveys.filter(s => s.status === 'closed').map((survey) => (
              <Card key={survey.id} className="overflow-hidden opacity-80">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{survey.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{survey.description}</p>
                    </div>
                    <Badge variant="outline">Closed</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {survey.community}
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="h-3.5 w-3.5" />
                      {survey.totalVotes} total votes
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Ended {survey.endDate}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {survey.options.map((option, index) => {
                    const percentage = getPercentage(option.votes, survey.totalVotes);
                    const isWinner = option.votes === Math.max(...survey.options.map(o => o.votes));
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-2 ${
                          isWinner ? 'border-green-500 bg-green-50 dark:bg-green-950/30' : 'border-border'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-medium ${isWinner ? 'text-green-700 dark:text-green-400' : ''}`}>
                            {option.label}
                            {isWinner && <Badge className="ml-2 bg-green-500 text-xs">Winner</Badge>}
                          </span>
                          <span className="text-sm font-medium">{percentage}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">{option.votes} votes</p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Surveys;
