import React from "react";
import { motion } from "framer-motion";

const AnimatedText = ({ text, className = "", delay = 0, as = "h1" }) => {
  const words = text.split(" ");

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay
      }
    }
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 8
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const MotionTag = motion[as] || motion.h1;

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
      style={{
        overflow: "hidden",
        lineHeight: 1.2
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          style={{
            display: "inline-block",
            marginRight: "0.25em",
            willChange: "transform",
            transform: "translate3d(0,0,0)"
          }}
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
};

export default AnimatedText;
