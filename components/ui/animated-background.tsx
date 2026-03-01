"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">

      {/* Base Background */}
      <div className="absolute inset-0 bg-background" />

      {/* Circle 1 */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full bg-indigo-500/20"
        animate={{
          x: [0, 150, -120, 0],
          y: [0, -100, 120, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ top: "-10%", left: "-10%" }}
      />

      {/* Circle 2 */}
      <motion.div
        className="absolute w-[650px] h-[650px] rounded-full bg-violet-500/20"
        animate={{
          x: [0, -180, 100, 0],
          y: [0, 120, -80, 0],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ bottom: "-15%", right: "-10%" }}
      />

      {/* Circle 3 */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-sky-500/20"
        animate={{
          x: [0, 120, -150, 0],
          y: [0, -150, 80, 0],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ top: "40%", left: "50%" }}
      />
    </div>
  );
}