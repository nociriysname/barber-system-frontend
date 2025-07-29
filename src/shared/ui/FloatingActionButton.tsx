import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useTelegram } from '../lib/hooks/useTelegram';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
}

export const FloatingActionButton = ({ onClick, icon }: FloatingActionButtonProps) => {
    const { hapticFeedback } = useTelegram();

    const handleClick = () => {
        hapticFeedback('light');
        onClick();
    }
  return (
    <motion.button
      initial={{ scale: 0, y: 100 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0, y: 100 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      onClick={handleClick}
      className="fixed bottom-24 right-4 z-40 w-16 h-16 rounded-full bg-link text-white flex items-center justify-center shadow-lg"
      aria-label="Add"
    >
      {icon || <Plus size={32} />}
    </motion.button>
  );
};
