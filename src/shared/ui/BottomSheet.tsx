import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  snapPoint?: string;
}

export const BottomSheet = ({ isOpen, onClose, children, snapPoint = 'h-auto' }: BottomSheetProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black/60"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className={`fixed bottom-0 left-0 right-0 bg-secondary-bg rounded-t-2xl shadow-2xl ${snapPoint} max-h-[90vh] flex flex-col`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-hint my-3" />
            <div className="overflow-y-auto px-4 pb-4 flex-grow">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
