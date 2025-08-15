import { Booking, BookingStatus, Branch, Master, MasterStatus, NewsItem, Service } from './types';

// Utility to simulate network delay
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// News Logic
export const createNewNewsItem = (item: { title: string; text: string; imageFile: File; }, news: NewsItem[]): NewsItem => {
    return {
        id: Math.max(0, ...news.map(n => n.id)) + 1,
        title: item.title,
        text: item.text,
        imageUrl: URL.createObjectURL(item.imageFile),
        date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
        created_at: new Date().toISOString(),
    };
};

export const updateNewsItemLogic = (item: NewsItem, data: { title?: string; text?: string; imageFile?: File; }): NewsItem => {
    return {
        ...item,
        title: data.title ?? item.title,
        text: data.text ?? item.text,
        imageUrl: data.imageFile ? URL.createObjectURL(data.imageFile) : item.imageUrl,
    };
};

// Booking Logic
export const createNewBooking = (
    bookingDetails: Omit<Booking, 'id' | 'status' | 'created_at' | 'updated_at' | 'appointment_time' | 'service' | 'employee' >,
    bookings: Booking[],
    services: Service[],
    masters: Master[]
): Booking | null => {
    const foundService = services.find(s => s.id === bookingDetails.service_id);
    const foundMaster = masters.find(m => m.id === bookingDetails.employee_id);

    if (!foundService || !foundMaster) {
        return null;
    }

    return {
        id: Math.max(0, ...bookings.map(b => b.id)) + 1,
        ...bookingDetails,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        appointment_time: bookingDetails.date,
        status: BookingStatus.PENDING,
        service: {
            id: foundService.id,
            name: foundService.name,
            price: foundService.price,
            duration_minutes: foundService.duration_minutes,
        },
        employee: {
            id: foundMaster.id,
            user: foundMaster.user,
        },
    };
};

export const calculateOccupiedSlots = (
    bookings: Booking[],
    selectedMaster: Master | null,
    selectedDate: Date,
    allTimeSlots: string[]
): Set<string> => {
    if (!selectedMaster || !selectedDate) return new Set();

    const occupied = new Set<string>();

    const relevantBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return booking.masterName === selectedMaster.name &&
            (booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.PENDING) &&
            bookingDate.getFullYear() === selectedDate.getFullYear() &&
            bookingDate.getMonth() === selectedDate.getMonth() &&
            bookingDate.getDate() === selectedDate.getDate();
    });

    relevantBookings.forEach(booking => {
        const duration = booking.service.duration_minutes;
        const slotsToOccupy = Math.ceil(duration / 30);
        const startTime = booking.time;
        const startIndex = allTimeSlots.indexOf(startTime);

        if (startIndex !== -1) {
            for (let i = 0; i < slotsToOccupy; i++) {
                const slotIndex = startIndex + i;
                if (slotIndex < allTimeSlots.length) {
                    occupied.add(allTimeSlots[slotIndex]);
                }
            }
        }
    });

    return occupied;
};

// Master Logic
export const createNewMaster = (
    data: { name: string, branchId: number, position: MasterStatus, username?: string, avatarFile?: File | null, working_hours_start?: string, working_hours_end?: string },
    masters: Master[]
): Master => {
    return {
        id: Math.max(0, ...masters.map(m => m.id), 0) + 1,
        name: data.name,
        position: data.position,
        username: data.username,
        avatarUrl: data.avatarFile ? URL.createObjectURL(data.avatarFile) : null,
        barbershop_id: data.branchId,
        working_hours_start: data.working_hours_start,
        working_hours_end: data.working_hours_end,
    };
};

export const updateMasterLogic = (
    master: Master,
    data: Partial<Pick<Master, 'name' | 'position' | 'username' | 'working_hours_start' | 'working_hours_end'>> & { avatarFile?: File | null }
): Master => {
    const { avatarFile, ...restData } = data;
    let newAvatarUrl = master.avatarUrl;
    if (avatarFile) {
        newAvatarUrl = URL.createObjectURL(avatarFile);
    } else if (avatarFile === null) {
        newAvatarUrl = null;
    }

    return {
        ...master,
        ...restData,
        avatarUrl: newAvatarUrl,
    };
};

// Branch Logic
export const createNewBranch = (
    branch: Omit<Branch, 'id' | 'created_at' | 'updated_at' | 'is_public'>,
    branches: Branch[]
): Branch => {
    return {
        ...branch,
        id: Math.max(0, ...branches.map(b => b.id)) + 1,
        is_public: false, // New branches are private by default
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
};

// Service Logic
export const createNewService = (
    serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at' | 'duration'>,
    services: Service[]
): Service => {
    return {
        ...serviceData,
        id: Math.max(0, ...services.map(s => s.id), 0) + 1,
        duration: serviceData.duration_minutes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
};

export const updateServiceLogic = (
    service: Service,
    data: Partial<Pick<Service, 'name' | 'price' | 'duration_minutes'>>
): Service => {
    return {
        ...service,
        ...data,
        duration: data.duration_minutes ?? service.duration_minutes,
        updated_at: new Date().toISOString()
    };
};

// Time Slot Logic
export const getAvailableTimeSlotsForMaster = (master: Master | null | undefined, allTimeSlots: string[]): string[] => {
    if (master && master.working_hours_start && master.working_hours_end) {
        const startIndex = allTimeSlots.indexOf(master.working_hours_start);
        const endIndex = allTimeSlots.indexOf(master.working_hours_end);
        
        if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
            // Return slots within working hours. The slice is inclusive of start, exclusive of end, so add 1 to endIndex.
            return allTimeSlots.slice(startIndex, endIndex + 1);
        }
        return []; // Return empty if hours are invalid or not found
    }
    return allTimeSlots; // Return all slots if no master or hours are specified
};
