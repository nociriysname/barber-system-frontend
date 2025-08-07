
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

export const initialNews: NewsItem[] = [
  { id: 1, title: "Новый сезон: обновленные услуги и мастера", date: "15 июля 2024", imageUrl: "https://picsum.photos/seed/news1/600/400", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.", created_at: "2024-07-15T10:00:00Z" },
  { id: 2, title: "Летняя акция: скидка 20% на все услуги", date: "10 июля 2024", imageUrl: "https://picsum.photos/seed/news2/600/400", text: "Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper.", created_at: "2024-07-10T10:00:00Z" },
];

export const initialBookings: Booking[] = [
    {
        id: 1,
        serviceName: "Стрижка и укладка",
        masterName: "Анна",
        branchAddress: "Филиал на Пушкина",
        date: new Date(new Date().setDate(new Date().getDate() + 3)).getTime(),
        time: "12:30",
        status: BookingStatus.CONFIRMED,
        price: 500,
        userName: "Константин",
        created_at: "2024-07-20T10:00:00Z",
        updated_at: "2024-07-20T10:00:00Z",
        appointment_time: new Date(new Date().setDate(new Date().getDate() + 3)).getTime(),
        user_id: 1,
        employee_id: 1,
        service_id: 1,
        service: { id: 1, name: "Стрижка и укладка", price: 500, duration_minutes: 90 },
        employee: { id: 1, user: { id: 101, name: "Анна" } },
    },
    {
        id: 2,
        serviceName: "Маникюр",
        masterName: "Елена",
        branchAddress: "Филиал на Ленина",
        date: new Date(new Date().setDate(new Date().getDate() - 5)).getTime(),
        time: "15:00",
        status: BookingStatus.COMPLETED,
        price: 350,
        userName: "Константин",
        created_at: "2024-07-15T15:00:00Z",
        updated_at: "2024-07-15T15:00:00Z",
        appointment_time: new Date(new Date().setDate(new Date().getDate() - 5)).getTime(),
        user_id: 1,
        employee_id: 2,
        service_id: 2,
        service: { id: 2, name: "Маникюр", price: 350, duration_minutes: 60 },
        employee: { id: 2, user: { id: 102, name: "Елена" } },
    }
];

export const initialBranches: Branch[] = [
    { id: 1, name: "Филиал на Пушкина", address: "ул. Пушкина, 12", coords: [55.7602, 37.6225], created_at: "2024-01-01T10:00:00Z", updated_at: "2024-01-01T10:00:00Z", latitude: 55.7602, longitude: 37.6225, is_public: true },
    { id: 2, name: "Филиал на Ленина", address: "пр. Ленина, 45", coords: [55.7447, 37.6728], created_at: "2024-01-01T10:00:00Z", updated_at: "2024-01-01T10:00:00Z", latitude: 55.7447, longitude: 37.6728, is_public: true }
];

export const initialServices: Service[] = [
    { id: 1, name: "Стрижка и укладка", duration: 90, price: 500, barbershop_id: 1, duration_minutes: 90, created_at: "2024-01-01T10:00:00Z", updated_at: "2024-01-01T10:00:00Z" },
    { id: 2, name: "Маникюр", duration: 60, price: 350, barbershop_id: 1, duration_minutes: 60, created_at: "2024-01-01T10:00:00Z", updated_at: "2024-01-01T10:00:00Z" },
    { id: 3, name: "Классический массаж", duration: 60, price: 800, barbershop_id: 2, duration_minutes: 60, created_at: "2024-01-01T10:00:00Z", updated_at: "2024-01-01T10:00:00Z" },
    { id: 4, name: "Педикюр", duration: 75, price: 450, barbershop_id: 2, duration_minutes: 75, created_at: "2024-01-01T10:00:00Z", updated_at: "2024-01-01T10:00:00Z" },
    { id: 5, name: "Окрашивание", duration: 120, price: 1200, barbershop_id: 1, duration_minutes: 120, created_at: "2024-01-01T10:00:00Z", updated_at: "2024-01-01T10:00:00Z" },
];

export const initialMasters: Master[] = [
    { id: 1, name: "Анна", avatarUrl: "https://picsum.photos/seed/master1/100/100", barbershop_id: 1, position: MasterStatus.BARBER, username: '@anna_master' },
    { id: 2, name: "Елена", avatarUrl: "https://picsum.photos/seed/master2/100/100", barbershop_id: 1, position: MasterStatus.ADMIN, username: '@elena_admin' },
    { id: 3, name: "Иван", avatarUrl: null, barbershop_id: 2, position: MasterStatus.BARBER, username: '@ivan_barber' },
    { id: 4, name: "Ольга", avatarUrl: "https://picsum.photos/seed/master4/100/100", barbershop_id: 2, position: MasterStatus.BARBER },
];

export const timeSlots = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];
