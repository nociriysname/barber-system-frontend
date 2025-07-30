import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { BottomNavBar } from '@/widgets/BottomNavBar';
import { MotionDiv } from '@/shared/ui/MotionDiv';

export const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <MotionDiv
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </MotionDiv>
        </AnimatePresence>
      </main>
      <BottomNavBar />
    </div>
  );
};
