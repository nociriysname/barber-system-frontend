import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNavBar } from '@/widgets/BottomNavBar';
import { MotionDiv } from '@/shared/ui/MotionDiv';

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow">
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </MotionDiv>
      </main>
      <BottomNavBar />
    </div>
  );
};
