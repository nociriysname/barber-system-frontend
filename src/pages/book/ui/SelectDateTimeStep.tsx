import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Master } from '../../../shared/api/types';
import { Calendar } from '../../../shared/ui/Calendar';
import { telegramService } from '../../../shared/lib/telegram';

interface SelectDateTimeStepProps {
    master: Master | null;
    totalDuration: number;
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    timeSlots: string[];
    occupiedSlots: Set<string>;
    onConfirmBooking: (time: string) => void;
    totalPrice: number;
}

export const SelectDateTimeStep = ({ master, totalDuration, selectedDate, setSelectedDate, timeSlots, occupiedSlots, onConfirmBooking, totalPrice }: SelectDateTimeStepProps) => {
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [timeGridError, setTimeGridError] = useState(false);
    const [flashingSlot, setFlashingSlot] = useState<string | null>(null);
    const timeGridErrorTimeoutRef = useRef<any>(null);
    const flashingSlotTimeoutRef = useRef<any>(null);

    const requiredSlotsCount = useMemo(() => Math.ceil(totalDuration / 30), [totalDuration]);

    useEffect(() => { setSelectedTime(null); }, [master, selectedDate, totalDuration]);

    const canStartHere = (time: string): boolean => {
        if (requiredSlotsCount === 0) return false;
        const startIndex = timeSlots.indexOf(time);
        if (startIndex === -1 || startIndex + requiredSlotsCount > timeSlots.length) return false;
        for (let i = 0; i < requiredSlotsCount; i++) {
            if (occupiedSlots.has(timeSlots[startIndex + i])) return false;
        }
        return true;
    };
    
     const handleTimeSlotClick = (time: string) => {
        if (time === selectedTime) {
             setSelectedTime(null);
             telegramService.hapticSelection();
             return;
        }

        if (canStartHere(time)) {
            setSelectedTime(time);
            telegramService.hapticSelection();
        } else {
            if (timeGridErrorTimeoutRef.current) clearTimeout(timeGridErrorTimeoutRef.current);
            if (flashingSlotTimeoutRef.current) clearTimeout(flashingSlotTimeoutRef.current);
            setTimeGridError(false);
            setFlashingSlot(null);
            setTimeout(() => {
                setTimeGridError(true);
                setFlashingSlot(time);
                telegramService.hapticNotification('error');
                telegramService.showPopup({ title: 'Недоступно', message: 'Недостаточно времени для записи или этот слот занят.', buttons: [{ type: 'ok', text: 'Понятно' }] });
                timeGridErrorTimeoutRef.current = setTimeout(() => setTimeGridError(false), 820);
                flashingSlotTimeoutRef.current = setTimeout(() => setFlashingSlot(null), 500);
            }, 10);
        }
    };
    
    const selectedBlock: string[] = useMemo(() => {
        if (!selectedTime) return [];
        const startIndex = timeSlots.indexOf(selectedTime);
        if (startIndex === -1) return [];
        return timeSlots.slice(startIndex, startIndex + requiredSlotsCount);
    }, [selectedTime, requiredSlotsCount, timeSlots]);


    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Выберите дату и время</h2>
            <p className="text-[#8E8E93] mb-4">Мастер: {master?.name} <br/> Длительность: {totalDuration} мин</p>
            <div className="mt-4"><h3 className="text-xl font-bold mb-3">Календарь</h3><Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} /></div>
            <div className="mt-6">
                <h3 className="text-xl font-bold mb-3">Доступное время</h3>
                <div className={`grid grid-cols-4 gap-3 ${timeGridError ? 'animate-shake' : ''}`}>
                    {timeSlots.map((time: string) => {
                        const isOccupied = occupiedSlots.has(time);
                        const isSelectedStart = selectedTime === time;
                        const isInSelectedBlock = selectedBlock.includes(time);
                        const isFlashing = flashingSlot === time;

                        let buttonClass = 'py-3 rounded-xl font-semibold transition-all duration-200';
                        let isDisabled = false;

                        if (isOccupied) { 
                            buttonClass += ' bg-[#2a2a2d] text-[#8E8E93]/50 line-through cursor-not-allowed';
                            isDisabled = true;
                        } else if (isInSelectedBlock) {
                            buttonClass += ' bg-[#007BFF] text-white shadow-lg shadow-blue-500/30';
                            if (!isSelectedStart) buttonClass += ' opacity-70 cursor-not-allowed';
                            isDisabled = !isSelectedStart;
                        } else { 
                            buttonClass += ' border-2 border-[#007BFF]/50 text-[#007BFF] hover:bg-[#007BFF]/10 active:scale-95'; 
                        }
                        
                        if (isFlashing) buttonClass += ' animate-flash-red';

                        return (<button key={time} onClick={() => handleTimeSlotClick(time)} className={buttonClass} disabled={isDisabled}>{time}</button>);
                    })}
                </div>
                 {timeSlots.length === 0 && <p className="text-gray-400 text-center py-4">Мастер не работает в этот день или нет доступных слотов.</p>}
            </div>
            {selectedTime && (
                <div className="fixed bottom-20 left-0 right-0 p-4 bg-[#121212]/80 backdrop-blur-lg border-t border-white/10">
                    <button onClick={() => onConfirmBooking(selectedTime)} className="w-full bg-[#007BFF] text-white font-bold py-4 rounded-xl active:scale-95 transition-transform">Записаться за {totalPrice} ₽</button>
                </div>
            )}
        </div>
    );
}
