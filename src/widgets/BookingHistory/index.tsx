import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useIsAdminMode } from '@/entities/User/model/store';
import { getAllAppointments, getMyBookings } from '@/shared/api/booking';
import { BookingHistorySkeleton } from './ui/BookingHistorySkeleton';
import { BookingCard } from '@/entities/Booking/ui/BookingCard';
import { Booking } from '@/shared/types/booking';

export const BookingHistory = () => {
    const isAdminMode = useIsAdminMode();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['bookings', { isAdmin: isAdminMode }],
        queryFn: () => isAdminMode 
            ? getAllAppointments({ limit: 100, offset: 0 })
            : getMyBookings({ limit: 100, offset: 0 }),
    });

    const { upcoming, past } = useMemo(() => {
        if (!data) return { upcoming: [], past: [] };

        const upcomingBookings: Booking[] = [];
        const pastBookings: Booking[] = [];

        data.items.forEach(booking => {
            if (booking.is_past || booking.status === 'COMPLETED' || booking.status === 'CANCELED') {
                pastBookings.push(booking);
            } else {
                upcomingBookings.push(booking);
            }
        });

        // Sort past bookings to show the most recent first
        pastBookings.sort((a, b) => new Date(b.appointment_time).getTime() - new Date(a.appointment_time).getTime());

        return { upcoming: upcomingBookings, past: pastBookings };
    }, [data]);
    
    if (isLoading) {
        return <BookingHistorySkeleton />;
    }

    if (isError) {
        return <div className="text-red-500 text-center p-4">Ошибка при загрузке записей: {error.message}</div>;
    }

    if (!data || data.items.length === 0) {
        return <div className="text-hint text-center p-4">У вас пока нет записей.</div>
    }

    return (
        <div className="space-y-8">
            {upcoming.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold text-white/90 mb-4">Предстоящие</h2>
                    {upcoming.map(booking => <BookingCard key={booking.id} booking={booking} />)}
                </section>
            )}

            {past.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold text-white/90 mb-4">Прошедшие</h2>
                     {past.map(booking => <BookingCard key={booking.id} booking={booking} />)}
                </section>
            )}
        </div>
    );
};
