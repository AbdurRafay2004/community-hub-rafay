import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, ArrowRight, User, Mail, Phone, MapPin, 
  Briefcase, GraduationCap, Heart, AlertTriangle, CheckCircle, Camera
} from "lucide-react";

const EditProfile = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+880 1712-345678",
    location: "Gulshan, Dhaka",
    bio: "Community enthusiast and tech professional.",
    education: "BSc in Computer Science, BUET",
    institution: "BUET",
    work: "Software Engineer",
    company: "Tech Corp",
    interests: ["Technology", "Environment"],
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: ""
  });

  const interestOptions = ["Technology", "Environment", "Community Service", "Photography", "Sports", "Arts", "Music", "Reading"];

  const steps = [
    { num: 1, title: "Personal", icon: User },
    { num: 2, title: "Education", icon: GraduationCap },
    { num: 3, title: "Work", icon: Briefcase },
    { num: 4, title: "Interests", icon: Heart },
    { num: 5, title: "Emergency", icon: AlertTriangle },
  ];

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-3xl mx-auto">
        {/* Header */}
        <Link to="/profile" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
          <p className="text-muted-foreground mt-1">Update your profile information</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
          {steps.map((s, index) => (
            <div key={s.num} className="flex items-center">
              <button
                onClick={() => setStep(s.num)}
                className={`flex flex-col items-center gap-1 px-2 ${
                  step === s.num ? "text-primary" : step > s.num ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  step >= s.num ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}>
                  {step > s.num ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                </div>
                <span className="text-xs font-medium hidden sm:block">{s.title}</span>
              </button>
              {index < steps.length - 1 && (
                <div className={`w-8 md:w-16 h-0.5 mx-1 ${step > s.num ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl shadow-soft border border-border p-6 md:p-8">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
              
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-hero rounded-2xl flex items-center justify-center text-primary-foreground text-3xl font-bold">
                    JD
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center shadow-soft">
                    <Camera className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="h-12" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground">Education</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Degree / Qualification</Label>
                  <Input placeholder="e.g., BSc in Computer Science" value={formData.education} onChange={(e) => setFormData({ ...formData, education: e.target.value })} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label>Institution</Label>
                  <Input placeholder="e.g., BUET" value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} className="h-12" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground">Work Experience</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input placeholder="e.g., Software Engineer" value={formData.work} onChange={(e) => setFormData({ ...formData, work: e.target.value })} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input placeholder="e.g., Tech Corp" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="h-12" />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground">Interests</h2>
              <p className="text-muted-foreground">Select your interests to help connect with like-minded community members</p>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => {
                      const interests = formData.interests.includes(interest)
                        ? formData.interests.filter(i => i !== interest)
                        : [...formData.interests, interest];
                      setFormData({ ...formData, interests });
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      formData.interests.includes(interest)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground">Emergency Contact</h2>
              <p className="text-muted-foreground">This information will be used only in case of emergencies</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Contact Name</Label>
                  <Input placeholder="Emergency contact name" value={formData.emergencyName} onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Phone</Label>
                  <Input type="tel" placeholder="Emergency contact phone" value={formData.emergencyPhone} onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label>Relationship</Label>
                  <Input placeholder="e.g., Parent, Spouse, Sibling" value={formData.emergencyRelation} onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })} className="h-12" />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 1}>
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            {step < 5 ? (
              <Button variant="hero" onClick={() => setStep(step + 1)}>
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Link to="/profile">
                <Button variant="hero">
                  <CheckCircle className="w-4 h-4" />
                  Save Profile
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EditProfile;
