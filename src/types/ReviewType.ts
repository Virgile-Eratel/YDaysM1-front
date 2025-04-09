export interface ReviewType {
    id: number;
    message: string;
    rating: number;
    author: {
        id: number;
        email: string;
    };
    createdAt: string;
}
