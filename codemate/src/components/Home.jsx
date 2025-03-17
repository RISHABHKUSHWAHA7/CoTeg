"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useAnimation } from "framer-motion";
import Particles from "react-tsparticles";
import { useCallback, useEffect, useState } from "react";
import { Code, Users, Sparkles, GitBranch } from "lucide-react";
import "@fontsource/press-start-2p";
import StarsCanvas from "@/components/StarCanvas"; // Import StarsCanvas

export default function HomePage() {
  const particlesInit = useCallback((engine) => {
    console.log("Particles Engine Loaded:", engine);
  }, []);
  const features = [
    {
      icon: <Users />, title: "Seamless Teamwork", description: "Collaborate in real time with shared editing and live cursors.", titleColor: "text-cyan-400",
    },
    {
      icon: <Sparkles />, title: "AI-powered Assistance", description: "Get smart code suggestions and instant auto-completions.", titleColor: "text-pink-400",
    },
    {
      icon: <Code />, title: "Instant Error Detection", description: "Fix syntax errors instantly with AI-powered linting.", titleColor: "text-yellow-400",
    },
    {
      icon: <GitBranch />, title: "AI Coding Companion", description: "Chat with an AI assistant for coding help and debugging.", titleColor: "text-purple-400",
    },
  ];

  // Typewriter effect
  const [displayText, setDisplayText] = useState("");
  const fullText = "CodeMate";
  const controls = useAnimation();

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        setTimeout(() => {
          index = 0;
        }, 1000);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center">
      <StarsCanvas className="absolute inset-0 z-0" /> {/* Add StarsCanvas in the background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{ background: { color: "black" }, particles: { number: { value: 50 }, size: { value: 3 }, move: { enable: true, speed: 1 } } }}
        className="absolute inset-0"
      />

      {/* Hero Section */}
      <section className="relative text-center py-20 px-6 z-10 min-h-[150px]">
        <motion.h1 className="text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 neon-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          {displayText || "\u00A0"}
        </motion.h1>
        <motion.p className="text-lg text-gray-400 mb-6 max-w-2xl mx-auto font-mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          Hack, collaborate, and innovate with AI-powered coding tools in real-time.
        </motion.p>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-gradient-to-r from-cyan-500 to-pink-500 text-black px-8 py-6 text-lg rounded-full shadow-xl neon-btn" onClick={() => (window.location.href = "/register")}>Enter the Cyber World</Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative px-10 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 z-10 w-full">
        {features.map((feature, index) => (
          <motion.div key={index} className="bg-gray-900 p-6 rounded-full shadow-lg border border-gray-700 neon-border transition-colors" initial={{ rotateY: 180, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ delay: index * 0.2, duration: 0.8 }} whileHover={{ scale: 1.05 }}>
            <CardContent className="text-center flex flex-col items-center animate-pulse">
              <div className={`text-5xl mb-4 ${feature.titleColor} neon-icon`}>{feature.icon}</div>
              <h3 className={`text-xl font-semibold mb-2 ${feature.titleColor} neon-glow`}>{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </CardContent>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
