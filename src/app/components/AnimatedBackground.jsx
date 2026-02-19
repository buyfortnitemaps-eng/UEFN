"use client";
import { motion } from "framer-motion";
import { Box, Code2, Zap, Grid3x3 } from "lucide-react";

const icons = [
  { Icon: Box, x: "-30%", y: "20%", delay: 0 },
  { Icon: Code2, x: "40%", y: "10%", delay: 2 },
  { Icon: Zap, x: "-35%", y: "-20%", delay: 4 },
  { Icon: Grid3x3, x: "35%", y: "-25%", delay: 6 },
];

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, x, y, delay }, i) => (
        <motion.div
          key={i}
          className="absolute text-purple-500/20"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            rotate: 360,
            y: [0, -20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
            delay,
          }}
          style={{
            left: x,
            top: y,
          }}
        >
          <Icon size={120} strokeWidth={1} />
        </motion.div>
      ))}
    </div>
  );
}
