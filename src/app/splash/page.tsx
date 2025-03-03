'use client'

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from './styles.module.css'
import logo from '../../assets/logo.png'
import { varela_round } from "@/app/fonts/fonts";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [showSecondText, setShowSecondText] = useState(false);

  const route = useRouter()

  useEffect(() => {
    setTimeout(() => {
      setShowSecondText(true);
    }, 2000);
  
    setTimeout(() => {
      setVisible(false);
    }, 3000);
  
    setTimeout(() => {
      route.replace('/login')
    }, 4000);
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 1, scale: 1, backgroundColor: "#24125A" }}
      animate={{
        opacity: 1,
        scale: 1 
      }}
      transition={{ duration: 1 }}
      onAnimationComplete={() => {
        if (!visible) route.push('/login')
      }}
      className="fixed inset-0 flex items-center justify-center"
    >

       <div className=" flex-row flex items-center justify-between">
        {showSecondText && (
            <motion.h1
              initial={{ y: 20, opacity: 0, fontSize:"clamp(3.5rem, 10vw, 10rem)", color:'#F78223'}}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className={`${varela_round.className} ${styles.text_left}`}
            >
              stud
            </motion.h1>
          )}

          <motion.div
            initial={{ width: "clamp(150px, 50vw, 300px)" }}
            animate={{ width: "clamp(100px, 20vw, 200px)" }}
            transition={{ duration: 1 }}
          >
            <Image src={logo} alt="logo" />
          </motion.div>

          {showSecondText && (
            <motion.h1
              initial={{ y: 20, opacity: 0, fontSize:"clamp(3.5rem, 10vw, 10rem)", color:'#F78223'}}
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
