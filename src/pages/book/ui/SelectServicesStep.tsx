import React from 'react';
import { Service } from '../../../shared/api/types';

interface SelectServicesStepProps {
    services: Service[];
    selectedServices: Service[];
    onServiceToggle: (service: Service) => void;
    onNext: () => void;
    totalPrice: number;
    totalDuration: number;
}

export const SelectServicesStep = ({ services, selectedServices, onServiceToggle, onNext, totalPrice, totalDuration }: SelectServicesStepProps) => (
     <div className="pb-24">
        <div className="space-y-3">
            {services.map((service: Service) => {
                const isSelected = selectedServices.some((s: Service) => s.id === service.id);
                return (
                <button key={service.id} onClick={() => onServiceToggle(service)} className={`w-full text-left p-4 rounded-2xl transition-all duration-200 flex justify-between items-center ${isSelected ? 'bg-[#007BFF]/20 border-2 border-[#007BFF]' : 'bg-[#1E1E1E] border-2 border-transparent'}`}>
                    <div><p className="text-lg font-semibold">{service.name}</p><p className="text-sm text-[#8E8E93]">{Math.floor(service.duration / 60)} ч {service.duration % 60} мин</p></div>
                    <p className="font-bold text-lg">{service.price} ₽</p>
                </button>
            )})}
        </div>
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-[#121212]/80 backdrop-blur-lg border-t border-white/10">
            <button onClick={onNext} disabled={selectedServices.length === 0} className="w-full bg-[#007BFF] text-white font-bold py-4 rounded-xl active:scale-95 transition-transform disabled:bg-gray-500 disabled:opacity-50">
                Далее ({totalDuration} мин / {totalPrice} ₽)
            </button>
        </div>
    </div>
);
