
import React, { useState, useMemo, useEffect } from 'react';
import BottomSheet from '../../../shared/ui/BottomSheet';
import { Branch, Master } from '../../../shared/api/types';
import { useApi } from '../../../shared/api';
import { PlusIcon, PencilIcon } from '../../../shared/ui/icons';
import { RenameBranchSheet } from '../../rename-branch/ui/RenameBranchSheet';
import { CreateMasterSheet } from '../../manage-masters/ui/CreateMasterSheet';
import { MasterAvatar } from '../../../entities/master';
import { usePopup } from '../../../shared/lib/hooks';
import { BookingList } from '../../../widgets/booking-list';
import { EditMasterSheet } from '../../manage-masters/ui/EditMasterSheet';

interface BranchEditorSheetProps {
    isOpen: boolean;
    onClose: () => void;
    branch: Branch | null;
    api: ReturnType<typeof useApi>;
}

export const BranchEditorSheet = ({ isOpen, onClose, branch, api }: BranchEditorSheetProps) => {
    const { masters, updateBranch, deleteMaster, bookings, currentUser, cancelBooking, deleteBooking, confirmBooking, completeBooking } = api;
    const { showPopup } = usePopup();

    const [activeTab, setActiveTab] = useState<'settings' | 'bookings'>('settings');
    const [isUpdatingPublic, setIsUpdatingPublic] = useState(false);
    const [isRenameSheetOpen, setIsRenameSheetOpen] = useState(false);
    const [isCreateMasterSheetOpen, setIsCreateMasterSheetOpen] = useState(false);
    const [editingMaster, setEditingMaster] = useState<Master | null>(null);

    // Локальное состояние для визуального состояния переключателя, чтобы обеспечить оптимистичное обновление UI.
    const [isPublic, setIsPublic] = useState(branch?.is_public || false);

    useEffect(() => {
        // Когда открывается панель или меняются данные о филиале, синхронизируем локальное состояние.
        if (isOpen && branch) {
            setIsPublic(branch.is_public);
            setActiveTab('settings'); // Сбрасываем на вкладку настроек при открытии
        }
    }, [isOpen, branch]);

    const branchBookings = useMemo(() => {
        if (!branch) return [];
        return bookings.filter(b => b.branchAddress === branch.address);
    }, [bookings, branch]);

    if (!branch) return null;

    const branchMasters = masters.filter(m => m.barbershop_id === branch.id);

    const handleTogglePublic = async () => {
        if (isUpdatingPublic || !branch) return;

        const newIsPublicState = !isPublic;

        // 1. Оптимистично обновляем локальное состояние для мгновенной анимации UI.
        setIsPublic(newIsPublicState);
        setIsUpdatingPublic(true);

        try {
            // 2. Вызываем API для сохранения изменения.
            await updateBranch(branch.id, { is_public: newIsPublicState });
        } catch (error) {
            console.error("Failed to update branch status:", error);
            // 3. Если вызов API не удался, возвращаем переключатель в исходное состояние.
            setIsPublic(!newIsPublicState);
            showPopup({
                title: 'Ошибка',
                message: 'Не удалось изменить статус филиала. Попробуйте снова.',
                buttons: [{ id: 'ok', text: 'OK' }]
            });
        } finally {
            // 4. Снова включаем кнопку.
            setIsUpdatingPublic(false);
        }
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
                    <button onClick={handleTogglePublic} disabled={isUpdatingPublic} className="relative inline-flex items-center h-8 rounded-full w-14 transition-colors duration-300 focus:outline-none">
                        <div className={`absolute inset-0 rounded-full transition-colors duration-300 ${isPublic ? 'bg-[#007BFF]' : 'bg-gray-600'}`}></div>
                        <span className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${isPublic ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                </div>
                <p className="text-sm text-gray-400 mt-2">{isPublic ? 'Филиал виден всем пользователям' : 'Филиал виден только администраторам'}</p>
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
                            <div className="flex items-center">
                                <button onClick={() => setEditingMaster(master)} className="font-semibold text-blue-500 px-3 py-1">Править</button>
                                <button onClick={() => handleDeleteMaster(master.id, master.name)} className="font-semibold text-red-500 px-3 py-1">Удалить</button>
                            </div>
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
                                onConfirm={confirmBooking}
                                onComplete={completeBooking}
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

            <EditMasterSheet
                isOpen={!!editingMaster}
                onClose={() => setEditingMaster(null)}
                master={editingMaster}
                api={api}
            />
        </>
    );
};
