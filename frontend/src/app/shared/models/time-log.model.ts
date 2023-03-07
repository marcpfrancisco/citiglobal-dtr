export interface TimeLog {
    id: number;
    name: string;
    createdAt: string | Date;
    time_in: string | Date;
    time_out: string | Date;
    time_rendered: string | Date;
}
