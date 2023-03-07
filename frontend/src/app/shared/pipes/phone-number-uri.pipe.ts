import { Pipe, PipeTransform } from '@angular/core';
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';

@Pipe({ name: 'phoneNumberUri' })
export class PhoneNumberUriPipe implements PipeTransform {
  transform(value: string, country: string = 'GB'): string {
    const phoneUtil = PhoneNumberUtil.getInstance();
    const phoneNumber = phoneUtil.parse(value, country);

    if (!phoneNumber) {
      return value;
    }

    const formatted = phoneUtil.format(phoneNumber, PhoneNumberFormat.E164);

    if (!formatted) {
      return value;
    }

    return `tel:${value}`;
  }
}
