import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DEFAULT_DATE_FORMAT } from '../constants/date.constant';

@Pipe({
    name: 'dateFormat',
})
export class DateFormatPipe extends DatePipe implements PipeTransform {
    transform(value: any, dateFormat: string = DEFAULT_DATE_FORMAT): any {
        return super.transform(value, dateFormat);
    }
}
