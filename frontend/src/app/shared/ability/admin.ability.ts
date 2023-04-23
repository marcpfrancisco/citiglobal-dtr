import {
    AbilityRule,
    ACTION_CREATE,
    ACTION_LIST,
    ACTION_MANAGE,
    ACTION_READ,
    ACTION_UPDATE,
    SUBJECT_DASHBOARD,
    SUBJECT_LOGS,
    SUBJECT_SECTIONS,
    SUBJECT_STUDENTS,
    SUBJECT_SUBJECTS,
    SUBJECT_USER,
} from '@constants';
import { UserSubject } from '@interfaces';

export function adminAbility(subject: UserSubject): AbilityRule[] {
    return [
        // list/read/create user
        {
            action: ACTION_LIST,
            subject: SUBJECT_USER,
        },
        {
            action: ACTION_READ,
            subject: SUBJECT_USER,
        },

        // update my own user only
        {
            action: ACTION_UPDATE,
            subject: SUBJECT_USER,
            conditions: { id: { $in: subject.userIds } },
        },

        // manage dashboard
        {
            action: ACTION_MANAGE,
            subject: SUBJECT_DASHBOARD,
        },

        // manage sections
        {
            action: ACTION_LIST,
            subject: SUBJECT_SECTIONS,
        },
        {
            action: ACTION_READ,
            subject: SUBJECT_SECTIONS,
        },

        // manage students
        {
            action: ACTION_LIST,
            subject: SUBJECT_STUDENTS,
        },
        {
            action: ACTION_READ,
            subject: SUBJECT_STUDENTS,
        },

        // manage subjects
        {
            action: ACTION_READ,
            subject: SUBJECT_SUBJECTS,
        },
        {
            action: ACTION_LIST,
            subject: SUBJECT_SUBJECTS,
        },

        // manage logs
        {
            action: ACTION_READ,
            subject: SUBJECT_LOGS,
        },
        {
            action: ACTION_LIST,
            subject: SUBJECT_LOGS,
        },
    ];
}
