import React from 'react';

interface AdminToggleProps {
    isAdmin: boolean;
    setAdmin: (val: boolean) => void;
}

export const AdminToggle = ({ isAdmin, setAdmin }: AdminToggleProps) => (
    <div className="mt-6 bg-[#1E1E1E] p-4 rounded-2xl">
        <div className="flex justify-between items-center">
            <p className="font-bold text-lg text-amber-400">Режим администратора</p>
            <button
                onClick={() => setAdmin(!isAdmin)}
                className={`relative inline-flex items-center h-8 rounded-full w-14 transition-colors duration-300 focus:outline-none ${
                    isAdmin ? 'bg-[#007BFF]' : 'bg-gray-600'
                }`}
            >
                <span
                    className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ${
                        isAdmin ? 'translate-x-7' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
        <p className="text-sm text-gray-400 mt-2">
            {isAdmin ? 'Вы вошли как администратор. Вам доступны дополнительные функции.' : 'Выключено.'}
        </p>
    </div>
);
