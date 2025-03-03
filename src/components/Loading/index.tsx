import { motion } from "framer-motion";
import styles from './styles.module.css';
import Image from "next/image";
import Logo from '../../assets/logo.png';
import { varela_round } from "@/app/fonts/fonts";

export default function Loading() {
  // Animação de onda para as letras e imagem
  const waveAnimation1 = {
    y: [0, -20, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 0,
    },
  };

  const waveAnimation2 = {
    y: [0, -20, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 0.1,
    },
  };

  const waveAnimation3 = {
    y: [0, -20, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      delay: 0.2,
      ease: "easeInOut",
    },
  };

  const waveAnimation4 = {
    y: [0, -20, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      delay: 0.3,
      ease: "easeInOut",
    },
  };

  const waveAnimation5 = {
    y: [0, -20, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      delay: 0.4,
      ease: "easeInOut",
    },
  };

  const waveAnimation6 = {
    y: [0, -20, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 0.5,
    },
  };

  // Animação de onda para os pontinhos
  const dotAnimation = (delay: number) => ({
		opacity:1,
    transition: {
      delay: delay,
      duration: 0.8, 
      repeat: Infinity,
      ease: "easeInOut",
    },
  });

  return (
    <div className={`${styles.body}`}>
      <motion.div className={styles.container}>
        {/* Letra "s" */}
        <motion.p
          className={`${varela_round.className} ${styles.text}`}
          animate={waveAnimation1}
        >
          s
        </motion.p>

        {/* Letra "t" */}
        <motion.p
          className={`${varela_round.className} ${styles.text}`}
          animate={waveAnimation2}
        >
          t
        </motion.p>

        {/* Letra "u" */}
        <motion.p
          className={`${varela_round.className} ${styles.text}`}
          animate={waveAnimation3}
        >
          u
        </motion.p>

        {/* Letra "d" */}
        <motion.p
          className={`${varela_round.className} ${styles.text}`}
          animate={waveAnimation4}
        >
          d
        </motion.p>

        {/* Imagem */}
        <motion.div animate={waveAnimation5}>
          <Image className={styles.image} src={Logo} alt="Logo" />
        </motion.div>

        {/* Letra "s" */}
        <motion.p
          className={`${varela_round.className} ${styles.text}`}
          animate={waveAnimation6}
        >
          s
        </motion.p>
      </motion.div>

      {/* Texto "Aguarde..." com animação nos pontinhos */}
			<div className="flex flex-row">
				<motion.p className={`${varela_round.className}`}>Aguarde</motion.p>
				<motion.p initial={{opacity:0}} className={`${varela_round.className}`} animate={dotAnimation(0)}>.</motion.p>
				<motion.p initial={{opacity:0}}className={`${varela_round.className}`} animate={dotAnimation(0.2)}>.</motion.p>
				<motion.p initial={{opacity:0}} className={`${varela_round.className}`} animate={dotAnimation(0.4)}>.</motion.p>
			</div>
    </div>
  );
}