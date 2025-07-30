import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { getAllBranches } from '@/shared/api/branch';
import { Skeleton } from '@/shared/ui/Skeleton';

interface BranchSelectOnMapProps {
  onBranchSelect: (id: number) => void;
}

export const BranchSelectOnMap = ({ onBranchSelect }: BranchSelectOnMapProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: () => getAllBranches({ limit: 100, offset: 0 }),
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[60vh] rounded-2xl" />;
  }

  return (
    <YMaps>
      <div className="rounded-2xl overflow-hidden">
        <Map
          defaultState={{ center: [55.751574, 37.573856], zoom: 10 }}
          width="100%"
          height="60vh"
        >
          {data?.items.map((branch) =>
            branch.latitude && branch.longitude ? (
              <Placemark
                key={branch.id}
                geometry={[branch.latitude, branch.longitude]}
                properties={{
                  hintContent: branch.name,
                  balloonContent: branch.address,
                }}
                options={{
                  preset: 'islands#violetDotIcon',
                }}
                onClick={() => onBranchSelect(branch.id)}
              />
            ) : null
          )}
        </Map>
      </div>
    </YMaps>
  );
};
