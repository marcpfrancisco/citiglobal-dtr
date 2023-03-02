import { Pipe, PipeTransform } from '@angular/core';

import { isDate, isNumber, isString } from 'lodash';
import * as moment from 'moment';
import { MomentizeFormat } from '../enums/momentize-format.enum';

const AVAILABLE_FORMAT = Object.values(MomentizeFormat);
const DEFAULT_MOMENT_FORMAT = moment.ISO_8601;

@Pipe({ name: 'momentize' })
export class MomentizePipe implements PipeTransform {
    private resolveFormat(
        format?: MomentizeFormat
    ): string | moment.MomentBuiltinFormat {
        if (AVAILABLE_FORMAT.includes(format)) {
            return format;
        }

        return DEFAULT_MOMENT_FORMAT;
    }

    private resolveMoment<MomentObject>(
        momentObject: MomentObject
    ): moment.Moment | null {
        if (moment.isMoment(momentObject) && momentObject?.isValid()) {
            return momentObject;
        }

        return null;
    }

    transform<RawDate>(
        raw: RawDate,
        format?: MomentizeFormat
    ): moment.Moment | null {
        let date: moment.Moment | null;

        // parse raw string with given format
        if (isString(raw) && format && isString(format)) {
            return this.resolveMoment(moment(raw, this.resolveFormat(format)));
        }

        // unix timestamp
        if (isNumber(raw)) {
            return this.resolveMoment((date = moment.unix(raw)));
        }

        // date
        if (isDate(raw)) {
            return this.resolveMoment((date = moment(raw)));
        }

        // try if it's a moment object
        return this.resolveMoment(raw);
    }
}
