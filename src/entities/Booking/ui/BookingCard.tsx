import React from 'react';
import { Booking } from '../../../shared/api/types';
import { AdminBookingCard } from './AdminBookingCard';
import { UserBookingCard } from './UserBookingCard';

interface BookingCardProps {
    booking: Booking;
    onCancel: (id: number) => void;
    onDelete: (id: number) => void;
    onConfirm: (id: number) => void;
    onComplete: (id: number) => void;
    isAdmin: boolean;
}

export const BookingCard = ({ booking, onCancel, onDelete, onConfirm, onComplete, isAdmin }: BookingCardProps) => {
    if (isAdmin) {
        return (
            <AdminBookingCard 
                booking={booking} 
                onDelete={onDelete} 
                onConfirm={onConfirm} 
                onComplete={onComplete} 
            />
        );
    }

    return (
        <UserBookingCard 
            booking={booking} 
            onCancel={onCancel}
            isAdmin={isAdmin}
        />
    );
};
