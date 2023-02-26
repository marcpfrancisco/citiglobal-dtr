import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FiltersInput } from '@services';

export interface MultiSelectFiltersDialogData {
    input: FiltersInput;
    value: any[];
}

export interface MultiSelectFiltersDialogResponse {
    cancelled: boolean;
    data: unknown;
}

@Component({
    selector: 'citiglobal-multi-select-filters-dialog',
    templateUrl: './multi-select-filters-dialog.component.html',
    styleUrls: ['./multi-select-filters-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MultiSelectFiltersDialogComponent implements OnInit {
    static panelClass = 'citiglobal-multi-select-filters-dialog';

    inputData: {
        label: string; // display label
        value: any;
        isChecked: boolean;
    }[];

    title: string;

    constructor(
        public matDialogRef: MatDialogRef<MultiSelectFiltersDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        private filterData: MultiSelectFiltersDialogData
    ) {
        this.processInputData(this.filterData);
    }

    ngOnInit(): void {}

    processInputData(data: MultiSelectFiltersDialogData): void {
        this.title = data.input.label;
        if (data?.input?.options) {
            const value: any[] = data?.value ?? []; // fallback to empty array
            this.inputData = data.input.options.map((option) => {
                return {
                    label: option.label,
                    value: option.value,
                    isChecked:
                        value?.some((aValue) => option.value === aValue) ??
                        false,
                };
            });
        }
    }

    getSelectedValues(): any[] {
        const value = this.inputData.reduce((accu, v) => {
            if (v.isChecked) {
                accu.push(v.value);
            }
            return accu;
        }, []);
        return value.length > 0 ? value : null;
    }

    onReset(): void {
        this.inputData.forEach((item) => {
            item.isChecked =
                this.filterData?.input?.resetValue.some(
                    (aValue) => aValue === item.value
                ) ?? false;
        });
    }

    onCancel(): void {
        this.matDialogRef.close({
            cancelled: true,
            data: this.getSelectedValues(),
        } as MultiSelectFiltersDialogResponse);
    }

    onApply(): void {
        this.matDialogRef.close({
            cancelled: false,
            data: this.getSelectedValues(),
        } as MultiSelectFiltersDialogResponse);
    }
}
