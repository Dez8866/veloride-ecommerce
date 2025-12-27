"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, UserPlus } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Signup failed");
        return;
      }

      const result = await signIn("credentials", {
        email: formData?.email,
        password: formData?.password,
        redirect: false,
      });

      if (result?.ok) {
        router.replace("/");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900/20 px-4">
      <ScrollReveal direction="up" className="w-full max-w-md">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-bold text-white mb-2">
                Velo<span className="text-blue-500">Ride</span>
              </h1>
            </Link>
            <p className="text-gray-400">Create your account</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-white mb-2 block">
                Full Name
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
                Email
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

            <div>
              <Label htmlFor="password" className="text-white mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData?.password ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e?.target?.value ?? "" })
                  }
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-gray-500"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">
                Minimum 6 characters
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
              disabled={loading}
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-slate-700"></div>
            <span className="px-4 text-gray-400 text-sm">OR</span>
            <div className="flex-1 border-t border-slate-700"></div>
          </div>

          <Button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full bg-white hover:bg-gray-100 text-gray-900 py-6 text-lg border border-slate-700"
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-blue-500 hover:text-blue-400 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
