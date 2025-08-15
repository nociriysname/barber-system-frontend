import React, { useState } from 'react';
import BottomSheet from '../../../shared/ui/BottomSheet';
import { LocationMarkerIcon } from '../../../shared/ui/icons';
import { Branch } from '../../../shared/api/types';

interface CreateBranchSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onAddBranch: (branchData: Omit<Branch, 'id' | 'created_at' | 'updated_at' | 'is_public'>) => void;
    onPickLocation: () => void;
    pickedAddress: string | null;
    pickedCoords: [number, number] | null;
}

export const CreateBranchSheet = ({ isOpen, onClose, onAddBranch, onPickLocation, pickedAddress, pickedCoords }: CreateBranchSheetProps) => {
    const [name, setName] = useState('');

    const handleCreateBranch = () => {
        if (name && pickedAddress && pickedCoords) {
            onAddBranch({ name, address: pickedAddress, coords: pickedCoords });
            setName('');
            onClose();
        }
    };
    
    return (
        <BottomSheet isOpen={isOpen} onClose={onClose}>
            <div className="text-white">
                <h2 className="text-2xl font-bold mb-4">Создать филиал</h2>
                <div className="space-y-4">
                    <input type="text" placeholder="Название филиала" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-[#2c2c2e] rounded-lg border-2 border-transparent focus:border-[#007BFF] outline-none" />
                    
                    {pickedAddress ? (
                        <div className="p-3 bg-[#2c2c2e] rounded-lg">
                            <p className="text-xs text-gray-400">Автоматически определенный адрес</p>
                            <p>{pickedAddress}</p>
                        </div>
                    ) : (
                         <button onClick={onPickLocation} className="w-full p-4 bg-[#2c2c2e] rounded-lg flex items-center justify-center text-center hover:bg-[#3a3a3c] transition-colors">
                            <LocationMarkerIcon className="w-6 h-6 mr-3 text-gray-400" />
                            <span className="font-semibold">Выбрать на карте</span>
                        </button>
                    )}
                   
                    <button onClick={handleCreateBranch} disabled={!name || !pickedAddress || !pickedCoords} className="w-full bg-[#007BFF] text-white font-bold py-3 rounded-xl active:scale-95 transition-transform disabled:bg-gray-500 disabled:opacity-50">Создать</button>
                </div>
            </div>
        </BottomSheet>
    );
};
