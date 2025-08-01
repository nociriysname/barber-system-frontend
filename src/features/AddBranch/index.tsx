import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Branch } from '@/shared/types/branch';
import { createBranch } from '@/shared/api/branch'; // <-- Нужно будет создать эту функцию в api/branch.ts
import { useTelegram } from '@/shared/lib/hooks/useTelegram';
import { FloatingActionButton } from '@/shared/ui/FloatingActionButton';
import { BottomSheet } from '@/shared/ui/BottomSheet';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

type FormInputs = {
    name: string;
};

// Пропс для компонента выбора локации на карте, который нужно будет создать
interface LocationPickerProps {
    onConfirm: (coords: [number, number], address: string) => void;
    onCancel: () => void;
}

// TODO: Создать компонент LocationPicker
const LocationPicker = ({ onConfirm, onCancel }: LocationPickerProps) => {
    // Здесь будет логика с картой и маркером в центре
    return <div>Режим выбора локации (в разработке)...</div>
};

export const AddBranch = () => {
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [isPickingLocation, setPickingLocation] = useState(false);
    const [branchData, setBranchData] = useState<{ coords: [number, number], address: string } | null>(null);

    const queryClient = useQueryClient();
    const { hapticFeedback } = useTelegram();
    const { register, handleSubmit, setValue } = useForm<FormInputs>();

    const mutation = useMutation<Branch, Error, Omit<Branch, 'id'|'created_at'|'updated_at'|'image_id'|'image_url'>>({
        mutationFn: createBranch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['branches'] });
            hapticFeedback('success');
            setSheetOpen(false);
        }
    });

    const handleLocationConfirm = (coords: [number, number], address: string) => {
        setBranchData({ coords, address });
        setPickingLocation(false);
        setSheetOpen(true);
    };
    
    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        if (!branchData) return;
        mutation.mutate({
            name: data.name,
            address: branchData.address,
            latitude: branchData.coords[0],
            longitude: branchData.coords[1],
            phone_number: null
        });
    };

    return (
        <>
            <FloatingActionButton onClick={() => setSheetOpen(true)} />
            <BottomSheet isOpen={isSheetOpen} onClose={() => setSheetOpen(false)}>
                {/* Логика формы */}
            </BottomSheet>
            {isPickingLocation && (
                <div className="fixed inset-0 z-50 bg-background">
                     <LocationPicker 
                        onConfirm={handleLocationConfirm} 
                        onCancel={() => setPickingLocation(false)} 
                     />
                </div>
            )}
        </>
    );
};