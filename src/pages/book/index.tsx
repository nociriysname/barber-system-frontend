import React, { useState, useMemo, useCallback } from 'react';
import { Branch, Service, Master, View } from '../../shared/api/types';
import { ChevronLeftIcon, PlusIcon } from '../../shared/ui/icons';
import { telegramService } from '../../shared/lib/telegram';
import { useApi } from '../../shared/api';
import { useImagePreloader } from '../../shared/lib/hooks';
import { BranchEditorSheet } from '../../features/manage-branch/ui/BranchEditorSheet';
import { YandexMap } from '../../widgets/map/YandexMap';
import { SelectServicesStep } from './ui/SelectServicesStep';
import { SelectMasterStep } from './ui/SelectMasterStep';
import { SelectDateTimeStep } from './ui/SelectDateTimeStep';
import { CreateBranchSheet } from '../../features/manage-branch/ui/CreateBranchSheet';

declare const ymaps: any;

const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
};

interface BookPageProps {
    api: ReturnType<typeof useApi>;
    isAdmin: boolean;
    setActiveView: (view: View) => void;
}

export const BookPage = ({ api, isAdmin, setActiveView }: BookPageProps) => {
    const { currentUser, branches, services, masters, addBooking, addBranch, updateMasterAvatar, getTimeSlots, getOccupiedSlots } = api;

    const [step, setStep] = useState(1);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [selectedMaster, setSelectedMaster] = useState<Master | null>(null);
    const [selectedDate, setSelectedDate] = useState(getTomorrow());
    
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
    
    const [isPickingLocation, setIsPickingLocation] = useState(false);
    const [pickedAddress, setPickedAddress] = useState<string | null>(null);
    const [pickedCoords, setPickedCoords] = useState<[number, number] | null>(null);

    const timeSlotsForMaster = useMemo(() => getTimeSlots(selectedMaster), [getTimeSlots, selectedMaster]);
    
    const visibleBranches = useMemo(() => {
        if (isAdmin) return branches;
        return branches.filter(b => b.is_public);
    }, [branches, isAdmin]);

    const mastersForBranch = useMemo(() => {
        if (!selectedBranch || !masters) return [];
        return masters.filter(master => master.barbershop_id === selectedBranch.id);
    }, [selectedBranch, masters]);

    const avatarUrlsToPreload = useMemo(() => mastersForBranch.map(m => m.avatarUrl).filter((url): url is string => !!url), [mastersForBranch]);
    useImagePreloader(avatarUrlsToPreload);

    const handleBranchSelect = useCallback((branch: Branch) => {
        if (isAdmin) {
            setEditingBranch(branch);
        } else {
            setSelectedBranch(branch);
            setStep(2);
            telegramService.hapticImpact('light');
        }
    }, [isAdmin]);
    
    const handleServiceToggle = (service: Service) => {
        setSelectedServices(prev =>
            prev.find(s => s.id === service.id) ? prev.filter(s => s.id !== service.id) : [...prev, service]
        );
    };

    const handleMasterSelect = (master: Master) => {
        setSelectedMaster(master);
        setStep(4);
        telegramService.hapticImpact('light');
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(prev => prev - 1);
            if (step === 4) setSelectedMaster(null);
            if (step === 2) {
                setSelectedBranch(null);
                setSelectedServices([]);
            }
        }
    };

    const handleConfirmBooking = (selectedTime: string) => {
        if (!currentUser || !selectedBranch || !selectedMaster || selectedServices.length === 0) return;
        
        addBooking({
            serviceName: selectedServices.map(s => s.name).join(', '),
            masterName: selectedMaster.name,
            branchAddress: selectedBranch.address,
            date: selectedDate.getTime(),
            time: selectedTime,
            price: totalPrice,
            userName: currentUser.name,
            user_id: currentUser.id,
            employee_id: selectedMaster.id,
            service_id: selectedServices[0].id,
        });
        setActiveView('history');
    };
    
    const handlePickLocation = () => {
        setIsCreateSheetOpen(false);
        setIsPickingLocation(true);
    };

    const handleConfirmLocation = (coords: [number, number]) => {
        setPickedCoords(coords);
        setIsPickingLocation(false);
        setIsCreateSheetOpen(true);
        ymaps.geocode(coords).then((res: any) => {
            const firstGeoObject = res.geoObjects.get(0);
            setPickedAddress(firstGeoObject.getAddressLine() || 'Адрес не определен');
        });
    };
    
    const handleAddBranch = (branchData: Omit<Branch, 'id'|'created_at'|'updated_at'|'is_public'>) => {
        addBranch(branchData);
        setPickedAddress(null);
        setPickedCoords(null);
    };

    const totalDuration = useMemo(() => selectedServices.reduce((sum, s) => sum + s.duration, 0), [selectedServices]);
    const totalPrice = useMemo(() => selectedServices.reduce((sum, s) => sum + s.price, 0), [selectedServices]);
    const occupiedSlots = useMemo(() => getOccupiedSlots(selectedMaster, selectedDate), [getOccupiedSlots, selectedMaster, selectedDate]);
    
    const renderStepContent = () => {
        switch (step) {
            case 2:
                return (
                    <SelectServicesStep 
                        services={services.filter(s => s.barbershop_id === selectedBranch?.id)}
                        selectedServices={selectedServices}
                        onServiceToggle={handleServiceToggle}
                        onNext={() => setStep(3)}
                        totalPrice={totalPrice}
                        totalDuration={totalDuration}
                    />
                );
            case 3: 
                return (
                   <SelectMasterStep
                        masters={mastersForBranch}
                        onMasterSelect={handleMasterSelect}
                        onAvatarUpdate={updateMasterAvatar}
                        isAdmin={isAdmin}
                    />
                );
            case 4: 
                return (
                    <SelectDateTimeStep
                        master={selectedMaster}
                        totalDuration={totalDuration}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        timeSlots={timeSlotsForMaster}
                        occupiedSlots={occupiedSlots}
                        onConfirmBooking={handleConfirmBooking}
                        totalPrice={totalPrice}
                    />
                );
            default: return null;
        }
    };
    
    return (
        <div className="h-screen w-screen bg-[#121212] text-white/90 flex flex-col overflow-hidden">
            <div className="absolute top-0 left-0 right-0 p-4 z-20 bg-gradient-to-b from-[#121212] via-[#121212]/70 to-transparent pointer-events-none">
                 <h1 className="text-3xl font-bold text-center">{step === 1 ? 'Выберите филиал на карте' : selectedBranch?.name}</h1>
            </div>

            <YandexMap 
                branches={visibleBranches}
                isAdmin={isAdmin}
                isPickingLocation={isPickingLocation}
                onBranchSelect={handleBranchSelect}
                onConfirmLocation={handleConfirmLocation}
            />
            
            <div className={`absolute inset-0 bg-[#121212] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${step > 1 ? 'translate-y-0' : 'translate-y-full'}`}>
                 <div className="p-4 pt-20 pb-40 overflow-y-auto h-full">
                    {step > 1 && (<button onClick={handleBack} className="absolute top-5 left-4 flex items-center text-[#007BFF] font-semibold z-30 p-2"><ChevronLeftIcon className="w-6 h-6 mr-1" />Назад</button>)}
                    {renderStepContent()}
                 </div>
            </div>

            {isAdmin && step === 1 && !isPickingLocation && (
                <button onClick={() => setIsCreateSheetOpen(true)} className="fixed bottom-32 right-4 bg-[#007BFF] w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform active:scale-90 z-40"><PlusIcon className="w-8 h-8 text-white" /></button>
            )}
            
            <BranchEditorSheet 
                isOpen={!!editingBranch}
                onClose={() => setEditingBranch(null)}
                branch={editingBranch}
                api={api}
            />
            
            {isAdmin && (
                <CreateBranchSheet
                    isOpen={isCreateSheetOpen && !isPickingLocation}
                    onClose={() => setIsCreateSheetOpen(false)}
                    onAddBranch={handleAddBranch}
                    onPickLocation={handlePickLocation}
                    pickedAddress={pickedAddress}
                    pickedCoords={pickedCoords}
                />
            )}
        </div>
    );
};
