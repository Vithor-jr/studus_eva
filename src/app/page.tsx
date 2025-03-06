"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";import Head from 'next/head';



export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [token, setToken] = useState<string | undefined>('')

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cookie = Cookies.get("token")
      setToken(cookie)

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
      {showSplash ? redirect("/splash") : (token ?  redirect("/login") : redirect('/home'))}
    </AnimatePresence>
  );
}