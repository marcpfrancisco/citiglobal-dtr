import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AblePipe } from '@pipes';
import { ACTION_CREATE, ACTION_UPDATE, SUBJECT_SECTIONS } from '@constants';
import { fuseAnimations } from '@fuse/animations';
import { Section } from '@models';
import { Store } from '@ngrx/store';
import { PermissionsService, RouterService, SectionsService } from '@services';
import { RootState } from '@stores/index';
import { of, Subject, Subscription } from 'rxjs';
import { CreateSectionDto } from 'src/app/shared/interfaces/section/create-section-dto.interface';
import { EditSectionDto } from 'src/app/shared/interfaces/section/edit-section-dto.interface';
import { NgValidators } from '@utils';
import { catchError, map, switchMap } from 'rxjs/operators';
import { isBoolean, isString } from 'lodash';

@Component({
    selector: 'citiglobal-section-edit',
    templateUrl: './section-edit.component.html',
    styleUrls: ['./section-edit.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class SectionEditComponent implements OnInit, OnDestroy {
    // Type of mode if Edit or Create
    protected editMode: boolean | null;

    protected formSubmit$: Subject<CreateSectionDto | EditSectionDto>;

    sectionReloadSubscription: Subscription;
    formSubmitSubscription: Subscription;

    form: FormGroup;
    tabIndex: number;

    sectionRecord: Section | null;

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
                subject: SUBJECT_SECTIONS,
                subjectAttributes: this.sectionRecord,
            });
        }

        return this.permissionService.can({
            actions: [ACTION_CREATE],
            subject: SUBJECT_SECTIONS,
        });
    }

    get sectionName(): string {
        const sectionName = this.form?.get('name')?.value;

        if (!sectionName) {
            return null;
        }

        return sectionName;
    }

    get formData(): { [key in keyof CreateSectionDto]: CreateSectionDto[key] } {
        const data = this.form?.getRawValue() || {};
        const payload = {};

        // exclude disabled data
        Object.keys(data).forEach((fieldName) => {
            payload[fieldName] = data[fieldName];
        });

        return payload as CreateSectionDto;
    }

    constructor(
        private route: ActivatedRoute,
        private routerService: RouterService,
        private sectionService: SectionsService,
        private permissionService: PermissionsService,
        private store: Store<RootState>,
        private ablePipe: AblePipe
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
                        ? this.sectionService.update(
                              this.sectionRecord.id,
                              payload
                          )
                        : this.sectionService.create(
                              payload as CreateSectionDto
                          )
                    ).pipe(
                        map(() => true),
                        catchError(() => of(false))
                    )
                )
            )
            .subscribe((response) => this.navigateBack());

        this.sectionReloadSubscription = this.route.paramMap
            .pipe(
                switchMap((param) => {
                    const sectionId = param.has('sectionId')
                        ? param.get('sectionId')
                        : null;

                    if (!sectionId) {
                        this.editMode = false;
                        return of(null);
                    }

                    this.editMode = true;

                    return this.sectionService
                        .getSectionById(sectionId)
                        .pipe(catchError(() => of(null)));
                })
            )
            .subscribe((section: Section | null) => {
                this.sectionRecord = section;

                if (section) {
                    const { name, isActive, course } = section[0];

                    this.form.patchValue({
                        name,
                        isActive,
                        course,
                    });
                } else {
                    this.form.patchValue({
                        name: '',
                        isActive: true,
                        course: null,
                    });
                }
            });
    }

    private buildSubjectForm(): void {
        this.form = new FormGroup({
            name: new FormControl('', [Validators.required]),
            course: new FormControl('', [Validators.required]),
            isActive: new FormControl('', [Validators.required]),
        });
    }

    ngOnDestroy(): void {
        this.sectionReloadSubscription.unsubscribe();
        this.formSubmitSubscription.unsubscribe();
        this.formSubmit$.complete();
    }

    private transformFormDataToPayload<
        Result extends CreateSectionDto | EditSectionDto
    >(): Result {
        const { name, course, isActive } = this.form?.getRawValue() || {};
        const payload = {} as Result;

        if (isString(name)) {
            payload.name = name;
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
        this.routerService.back(['subjects']);
    }
}
