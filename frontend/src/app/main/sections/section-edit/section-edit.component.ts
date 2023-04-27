import {
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ACTION_CREATE,
    ACTION_UPDATE,
    pagination,
    SUBJECT_SECTIONS,
} from '@constants';
import { UserSortables } from '@enums';
import { fuseAnimations } from '@fuse/animations';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { Course, Section, User } from '@models';
import { Store } from '@ngrx/store';
import { AblePipe } from '@pipes';
import {
    CourseService,
    PermissionsService,
    RouterService,
    SectionsService,
} from '@services';
import { RootState, SectionUserListReducer } from '@stores/index';
import { SectionUserListActions } from '@stores/section-users-list';
import {
    createSearchPaginationLimitOptions,
    getSortData,
    isNumericInteger,
} from '@utils';
import { isBoolean, isString } from 'lodash';
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, map, switchMap, tap } from 'rxjs/operators';
import {
    AlertComponent,
    ButtonTypes,
} from 'src/app/shared/dialogs/alert/alert.component';
import { FindAllCoursesDto } from 'src/app/shared/interfaces/course/find-all-courses-dto.interface';
import { CreateSectionDto } from 'src/app/shared/interfaces/section/create-section-dto.interface';
import { EditSectionDto } from 'src/app/shared/interfaces/section/edit-section-dto.interface';

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

    readonly USER_SORTABLES = UserSortables;

    USER_DISPLAYED_COLUMNS = [
        UserSortables.NAME,
        UserSortables.ROLE,
        UserSortables.CREATED_AT,
        UserSortables.ACTIVE,
        'options',
    ];

    protected formSubmit$: Subject<CreateSectionDto | EditSectionDto>;

    private searchSubject = new BehaviorSubject<string>('');

    sectionReloadSubscription: Subscription;
    formSubmitSubscription: Subscription;
    unassignSubjectDialogSubscription: Subscription | null;

    form: FormGroup;
    tabIndex: number;

    sectionRecord: Section | null;
    sectionId: number;

    courseOptions: Course[];
    courseId: number;
    courseList$: Observable<Course[]>;

    dataSource$: Observable<User[]>;

    /** Pagination */
    pageSizeOptions$: Observable<number[]>;
    pageSize$: Observable<number>;
    pageIndex$: Observable<number>;
    total$: Observable<number>;

    listState$: Observable<SectionUserListReducer.State>;

    @ViewChild(FusePerfectScrollbarDirective)
    directiveScroll: FusePerfectScrollbarDirective;

    get userDisplayedColumns(): Array<string> {
        if (!this.ablePipe.transform(ACTION_UPDATE, SUBJECT_SECTIONS)) {
            return this.USER_DISPLAYED_COLUMNS.filter(
                (column) => column !== 'options'
            );
        }
        return this.USER_DISPLAYED_COLUMNS;
    }

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

    get currentCourse(): Course | null {
        return this.form?.get('course')?.value || null;
    }

    set currentSection(course: Course | null) {
        this.form?.patchValue({
            section: course || null,
        });
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private routerService: RouterService,
        private sectionService: SectionsService,
        private courseService: CourseService,
        private permissionService: PermissionsService,
        private ablePipe: AblePipe,
        private dialog: MatDialog,
        private store: Store<RootState>
    ) {}

    ngOnInit(): void {
        this.tabIndex = 0;
        this.editMode = null;

        this.courseList$ = this.searchSubject.pipe(
            debounceTime(500),
            switchMap((search) => {
                const params = createSearchPaginationLimitOptions({
                    search,
                    page: pagination.CURRENT_PAGE,
                    limit: pagination.ITEMS_PER_PAGE,
                });

                return this.courseService.getCourses(
                    params as FindAllCoursesDto
                );
            }),
            map((sections) => sections?.data || [])
        );

        this.buildSubjectForm();

        this.formSubmit$ = new Subject();
        this.formSubmitSubscription = this.formSubmit$
            .pipe(
                switchMap((payload) =>
                    (this.editMode
                        ? this.sectionService.update(this.sectionId, payload)
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

                    this.sectionId = isNumericInteger(sectionId)
                        ? +sectionId
                        : null;

                    if (!sectionId) {
                        this.editMode = false;
                        return of(null);
                    }

                    this.editMode = true;

                    return this.sectionService
                        .getSectionById(this.sectionId)
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

        this.store.dispatch(
            SectionUserListActions.onInit({ sectionId: this.sectionId })
        );
        this.setupObservables();
    }

    private buildSubjectForm(): void {
        this.form = new FormGroup({
            name: new FormControl('', [Validators.required]),
            course: new FormControl(null, [Validators.required]),
            isActive: new FormControl('', [Validators.required]),
        });
    }

    ngOnDestroy(): void {
        this.sectionReloadSubscription.unsubscribe();
        this.formSubmitSubscription.unsubscribe();
        this.formSubmit$.complete();
    }

    onToggleSort(sort: Sort): void {
        const sortData = getSortData<UserSortables>(sort);
        this.store.dispatch(SectionUserListActions.onToggleSort(sortData));
    }

    onChangePage(event: PageEvent): void {
        this.store.dispatch(
            SectionUserListActions.onLoadSectionUsers({
                limit: event.pageSize,
                page: event.pageIndex,
            })
        );
    }

    private transformFormDataToPayload<
        Result extends CreateSectionDto | EditSectionDto
    >(): Result {
        const { name, course, isActive } = this.form?.getRawValue() || {};
        const payload = {} as Result;

        if (isString(name)) {
            payload.name = name;
        }

        if (course) {
            payload.course = course;
        }

        if (isNumericInteger(this.courseId)) {
            payload.courseId = this.courseId;
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

    unsubscribeDialogbox(): void {
        if (this.unassignSubjectDialogSubscription) {
            this.unassignSubjectDialogSubscription.unsubscribe();
            this.unassignSubjectDialogSubscription = null;
        }
    }

    unassignUser(userId: number): void {
        this.unsubscribeDialogbox();

        this.unassignSubjectDialogSubscription = this.dialog
            .open(AlertComponent, {
                disableClose: true,
                minWidth: 280,
                data: {
                    title: 'Remove Assigned User',
                    message: 'Are you sure you want to remove User?',
                    buttons: [
                        { title: 'CANCEL', type: ButtonTypes.CANCEL },
                        { title: 'REMOVE', type: ButtonTypes.CONFIRM },
                    ],
                },
            })
            .afterClosed()
            .subscribe((result) => {
                if (result === ButtonTypes.CONFIRM) {
                    // remove assigned subject
                    this.store.dispatch(
                        SectionUserListActions.onRemoveSectionUser({
                            userId,
                        })
                    );
                }
            });
    }

    navigateBack() {
        this.routerService.back(['sections']);
    }

    private setupObservables(): void {
        const listState$ = this.store.select(
            SectionUserListReducer.selectState
        );
        this.total$ = listState$.pipe(map((state) => state.total));
        this.pageSizeOptions$ = listState$.pipe(
            map((state) => state.pageSizeOptions)
        );
        this.pageSize$ = listState$.pipe(map((state) => state.limit));
        this.pageIndex$ = listState$.pipe(map((state) => state.page));
        this.dataSource$ = this.store
            .select(SectionUserListReducer.selectList)
            .pipe(
                tap((items) => {
                    this.directiveScroll?.scrollToTop();
                })
            );
        this.listState$ = listState$;
    }

    handleSearchCourse(text: string): void {
        this.searchSubject.next(text);
    }

    handleSelectedCourse(course: Course): void {
        this.courseId = course?.id || null;
    }

    assignUser() {
        this.router.navigate(['users/create', this.sectionId]);
    }

    displayFn(course: Course): string {
        return course?.name;
    }
}
