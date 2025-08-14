

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

export const timeSlots = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];
