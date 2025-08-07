import React from 'react';

export const PenguinPlaceholder = ({ onCreateBooking }: { onCreateBooking: () => void }) => (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-250px)] text-center p-4">
        <div className="animate-penguin-sway w-32 h-32">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <path fill="#2c3e50" d="M100 25C70 25 50 50 50 80v60c0 20 20 40 50 40s50-20 50-40V80c0-30-20-55-50-55z"/>
                    <path fill="#ffffff" d="M100 70c-20 0-35 15-35 35v30c0 15 15 25 35 25s35-10 35-25V105c0-20-15-35-35-35z"/>
                    <circle fill="#2c3e50" cx="85" cy="95" r="5"/>
                    <circle fill="#2c3e50" cx="115" cy="95" r="5"/>
                    <path fill="#f39c12" d="M95 115 l5 10 l5 -10 h-10z"/>
                    <ellipse fill="#f39c12" cx="60" cy="140" rx="10" ry="20" transform="rotate(-30 60 140)"/>
                    <ellipse fill="#f39c12" cx="140" cy="140" rx="10" ry="20" transform="rotate(30 140 140)"/>
                    <path fill="#2c3e50" d="M45 100 C 30 110, 30 130, 45 130 L 45 100 Z" />
                    <path fill="#2c3e50" d="M155 100 C 170 110, 170 130, 155 130 L 155 100 Z" />
                </g>
            </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mt-6">Здесь пока пусто</h2>
        <p className="text-[#8E8E93] mt-2 max-w-xs">У вас еще нет записей, но это легко исправить!</p>
        <button onClick={onCreateBooking} className="mt-8 bg-[#007BFF] text-white font-bold py-3 px-8 rounded-xl active:scale-95 transition-transform shadow-lg shadow-blue-500/20">
            Создать бронь
        </button>
    </div>
);
