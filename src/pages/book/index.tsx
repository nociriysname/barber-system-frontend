
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Branch, Service, Master, View } from '../../shared/api/types';
import { ChevronLeftIcon, PlusIcon, LocationMarkerIcon, PencilIcon } from '../../shared/ui/icons';
import BottomSheet from '../../shared/ui/BottomSheet';
import { Calendar } from '../../shared/ui/Calendar';
import { telegramService } from '../../shared/lib/telegram';
import { useApi } from '../../shared/api';
import { useImageUpload, useImagePreloader } from '../../shared/lib/hooks';
import { MasterAvatar } from '../../entities/master';
import { BranchEditorSheet } from '../../features/manage-branch/ui/BranchEditorSheet';

declare const ymaps: any;

interface BookPageProps {
    api: ReturnType<typeof useApi>;
    isAdmin: boolean;
    setActiveView: (view: View) => void;
}

const MasterCard = ({ master, onSelect, onAvatarUpdate, isAdmin }: { master: Master; onSelect: () => void; onAvatarUpdate: (file: File) => void; isAdmin: boolean }) => {
    const { previewUrl, isUploading, triggerFileInput, inputRef } = useImageUpload({
        initialImageUrl: master.avatarUrl,
        onFileSelect: onAvatarUpdate
    });

    const handleAvatarEditClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent master selection when editing avatar
        triggerFileInput();
    }

    return (
        <button 
            onClick={onSelect} 
            className="flex flex-col items-center space-y-2 flex-shrink-0 text-center group rounded-2xl p-2 transition-colors hover:bg-white/5"
        >
            <div className="relative">
                 <MasterAvatar 
                    name={master.name} 
                    avatarUrl={previewUrl}
                    className="w-24 h-24 border-4 border-transparent transition-all duration-200 group-hover:border-[#007BFF]/50"
                />
                {isUploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    </div>
                )}
                {isAdmin && !isUploading && (
                    <>
                        <input type="file" accept="image/*" ref={inputRef} className="hidden" />
                        <button
                            onClick={handleAvatarEditClick}
                            className="absolute bottom-0 right-0 bg-[#007BFF] w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#121212] transition-transform group-hover:scale-110 active:scale-95"
                        >
                            <PencilIcon className="w-5 h-5 text-white" />
                        </button>
                    </>
                )}
            </div>
            <p className="font-medium text-lg transition-colors group-hover:text-[#007BFF]">{master.name}</p>
        </button>
    );
};

