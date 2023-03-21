import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateTimeFormat',
})
export class DateTimeFormatPipe implements PipeTransform {
    constructor(private datePipe: DatePipe) {}

    transform(value: string): string {
        const date = new Date(value);
        const formattedTime = this.datePipe.transform(date, 'h:mm a');
        return formattedTime || '';
    }
}
