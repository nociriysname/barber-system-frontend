import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/shared/ui/Button';
import { useTelegram } from '@/shared/lib/hooks/useTelegram';
import { cancelBooking } from '@/shared/api/booking';
import type { Booking } from '@/shared/types/booking';

interface CancelBookingProps {
    bookingId: number;
}

export const CancelBooking = ({ bookingId }: CancelBookingProps) => {
    const { showPopup, hapticFeedback } = useTelegram();
    const queryClient = useQueryClient();

    const mutation = useMutation<Booking, Error, number>({
        mutationFn: cancelBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            hapticFeedback('success');
        },
        onError: () => {
            hapticFeedback('error');
        }
    });

    const handleCancel = async () => {
        hapticFeedback('warning');
        const buttonId = await showPopup({
            title: 'Отмена записи',
            message: 'Вы уверены, что хотите отменить эту запись? Это действие необратимо.',
            buttons: [
                { id: 'confirm', type: 'destructive', text: 'Да, отменить' },
                { type: 'cancel' },
            ],
        });

        if (buttonId === 'confirm') {
            mutation.mutate(bookingId);
        }
    };

    return (
        <Button
            variant="destructive"
            onClick={handleCancel}
            isLoading={mutation.isPending}
            className="w-full"
        >
            Отменить запись
        </Button>
    );
};