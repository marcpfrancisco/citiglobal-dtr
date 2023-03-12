export const DEFAULT_CURRENCY = 'PH';
// export const DEFAULT_DATE_FORMAT = 'dd/MM/yyyy'; // 'mediumDate';
export const DEFAULT_DATE_FORMAT = 'dd/MM/yyyy';

export const MOMENT_SQL_TIME_FORMAT = 'HH:mm:ss';

export const MOMENT_SQL_DATE_FORMAT = 'YYYY-MM-DD';

export const MOMENT_SQL_DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const MOMENT_SQL_TIME_FORMAT_PATTERN =
    /^[0-2][0-9]:[0-5][0-9]:[0-5][0-9]$/;

export const MOMENT_SQL_DATE_FORMAT_PATTERN =
    /^[1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]$/;

export const MOMENT_SQL_DATE_TIME_FORMAT_PATTERN =
    /^[1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]$/;

// Must use International Date format for MS Excel
// https://stackoverflow.com/questions/54131599/what-date-format-can-you-use-in-csv-that-excel-will-recognize-unambiguously
export const CSV_MOMENT_DATE_FORMAT = 'YYYY-MM-DD';

export const DEFAULT_LANGUAGE_LOCALE = 'en-us';

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
