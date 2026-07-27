import React from 'react';
import { motion } from 'framer-motion';

export const AuroraGradient: React.FC<{ primary?: string; secondary?: string }> = ({
  primary = '#7C3AED',
  secondary = '#EC4899',
}) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 45, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${primary} 0%, transparent 60%)`,
        }}
        className="absolute -left-[10%] -top-[20%] h-[70vw] w-[70vw] rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, -45, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${secondary} 0%, transparent 60%)`,
        }}
        className="absolute -bottom-[20%] -right-[10%] h-[60vw] w-[60vw] rounded-full blur-[140px]"
      />
    </div>
  );
};