const SelectMasterStep = ({ masters, onMasterSelect, onAvatarUpdate, isAdmin }: { masters: Master[]; onMasterSelect: (master: Master) => void; onAvatarUpdate: (masterId: number, file: File) => void; isAdmin: boolean; }) => (
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

const SelectServicesStep = ({ services, selectedServices, onServiceToggle, onNext, totalPrice, totalDuration }: any) => (
     <div className="pb-24">
        <div className="space-y-3">
            {services.map((service: Service) => {
                const isSelected = selectedServices.some((s: Service) => s.id === service.id);
                return (
                <button key={service.id} onClick={() => onServiceToggle(service)} className={`w-full text-left p-4 rounded-2xl transition-all duration-200 flex justify-between items-center ${isSelected ? 'bg-[#007BFF]/20 border-2 border-[#007BFF]' : 'bg-[#1E1E1E] border-2 border-transparent'}`}>
                    <div><p className="text-lg font-semibold">{service.name}</p><p className="text-sm text-[#8E8E93]">{Math.floor(service.duration / 60)} ч {service.duration % 60} мин</p></div>
                    <p className="font-bold text-lg">{service.price} ₽</p>
                </button>
            )})}
        </div>
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-[#121212]/80 backdrop-blur-lg border-t border-white/10">
            <button onClick={onNext} disabled={selectedServices.length === 0} className="w-full bg-[#007BFF] text-white font-bold py-4 rounded-xl active:scale-95 transition-transform disabled:bg-gray-500 disabled:opacity-50">
                Далее ({totalDuration} мин / {totalPrice} ₽)
            </button>
        </div>
    </div>
);

const SelectDateTimeStep = ({ master, totalDuration, selectedDate, setSelectedDate, timeSlots, occupiedSlots, onConfirmBooking, totalPrice }: any) => {
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [timeGridError, setTimeGridError] = useState(false);
    const [flashingSlot, setFlashingSlot] = useState<string | null>(null);
    const timeGridErrorTimeoutRef = useRef<any>(null);
    const flashingSlotTimeoutRef = useRef<any>(null);

    const requiredSlotsCount = useMemo(() => Math.ceil(totalDuration / 30), [totalDuration]);

    useEffect(() => { setSelectedTime(null); }, [master, selectedDate, totalDuration]);

    const canStartHere = (time: string): boolean => {
        if (requiredSlotsCount === 0) return false;
        const startIndex = timeSlots.indexOf(time);
        if (startIndex === -1 || startIndex + requiredSlotsCount > timeSlots.length) return false;
        for (let i = 0; i < requiredSlotsCount; i++) {
            if (occupiedSlots.has(timeSlots[startIndex + i])) return false;
        }
        return true;
    };
    
     const handleTimeSlotClick = (time: string) => {
        if (time === selectedTime) {
             setSelectedTime(null);
             telegramService.hapticSelection();
             return;
        }

        if (canStartHere(time)) {
            setSelectedTime(time);
            telegramService.hapticSelection();
        } else {
            if (timeGridErrorTimeoutRef.current) clearTimeout(timeGridErrorTimeoutRef.current);
            if (flashingSlotTimeoutRef.current) clearTimeout(flashingSlotTimeoutRef.current);
            setTimeGridError(false);
            setFlashingSlot(null);
            setTimeout(() => {
                setTimeGridError(true);
                setFlashingSlot(time);
                telegramService.hapticNotification('error');
                telegramService.showPopup({ title: 'Недоступно', message: 'Недостаточно времени для записи или этот слот занят.', buttons: [{ type: 'ok', text: 'Понятно' }] });
                timeGridErrorTimeoutRef.current = setTimeout(() => setTimeGridError(false), 820);
                flashingSlotTimeoutRef.current = setTimeout(() => setFlashingSlot(null), 500);
            }, 10);
        }
    };
    
    const selectedBlock: string[] = useMemo(() => {
        if (!selectedTime) return [];
        const startIndex = timeSlots.indexOf(selectedTime);
        if (startIndex === -1) return [];
        return timeSlots.slice(startIndex, startIndex + requiredSlotsCount);
    }, [selectedTime, requiredSlotsCount, timeSlots]);


    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Выберите дату и время</h2>
            <p className="text-[#8E8E93] mb-4">Мастер: {master?.name} <br/> Длительность: {totalDuration} мин</p>
            <div className="mt-4"><h3 className="text-xl font-bold mb-3">Календарь</h3><Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} /></div>
            <div className="mt-6">
                <h3 className="text-xl font-bold mb-3">Доступное время</h3>
                <div className={`grid grid-cols-4 gap-3 ${timeGridError ? 'animate-shake' : ''}`}>
                    {timeSlots.map((time: string) => {
                        const isOccupied = occupiedSlots.has(time);
                        const isSelectedStart = selectedTime === time;
                        const isInSelectedBlock = selectedBlock.includes(time);
                        const isFlashing = flashingSlot === time;

                        let buttonClass = 'py-3 rounded-xl font-semibold transition-all duration-200';
                        let isDisabled = false;

                        if (isOccupied) { 
                            buttonClass += ' bg-[#2a2a2d] text-[#8E8E93]/50 line-through cursor-not-allowed';
                            isDisabled = true;
                        } else if (isInSelectedBlock) {
                            buttonClass += ' bg-[#007BFF] text-white shadow-lg shadow-blue-500/30';
                            if (!isSelectedStart) buttonClass += ' opacity-70 cursor-not-allowed';
                            isDisabled = !isSelectedStart;
                        } else { 
                            buttonClass += ' border-2 border-[#007BFF]/50 text-[#007BFF] hover:bg-[#007BFF]/10 active:scale-95'; 
                        }
                        
                        if (isFlashing) buttonClass += ' animate-flash-red';

                        return (<button key={time} onClick={() => handleTimeSlotClick(time)} className={buttonClass} disabled={isDisabled}>{time}</button>);
                    })}
                </div>
            </div>
            {selectedTime && (
                <div className="fixed bottom-20 left-0 right-0 p-4 bg-[#121212]/80 backdrop-blur-lg border-t border-white/10">
                    <button onClick={() => onConfirmBooking(selectedTime)} className="w-full bg-[#007BFF] text-white font-bold py-4 rounded-xl active:scale-95 transition-transform">Записаться за {totalPrice} ₽</button>
                </div>
            )}
        </div>
    );
}


