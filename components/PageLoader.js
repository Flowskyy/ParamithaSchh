import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function PageLoader() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[9999] bg-[#FFFFFF] flex flex-col items-center justify-center"
      >
        {/* Logo Container */}
        <div className="relative w-24 h-24 mb-6">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [1, 0.8, 1] 
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative w-full h-full"
          >
            <Image 
              src="/favicon.jpg" 
              alt="Loading..." 
              fill
              className="object-contain"
              priority
            />
          </motion.div>
          
          {/* Pulse Ring */}
          <motion.div
            animate={{ 
              scale: [1, 1.5],
              opacity: [0.5, 0] 
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="absolute inset-0 rounded-full border-2 border-[#C0161C]"
          />
        </div>

        {/* Text */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold bg-gradient-to-r from-[#C0161C] to-[#1E1E8F] bg-clip-text text-transparent mb-8"
        >
          SMK Paramitha 2
        </motion.h2>

        {/* Loading Bar */}
        <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full h-full bg-[#C0161C] rounded-full"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
