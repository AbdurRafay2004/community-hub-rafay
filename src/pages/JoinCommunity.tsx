import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Users, MapPin, Shield, CheckCircle2, ArrowLeft, ArrowRight, Bell, FileText } from "lucide-react";

const communityData = {
  id: 1,
  name: "Green Valley Community",
  description: "A vibrant residential community focused on sustainable living and neighborhood harmony.",
  members: 234,
  location: "Dhaka, Bangladesh",
  visibility: "restricted",
  rules: [
    "Be respectful to all community members",
    "No spam or promotional content",
    "Participate in community events when possible",
    "Report any suspicious activities",
    "Keep shared spaces clean"
  ],
  requirements: [
    "Must be a resident of Green Valley area",
    "Provide valid identification",
    "Agree to community guidelines"
  ]
};

const JoinCommunity = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [notificationPreference, setNotificationPreference] = useState("all");

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    // Submit join request
    navigate('/communities');
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
              <span className="text-sm font-medium">
                {step === 1 ? 'Review Community' : step === 2 ? 'Your Information' : 'Preferences'}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Review Community */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-3xl font-bold">
                      {communityData.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-xl font-bold">{communityData.name}</h1>
                        <Badge variant="secondary" className="capitalize">
                          <Shield className="h-3 w-3 mr-1" />
                          {communityData.visibility}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{communityData.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {communityData.members} members
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {communityData.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Community Rules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {communityData.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Membership Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {communityData.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="agree" 
                  checked={agreedToRules}
                  onCheckedChange={(checked) => setAgreedToRules(checked as boolean)}
                />
                <Label htmlFor="agree" className="text-sm">
                  I have read and agree to the community rules and requirements
                </Label>
              </div>
            </div>
          )}

          {/* Step 2: Your Information */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Join Request Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Why do you want to join this community?</Label>
                    <Textarea 
                      placeholder="Tell the community admins a bit about yourself and why you'd like to join..."
                      className="min-h-[120px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Your Address/Location</Label>
                    <Input placeholder="e.g., Block A, House 12, Green Valley" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number (Optional)</Label>
                    <Input placeholder="+880 1XXX-XXXXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label>Referral (Optional)</Label>
                    <Input placeholder="Were you referred by a current member?" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={notificationPreference} onValueChange={setNotificationPreference}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all" className="flex-1 cursor-pointer">
                          <div className="font-medium">All Notifications</div>
                          <div className="text-sm text-muted-foreground">
                            Receive all community updates, notices, and alerts
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="important" id="important" />
                        <Label htmlFor="important" className="flex-1 cursor-pointer">
                          <div className="font-medium">Important Only</div>
                          <div className="text-sm text-muted-foreground">
                            Only emergency alerts and important announcements
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="minimal" id="minimal" />
                        <Label htmlFor="minimal" className="flex-1 cursor-pointer">
                          <div className="font-medium">Minimal</div>
                          <div className="text-sm text-muted-foreground">
                            Only emergency alerts
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Almost there!</p>
                      <p className="text-sm text-muted-foreground">
                        Your request will be reviewed by community admins. You'll receive a notification once approved.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={step === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            {step < totalSteps ? (
              <Button 
                onClick={handleNext}
                disabled={step === 1 && !agreedToRules}
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Submit Join Request
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default JoinCommunity;
