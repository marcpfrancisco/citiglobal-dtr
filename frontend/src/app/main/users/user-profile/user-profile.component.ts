import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { EditUserDto } from '@interfaces';
import { User } from '@models';
import { fuseAnimations } from '@fuse/animations';
import { createUserFullName } from '@utils';

export enum UserProfileDialogResultType {
    SAVE = 'save',
    RESET = 'reset',
}

export interface UserProfileDialogResult {
    type: UserProfileDialogResultType;
    value: EditUserDto | null;
}

@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class UserProfileComponent implements OnInit {
    userForm: FormGroup;

    get hasChanges(): boolean {
        const formData = this.userForm?.getRawValue();

        if (!formData) {
            return false;
        }

        return formData?.name !== this.data?.firstName;
    }

    constructor(
        public matDialogRef: MatDialogRef<
            UserProfileComponent,
            UserProfileDialogResult
        >,
        @Inject(MAT_DIALOG_DATA) private data: User
    ) {}

    ngOnInit(): void {
        this.userForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            email: new FormControl({ value: '', disabled: true }, [
                Validators.required,
                Validators.email,
            ]),
        });

        this.userForm.setValue({
            name: createUserFullName(this.data),
            email: this.data.email,
        });
    }

    hasError(controlName: string, errorName: string): boolean {
        return this.userForm.controls[controlName].hasError(errorName);
    }

    resetPassword(): void {
        this.matDialogRef.close({
            type: UserProfileDialogResultType.RESET,
            value: null,
        });
    }

    handleSave(): void {
        const { name } = this.userForm.getRawValue();

        if (this.userForm.valid) {
            this.matDialogRef.close({
                type: UserProfileDialogResultType.SAVE,
                value: { firstName: name },
            });
        }
    }

    get name(): string {
        return this.userForm.get('name').value;
    }
}
