"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Send, User } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <Header />
      <main className="min-h-screen pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
              Get in <span className="text-blue-500">Touch</span>
            </h1>
            <p className="text-gray-400 mb-12 text-center max-w-2xl mx-auto">
              Have a question about our products? We're here to help. Send us a message and we'll respond as soon as possible.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl shadow-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-white mb-2 block">
                      Your Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData?.name ?? ""}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e?.target?.value ?? "" })
                        }
                        className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white mb-2 block">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData?.email ?? ""}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e?.target?.value ?? "" })
                        }
                        className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-white mb-2 block">
                    Subject
                  </Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      id="subject"
                      type="text"
                      placeholder="How can we help?"
                      value={formData?.subject ?? ""}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e?.target?.value ?? "" })
                      }
                      className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-white mb-2 block">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    value={formData?.message ?? ""}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e?.target?.value ?? "" })
                    }
                    className="min-h-[150px] bg-slate-800 border-slate-700 text-white placeholder:text-gray-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                  disabled={loading}
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>

                <p className="text-gray-400 text-sm text-center">
                  Your message will be saved in our database and we'll respond to your email address as soon as possible.
                </p>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
