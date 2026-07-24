import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CursorGlow: React.FC<{ color?: string }> = ({ color = "rgba(0, 229, 255, 0.15)" }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 rounded-full blur-3xl z-10"
      animate={{ x: pos.x - 150, y: pos.y - 150 }}
      transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
      style={{
        width: 300,
        height: 300,
        backgroundColor: color,
      }}
    />
  );
};