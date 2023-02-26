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
                id: 'users',
                title: 'Users',
                translate: 'NAV.USERS.TITLE',
                type: 'item',
                icon: 'people',
                url: '/users',
            },
            {
                id: 'florists',
                title: 'Florists',
                translate: 'NAV.FLORISTS.TITLE',
                type: 'item',
                icon: 'store',
                url: '/florists',
            },
            {
                id: 'locations',
                title: 'Locations',
                translate: 'NAV.LOCATIONS.TITLE',
                type: 'item',
                icon: 'location_on',
                url: '/locations',
            },
        ],
    },
];
