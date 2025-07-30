import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BranchSelectOnMap } from '@/features/BranchSelectOnMap';
import { ServiceSelect } from '@/features/ServiceSelect';
import { MasterSelect } from '@/features/MasterSelect';
import { DateTimeSelect } from '@/features/DateTimeSelect';
import { ConfirmBooking } from '@/features/ConfirmBooking';
import { MotionDiv } from '@/shared/ui/MotionDiv';
import { useTelegram } from '@/shared/lib/hooks/useTelegram';

type BookingStep = 'branch' | 'service' | 'master' | 'datetime';

export const BookingWizard = () => {
    const { hapticFeedback } = useTelegram();
    const [step, setStep] = useState<BookingStep>('branch');
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
    const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
    const [selectedMasterId, setSelectedMasterId] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const handleBranchSelect = (id: number) => {
        hapticFeedback('light');
        setSelectedBranchId(id);
        setStep('service');
    };

    const handleServicesSelect = (ids: number[]) => {
        hapticFeedback('light');
        setSelectedServiceIds(ids);
        setStep('master');
    };

    const handleMasterSelect = (id: number) => {
        hapticFeedback('light');
        setSelectedMasterId(id);
        setStep('datetime');
    };

    const handleDateTimeSelect = (date: Date, time: string) => {
        hapticFeedback('light');
        setSelectedDate(date);
        setSelectedTime(time);
    };

    const resetStep = () => {
        hapticFeedback('light');
        if (step === 'datetime') setStep('master');
        if (step === 'master') setStep('service');
        if (step === 'service') setStep('branch');
    };

    const renderStep = () => {
        switch (step) {
            case 'branch':
                return <BranchSelectOnMap onBranchSelect={handleBranchSelect} />;
            case 'service':
                return <ServiceSelect branchId={selectedBranchId!} onServicesSelect={handleServicesSelect} onBack={resetStep} />;
            case 'master':
                return <MasterSelect branchId={selectedBranchId!} onMasterSelect={handleMasterSelect} onBack={resetStep} />;
            case 'datetime':
                return (
                    <DateTimeSelect
                        masterId={selectedMasterId!}
                        serviceIds={selectedServiceIds}
                        onDateTimeSelect={handleDateTimeSelect}
                        selectedTime={selectedTime}
                        onBack={resetStep}
                    />
                );
            default:
                return <BranchSelectOnMap onBranchSelect={handleBranchSelect} />;
        }
    };

    return (
        <div className="p-4 pb-24">
            <h1 className="text-3xl font-bold mb-6 text-white">Создать бронь</h1>
            <AnimatePresence mode="wait">
                <MotionDiv
                    key={step}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderStep()}
                </MotionDiv>
            </AnimatePresence>
            
            {step === 'datetime' && selectedTime && selectedMasterId && selectedServiceIds.length > 0 && (
                <ConfirmBooking 
                    masterId={selectedMasterId}
                    serviceIds={selectedServiceIds}
                    date={selectedDate}
                    time={selectedTime}
                />
            )}
        </div>
    );
};
