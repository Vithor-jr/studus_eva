"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasVisited = sessionStorage.getItem("visited");

      if (hasVisited) {
        setShowSplash(false);
      } else {
        sessionStorage.setItem("visited", "true");
      }

      setLoaded(true);
    }
  }, []);

  if (!loaded) return null;

  return (
    <AnimatePresence mode="wait">
      {showSplash ? redirect("/splash") : redirect("/login")}
    </AnimatePresence>
  );
}