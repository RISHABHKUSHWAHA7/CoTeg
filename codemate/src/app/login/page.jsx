"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { loginWithEmailAndPassword, loginWithGoogle } from "@/helpers/loginHelp";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import StarsCanvas from "@/components/StarCanvas";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const user = await loginWithEmailAndPassword(email, password);
      if (user) {
        toast.success("Login successful! Redirecting...", toastOptions);
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Login failed: " + error.message, toastOptions);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      if (user) {
        toast.success("Logged in with Google!", toastOptions);
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Google login failed: " + error.message, toastOptions);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <StarsCanvas className="relative inset-0 z-10" />

      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
        whileHover={{ scale: 1.05 }}
      >
        <Card className="w-full max-w-md bg-black/50 border border-gray-700 backdrop-blur-lg shadow-lg shadow-blue-500/30 rounded-xl p-6">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold text-white">
              🔑 Login
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent text-white border border-blue-500 rounded-md px-4 py-2 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent text-white border border-blue-500 rounded-md px-4 py-2 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-md transition-all duration-300"
            >
              {loading ? "Processing..." : "Login"}
            </Button>
            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-md transition-all duration-300"
            >
              {loading ? "Processing..." : "Continue with Google"}
            </Button>
            <p className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-400 hover:underline">
                Sign up here
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
