import React, { ReactNode } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  snapPoint?: string; // e.g. 'h-[80%]'
}

const BottomSheet = ({ isOpen, onClose, children, snapPoint = 'h-auto' }: BottomSheetProps) => {
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'bg-black/60' : 'bg-transparent pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 bg-[#1E1E1E] rounded-t-2xl shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        } ${snapPoint} max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-[#8E8E93] my-3" />
        <div className="overflow-y-auto px-4 pb-4 flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
