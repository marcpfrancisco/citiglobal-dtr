import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
    MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import {
    ACTION_CREATE,
    ACTION_UPDATE,
    DEFAULT_MOMENT_DATE_FORMATS,
    SUBJECT_SUBJECTS,
} from '@constants';
import { DayOfWeek } from '@enums';
import { fuseAnimations } from '@fuse/animations';
import { CreateSubjectDto, EditSubjectDto } from '@interfaces';
import { SubjectModel } from '@models';
import { Store } from '@ngrx/store';
import { AblePipe } from '@pipes';
import { PermissionsService, RouterService, SubjectsService } from '@services';
import { RootState } from '@stores/index';
import { isNumericInteger, NgValidators } from '@utils';
import { isArray, isBoolean, isInteger, isNumber, isString } from 'lodash';
import moment from 'moment';
import { of, Subject, Subscription } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

interface EnumView {
    value?: string;
    index?: number;
}

@Component({
    selector: 'citiglobal-subject-edit',
    templateUrl: './subject-edit.component.html',
    styleUrls: ['./subject-edit.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_FORMATS, useValue: DEFAULT_MOMENT_DATE_FORMATS },
        DecimalPipe,
        CurrencyPipe,
    ],
})
export class SubjectEditComponent implements OnInit, OnDestroy {
    // Type of mode if Edit or Create
    protected editMode: boolean | null;

    protected formSubmit$: Subject<CreateSubjectDto | EditSubjectDto>;

    subjectReloadSubscription: Subscription;
    formSubmitSubscription: Subscription;

    form: FormGroup;
    tabIndex: number;
    subjectId: number;

    subjectRecord: SubjectModel | null;
    dayOfWeekOptions: Array<EnumView> = [];

    get isEditMode(): boolean {
        return this.editMode === true;
    }

    get isReady(): boolean {
        return this.editMode !== null;
    }

    get isAllowSubmit(): boolean {
        if (!this.isReady) {
            return false;
        }

        if (this.isEditMode) {
            return this.permissionService.can({
                actions: [ACTION_UPDATE],
                subject: SUBJECT_SUBJECTS,
                subjectAttributes: this.subjectRecord,
            });
        }

        return this.permissionService.can({
            actions: [ACTION_CREATE],
            subject: SUBJECT_SUBJECTS,
        });
    }

    get subjectCode(): string {
        const subjectCode = this.form?.get('subjectCode')?.value;

        if (!subjectCode) {
            return null;
        }

        return subjectCode;
    }

    get minEndDate(): moment.Moment | null {
        const startDate = this.form?.get('startDate')?.value;

        if (!startDate) {
            return null;
        }

        return moment(startDate);
    }

    get isEndDateNotEmpty(): boolean {
        return moment.isMoment(this.form?.get('endDate')?.value);
    }

    get formData(): { [key in keyof CreateSubjectDto]: CreateSubjectDto[key] } {
        const data = this.form?.getRawValue() || {};
        const payload = {};

        // exclude disabled data
        Object.keys(data).forEach((fieldName) => {
            payload[fieldName] = data[fieldName];
        });

        return payload as CreateSubjectDto;
    }

    get startTime() {
        const startTime = this.form?.get('startTime')?.value;

        if (!startTime) {
            return null;
        }

        return startTime;
    }

    constructor(
        private route: ActivatedRoute,
        private routerService: RouterService,
        private subjectService: SubjectsService,
        private store: Store<RootState>,
        private ablePipe: AblePipe,
        private permissionService: PermissionsService
    ) {}

