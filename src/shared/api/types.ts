
// General App Types
export type View = 'home' | 'history' | 'book' | 'profile' | 'services';

// Enums from Backend Schemas
export enum UserRole {
    ADMIN = "admin",
    USER = "user"
}

export enum VerificationStatus {
    PENDING = "pending",
    VERIFIED = "verified"
}

// Renamed on frontend for consistency with old code
export enum BookingStatus {
    PENDING = "Ожидает",
    CONFIRMED = "Предстоит", // Was 'CONFIRMED'
    COMPLETED = "Завершена", // Was 'COMPLETED'
    CANCELED = "Отменена",  // Was 'CANCELED'
}

export enum MasterStatus { // Was EmployeeStatus
    BARBER = "barber",
    ADMIN = "admin",
    DIRECTOR = "director"
}

// Entity Interfaces based on Backend Schemas
export interface User {
  id: number;
  created_at: string;
  updated_at: string;
  telegram_id: number;
  name: string;
  role: UserRole;
  is_verified: VerificationStatus;
  is_active: boolean;
  balance: number;
  // Kept from old types.ts for mock data consistency and UI
  username: string;
  avatarUrl: string;
  registrationDate: string;
}

export interface Branch { // Was Barbershop
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    address: string;
    latitude?: number | null;
    longitude?: number | null;
    phone_number?: string | null;
    image_id?: string | null;
    image_url?: string | null;
    is_public: boolean;
    // Kept from old types for consistency
    coords: [number, number];
}

export interface Service {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    price: number;
    duration_minutes: number;
    barbershop_id: number;
    image_id?: string | null;
    image_url?: string | null;
    // Kept from old types
    duration: number;
}


export interface Master { // Was Employee
    id: number;
    position: MasterStatus;
    barbershop_id: number;
    user_id?: number | null;
    user?: { id: number; name: string; };
    name: string;
    username?: string;
    avatarUrl: string | null;
    working_hours_start?: string;
    working_hours_end?: string;
}

export interface Booking { // Was Appointment
    id: number;
    created_at: string;
    updated_at: string;
    appointment_time: number;
    status: BookingStatus;
    user_id: number;
    employee_id: number;
    service_id: number;
    service: {
        id: number;
        name: string;
        price: number;
        duration_minutes: number;
    };
    employee: {
        id: number;
        user?: { id: number; name: string };
    };
    // Denormalized fields from old type for UI convenience
    serviceName: string;
    masterName: string;
    branchAddress: string;
    date: number;
    time: string;
    price: number;
    userName: string;
}

export interface NewsItem {
  id: number;
  created_at: string;
  title: string;
  text: string;
  image_id?: string | null;
  image_url?: string | null;
  // Kept from old types
  date: string;
  imageUrl: string;
}