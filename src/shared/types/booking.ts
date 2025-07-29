export type AppointmentStatus = 'CONFIRMED' | 'COMPLETED' | 'CANCELED';

export interface Booking {
  id: number;
  created_at: string;
  updated_at: string;
  appointment_time: string;
  status: AppointmentStatus;
  user_id: number;
  employee_id: number;
  service_id: number;
  is_past: boolean;
}