    ngOnInit(): void {
        this.tabIndex = 0;
        this.editMode = null;

        this.dayOfWeekOptions = Object.keys(DayOfWeek)
            .filter((key) => !isNaN(+key))
            .map((index) => ({
                value: DayOfWeek[index],
                index: +index,
            }));

        this.buildSubjectForm();

        this.formSubmit$ = new Subject();
        this.formSubmitSubscription = this.formSubmit$
            .pipe(
                switchMap((payload) =>
                    (this.editMode
                        ? this.subjectService.update(this.subjectId, payload)
                        : this.subjectService.create(
                              payload as CreateSubjectDto
                          )
                    ).pipe(
                        map(() => true),
                        catchError(() => of(false))
                    )
                )
            )
            .subscribe((response) => this.navigateBack());

        this.subjectReloadSubscription = this.route.paramMap
            .pipe(
                switchMap((param) => {
                    const subjectId = param.has('subjectId')
                        ? param.get('subjectId')
                        : null;

                    this.subjectId = isNumericInteger(subjectId)
                        ? +subjectId
                        : null;

                    if (!subjectId) {
                        this.editMode = false;
                        return of(null);
                    }

                    this.editMode = true;

                    return this.subjectService
                        .getSubjectById(this.subjectId)
                        .pipe(catchError(() => of(null)));
                })
            )
            .subscribe((subject: SubjectModel | null) => {
                this.subjectRecord = subject;

                if (subject) {
                    const {
                        subjectCode,
                        description,
                        day,
                        startTime,
                        endTime,
                        gracePeriod,
                        units,
                        isActive,
                    } = subject[0];

                    this.form.patchValue({
                        subjectCode,
                        description,
                        day,
                        startTime,
                        endTime: endTime ? endTime : null,
                        gracePeriod,
                        units,
                        isActive,
                    });
                } else {
                    this.form.patchValue({
                        subjectCode: '',
                        description: '',
                        day: '',
                        startTime: null,
                        endTime: null,
                        gracePeriod: '',
                        units: '',
                        isActive: true,
                    });
                }
            });
    }

    private buildSubjectForm(): void {
        this.form = new FormGroup({
            subjectCode: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            day: new FormControl('', [Validators.required]),
            startTime: new FormControl(null, [Validators.required]),
            endTime: new FormControl(null, [Validators.required]),
            gracePeriod: new FormControl(null),
            units: new FormControl('', [
                Validators.required,
                NgValidators.isNumericInteger,
            ]),
            isActive: new FormControl('', [Validators.required]),
        });
    }

    ngOnDestroy(): void {
        this.subjectReloadSubscription.unsubscribe();
        this.formSubmitSubscription.unsubscribe();
        this.formSubmit$.complete();
    }

    private transformFormDataToPayload<
        Result extends CreateSubjectDto | EditSubjectDto
    >(): Result {
        const {
            subjectCode,
            description,
            day,
            startTime,
            endTime,
            gracePeriod,
            units,
            isActive,
        } = this.form?.getRawValue() || {};
        const payload = {} as Result;

        if (isString(subjectCode)) {
            payload.subjectCode = subjectCode;
        }

        if (isString(description)) {
            payload.description = description;
        }

        if (isString(day)) {
            payload.day = day;
        }

        if (isNumericInteger(units)) {
            payload.units = units;
        }

        if (isString(startTime)) {
            payload.startTime = this.formatTime(startTime);
        }

        if (isString(endTime)) {
            payload.endTime = this.formatTime(endTime);
        }

        if (isString(gracePeriod)) {
            payload.gracePeriod = this.formatTime(gracePeriod);
        }

        if (isBoolean(isActive)) {
            payload.isActive = isActive;
        }

        return payload;
    }

    private formatTime(timeInput: string): string {
        let trimmedInput: string = '';

        if (!isString(timeInput)) {
            return;
        }

        if (timeInput === null) {
            return;
        }

        // check if the string ends with "AM" or "PM"
        if (/AM|PM/i.test(timeInput)) {
            // extract the time portion without "AM" or "PM"
            return (trimmedInput = timeInput.substring(0, 5)).trim();
        } else {
            // extract the time portion in military time format
            return (trimmedInput = timeInput.substring(0, 5)).trim();
        }
    }

    submit(): void {
        if (!this.isReady || this.form?.invalid) {
            return;
        }

        this.formSubmit$.next(this.transformFormDataToPayload());
    }

    navigateBack() {
        this.routerService.back(['subjects']);
    }
}
