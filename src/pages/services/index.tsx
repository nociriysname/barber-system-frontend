
import React, { useState, useMemo } from 'react';
import { useApi } from '../../shared/api';
import { Service } from '../../shared/api/types';
import { PlusIcon } from '../../shared/ui/icons';
import { usePopup } from '../../shared/lib/hooks';
import { ServiceEditorSheet } from '../../features/manage-services/ui/ServiceEditorSheet';

interface ServiceCardProps {
    service: Service;
    onEdit: () => void;
    onDelete: () => void;
}

const ServiceCard = ({ service, onEdit, onDelete }: ServiceCardProps) => (
    <div className="bg-[#1E1E1E] rounded-2xl p-4 flex justify-between items-center">
        <div>
            <p className="text-lg font-semibold">{service.name}</p>
            <p className="text-sm text-gray-400">{service.duration_minutes} мин · {service.price} ₽</p>
        </div>
        <div className="flex space-x-2">
            <button onClick={onEdit} className="font-semibold text-blue-500">Править</button>
            <button onClick={onDelete} className="font-semibold text-red-500">Удалить</button>
        </div>
    </div>
);

export const ServicesPage = ({ api }: { api: ReturnType<typeof useApi> }) => {
    const { branches, services, deleteService } = api;
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(branches[0]?.id || null);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const { showPopup } = usePopup();

    const servicesForBranch = useMemo(() => {
        if (!selectedBranchId) return [];
        return services.filter(s => s.barbershop_id === selectedBranchId);
    }, [services, selectedBranchId]);

    const handleSelectBranch = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBranchId(Number(e.target.value));
    };

    const handleEditService = (service: Service) => {
        setEditingService(service);
        setIsCreating(true);
    };

    const handleAddService = () => {
        if (!selectedBranchId) return;
        setEditingService(null);
        setIsCreating(true);
    };

    const handleDeleteService = (service: Service) => {
         showPopup({
            title: 'Подтвердите удаление',
            message: `Вы уверены, что хотите удалить услугу "${service.name}"?`,
            buttons: [{id: 'yes', text: 'Удалить', type: 'destructive'}, {id: 'no', text: 'Отмена'}]
        }, (id) => {
            if(id === 'yes') {
                deleteService(service.id);
            }
        });
    };
    
    if (!selectedBranchId) {
        return <div className="p-4 text-center">Нет доступных филиалов для управления.</div>
    }

    return (
        <div className="p-4 pb-24 animate-fade-in-up">
            <h1 className="text-3xl font-bold mb-4 text-white">Услуги</h1>

            <div className="mb-6">
                <select 
                    value={selectedBranchId} 
                    onChange={handleSelectBranch} 
                    className="w-full p-4 bg-[#1E1E1E] rounded-2xl border-2 border-transparent focus:border-[#007BFF] outline-none text-white text-lg font-semibold"
                >
                    {branches.map(branch => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                </select>
            </div>
            
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white/90">Список услуг</h2>
                 <button onClick={handleAddService} className="flex items-center space-x-2 text-[#007BFF] font-bold">
                    <PlusIcon className="w-6 h-6"/>
                    <span>Добавить</span>
                </button>
            </div>

            <div className="space-y-3">
                {servicesForBranch.map(service => (
                    <ServiceCard 
                        key={service.id} 
                        service={service} 
                        onEdit={() => handleEditService(service)}
                        onDelete={() => handleDeleteService(service)}
                    />
                ))}
                {servicesForBranch.length === 0 && <p className="text-gray-400 text-center py-8">В этом филиале пока нет услуг.</p>}
            </div>

            <ServiceEditorSheet 
                isOpen={isCreating}
                onClose={() => setIsCreating(false)}
                service={editingService}
                branchId={selectedBranchId}
                api={api}
            />
        </div>
    );
};
