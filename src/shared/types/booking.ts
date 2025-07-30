export type AppointmentStatus = 'CONFIRMED' | 'COMPLETED' | 'CANCELED';

export interface BookingService {
  id: number;
  name: string;
  price: number;
  duration_minutes: number;
}

export interface BookingEmployee {
  id: number;
  user?: {
    id: number;
    name: string;
  };
}

export interface BookingClient {
  id: number;
  name: string;
}

export interface Booking {
  id: number;
  created_at: string;
  updated_at: string;
  appointment_time: string;
  status: AppointmentStatus;
  
  user_id: number; 
  employee_id: number; 
  service_id: number;
  
  service: BookingService;
  employee: BookingEmployee;
  user?: BookingClient;
  
  is_past: boolean;
}
