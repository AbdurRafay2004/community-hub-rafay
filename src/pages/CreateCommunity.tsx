import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Image, Globe, Lock, Users, CheckCircle } from "lucide-react";

const CreateCommunity = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    visibility: "public",
    welcomeMessage: "",
    rules: ""
  });

  const visibilityOptions = [
    { value: "public", label: "Public", description: "Anyone can find and join", icon: Globe },
    { value: "restricted", label: "Restricted", description: "Anyone can find, approval needed to join", icon: Users },
    { value: "private", label: "Private", description: "Only invited members can find and join", icon: Lock },
  ];

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        {/* Header */}
        <Link to="/communities" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Communities
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create Community</h1>
          <p className="text-muted-foreground mt-1">Set up a new community for your neighborhood or group</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step >= s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}>
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <div className="bg-card rounded-2xl shadow-soft border border-border p-6 md:p-8">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>
              
              <div className="space-y-2">
                <Label>Community Name</Label>
                <Input
                  placeholder="Enter community name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe your community..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="e.g., Gulshan, Dhaka"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label>Community Picture</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                    <Image className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground">Visibility & Access</h2>
              
              <div className="space-y-3">
                <Label>Who can join?</Label>
                {visibilityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, visibility: option.value })}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      formData.visibility === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      formData.visibility === option.value ? "bg-primary/10" : "bg-secondary"
                    }`}>
                      <option.icon className={`w-6 h-6 ${
                        formData.visibility === option.value ? "text-primary" : "text-muted-foreground"
                      }`} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      formData.visibility === option.value
                        ? "border-primary bg-primary"
                        : "border-border"
                    }`}>
                      {formData.visibility === option.value && (
                        <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground">Welcome & Rules</h2>
              
              <div className="space-y-2">
                <Label>Welcome Message</Label>
                <Textarea
                  placeholder="Write a welcome message for new members..."
                  value={formData.welcomeMessage}
                  onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Community Rules</Label>
                <Textarea
                  placeholder="Enter each rule on a new line..."
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">One rule per line</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            {step < 3 ? (
              <Button variant="hero" onClick={() => setStep(step + 1)}>
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Link to="/communities">
                <Button variant="hero">
                  <CheckCircle className="w-4 h-4" />
                  Create Community
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateCommunity;
