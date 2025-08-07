
import React, { useState, useEffect } from 'react';
import BottomSheet from '../../../shared/ui/BottomSheet';
import { Branch } from '../../../shared/api/types';
import { useApi } from '../../../shared/api';
import { usePopup } from '../../../shared/lib/hooks';
import { LoaderIcon } from '../../../shared/ui/icons';

interface RenameBranchSheetProps {
    isOpen: boolean;
    onClose: () => void;
    branch: Branch;
    api: ReturnType<typeof useApi>;
}

export const RenameBranchSheet = ({ isOpen, onClose, branch, api }: RenameBranchSheetProps) => {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showPopup } = usePopup();

    useEffect(() => {
        if (branch) {
            setName(branch.name);
        }
    }, [branch, isOpen]);

    const handleRename = () => {
        if (!name.trim() || name.trim() === branch.name) return;

        showPopup({
            title: 'Подтвердите смену имени',
            message: `Вы уверены что хотите переименовать "${branch.name}" в "${name.trim()}"?`,
            buttons: [{ id: 'yes', text: 'Да', type: 'destructive' }, { id: 'no', text: 'Нет' }]
        }, async (btnId) => {
            if (btnId === 'yes') {
                setIsSubmitting(true);
                await api.updateBranch(branch.id, { name: name.trim() });
                setIsSubmitting(false);
                onClose();
            }
        });
    };
    
    return (
        <BottomSheet isOpen={isOpen} onClose={onClose}>
            <div className="text-white">
                <h2 className="text-2xl font-bold mb-4">Переименовать филиал</h2>
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Новое название" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full p-3 bg-[#2c2c2e] rounded-lg border-2 border-transparent focus:border-[#007BFF] outline-none" 
                    />
                    <button 
                        onClick={handleRename}
                        disabled={!name.trim() || name.trim() === branch.name || isSubmitting}
                        className="w-full bg-[#007BFF] text-white font-bold py-3 rounded-xl active:scale-95 transition-transform flex items-center justify-center disabled:bg-gray-500 disabled:opacity-50"
                    >
                         {isSubmitting ? <LoaderIcon className="w-6 h-6 animate-spin" /> : 'Сохранить'}
                    </button>
                </div>
            </div>
        </BottomSheet>
    );
};
