import { AbstractControl, ValidationErrors } from '@angular/forms';

export type NgValidator = (control: AbstractControl) => ValidationErrors | null;
