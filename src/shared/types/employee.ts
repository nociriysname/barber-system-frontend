export type EmployeeStatus = 'BARBER' | 'ADMIN' | 'DIRECTOR';

export interface Employee {
  id: number;
  position: EmployeeStatus;
  barbershop_id: number;
  user_id: number | null;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
}
