import { Pipe, PipeTransform } from '@angular/core';
import { isString, startCase, toLower } from 'lodash';

@Pipe({
  name: 'titleCase',
})
export class TitleCasePipe implements PipeTransform {
  transform(text: string): string {
    if (!isString(text)) {
      return '';
    }

    return startCase(toLower(text));
  }
}
