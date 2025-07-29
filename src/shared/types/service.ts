export interface Service {
  id: number;
  name: string;
  price: number;
  duration_minutes: number;
  barbershop_id: number;
  image_id: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}
