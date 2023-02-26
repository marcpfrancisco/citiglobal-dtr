import { isNumber, isString } from 'lodash';
import * as moment from 'moment';
import 'moment-timezone';
import { MOMENT_SQL_DATE_TIME_FORMAT } from '../../constants';

export const SQL_DATE_TIME = 'YYYY-MM-DD HH:mm:ss';

// string date assumes that this is ISO-8601

export function momentize(
    date: string | number | Date | moment.Moment,
    format?: string
): moment.Moment | null {
    if (isString(date)) {
        return format && isString(format)
            ? moment(date, format)
            : moment(date, moment.ISO_8601);
    }
    if (date instanceof Date) {
        return moment(
            moment(date).format(MOMENT_SQL_DATE_TIME_FORMAT),
            MOMENT_SQL_DATE_TIME_FORMAT
        );
    }

    if (isNumber(date)) {
        return moment.unix(date);
    }

    if (moment.isMoment(date) && date.isValid()) {
        return date;
    }

    return null;
}
