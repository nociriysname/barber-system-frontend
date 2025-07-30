import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEmployeeSchedule } from '@/shared/api/employee';
import { Button } from '@/shared/ui/Button';
import { Skeleton } from '@/shared/ui/Skeleton';
import { cn } from '@/shared/lib/utils';

interface DateTimeSelectProps {
  masterId: number;
  serviceIds: number[];
  selectedTime: string | null;
  onDateTimeSelect: (date: Date, time: string) => void;
  onBack: () => void;
}

export const DateTimeSelect = ({ masterId, serviceIds, selectedTime, onDateTimeSelect, onBack }: DateTimeSelectProps) => {
  const [date, setDate] = useState(new Date());

  const { data: schedule, isLoading } = useQuery({
    queryKey: ['schedule', masterId, date.toISOString().split('T')[0], serviceIds],
    queryFn: () => getEmployeeSchedule({
      employeeId: masterId,
      serviceId: serviceIds[0], // Backend only accepts one for now
      onDate: date.toISOString().split('T')[0],
    }),
    enabled: !!masterId && serviceIds.length > 0 && !!date,
  });

  const handleTimeSelect = (time: string) => {
      onDateTimeSelect(date, time);
  };
  
  // Basic calendar - just shows today for simplicity
  const Calendar = () => (
      <div className="p-4 bg-secondary-bg rounded-xl mb-4">
          <p className="text-center font-semibold text-white">
              {date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
      </div>
  );

  return (
    <div>
        <h2 className="text-xl font-bold text-white/90 mb-4">Выберите дату и время</h2>
        <Calendar />
        <div className="grid grid-cols-4 gap-2 mb-4">
            {isLoading && [...Array(8)].map((_, i) => <Skeleton key={i} className="h-10" />)}
            {schedule && Object.entries(schedule).map(([time, isAvailable]) => (
                <Button
                    key={time}
                    variant={selectedTime === time ? 'default' : 'outline'}
                    disabled={!isAvailable}
                    onClick={() => handleTimeSelect(time)}
                >
                    {time}
                </Button>
            ))}
        </div>
         <div className="flex gap-2">
            <Button variant="outline" onClick={onBack} className="w-full">Назад</Button>
        </div>
    </div>
  );
};
