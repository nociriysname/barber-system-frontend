export type UserRole = 'ADMIN' | 'USER';
export type VerificationStatus = 'PENDING' | 'VERIFIED';

export interface User {
  id: number;
  telegram_id: number;
  name: string;
  role: UserRole;
  is_verified: VerificationStatus;
  is_active: boolean;
  balance: number;
  created_at: string;
  updated_at: string;
}
