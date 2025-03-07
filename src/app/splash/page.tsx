"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import logo from "../../assets/logo.png";
import { varela_round } from "@/app/fonts/fonts";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [showSecondText, setShowSecondText] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setShowSecondText(true);
    }, 2000);

    setTimeout(() => {
      setVisible(false); 
      setAnimationComplete(true);
    }, 3000);
  }, []);

  useEffect(() => {
    if (!animationComplete) return; 

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/verify-token', {
          method: 'GET',
          credentials: 'include', 
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Usuário autenticado:', data.user);
          router.replace('/home');
        } else {
          console.log('Usuário não autenticado');
          router.replace('/login')
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        router.replace('/login');
      }
    };
  
    checkAuth();
  }, [animationComplete, router]);

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1, backgroundColor: "#24125A" }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{ duration: 1 }}
      onAnimationComplete={() => {
        if (!visible) {
          setAnimationComplete(true);
        }
      }}
      className="fixed inset-0 flex items-center justify-center"
    >
      <div className="flex-row flex items-center justify-between">
        {showSecondText && (
          <motion.h1
            initial={{ y: 20, opacity: 0, fontSize: "clamp(3.5rem, 10vw, 10rem)", color: "#F78223" }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className={`${varela_round.className} ${styles.text_left}`}
          >
            stud
          </motion.h1>
        )}

        <motion.div initial={{ width: "clamp(150px, 50vw, 300px)" }} animate={{ width: "clamp(100px, 20vw, 200px)" }} transition={{ duration: 1 }}>
          <Image src={logo} alt="logo" />
        </motion.div>

        {showSecondText && (
          <motion.h1
            initial={{ y: 20, opacity: 0, fontSize: "clamp(3.5rem, 10vw, 10rem)", color: "#F78223" }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className={varela_round.className}
          >
            s
          </motion.h1>
        )}
      </div>
    </motion.div>
  );
}