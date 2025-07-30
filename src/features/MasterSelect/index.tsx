import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBranchEmployees } from '@/shared/api/employee';
import { Skeleton } from '@/shared/ui/Skeleton';
import { Employee } from '@/shared/types/employee';
import { Button } from '@/shared/ui/Button';
import { User } from 'lucide-react';

interface MasterSelectProps {
  branchId: number;
  onMasterSelect: (id: number) => void;
  onBack: () => void;
}

const MasterCard = ({ master, onSelect }: { master: Employee, onSelect: (id: number) => void }) => (
    <div
        onClick={() => onSelect(master.id)}
        className="flex flex-col items-center justify-center text-center p-3 rounded-xl bg-secondary-bg flex-shrink-0 w-28 h-28 cursor-pointer"
    >
        <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-2">
            <User className="w-8 h-8 text-hint" />
        </div>
        <p className="text-sm font-medium text-white/80 leading-tight">Мастер #{master.id}</p>
    </div>
);


export const MasterSelect = ({ branchId, onMasterSelect, onBack }: MasterSelectProps) => {
  const { data: masters, isLoading } = useQuery({
    queryKey: ['employees', branchId],
    queryFn: () => getBranchEmployees(branchId!),
    enabled: !!branchId,
  });

  if (isLoading) {
    return (
        <div className="flex space-x-3 overflow-x-auto pb-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="w-28 h-28 rounded-xl flex-shrink-0" />)}
        </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-white/90 mb-4">Выберите мастера</h2>
      <div className="flex space-x-3 overflow-x-auto pb-4 mb-4">
        {masters?.map(master => (
          <MasterCard key={master.id} master={master} onSelect={() => onMasterSelect(master.id)} />
        ))}
      </div>
       <div className="flex gap-2">
            <Button variant="outline" onClick={onBack} className="w-full">Назад</Button>
       </div>
    </div>
  );
};
