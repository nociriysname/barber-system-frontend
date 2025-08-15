
import React, { useState, useEffect, useMemo } from 'react';
import BottomSheet from '../../../shared/ui/BottomSheet';
import { MasterStatus } from '../../../shared/api/types';
import { useApi } from '../../../shared/api';
import { useImageUpload } from '../../../shared/lib/hooks';
import { MasterAvatar } from '../../../entities/master';
import { LoaderIcon } from '../../../shared/ui/icons';

interface CreateMasterSheetProps {
    isOpen: boolean;
    onClose: () => void;
    branchId: number;
    api: ReturnType<typeof useApi>;
}

export const CreateMasterSheet = ({ isOpen, onClose, branchId, api }: CreateMasterSheetProps) => {
    const [name, setName] = useState('');
    const [position, setPosition] = useState<MasterStatus>(MasterStatus.BARBER);
    const [username, setUsername] = useState('');
    const [startTime, setStartTime] = useState('10:00');
    const [endTime, setEndTime] = useState('18:00');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { previewUrl, isUploading, inputRef, handleFileSelect, triggerFileInput, removeImage } = useImageUpload({});
    const allTimeSlots = api.getTimeSlots();

    useEffect(() => {
        if (isOpen) {
            // Reset form state when sheet opens
            setName('');
            setPosition(MasterStatus.BARBER);
            setUsername('');
            setStartTime('10:00');
            setEndTime('18:00');
            removeImage();
            setIsSubmitting(false);
        }
    }, [isOpen]);
    
    const availableStartTimes = useMemo(() => {
        // Start time can be any slot except the last one
        return allTimeSlots.slice(0, -1);
    }, [allTimeSlots]);

    const availableEndTimes = useMemo(() => {
        const startIndex = allTimeSlots.indexOf(startTime);
        if (startIndex === -1) return [];
        // End time must be at least one slot after start time
        return allTimeSlots.slice(startIndex + 1);
    }, [startTime, allTimeSlots]);

    // Effect to auto-adjust end time if start time makes it invalid
    useEffect(() => {
        if (!availableEndTimes.includes(endTime)) {
            setEndTime(availableEndTimes[0] || '');
        }
    }, [startTime, endTime, availableEndTimes]);

    const handleSubmit = async () => {
        if (!name.trim()) return;
        setIsSubmitting(true);
        await api.addMaster({
            name: name.trim(),
            branchId,
            position,
            username: username.trim() || undefined,
            avatarFile: handleFileSelect.file,
            working_hours_start: startTime,
            working_hours_end: endTime
        });
        setIsSubmitting(false);
        onClose();
    };
    
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (value.length > 0 && !value.startsWith('@')) {
            value = '@' + value;
        }
        setUsername(value.replace(/[^a-zA-Z0-9_@]/g, ''));
    };

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose}>
            <div className="text-white">
                <h2 className="text-2xl font-bold mb-4">Новый мастер</h2>
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <button onClick={triggerFileInput} className="relative flex-shrink-0">
                            <MasterAvatar name={name || '?'} avatarUrl={previewUrl} className="w-24 h-24" />
                            {isUploading && <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center"><LoaderIcon className="w-8 h-8 animate-spin"/></div>}
                        </button>
                        <input type="file" accept="image/*" ref={inputRef} onChange={handleFileSelect.handleFileSelect} className="hidden" />
                        <div className="flex-grow space-y-2">
                           <input type="text" placeholder="Имя мастера" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-[#2c2c2e] rounded-lg border-2 border-transparent focus:border-[#007BFF] outline-none" />
                           <input type="text" placeholder="Telegram, например @username" value={username} onChange={handleUsernameChange} className="w-full p-3 bg-[#2c2c2e] rounded-lg border-2 border-transparent focus:border-[#007BFF] outline-none" />
                        </div>
                    </div>
                     <div>
                        <label className="text-sm text-gray-400">Должность</label>
                        <select value={position} onChange={e => setPosition(e.target.value as MasterStatus)} className="w-full p-3 mt-1 bg-[#2c2c2e] rounded-lg border-2 border-transparent focus:border-[#007BFF] outline-none">
                            <option value={MasterStatus.BARBER}>Работник</option>
                            <option value={MasterStatus.ADMIN}>Админ филиала</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Часы работы</label>
                        <div className="flex space-x-2 mt-1">
                            <select value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full p-3 bg-[#2c2c2e] rounded-lg border-2 border-transparent focus:border-[#007BFF] outline-none appearance-none text-center">
                                {availableStartTimes.map(slot => <option key={`start-${slot}`} value={slot}>{slot}</option>)}
                            </select>
                            <span className="p-3">-</span>
                             <select value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full p-3 bg-[#2c2c2e] rounded-lg border-2 border-transparent focus:border-[#007BFF] outline-none appearance-none text-center">
                                {availableEndTimes.map(slot => <option key={`end-${slot}`} value={slot}>{slot}</option>)}
                            </select>
                        </div>
                    </div>


                    <button 
                        onClick={handleSubmit} 
                        disabled={!name.trim() || isSubmitting || isUploading}
                        className="w-full bg-[#007BFF] text-white font-bold py-3 rounded-xl active:scale-95 transition-transform flex items-center justify-center disabled:bg-gray-500 disabled:opacity-50"
                    >
                        {isSubmitting ? <LoaderIcon className="w-6 h-6 animate-spin" /> : 'Создать мастера'}
                    </button>
                </div>
            </div>
        </BottomSheet>
    );
};
