import { Injectable } from '@angular/core';
import { UserRoles } from '@enums';
import { User } from '@models';
import { UserRolesPipe } from '@pipes';
import { startCase } from 'lodash';

export enum FiltersType {
    TEXT,
    NUMBER,
    NUMBER_RANGE,
    SELECT,
    MULTI_SELECT,
    DATE,
    USERS,
    DATE_RANGE,
    CHECKBOX,
}

export interface FiltersInputOption<Value = unknown> {
    label: string; // display label
    value: Value;
}

export interface FiltersInput<Value = unknown> {
    type: FiltersType;
    label: string; // display label
    name: string; // form control name
    resetValue: any | null; // values used when reset is pressed
    required: boolean;
    fieldConfig?: unknown;
    options?: FiltersInputOption<Value>[]; // options for SELECT or MULTI_SELECT type
}

export interface FiltersInputNumberRange {
    from: number | null;
    to: number | null;
}

// user filter options
export type UserFiltersInput = [
    FiltersInput<UserRoles>,
    FiltersInput<boolean>,
    FiltersInput<boolean>
];

@Injectable({
    providedIn: 'root',
})
export class FiltersService {
    constructor(private userRolesPipe: UserRolesPipe) {}

    getUsersListFilters(): UserFiltersInput {
        // User Roles Filter
        const userRoles = Object.values(UserRoles);

        const roleOptions = userRoles.map<FiltersInputOption<UserRoles>>(
            (role) => ({
                label: this.userRolesPipe.transform(role),
                value: role,
            })
        );

        return [
            {
                type: FiltersType.SELECT,
                label: 'Role',
                name: 'role',
                resetValue: null,
                required: false,
                options: roleOptions,
            },
            {
                type: FiltersType.SELECT,
                label: 'Active',
                name: 'active',
                resetValue: null,
                required: false,
                options: [
                    { label: 'Active', value: true },
                    { label: 'Inactive', value: false },
                ],
            },
            {
                type: FiltersType.CHECKBOX,
                label: 'Show Archived',
                name: 'withDeleted',
                resetValue: false,
                required: false,
            },
        ];
    }
}
