export interface Livre {
    id?: number;
    title: string;
    author: string;
    isbn: string;
    description?: string;
    category?: string;
    coverUrl?: string;
    totalCopies: number;
    availableCopies: number;
    avgRating: number;
}
