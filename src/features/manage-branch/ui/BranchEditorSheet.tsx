
import React, { useState, useMemo, useEffect } from 'react';
import BottomSheet from '../../../shared/ui/BottomSheet';
import { Branch } from '../../../shared/api/types';
import { useApi } from '../../../shared/api';
import { PlusIcon, LoaderIcon } from '../../../shared/ui/icons';
import { RenameBranchSheet } from '../../rename-branch/ui/RenameBranchSheet';
import { CreateMasterSheet } from '../../manage-masters/ui/CreateMasterSheet';
import { MasterAvatar } from '../../../entities/master';
import { usePopup } from '../../../shared/lib/hooks';
import { BookingList } from '../../../widgets/booking-list';

interface BranchEditorSheetProps {
    isOpen: boolean;
    onClose: () => void;
    branch: Branch | null;
    api: ReturnType<typeof useApi>;
}

export const BranchEditorSheet = ({ isOpen, onClose, branch, api }: BranchEditorSheetProps) => {
    const { masters, updateBranch, deleteMaster, bookings, currentUser, cancelBooking, deleteBooking } = api;
    const { showPopup } = usePopup();

    const [activeTab, setActiveTab] = useState<'settings' | 'bookings'>('settings');
    const [isUpdatingPublic, setIsUpdatingPublic] = useState(false);
    const [isRenameSheetOpen, setIsRenameSheetOpen] = useState(false);
    const [isCreateMasterSheetOpen, setIsCreateMasterSheetOpen] = useState(false);

    // Reset tab to settings when a new branch is opened
    useEffect(() => {
        if (isOpen) {
            setActiveTab('settings');
        }
    }, [isOpen]);

    if (!branch) return null;

    const branchMasters = masters.filter(m => m.barbershop_id === branch.id);
    const branchBookings = useMemo(() => bookings.filter(b => b.branchAddress === branch.address), [bookings, branch]);

    const handleTogglePublic = async () => {
        setIsUpdatingPublic(true);
        await updateBranch(branch.id, { is_public: !branch.is_public });
        setIsUpdatingPublic(false);
    };
    
    const handleDeleteMaster = (masterId: number, masterName: string) => {
        showPopup({
            title: 'Удалить мастера?',
            message: `Вы уверены, что хотите удалить мастера "${masterName}"?`,
            buttons: [{ id: 'delete', text: 'Удалить', type: 'destructive' }, { id: 'cancel', text: 'Отмена' }]
        }, (id) => {
            if (id === 'delete') {
                deleteMaster(masterId);
            }
        });
    }

    const SettingsTab = () => (
        <div className="space-y-4">
            <div className="bg-[#1E1E1E] p-4 rounded-2xl">
                <div className="flex justify-between items-center">
                    <p className="font-bold text-lg">Публичный доступ</p>
                    <button onClick={handleTogglePublic} disabled={isUpdatingPublic} className="relative inline-flex items-center h-8 rounded-full w-14 transition-colors duration-300 focus:outline-none disabled:opacity-50">
                        <div className={`absolute inset-0 rounded-full transition-colors ${branch.is_public ? 'bg-[#007BFF]' : 'bg-gray-600'}`}></div>
                        {isUpdatingPublic ? (
                            <LoaderIcon className={`inline-block w-6 h-6 text-white transform transition-transform duration-300 ${branch.is_public ? 'translate-x-7' : 'translate-x-1'} animate-spin`} />
                        ) : (
                            <span className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ${branch.is_public ? 'translate-x-7' : 'translate-x-1'}`} />
                        )}
                    </button>
                </div>
                <p className="text-sm text-gray-400 mt-2">{branch.is_public ? 'Филиал виден всем пользователям' : 'Филиал виден только администраторам'}</p>
            </div>

            <button onClick={() => setIsRenameSheetOpen(true)} className="w-full text-center py-3 bg-[#2c2c2e] rounded-lg font-semibold hover:bg-[#3a3a3c] transition-colors">Переименовать филиал</button>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold">Мастера</h3>
                    <button onClick={() => setIsCreateMasterSheetOpen(true)} className="flex items-center space-x-2 text-[#007BFF] font-bold">
                        <PlusIcon className="w-6 h-6"/>
                        <span>Добавить</span>
                    </button>
                </div>
                <div className="space-y-2">
                    {branchMasters.map(master => (
                        <div key={master.id} className="flex items-center justify-between p-2 pl-3 bg-[#1E1E1E] rounded-lg">
                            <div className="flex items-center space-x-3">
                                <MasterAvatar name={master.name} avatarUrl={master.avatarUrl} className="w-10 h-10 text-xl"/>
                                <div>
                                    <p>{master.name}</p>
                                    {master.username && <p className="text-xs text-gray-400">{master.username}</p>}
                                </div>
                            </div>
                            <button onClick={() => handleDeleteMaster(master.id, master.name)} className="font-semibold text-red-500 px-2">Удалить</button>
                        </div>
                    ))}
                    {branchMasters.length === 0 && <p className="text-gray-400 text-sm text-center py-4">В этом филиале пока нет мастеров.</p>}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <BottomSheet isOpen={isOpen} onClose={onClose} snapPoint="h-[90%]">
                <div className="text-white">
                    <h2 className="text-2xl font-bold mb-1">{branch.name}</h2>
                    <p className="text-sm text-gray-400 mb-4">{branch.address}</p>

                     <div className="flex border-b border-white/10 mb-4">
                        <button 
                            onClick={() => setActiveTab('settings')}
                            className={`flex-1 py-3 font-semibold transition-colors ${activeTab === 'settings' ? 'text-[#007BFF] border-b-2 border-[#007BFF]' : 'text-gray-400'}`}
                        >
                            Настройки
                        </button>
                        <button 
                             onClick={() => setActiveTab('bookings')}
                             className={`flex-1 py-3 font-semibold transition-colors ${activeTab === 'bookings' ? 'text-[#007BFF] border-b-2 border-[#007BFF]' : 'text-gray-400'}`}
                        >
                            Записи ({branchBookings.length})
                        </button>
                    </div>

                    {activeTab === 'settings' && <SettingsTab />}
                    {activeTab === 'bookings' && (
                        currentUser && (
                            <BookingList 
                                bookings={branchBookings}
                                currentUser={currentUser}
                                isAdmin={true}
                                onCancel={cancelBooking}
                                onDelete={deleteBooking}
                            />
                        )
                    )}
                </div>
            </BottomSheet>

            <RenameBranchSheet
                isOpen={isRenameSheetOpen}
                onClose={() => setIsRenameSheetOpen(false)}
                branch={branch}
                api={api}
            />
            
            <CreateMasterSheet 
                isOpen={isCreateMasterSheetOpen}
                onClose={() => setIsCreateMasterSheetOpen(false)}
                branchId={branch.id}
                api={api}
            />
        </>
    );
};
