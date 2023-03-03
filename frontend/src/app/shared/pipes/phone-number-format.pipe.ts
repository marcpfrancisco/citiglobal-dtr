import { Pipe, PipeTransform } from '@angular/core';
import { AsYouTypeFormatter } from 'google-libphonenumber';

@Pipe({ name: 'phoneNumberFormat' })
export class PhoneNumberFormatPipe implements PipeTransform {
    transform(value: string, country: string = 'PH'): string {
        return new AsYouTypeFormatter(country).inputDigit(value);
    }
}