export const BookPage = ({ api, isAdmin, setActiveView }: BookPageProps) => {
    const { currentUser, branches, services, masters, addBooking, addBranch, updateBranch, updateMasterAvatar, getTimeSlots, getOccupiedSlots, addMaster, deleteMaster } = api;

    const [step, setStep] = useState(1);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [selectedMaster, setSelectedMaster] = useState<Master | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

    const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
    const [newBranchName, setNewBranchName] = useState('');
    const [newBranchAddress, setNewBranchAddress] = useState('');
    const [newBranchCoords, setNewBranchCoords] = useState<[number, number] | null>(null);
    const [isPickingLocation, setIsPickingLocation] = useState(false);
    const [mapReady, setMapReady] = useState(false);
    
    const mapRef = useRef<any>(null);
    const mapInstanceRef = useRef<any>(null);

    const timeSlots = useMemo(() => getTimeSlots(), [getTimeSlots]);
    
    const visibleBranches = useMemo(() => {
        if (isAdmin) return branches;
        return branches.filter(b => b.is_public);
    }, [branches, isAdmin]);

    const mastersForBranch = useMemo(() => {
        if (!selectedBranch || !masters) {
            return [];
        }
        return masters.filter(master => master.barbershop_id === selectedBranch.id);
    }, [selectedBranch, masters]);

    const avatarUrlsToPreload = useMemo(() => {
        return mastersForBranch
            .map(master => master.avatarUrl)
            .filter((url): url is string => !!url);
    }, [mastersForBranch]);
    
    useImagePreloader(avatarUrlsToPreload);

    const handleBranchSelect = (branch: Branch) => {
        if (isCreateSheetOpen || isPickingLocation || editingBranch) return;
        
        if (isAdmin) {
            setEditingBranch(branch);
        } else {
            setSelectedBranch(branch);
            setStep(2);
            telegramService.hapticImpact('light');
        }
    };
    
    const handleServiceToggle = (service: Service) => {
        setSelectedServices(prev =>
            prev.find(s => s.id === service.id)
                ? prev.filter(s => s.id !== service.id)
                : [...prev, service]
        );
    };

    const handleMasterSelect = (master: Master) => {
        setSelectedMaster(master);
        setStep(4);
        telegramService.hapticImpact('light');
    };

    const handleBack = () => {
        const currentStep = step;
        setStep(prev => prev - 1);
        if (currentStep === 4) setSelectedMaster(null);
        if (currentStep === 2) {
            setSelectedBranch(null);
            setSelectedServices([]);
        }
    };

    const handleConfirmBooking = (selectedTime: string) => {
        if (!selectedBranch || !selectedMaster || selectedServices.length === 0 || !currentUser) return;
        const bookingDetails = {
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
        };
        addBooking(bookingDetails);
        setActiveView('history');
    };
    
    const totalDuration = useMemo(() => selectedServices.reduce((sum, s) => sum + s.duration, 0), [selectedServices]);
    const totalPrice = useMemo(() => selectedServices.reduce((sum, s) => sum + s.price, 0), [selectedServices]);
    const occupiedSlots = useMemo(() => getOccupiedSlots(selectedMaster, selectedDate), [getOccupiedSlots, selectedMaster, selectedDate]);
    
    useEffect(() => {
        const mapElement = mapRef.current;
        if (!mapElement) return;

        let map: any = null;

        ymaps.ready(() => {
            if (mapInstanceRef.current) return;
            map = new ymaps.Map(mapElement, {
                center: [55.751244, 37.618423],
                zoom: 11,
                controls: ['zoomControl']
            }, { suppressMapOpenBlock: true });
            mapInstanceRef.current = map;
            setMapReady(true);
        });

        return () => {
            if (map) map.destroy();
            mapInstanceRef.current = null;
            setMapReady(false);
        };
    }, []);

    useEffect(() => {
        if (!mapReady || !mapInstanceRef.current || !ymaps || !visibleBranches) return;

        const map = mapInstanceRef.current;
        map.geoObjects.removeAll();

        visibleBranches.forEach(branch => {
            const preset = isAdmin && !branch.is_public
                ? 'islands#grayCircleDotIconWithCaption'
                : 'islands#blueCircleDotIconWithCaption';

            const placemarkData = {
                hintContent: branch.name,
                // Set balloonContent to null for admins to prevent the info window from opening
                balloonContent: isAdmin ? null : `<strong>${branch.name}</strong><br/>${branch.address}`
            };
                
            const placemark = new ymaps.Placemark(branch.coords, placemarkData, {
                preset,
                iconCaption: branch.name + (isAdmin && !branch.is_public ? ' (Приватный)' : '')
            });
            placemark.events.add('click', () => handleBranchSelect(branch));
            map.geoObjects.add(placemark);
        });
    }, [visibleBranches, mapReady, isAdmin]);

    
    const handleConfirmLocation = () => {
        if (!mapInstanceRef.current) return;
        const center = mapInstanceRef.current.getCenter();
        setNewBranchCoords(center);
        setIsPickingLocation(false);
        setIsCreateSheetOpen(true);
        ymaps.geocode(center).then((res: any) => {
            const firstGeoObject = res.geoObjects.get(0);
            setNewBranchAddress(firstGeoObject.getAddressLine() || 'Адрес не определен');
        });
    };

    const handleCreateBranch = () => {
        if (newBranchName && newBranchAddress && newBranchCoords) {
            addBranch({ name: newBranchName, address: newBranchAddress, coords: newBranchCoords });
            setIsCreateSheetOpen(false);
            setNewBranchName('');
            setNewBranchAddress('');
            setNewBranchCoords(null);
        }
    };

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
                        timeSlots={timeSlots}
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

            <div ref={mapRef} className="w-full h-full" style={{ transition: 'filter 0.5s ease-in-out' }}/>
            
            {isPickingLocation && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <LocationMarkerIcon className="w-12 h-12 text-[#007BFF] drop-shadow-lg" />
                </div>
            )}
            {isPickingLocation && (
                 <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-auto z-40 pointer-events-auto">
                    <button onClick={handleConfirmLocation} className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-green-500/30">
                        Подтвердить здесь
                    </button>
                 </div>
            )}

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

            <BottomSheet isOpen={isCreateSheetOpen && !isPickingLocation} onClose={() => setIsCreateSheetOpen(false)}>
                <div className="text-white">
                    <h2 className="text-2xl font-bold mb-4">Создать филиал</h2>
                    <div className="space-y-4">
                        <input type="text" placeholder="Название филиала" value={newBranchName} onChange={(e) => setNewBranchName(e.target.value)} className="w-full p-3 bg-[#2c2c2e] rounded-lg border-2 border-transparent focus:border-[#007BFF] outline-none" />
                        
                        {newBranchAddress ? (
                            <div className="p-3 bg-[#2c2c2e] rounded-lg">
                                <p className="text-xs text-gray-400">Автоматически определенный адрес</p>
                                <p>{newBranchAddress}</p>
                            </div>
                        ) : (
                             <button onClick={() => { setIsCreateSheetOpen(false); setIsPickingLocation(true); }} className="w-full p-4 bg-[#2c2c2e] rounded-lg flex items-center justify-center text-center hover:bg-[#3a3a3c] transition-colors">
                                <LocationMarkerIcon className="w-6 h-6 mr-3 text-gray-400" />
                                <span className="font-semibold">Выбрать на карте</span>
                            </button>
                        )}
                       
                        <button onClick={handleCreateBranch} disabled={!newBranchName || !newBranchAddress || !newBranchCoords} className="w-full bg-[#007BFF] text-white font-bold py-3 rounded-xl active:scale-95 transition-transform disabled:bg-gray-500 disabled:opacity-50">Создать</button>
                    </div>
                </div>
            </BottomSheet>
        </div>
    );
};
