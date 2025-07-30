import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBranchServices } from '@/shared/api/service';
import { Skeleton } from '@/shared/ui/Skeleton';
import { Service } from '@/shared/types/service';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/utils';
import { Check } from 'lucide-react';

interface ServiceSelectProps {
  branchId: number;
  onServicesSelect: (ids: number[]) => void;
  onBack: () => void;
}

const ServiceCard = ({ service, isSelected, onSelect }: { service: Service, isSelected: boolean, onSelect: (id: number) => void }) => (
    <div
        onClick={() => onSelect(service.id)}
        className={cn(
            "p-4 rounded-xl border-2 bg-secondary-bg transition-all cursor-pointer",
            isSelected ? 'border-link' : 'border-transparent'
        )}
    >
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-white/90">{service.name}</h3>
            {isSelected && <Check className="w-6 h-6 text-link" />}
        </div>
        <p className="text-sm text-hint">{service.duration_minutes} мин. • {service.price} ₽</p>
    </div>
);

export const ServiceSelect = ({ branchId, onServicesSelect, onBack }: ServiceSelectProps) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  const { data: servicesData, isLoading } = useQuery({
    queryKey: ['services', branchId],
    queryFn: () => getBranchServices(branchId),
    enabled: !!branchId,
  });

  const handleSelect = (id: number) => {
    setSelectedIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return (
        <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </div>
    );
  }

  return (
    <div>
        <h2 className="text-xl font-bold text-white/90 mb-4">Выберите услугу</h2>
        <div className="space-y-3 mb-4">
            {servicesData?.items.map(service => (
                <ServiceCard key={service.id} service={service} isSelected={selectedIds.includes(service.id)} onSelect={handleSelect} />
            ))}
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={onBack} className="w-full">Назад</Button>
            <Button onClick={() => onServicesSelect(selectedIds)} disabled={selectedIds.length === 0} className="w-full">Далее</Button>
        </div>
    </div>
  );
};
