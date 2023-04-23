import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeDifference',
})
export class TimeDifferencePipe implements PipeTransform {
    constructor(private datePipe: DatePipe) {}

    transform(timeIn: string, timeOut: string): string {
        const dateIn = new Date(timeIn);
        const dateOut = new Date(timeOut);
        const timeDifference = dateOut.getTime() - dateIn.getTime();

        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDifference / 1000) % 60);

        const timeRendered = `${hours} hours ${minutes} minutes ${seconds} seconds`;

        return timeRendered;
    }
}
