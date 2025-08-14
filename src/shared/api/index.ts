

import { useState } from 'react';
import { initialBookings, initialBranches, initialNews, initialServices, initialMasters, mockUser, timeSlots } from './mock';
import { Booking, BookingStatus, Branch, Master, MasterStatus, NewsItem, Service } from './types';
import { telegramService } from '../lib/telegram';

// Utility to simulate network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// This custom hook will act as our central API and state management
export const useApi = () => {
    const [news, setNews] = useState<NewsItem[]>(initialNews);
    const [bookings, setBookings] = useState<Booking[]>(initialBookings);
    const [branches, setBranches] = useState<Branch[]>(initialBranches);
    const [services, setServices] = useState<Service[]>(initialServices);
    const [masters, setMasters] = useState<Master[]>(initialMasters);
    const [currentUser] = useState(mockUser);
    
    // News Management
    const addNewsItem = async (item: { title: string; text: string; imageFile: File; }) => {
        await sleep(1500); // Simulate upload
        const newPost: NewsItem = {
            id: Math.max(0, ...news.map(n => n.id)) + 1,
            title: item.title,
            text: item.text,
            imageUrl: URL.createObjectURL(item.imageFile),
            date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
            created_at: new Date().toISOString(),
        };
        setNews(prev => [newPost, ...prev]);
    };

    const deleteNewsItem = (id: number) => {
        setNews(prev => prev.filter(item => item.id !== id));
    };

    const updateNewsItem = async (id: number, data: { title?: string; text?: string; imageFile?: File; }) => {
        await sleep(1000); // Simulate network and upload
        setNews(prev => prev.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    title: data.title ?? item.title,
                    text: data.text ?? item.text,
                    imageUrl: data.imageFile ? URL.createObjectURL(data.imageFile) : item.imageUrl,
                };
            }
            return item;
        }));
    };

    // Booking Management
    const addBooking = (bookingDetails: Omit<Booking, 'id' | 'status' | 'created_at' | 'updated_at' | 'appointment_time' | 'service' | 'employee' >) => {
        const foundService = services.find(s => s.id === bookingDetails.service_id);
        const foundMaster = masters.find(m => m.id === bookingDetails.employee_id);

        if (!foundService || !foundMaster) {
            console.error("Could not find service or master for booking.", { serviceId: bookingDetails.service_id, masterId: bookingDetails.employee_id });
            telegramService.hapticNotification('error');
            return;
        }

        const newBooking: Booking = {
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
        setBookings(prev => [newBooking, ...prev]);
        telegramService.hapticNotification('success');
        telegramService.showPopup({
            title: "Запись создана",
            message: "Ваша запись ожидает подтверждения от администратора.",
            buttons: [{ type: 'ok', text: 'Понятно' }]
        });
    };
    
    const confirmBooking = (bookingId: number) => {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: BookingStatus.CONFIRMED } : b));
        telegramService.hapticNotification('success');
    };

    const cancelBooking = (bookingId: number) => {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: BookingStatus.CANCELED } : b));
        telegramService.hapticNotification('success');
    };

    const deleteBooking = (bookingId: number) => {
        setBookings(prev => prev.filter(b => b.id !== bookingId));
        telegramService.hapticNotification('success');
    };
    
    // Master Management
    const addMaster = async (data: { name: string, branchId: number, position: MasterStatus, username?: string, avatarFile?: File | null, working_hours_start?: string, working_hours_end?: string }) => {
        await sleep(1000); // simulate upload
        const newMaster: Master = {
            id: Math.max(0, ...masters.map(m => m.id), 0) + 1,
            name: data.name,
            position: data.position,
            username: data.username,
            avatarUrl: data.avatarFile ? URL.createObjectURL(data.avatarFile) : null,
            barbershop_id: data.branchId,
            working_hours_start: data.working_hours_start,
            working_hours_end: data.working_hours_end,
        };
        setMasters(prev => [...prev, newMaster]);
    };

    const updateMaster = async (id: number, data: Partial<Pick<Master, 'name' | 'position' | 'username' | 'working_hours_start' | 'working_hours_end'>> & { avatarFile?: File | null }) => {
        await sleep(1000);
        setMasters(prev => prev.map(m => {
            if (m.id === id) {
                const { avatarFile, ...restData } = data;
                let newAvatarUrl = m.avatarUrl;
                if (avatarFile) {
                    newAvatarUrl = URL.createObjectURL(avatarFile);
                } else if (avatarFile === null) {
                    newAvatarUrl = null;
                }

                return {
                    ...m,
                    ...restData,
                    avatarUrl: newAvatarUrl,
                };
            }
            return m;
        }));
    };
    
    const deleteMaster = (masterId: number) => {
        setMasters(prev => prev.filter(m => m.id !== masterId));
    };
    
    const updateMasterAvatar = async (masterId: number, imageFile: File) => {
        await sleep(1000); // Simulate upload
        setMasters(prev => prev.map(m => m.id === masterId ? { ...m, avatarUrl: URL.createObjectURL(imageFile) } : m));
    }

    // Branch Management
    const addBranch = (branch: Omit<Branch, 'id' | 'created_at' | 'updated_at' | 'is_public'>) => {
        const newBranch: Branch = {
            ...branch,
            id: Math.max(0, ...branches.map(b => b.id)) + 1,
            is_public: false, // New branches are private by default
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        setBranches(prev => [...prev, newBranch]);
    };
    
    const updateBranch = async (id: number, data: Partial<Pick<Branch, 'name' | 'is_public'>>) => {
        await sleep(500);
        setBranches(prev => prev.map(b => b.id === id ? { ...b, ...data, updated_at: new Date().toISOString() } : b));
    };
    
    // Service Management
    const addService = async (serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at' | 'duration'>) => {
        await sleep(500);
        const newService: Service = {
            ...serviceData,
            id: Math.max(0, ...services.map(s => s.id), 0) + 1,
            duration: serviceData.duration_minutes,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        setServices(prev => [...prev, newService]);
    };

    const updateService = async (id: number, data: Partial<Pick<Service, 'name' | 'price' | 'duration_minutes'>>) => {
        await sleep(500);
        setServices(prev => prev.map(s => {
            if (s.id === id) {
                return { ...s, ...data, duration: data.duration_minutes ?? s.duration_minutes, updated_at: new Date().toISOString() };
            }
            return s;
        }));
    };
    
    const deleteService = (id: number) => {
        setServices(prev => prev.filter(s => s.id !== id));
    };

    // Booking View Helpers
    const getTimeSlots = (master?: Master | null) => {
        if (master && master.working_hours_start && master.working_hours_end) {
            const startIndex = timeSlots.indexOf(master.working_hours_start);
            const endIndex = timeSlots.indexOf(master.working_hours_end);
            
            if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
                // Return slots within working hours. The slice is inclusive of start, exclusive of end, so add 1 to endIndex.
                return timeSlots.slice(startIndex, endIndex + 1);
            }
            return []; // Return empty if hours are invalid or not found
        }
        return timeSlots; // Return all slots if no master or hours are specified
    };

    const getOccupiedSlots = (selectedMaster: Master | null, selectedDate: Date) => {
        if (!selectedMaster || !selectedDate) return new Set();
        
        const occupied = new Set<string>();
        for (let i = 0; i < bookings.length; i++) {
             const booking = bookings[i];
             const bookingDate = new Date(booking.date);
             if(booking.masterName === selectedMaster.name && 
                (booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.PENDING) &&
                bookingDate.getFullYear() === selectedDate.getFullYear() &&
                bookingDate.getMonth() === selectedDate.getMonth() &&
                bookingDate.getDate() === selectedDate.getDate()
             ) {
                 occupied.add(booking.time);
             }
        }
        return occupied;
    };

    return {
        // State
        news,
        bookings,
        branches,
        services,
        masters,
        currentUser,
        // Actions
        addNewsItem,
        deleteNewsItem,
        updateNewsItem,
        addBooking,
        confirmBooking,
        cancelBooking,
        deleteBooking,
        addBranch,
        updateBranch,
        addMaster,
        updateMaster,
        deleteMaster,
        updateMasterAvatar,
        addService,
        updateService,
        deleteService,
        // Helpers
        getTimeSlots,
        getOccupiedSlots,
    };
};