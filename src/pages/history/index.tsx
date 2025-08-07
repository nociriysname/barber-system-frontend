import React from 'react';
import { View } from '../../shared/api/types';
import { BookingList } from '../../widgets/booking-list';
import { useApi } from '../../shared/api';

interface HistoryPageProps {
    api: ReturnType<typeof useApi>;
    setActiveView: (view: View) => void;
    isAdmin: boolean;
}

export const HistoryPage = ({ api, setActiveView, isAdmin }: HistoryPageProps) => {
    const { currentUser, bookings, cancelBooking, deleteBooking } = api;
    const title = isAdmin ? "Все записи" : "Мои записи";

    return (
        <div className="p-4 pb-24 animate-fade-in-up">
            <h1 className="text-3xl font-bold mb-6 text-white">{title}</h1>
            {currentUser && (
              <BookingList
                bookings={bookings}
                currentUser={currentUser}
                isAdmin={isAdmin}
                onCancel={cancelBooking}
                onDelete={deleteBooking}
                onCreateBooking={() => setActiveView('book')}
              />
            )}
        </div>
    );
};