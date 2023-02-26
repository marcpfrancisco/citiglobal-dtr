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
                title: 'Sections',
                translate: 'NAV.SECTIONS.TITLE',
                type: 'item',
                icon: 'people',
                url: '/sections',
            },
            {
                id: 'students',
                title: 'Students',
                translate: 'NAV.STUDENTS.TITLE',
                type: 'item',
                icon: 'store',
                url: '/students',
            },
            {
                id: 'subjects',
                title: 'Subjects',
                translate: 'NAV.SUBJECTS.TITLE',
                type: 'item',
                icon: 'location_on',
                url: '/subjects',
            },
        ],
    },
    {
        id: 'profile',
        title: 'Profile',
        translate: 'NAV.PROFILE',
        type: 'group',
        children: [
            {
                id: 'time_log',
                title: 'Time Log',
                translate: 'NAV.TIMELOG.TITLE',
                type: 'item',
                icon: 'people',
                url: '/logs',
            },
        ],
    },
];
