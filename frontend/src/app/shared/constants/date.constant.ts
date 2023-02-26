export const MOMENT_SQL_TIME_FORMAT = 'HH:mm:ss';

export const MOMENT_SQL_DATE_FORMAT = 'YYYY-MM-DD';

export const MOMENT_SQL_DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

// Moment date format
// parse formats https://momentjs.com/docs/#/parsing/string-format/
// display formats https://momentjs.com/docs/#/displaying/format/
export const DEFAULT_MOMENT_DATE_TIME_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY, HH:mm',
    },
    display: {
        dateInput: 'DD/MM/YYYY, HH:mm',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

export const DEFAULT_MOMENT_DATE_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};
