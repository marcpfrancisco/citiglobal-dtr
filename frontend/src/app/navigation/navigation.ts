import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'home',
        title: 'Home',
        translate: 'NAV.HOME',
        type: 'group',
        children: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                translate: 'NAV.DASHBOARD.TITLE',
                type: 'item',
                icon: 'dashboard',
                url: '/dashboard',
            },
        ],
    },
    {
        id: 'management',
        title: 'Management',
        translate: 'NAV.MANAGEMENT',
        type: 'group',
        children: [
            {
                id: 'sections',
                title: 'Course & Section',
                translate: 'NAV.SECTIONS.TITLE',
                type: 'item',
                icon: 'info',
                url: '/sections',
            },
            {
                id: 'students',
                title: 'Students',
                translate: 'NAV.STUDENTS.TITLE',
                type: 'item',
                icon: 'groups',
                url: '/students',
            },
            {
                id: 'subjects',
                title: 'Subjects',
                translate: 'NAV.SUBJECTS.TITLE',
                type: 'item',
                icon: 'library_books',
                url: '/subjects',
            },
            {
                id: 'users',
                title: 'Users',
                translate: 'NAV.USERS.TITLE',
                type: 'item',
                icon: 'people',
                url: '/users',
            },
        ],
    },
    {
        id: 'reports',
        title: 'Reports',
        translate: 'NAV.REPORTS',
        type: 'group',
        children: [
            {
                id: 'time_log',
                title: 'Time Log',
                translate: 'NAV.TIMELOG.TITLE',
                type: 'item',
                icon: 'date_range',
                url: '/logs',
            },
        ],
    },
];
