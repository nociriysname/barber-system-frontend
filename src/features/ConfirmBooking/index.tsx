import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { createBooking } from '@/shared/api/booking';
import { useCurrentUser } from '@/entities/User/model/store';
import { ROUTES } from '@/shared/config/routes';
import { useTelegram } from '@/shared/lib/hooks/useTelegram';
import type { Booking } from '@/shared/types/booking';

interface ConfirmBookingProps {
    masterId: number;
    serviceIds: number[];
    date: Date;
    time: string;
}

export const ConfirmBooking = ({ masterId, serviceIds, date, time }: ConfirmBookingProps) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const user = useCurrentUser();
    const { tg, hapticFeedback } = useTelegram();

    const mutation = useMutation<Booking, Error, {
        employee_id: number;
        service_id: number;
        appointment_time: string;
        user_id: number;
    }>({
        mutationFn: createBooking,
        onSuccess: () => {
            hapticFeedback('success');
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            navigate(ROUTES.HISTORY);
            tg?.showPopup({
                title: 'Успешно!',
                message: 'Вы успешно записались. Детали можно посмотреть на странице "Мои Записи".',
                buttons: [{ type: 'ok' }],
            });
        },
        onError: (error) => {
            hapticFeedback('error');
            tg?.showPopup({
                title: 'Ошибка',
                message: `Не удалось создать запись: ${error.message}`,
                buttons: [{ type: 'ok' }],
            });
        }
    });

    const handleConfirm = () => {
        if (!user) return;

        const [hours, minutes] = time.split(':').map(Number);
        const appointmentTime = new Date(date);
        appointmentTime.setHours(hours, minutes, 0, 0);

        mutation.mutate({
            employee_id: masterId,
            service_id: serviceIds[0], // Backend only accepts one for now
            appointment_time: appointmentTime.toISOString(),
            user_id: user.id,
        });
    };
    
    return (
        <div className="fixed bottom-24 left-4 right-4 z-20">
            <Button 
                className="w-full"
                size="lg"
                onClick={handleConfirm}
                isLoading={mutation.isPending}
            >
                Записаться
            </Button>
        </div>
    );
};
