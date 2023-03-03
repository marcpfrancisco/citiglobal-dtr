export interface Student {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;

    studentId: string;
    mobileNumber: string;

    createdAt: string | Date;
    updatedAt: string | Date;

    active: boolean;
}
