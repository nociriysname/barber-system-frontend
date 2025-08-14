

import React from 'react';
import { Booking, User, BookingStatus } from '../../../shared/api/types';
import { BookingCard } from '../../../entities/Booking/ui/BookingCard';
import { PenguinPlaceholder } from '../../../shared/ui/PenguinPlaceholder';

interface BookingListProps {
    bookings: Booking[];
    currentUser: User;
    isAdmin: boolean;
    onCancel: (id: number) => void;
    onDelete: (id: number) => void;
    onConfirm: (id: number) => void;
    onCreateBooking?: () => void;
}

export const BookingList = ({ bookings, currentUser, isAdmin, onCancel, onDelete, onConfirm, onCreateBooking }: BookingListProps) => {
    const userBookings = isAdmin ? bookings : bookings.filter(b => b.userName === currentUser.name);

    // Use the enum for robust filtering
    const upcomingBookings = userBookings
        .filter(b => b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.PENDING)
        .sort((a, b) => b.date - a.date);
        
    const pastBookings = userBookings
        .filter(b => b.status !== BookingStatus.CONFIRMED && b.status !== BookingStatus.PENDING)
        .sort((a, b) => b.date - a.date);
    
    if (userBookings.length === 0 && !isAdmin && onCreateBooking) {
        return <PenguinPlaceholder onCreateBooking={onCreateBooking} />;
    }
    
    if (userBookings.length === 0 && (isAdmin || !onCreateBooking)) {
        return <p className="text-[#8E8E93] text-center py-8">Записей нет.</p>
    }

    return (
        <>
            <section>
                <h2 className="text-xl font-semibold text-white/90 mb-4">Предстоящие</h2>
                {upcomingBookings.length > 0 ? (
                    upcomingBookings.map(booking => <BookingCard key={booking.id} booking={booking} onCancel={onCancel} onDelete={onDelete} onConfirm={onConfirm} isAdmin={isAdmin}/>)
                ) : (
                    <p className="text-[#8E8E93]">Нет предстоящих записей.</p>
                )}
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold text-white/90 mb-4">Прошедшие</h2>
                {pastBookings.length > 0 ? (
                    pastBookings.map(booking => <BookingCard key={booking.id} booking={booking} onCancel={onCancel} onDelete={onDelete} onConfirm={onConfirm} isAdmin={isAdmin}/>)
                ) : (
                    <p className="text-[#8E8E93]">Нет прошедших записей.</p>
                )}
            </section>
        </>
    );
};