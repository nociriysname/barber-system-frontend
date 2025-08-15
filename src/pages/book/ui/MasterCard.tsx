import React from 'react';
import { Master } from '../../../shared/api/types';
import { useImageUpload } from '../../../shared/lib/hooks';
import { MasterAvatar } from '../../../entities/master';
import { PencilIcon } from '../../../shared/ui/icons';

interface MasterCardProps {
    master: Master;
    onSelect: () => void;
    onAvatarUpdate: (file: File) => void;
    isAdmin: boolean;
}

export const MasterCard = ({ master, onSelect, onAvatarUpdate, isAdmin }: MasterCardProps) => {
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
