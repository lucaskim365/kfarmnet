/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import DashboardSection from "./components/DashboardSection";
import InsightsSection from "./components/InsightsSection";
import SearchResults from "./components/SearchResults";
import AIAssistant from "./components/AIAssistant";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";
import { motion, useScroll, useSpring } from "motion/react";

export default function App() {
  const [page, setPage] = useState<"home" | "search" | "ai" | "admin">("home");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left"
        style={{ scaleX }}
      />
      
      <Navbar 
        onHomeClick={() => setPage("home")} 
        onSearchClick={() => setPage("search")} 
        onAIClick={() => setPage("ai")}
        onAdminClick={() => setPage("admin")}
      />
      
      <main className="flex-grow">
        {page === "home" ? (
          <>
            <Hero onSearch={() => setPage("ai")} />
            <Services />
            <DashboardSection />
            <InsightsSection />
          </>
        ) : page === "search" ? (
          <SearchResults />
        ) : page === "ai" ? (
          <AIAssistant />
        ) : (
          <AdminPanel />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
