import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Image, Calendar, AlertTriangle, Bell, CheckCircle } from "lucide-react";

const formSchema = z.object({
  type: z.enum(["info", "event", "emergency"]),
  community: z.string().min(1, "Please select a community"),
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  content: z.string()
    .min(10, "Content must be at least 10 characters")
    .max(1000, "Content must be less than 1000 characters"),
  scheduledDate: z.string().optional(),
}).refine((data) => {
  if (data.type === "event" && !data.scheduledDate) {
    return false;
  }
  return true;
}, {
  message: "Event date is required for events",
  path: ["scheduledDate"],
});

type FormValues = z.infer<typeof formSchema>;

const CreateNotice = () => {
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "info",
      community: "",
      title: "",
      content: "",
      scheduledDate: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    toast.success("Notice posted successfully!");
    navigate("/notices");
  };

  const noticeTypes = [
    { value: "info", label: "Information", icon: Bell, color: "text-primary", bg: "bg-primary/10" },
    { value: "event", label: "Event", icon: Calendar, color: "text-accent", bg: "bg-accent/10" },
    { value: "emergency", label: "Emergency", icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  ] as const;

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* Notice Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Notice Type</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-3">
                        {noticeTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => field.onChange(type.value)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                              field.value === type.value
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Community */}
              <FormField
                control={form.control}
                name="community"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Select Community</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-1 gap-2">
                        {communities.map((community) => (
                          <button
                            key={community.id}
                            type="button"
                            onClick={() => field.onChange(community.name)}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                              field.value === community.name
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/30"
                            }`}
                          >
                            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center text-primary-foreground font-semibold">
                              {community.name.charAt(0)}
                            </div>
                            <span className="font-medium text-foreground">{community.name}</span>
                            {field.value === community.name && (
                              <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                            )}
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter notice title"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Content */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your notice content..."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload - UI only for now */}
              <div className="space-y-2">
                <FormLabel>Attachment (Optional)</FormLabel>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                    <Image className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>

              {/* Schedule (for events) */}
              {form.watch("type") === "event" && (
                <FormField
                  control={form.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Date & Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-border">
                <Link to="/notices">
                  <Button variant="outline" type="button">Cancel</Button>
                </Link>
                <Button variant="hero" type="submit">
                  <Bell className="w-4 h-4 mr-2" />
                  Post Notice
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateNotice;
