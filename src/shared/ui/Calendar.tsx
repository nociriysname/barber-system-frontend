import React, { useState, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface CalendarProps {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
}

export const Calendar = ({ selectedDate, setSelectedDate }: CalendarProps) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - (startOfMonth.getDay() === 0 ? 6 : startOfMonth.getDay() - 1));

    const days = Array.from({ length: 42 }, (_, i) => {
        const day = new Date(startDate);
        day.setDate(day.getDate() + i);
        return day;
    });

    const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    
    const changeMonth = (amount: number) => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
    };

    const isPrevMonthDisabled = currentMonth.getFullYear() <= today.getFullYear() && currentMonth.getMonth() <= today.getMonth();

    return (
        <div className="bg-[#1E1E1E] rounded-2xl p-4">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} disabled={isPrevMonthDisabled} className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"><ChevronLeftIcon className="w-5 h-5" /></button>
                <h3 className="font-semibold text-lg">{currentMonth.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}</h3>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-white/10"><ChevronRightIcon className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center text-sm text-[#8E8E93]">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-y-2 mt-2">
                {days.map((day, index) => {
                    const isUnavailable = day <= today;
                    return (
                        <button
                            key={index}
                            onClick={() => !isUnavailable && setSelectedDate(day)}
                            disabled={isUnavailable}
                            className={`w-10 h-10 mx-auto flex items-center justify-center rounded-full transition-colors 
                                ${isSameDay(day, selectedDate) ? 'bg-[#007BFF] text-white' : 'hover:bg-white/10'} 
                                ${day.getMonth() !== currentMonth.getMonth() ? 'text-gray-600' : 'text-white/90'}
                                ${isUnavailable ? 'text-gray-700 !bg-transparent cursor-not-allowed' : ''}
                            `}
                        >
                            {day.getDate()}
                        </button>
                    )
                })}
            </div>
        </div>
    );
};