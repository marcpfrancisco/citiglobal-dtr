import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export enum ButtonTypes {
    CANCEL = 'cancel',
    CONFIRM = 'confirm',
}

export interface AlertDialogData {
    title?: string;
    message?: string;
    buttons?: {
        title: string;
        type: ButtonTypes;
    }[];
}

@Component({
    selector: 'citiglobal-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
    buttonTypes = ButtonTypes;

    constructor(
        public dialogRef: MatDialogRef<AlertComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AlertDialogData
    ) {}

    ngOnInit(): void {}
}
