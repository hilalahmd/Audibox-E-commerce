import React from "react";
import { motion } from "framer-motion";

const transitionVariants = {
  initial: { opacity: 0, scale: 0.99 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.2, ease: "easeOut" } 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.1, ease: "easeIn" } 
  }
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      variants={transitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
