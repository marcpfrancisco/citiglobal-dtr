import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AblePipe } from '@pipes';
import {
    ACTION_CREATE,
    ACTION_UPDATE,
    DEFAULT_MOMENT_DATE_FORMATS,
    mode,
    MOMENT_SQL_TIME_FORMAT,
    SUBJECT_SUBJECTS,
} from '@constants';
import { fuseAnimations } from '@fuse/animations';
import { CreateSubjectDto, EditSubjectDto } from '@interfaces';
import { SubjectModel } from '@models';
import { Store } from '@ngrx/store';
import { PermissionsService, RouterService, SubjectsService } from '@services';
import { RootState, SubjectListReducer } from '@stores/index';
import { combineLatest, of, Subject, Subscription } from 'rxjs';
import {
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import moment from 'moment';
import { catchError, map, switchMap } from 'rxjs/operators';
import { isArray, isBoolean, isNumber, isString } from 'lodash';
import { momentize } from '@utils';

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

    subjectRecord: SubjectModel | null;

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

        this.buildSubjectForm();

        this.formSubmit$ = new Subject();
        this.formSubmitSubscription = this.formSubmit$
            .pipe(
                switchMap((payload) =>
                    (this.editMode
                        ? this.subjectService.update(
                              this.subjectRecord.id,
                              payload
                          )
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

                    if (!subjectId) {
                        this.editMode = false;
                        return of(null);
                    }

                    this.editMode = true;

                    return this.subjectService
                        .getSubjectById(subjectId)
                        .pipe(catchError(() => of(null)));
                })
            )
            .subscribe((subject: SubjectModel | null) => {
                this.subjectRecord = subject;

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

                if (subject) {
                    this.form.patchValue({
                        subjectCode,
                        description,
                        day,
                        startTime: momentize(startTime),
                        endTime: momentize(endTime),
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
            gracePeriod: new FormControl(null, [Validators.required]),
            units: new FormControl('', [Validators.required]),
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

        if (isArray(day)) {
            payload.day = day;
        }

        if (isString(gracePeriod)) {
            payload.gracePeriod = gracePeriod;
        }

        if (isNumber(units)) {
            payload.units = units;
        }

        if (moment.isMoment(startTime)) {
            payload.startTime = startTime.format(MOMENT_SQL_TIME_FORMAT);
        }

        if (moment.isMoment(endTime)) {
            payload.endTime = endTime.format(MOMENT_SQL_TIME_FORMAT);
        }

        if (isBoolean(isActive)) {
            payload.isActive = isActive;
        }

        return payload;
    }

    submit(): void {
        if (!this.isReady || this.form?.invalid) {
            return;
        }

        this.formSubmit$.next(this.transformFormDataToPayload());
    }

    navigateBack() {
        this.routerService.back(['subject']);
    }
}
