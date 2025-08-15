

import { User, NewsItem, Booking, Branch, Service, Master, UserRole, VerificationStatus, BookingStatus, MasterStatus } from './types';

export const mockUser: User = {
    id: 1,
    name: "Константин",
    username: "@k.konstantinopolsky",
    avatarUrl: "https://picsum.photos/seed/avatar/100/100",
    registrationDate: "15 мая 2024",
    role: UserRole.ADMIN,
    created_at: "2024-05-15T10:00:00Z",
    updated_at: "2024-05-15T10:00:00Z",
    telegram_id: 12345678,
    is_verified: VerificationStatus.VERIFIED,
    is_active: true,
    balance: 1500.00
};

export const initialNews: NewsItem[] = [];

export const initialBookings: Booking[] = [];

export const initialBranches: Branch[] = [];

export const initialServices: Service[] = [];

export const initialMasters: Master[] = [];

export const timeSlots = [
    "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", 
    "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", 
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", 
    "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30",
    "24:00"
];
