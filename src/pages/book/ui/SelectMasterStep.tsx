import React from 'react';
import { Master } from '../../../shared/api/types';
import { MasterCard } from './MasterCard';

interface SelectMasterStepProps {
    masters: Master[];
    onMasterSelect: (master: Master) => void;
    onAvatarUpdate: (masterId: number, file: File) => void;
    isAdmin: boolean;
}

export const SelectMasterStep = ({ masters, onMasterSelect, onAvatarUpdate, isAdmin }: SelectMasterStepProps) => (
    <div>
        <h2 className="text-2xl font-bold mb-3">Выберите мастера</h2>
        <div className="flex space-x-2 overflow-x-auto pb-3 -mx-4 px-4">
            {masters.map(master => (
                <MasterCard
                    key={master.id}
                    master={master}
                    onSelect={() => onMasterSelect(master)}
                    onAvatarUpdate={(file) => onAvatarUpdate(master.id, file)}
                    isAdmin={isAdmin}
                />
            ))}
        </div>
    </div>
);
