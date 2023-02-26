import { RawRule, Ability, AbilityClass } from '@casl/ability';

// actions
export const ACTION_MANAGE = 'manage';
export const ACTION_LIST = 'list';
export const ACTION_READ = 'read';
export const ACTION_CREATE = 'create';
export const ACTION_UPDATE = 'update';
export const ACTION_DELETE = 'delete';

// list related actions
export const ACTION_PRINT = 'print';
export const ACTION_EXPORT_LIST = 'exportList';

// subject
export const SUBJECT_ALL = 'all';
export const SUBJECT_DASHBOARD = 'Dashboard';
export const SUBJECT_USER = 'User';
export const SUBJECT_SECTIONS = 'Sections';
export const SUBJECT_STUDENTS = 'Students';
export const SUBJECT_SUBJECTS = 'Subjects';
export const SUBJECT_LOGS = 'Logs';

// types
export type AbilityAction =
    | 'manage'
    | 'read'
    | 'create'
    | 'update'
    | 'delete'

    // list actions
    | 'list'
    | 'print'
    | 'exportList';

export type AbilitySubject =
    | 'all'
    | 'Dashboard'
    | 'User'
    | 'Sections'
    | 'Students'
    | 'Subjects'
    | 'Logs';

export type AbilityRule = RawRule<[AbilityAction, AbilitySubject]>;

export type AppAbility = Ability<[AbilityAction, AbilitySubject]>;
export const AppAbility = Ability as AbilityClass<AppAbility>;
