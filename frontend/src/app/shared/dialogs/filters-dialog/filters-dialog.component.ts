import {
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    AbstractControl,
    AbstractControlOptions,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import {
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
    MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import {
    DEFAULT_FILTER_PAGINATION_LIMIT,
    DEFAULT_MOMENT_DATE_FORMATS,
} from '@constants';
import { UserRoles } from '@enums';
import { User } from '@models';
import { Store } from '@ngrx/store';
import { FiltersInput, FiltersType, UsersService } from '@services';
import { AuthenticationReducer, RootState } from '@stores/index';
import { createSearchPaginationLimitOptions } from '@utils';
import { isArray, isNumber } from 'lodash';
import { Observable, of, Subscription } from 'rxjs';
import {
    catchError,
    debounceTime,
    map,
    startWith,
    switchMap,
    tap,
} from 'rxjs/operators';
import { FilterViewMode } from '../../view';

import {
    MultiSelectFiltersDialogComponent,
    MultiSelectFiltersDialogData,
    MultiSelectFiltersDialogResponse,
} from '../multi-select-filters-dialog/multi-select-filters-dialog.component';

type EntityOptions<Entity> = Observable<Array<Entity>>;
type PopulateOptionsCallback<Entity> = (
    searchKeyword: string
) => EntityOptions<Entity>;

export interface FiltersDialogData {
    name?: string;
    inputs: FiltersInput[];
    value?: any; // will be used to populate the forms
    viewMode?: FilterViewMode;
}

export enum FilterInputType {
    TEXT = 'text',
    NUMBER = 'number',
    NUMBER_RANGE = 'number-range',
    CHECKBOX = 'checkbox',
    SELECT = 'select',
    MULTI_SELECT = 'multi-select',
    DATE = 'date',
    DATE_RANGE = 'date-range',
    USER_OPTIONS = 'user-options',
}

@Component({
    selector: 'citiglobal-filters-dialog',
    templateUrl: './filters-dialog.component.html',
    styleUrls: ['./filters-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_FORMATS, useValue: DEFAULT_MOMENT_DATE_FORMATS },
    ],
})
export class FiltersDialogComponent implements OnInit, OnDestroy {
    static panelClass = 'citiglobal-filters-dialog';

    form: FormGroup;
    readonly types = FiltersType;
    readonly INPUT_TYPE = FilterInputType;
    readonly VIEW_MODE = FilterViewMode;

    filterName: string;

    inputs: FiltersInput[];
    value: any;
    viewMode: FilterViewMode;

    sessionUserSubscription: Subscription;

    selectOptions: {
        [key in string]?: EntityOptions<User>;
    };
    isSelectOptionsLoading: {
        [key in string]?: boolean;
    };

    constructor(
        public matDialogRef: MatDialogRef<FiltersDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: FiltersDialogData,
        private formBuilder: FormBuilder,
        private dialog: MatDialog,
        private userService: UsersService,
        private store: Store<RootState>
    ) {}

    ngOnInit(): void {
        this.selectOptions = {};
        this.isSelectOptionsLoading = {};

        this.inputs = this.data.inputs;
        this.form = this.createForm(this.data);
        this.viewMode = this.data.viewMode;

        this.sessionUserSubscription = this.store
            .select(AuthenticationReducer.selectCurrentUser)
            .subscribe((user) => console.log(user));
    }

    ngOnDestroy(): void {
        this.sessionUserSubscription.unsubscribe();
    }

    getInputType(type: FiltersType): FilterInputType {
        switch (type) {
            case FiltersType.TEXT:
                return FilterInputType.TEXT;

            case FiltersType.NUMBER:
                return FilterInputType.NUMBER;

            case FiltersType.NUMBER_RANGE:
                return FilterInputType.NUMBER_RANGE;

            case FiltersType.SELECT:
                return FilterInputType.SELECT;

            case FiltersType.MULTI_SELECT:
                return FilterInputType.MULTI_SELECT;
            case FiltersType.DATE:
                return FilterInputType.DATE;

            case FiltersType.DATE_RANGE:
                return FilterInputType.DATE_RANGE;

            case FiltersType.CHECKBOX:
                return FilterInputType.CHECKBOX;

            case FiltersType.USERS:
                return FilterInputType.USER_OPTIONS;

            case FiltersType.TEXT:
            default:
                return FilterInputType.TEXT;
        }
    }

    createDefaultControl<Type, Value>(
        input: FiltersInput<Type>,
        defaultValue?: Value,
        validators?: ValidatorFn | ValidatorFn[] | AbstractControlOptions
    ): AbstractControl {
        // Initialize validator
        const finalizedValidators = isArray(validators)
            ? validators
            : [objectInputValidator];

        if (
            input.required &&
            !finalizedValidators.includes(Validators.required)
        ) {
            // add required validator at the beginning of the array
            finalizedValidators.unshift(Validators.required);
        }

        // Builds the form control
        return this.formBuilder.control(
            isNumber(defaultValue) ? defaultValue : defaultValue || null,
            finalizedValidators
        );
    }

    createForm(data: FiltersDialogData): FormGroup {
        const group = {};

        this.filterName = data.name || '';

        data.inputs.forEach((input) => {
            const name = input.name;
            const defaultValue = data?.value ? data.value[name] : null;
            let control: AbstractControl;

            group[input.name] = control;

            switch (input.type) {
                case FiltersType.USERS:
                    group[name] = control = this.createDefaultControl(
                        input,
                        defaultValue
                    );
                    this.createUsersOptions(input, control, [
                        UserRoles.STUDENT,
                    ]);
                    break;

                case FiltersType.DATE_RANGE:
                    const dateRange = data.value[input.name];
                    const dateRangeGroup = this.formBuilder.group({
                        from: [dateRange?.from ?? null],
                        to: [dateRange?.to ?? null],
                    });
                    group[input.name] = dateRangeGroup;
                    break;

                default:
                    group[name] = this.formBuilder.control(
                        data?.value ? data.value[name] : null,
                        input.required ? [Validators.required] : []
                    );
                    break;
            }
        });

        return new FormGroup(group);
    }

    showMultiSelectFiltersDialog(input: FiltersInput): void {
        // acquire the form control
        const control = this.form.get(input.name);

        const dialogData: MultiSelectFiltersDialogData = {
            input,
            value: control.value,
        };
        const dialogRef = this.dialog.open(MultiSelectFiltersDialogComponent, {
            panelClass: MultiSelectFiltersDialogComponent.panelClass,
            data: dialogData,
        });

        dialogRef
            .afterClosed()
            .subscribe((result: MultiSelectFiltersDialogResponse) => {
                // set value only if not cancelled
                if (result) {
                    if (!result?.cancelled) {
                        control.setValue(result.data);
                    }
                }
            });
    }

    getMultiSelectValueLabel(input: FiltersInput): string {
        // get values
        const values: any[] = this.form.get(input.name)?.value ?? [];

        return (
            input.options
                // include option only if in value
                .filter((option) => values.includes(option.value))
                // gather labels
                .map((option) => option.label)
                .join(', ')
        );
    }

    onReset(): void {
        this.inputs.forEach((input) => {
            const formControl = this.form.get(input.name);
            formControl.setValue(input.resetValue);
        });
    }

    usersNameDisplayFn(user: User): string {
        return user ? `${user?.firstName} ${user?.lastName}` : null;
    }

    applyAndClose(): void {
        this.matDialogRef.close(this.form.value);
    }

    private createSelectOptions<Entity>(
        input: FiltersInput,
        control: AbstractControl,
        callback: PopulateOptionsCallback<Entity>
    ): void {
        // set initial value
        this.isSelectOptionsLoading[input.name] = false;

        // populate options
        this.selectOptions[input.name] = control.valueChanges.pipe(
            debounceTime(200),
            startWith(''),
            map((value) =>
                typeof value === 'string' ? value : value?.name ?? ''
            ),
            switchMap((search) => {
                this.isSelectOptionsLoading[input.name] = false;

                if (!search) {
                    return [];
                }

                this.isSelectOptionsLoading[input.name] = true;

                return callback(search);
            }),
            tap(() => (this.isSelectOptionsLoading[input.name] = false))
        );
    }

    private createUsersOptions(
        input: FiltersInput,
        control: AbstractControl,
        userTypes: Array<UserRoles> | null
    ): void {
        this.createSelectOptions<User>(input, control, (search) =>
            this.userService
                .getUsers(
                    createSearchPaginationLimitOptions({
                        search,
                        limit: DEFAULT_FILTER_PAGINATION_LIMIT,
                        ...(userTypes ? { roles: userTypes } : {}),
                    })
                )
                .pipe(
                    map((result) => result.data),
                    catchError(() => of([]))
                )
        );
    }
}

// For validation of object as dropdown list
export const objectInputValidator: ValidatorFn = (
    control: AbstractControl
): ValidationErrors | null => {
    if (!control.value) {
        return null;
    }
    const inputValue = control.value;

    return typeof inputValue === 'string' || typeof inputValue === 'number'
        ? { validSiteValueRequired: true }
        : null;
};
