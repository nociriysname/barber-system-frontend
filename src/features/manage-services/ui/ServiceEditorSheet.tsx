
import React, { useState, useEffect } from 'react';
import BottomSheet from '../../../shared/ui/BottomSheet';
import { Service } from '../../../shared/api/types';
import { useApi } from '../../../shared/api';
import { LoaderIcon } from '../../../shared/ui/icons';

interface ServiceEditorSheetProps {
    isOpen: boolean;
    onClose: () => void;
    service: Service | null;
    branchId: number;
    api: ReturnType<typeof useApi>;
}

export const ServiceEditorSheet = ({ isOpen, onClose, service, branchId, api }: ServiceEditorSheetProps) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (service) {
            setName(service.name);
            setPrice(String(service.price));
            setDuration(String(service.duration_minutes));
        } else {
            setName('');
            setPrice('');
            setDuration('');
        }
    }, [service, isOpen]);

    const handleSubmit = async () => {
        const numPrice = parseFloat(price);
        const numDuration = parseInt(duration, 10);

        if (name && !isNaN(numPrice) && numPrice > 0 && !isNaN(numDuration) && numDuration > 0) {
            setIsSubmitting(true);
            const serviceData = { name, price: numPrice, duration_minutes: numDuration, barbershop_id: branchId };
            if (service) {
                await api.updateService(service.id, serviceData);
            } else {
                await api.addService(serviceData);
            }
            setIsSubmitting(false);
            onClose();
        }
    };
    
    const isFormValid = name && price && duration && parseFloat(price) > 0 && parseInt(duration, 10) > 0;
    const title = service ? 'Редактировать услугу' : 'Новая услуга';

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose}>
            <div className="text-white">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <div className="space-y-4">
                    <input type="text" placeholder="Название услуги" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-[#2c2c2e] rounded-lg border-2 border-transparent focus:border-[#007BFF] outline-none" />
                    <input type="number" placeholder="Стоимость (₽)" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-3 bg-[#2c2c2e] rounded-lg border-2 border-transparent focus:border-[#007BFF] outline-none" />
                    <input type="number" placeholder="Длительность (мин)" value={duration} onChange={e => setDuration(e.target.value)} className="w-full p-3 bg-[#2c2c2e] rounded-lg border-2 border-transparent focus:border-[#007BFF] outline-none" />
                    <button onClick={handleSubmit} disabled={!isFormValid || isSubmitting} className="w-full bg-[#007BFF] text-white font-bold py-3 rounded-xl active:scale-95 transition-transform flex items-center justify-center disabled:bg-gray-500 disabled:opacity-50">
                        {isSubmitting ? <LoaderIcon className="w-6 h-6 animate-spin" /> : (service ? 'Сохранить' : 'Создать')}
                    </button>
                </div>
            </div>
        </BottomSheet>
    );
};
