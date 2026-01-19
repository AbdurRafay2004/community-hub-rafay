import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRegisterVoiceCommand } from "@/hooks/useRegisterVoiceCommand";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Image, Calendar, AlertTriangle, Bell, CheckCircle, Users } from "lucide-react";

const CreateNotice = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "info",
    community: "",
    scheduledDate: ""
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "Missing fields",
        description: "Please fill in title and content",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Notice Created",
      description: "Your notice has been posted to the community board.",
    });

    // Reset form
    setFormData({ ...formData, title: "", content: "" });
    navigate("/notices");
  };

  useRegisterVoiceCommand({
    id: "submit-notice",
    keywords: {
      en: ["submit notice", "post notice", "publish notice"],
      bn: ["নোটিশ জমা দিন", "নোটিশ পোস্ট করুন"],
    },
    response: {
      en: "Submitting notice",
      bn: "নোটিশ জমা দেয়া হচ্ছে",
    },
    action: () => handleSubmit()
  });

  const noticeTypes = [
    { value: "info", label: "Information", icon: Bell, color: "text-primary", bg: "bg-primary/10" },
    { value: "event", label: "Event", icon: Calendar, color: "text-accent", bg: "bg-accent/10" },
    { value: "emergency", label: "Emergency", icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  ];

  const communities = [
    { id: 1, name: "Green Valley" },
    { id: 2, name: "Downtown District" },
    { id: 3, name: "Tech Hub Community" },
  ];

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        {/* Header */}
        <Link to="/notices" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Notices
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create Notice</h1>
          <p className="text-muted-foreground mt-1">Share important updates with your community</p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl shadow-soft border border-border p-6 md:p-8">
          <div className="space-y-6">
            {/* Notice Type */}
            <div className="space-y-3">
              <Label>Notice Type</Label>
              <div className="grid grid-cols-3 gap-3">
                {noticeTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      formData.type === type.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${type.bg}`}>
                      <type.icon className={`w-5 h-5 ${type.color}`} />
                    </div>
                    <span className="text-sm font-medium text-foreground">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Community */}
            <div className="space-y-2">
              <Label>Select Community</Label>
              <div className="grid grid-cols-1 gap-2">
                {communities.map((community) => (
                  <button
                    key={community.id}
                    onClick={() => setFormData({ ...formData, community: community.name })}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                      formData.community === community.name
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center text-primary-foreground font-semibold">
                      {community.name.charAt(0)}
                    </div>
                    <span className="font-medium text-foreground">{community.name}</span>
                    {formData.community === community.name && (
                      <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Enter notice title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-12"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                placeholder="Write your notice content..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Attachment (Optional)</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                  <Image className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
              </div>
            </div>

            {/* Schedule (for events) */}
            {formData.type === "event" && (
              <div className="space-y-2">
                <Label>Event Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="h-12"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-border">
            <Link to="/notices">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button variant="hero" onClick={handleSubmit}>
              <Bell className="w-4 h-4" />
              Post Notice
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateNotice;
