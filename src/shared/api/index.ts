import { useState } from 'react';
import { initialBookings, initialBranches, initialNews, initialServices, initialMasters, mockUser, timeSlots } from './mock';
import { Booking, BookingStatus, Branch, Master, MasterStatus, NewsItem, Service } from './types';
import { telegramService } from '../lib/telegram';
import * as apiLogic from './logic';

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
        await apiLogic.sleep(1500); // Simulate upload
        const newPost = apiLogic.createNewNewsItem(item, news);
        setNews(prev => [newPost, ...prev]);
    };

    const deleteNewsItem = (id: number) => {
        setNews(prev => prev.filter(item => item.id !== id));
    };

    const updateNewsItem = async (id: number, data: { title?: string; text?: string; imageFile?: File; }) => {
        await apiLogic.sleep(1000); // Simulate network and upload
        setNews(prev => prev.map(item => item.id === id ? apiLogic.updateNewsItemLogic(item, data) : item));
    };

    // Booking Management
    const addBooking = (bookingDetails: Omit<Booking, 'id' | 'status' | 'created_at' | 'updated_at' | 'appointment_time' | 'service' | 'employee' >) => {
        const result = apiLogic.createNewBooking(bookingDetails, bookings, services, masters);

        if (!result) {
            console.error("Could not find service or master for booking.", { serviceId: bookingDetails.service_id, masterId: bookingDetails.employee_id });
            telegramService.hapticNotification('error');
            return;
        }

        setBookings(prev => [result, ...prev]);
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

    const completeBooking = (bookingId: number) => {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: BookingStatus.COMPLETED } : b));
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
        await apiLogic.sleep(1000); // simulate upload
        const newMaster = apiLogic.createNewMaster(data, masters);
        setMasters(prev => [...prev, newMaster]);
    };

    const updateMaster = async (id: number, data: Partial<Pick<Master, 'name' | 'position' | 'username' | 'working_hours_start' | 'working_hours_end'>> & { avatarFile?: File | null }) => {
        await apiLogic.sleep(1000);
        setMasters(prev => prev.map(m => m.id === id ? apiLogic.updateMasterLogic(m, data) : m));
    };
    
    const deleteMaster = (masterId: number) => {
        setMasters(prev => prev.filter(m => m.id !== masterId));
    };
    
    const updateMasterAvatar = async (masterId: number, imageFile: File) => {
        await apiLogic.sleep(1000); // Simulate upload
        setMasters(prev => prev.map(m => m.id === masterId ? { ...m, avatarUrl: URL.createObjectURL(imageFile) } : m));
    }

    // Branch Management
    const addBranch = (branch: Omit<Branch, 'id' | 'created_at' | 'updated_at' | 'is_public'>) => {
        const newBranch = apiLogic.createNewBranch(branch, branches);
        setBranches(prev => [...prev, newBranch]);
    };
    
    const updateBranch = async (id: number, data: Partial<Pick<Branch, 'name' | 'is_public'>>) => {
        await apiLogic.sleep(500);
        setBranches(prev => prev.map(b => b.id === id ? { ...b, ...data, updated_at: new Date().toISOString() } : b));
    };
    
    // Service Management
    const addService = async (serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at' | 'duration'>) => {
        await apiLogic.sleep(500);
        const newService = apiLogic.createNewService(serviceData, services);
        setServices(prev => [...prev, newService]);
    };

    const updateService = async (id: number, data: Partial<Pick<Service, 'name' | 'price' | 'duration_minutes'>>) => {
        await apiLogic.sleep(500);
        setServices(prev => prev.map(s => s.id === id ? apiLogic.updateServiceLogic(s, data) : s));
    };
    
    const deleteService = (id: number) => {
        setServices(prev => prev.filter(s => s.id !== id));
    };

    // Booking View Helpers
    const getTimeSlots = (master?: Master | null) => {
        return apiLogic.getAvailableTimeSlotsForMaster(master, timeSlots);
    };

    const getOccupiedSlots = (selectedMaster: Master | null, selectedDate: Date) => {
        return apiLogic.calculateOccupiedSlots(bookings, selectedMaster, selectedDate, timeSlots);
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
        completeBooking,
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
