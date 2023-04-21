import React from "react";
import { motion,AnimatePresence } from "framer-motion";

const container = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.2,
    }
  },
};

const word = {
  hidden: {
    y:-20,
    opacity: 0
  },
  visible: {
    x:100,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    }
  },
  exit: {
    opacity: 0,
    transition: {
      ease: "easeInOut",
    }
  }
};

const loadingText = "Joshua Yang.";
const loadingChars = Array.from(loadingText);

const LoadingScreen = ({isDone}) => {

  return (
    <AnimatePresence>
      {isDone && <div class= "h-screen flex items-center justify-center"> 
        <motion.div class="text-6xl font-fancybody"
          variants={container}
          initial="hidden"
          animate="visible"
          exit="exit"
        >  
          {
            loadingChars.map( (char, index) =>
              <motion.span
              class=""
              key={index}
              variants={word}
              >
                {char}
              </motion.span>
            )
          }
        </motion.div>
      </div>}
    </AnimatePresence>
  )
}

export default LoadingScreen