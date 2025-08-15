import React, { useEffect, useRef, memo } from 'react';
import { Branch } from '../../shared/api/types';
import { LocationMarkerIcon } from '../../shared/ui/icons';

declare const ymaps: any;

interface YandexMapProps {
    branches: Branch[];
    isAdmin: boolean;
    isPickingLocation: boolean;
    onBranchSelect: (branch: Branch) => void;
    onConfirmLocation: (coords: [number, number]) => void;
}

const areEqual = (prevProps: YandexMapProps, nextProps: YandexMapProps) => {
    return (
        prevProps.isAdmin === nextProps.isAdmin &&
        prevProps.isPickingLocation === nextProps.isPickingLocation &&
        JSON.stringify(prevProps.branches) === JSON.stringify(nextProps.branches)
    );
};

export const YandexMap = memo(({ branches, isAdmin, isPickingLocation, onBranchSelect, onConfirmLocation }: YandexMapProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);

    useEffect(() => {
        let map: any = null;

        ymaps.ready(() => {
            if (mapInstanceRef.current || !mapContainerRef.current) return;
            map = new ymaps.Map(mapContainerRef.current, {
                center: [55.751244, 37.618423],
                zoom: 11,
                controls: ['zoomControl']
            }, { suppressMapOpenBlock: true });
            mapInstanceRef.current = map;
        });

        return () => {
            if (map) map.destroy();
            mapInstanceRef.current = null;
        };
    }, []);

    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !ymaps || !branches) return;
        
        const updatePlacemarks = () => {
            map.geoObjects.removeAll();
            branches.forEach(branch => {
                const preset = isAdmin && !branch.is_public ? 'islands#grayCircleDotIconWithCaption' : 'islands#blueCircleDotIconWithCaption';
                const placemarkData = {
                    hintContent: branch.name,
                    balloonContent: isAdmin ? null : `<strong>${branch.name}</strong><br/>${branch.address}`
                };
                const placemark = new ymaps.Placemark(branch.coords, placemarkData, {
                    preset,
                    iconCaption: branch.name + (isAdmin && !branch.is_public ? ' (Приватный)' : '')
                });
                placemark.events.add('click', () => onBranchSelect(branch));
                map.geoObjects.add(placemark);
            });
        };
        
        // Defer heavy map operations
        const timeoutId = setTimeout(updatePlacemarks, 0);
        return () => clearTimeout(timeoutId);

    }, [branches, isAdmin, onBranchSelect]);
    
    const handleConfirmClick = () => {
        if (!mapInstanceRef.current) return;
        const center = mapInstanceRef.current.getCenter();
        onConfirmLocation(center);
    }

    return (
        <div className="relative w-full h-full">
            <div ref={mapContainerRef} className="w-full h-full" />
            
            {isPickingLocation && (
                <>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <LocationMarkerIcon className="w-12 h-12 text-[#007BFF] drop-shadow-lg" />
                    </div>
                    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-auto z-40 pointer-events-auto">
                        <button onClick={handleConfirmClick} className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-green-500/30">
                            Подтвердить здесь
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}, areEqual);
