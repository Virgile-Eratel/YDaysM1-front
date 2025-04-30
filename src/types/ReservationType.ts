export interface ReservationType {
    id: number;
    user: string | { id: number; email: string };
    place: string | { 
        id: number; 
        title: string;
        address: string;
        price: number;
        imageName: string;
    };
    startDate: string;
    endDate: string;
    numberOfGuests: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    createdAt: string;
    updatedAt: string | null;
    durationInDays: number;
}
