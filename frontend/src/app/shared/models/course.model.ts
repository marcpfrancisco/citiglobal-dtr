export interface Course {
    id: number;

    createdAt: string | Date;
    updatedAt: string | Date;
    publishedAt: string | Date;

    isActive: boolean;
    name: string;
}
