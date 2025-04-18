import {
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Params } from '@angular/router';
import { ACTION_UPDATE, mode, pagination, SUBJECT_SECTIONS } from '@constants';
import { SectionSortables, SubjectSortables, UserRoles } from '@enums';
import { fuseAnimations } from '@fuse/animations';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { CreateUserDto } from '@interfaces';
import { Section, SubjectModel, User } from '@models';
import { Store } from '@ngrx/store';
import { AblePipe } from '@pipes';
import {
    ReportsService,
    RouterService,
    SectionsService,
    UsersService,
} from '@services';
import {
    AuthenticationReducer,
    RootState,
    UsersListReducer,
    UserSubjectListReducer,
} from '@stores/index';
import { UserSubjectListActions } from '@stores/user-subjects-list';
import { UsersListActions } from '@stores/users';
import {
    createSearchPaginationLimitOptions,
    getSortData,
    isNumericInteger,
} from '@utils';
import {
    BehaviorSubject,
    combineLatest,
    Observable,
    of,
    Subject,
    Subscription,
} from 'rxjs';
import {
    catchError,
    debounceTime,
    map,
    switchMap,
    take,
    tap,
} from 'rxjs/operators';
import {
    AlertComponent,
    ButtonTypes,
} from 'src/app/shared/dialogs/alert/alert.component';
import { FindAllSectionsDto } from 'src/app/shared/interfaces/section/find-all-sections-dto.interface';
import { UserAssignSubjectComponent } from '../user-assign-subject/user-assign-subject.component';

@Component({
    selector: 'citiglobal-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class UserEditComponent implements OnInit, OnDestroy {
    private searchSubject = new BehaviorSubject<string>('');

    readonly USER_ROLES = UserRoles;
    readonly COURSE_SECTION_SORTABLES = SectionSortables;
    readonly SUBJECT_SORTABLES = SubjectSortables;

    SUBJECT_DISPLAYED_COLUMNS = [
        SubjectSortables.SUBJECT_CODE,
        SubjectSortables.DESCRIPTION,
        SubjectSortables.START_TIME,
        SubjectSortables.END_TIME,
        SubjectSortables.CREATED_AT,
        SubjectSortables.ACTIVE,
        'options',
    ];

    userForm: FormGroup;

    // Type of mode if Edit or Create
    mode: string = mode.CREATE_MODE;

    userId: number | null;

    isLoading: boolean;

    // options for roles
    userRoles: Array<UserRoles>;

    userDetailSubscription: Subscription | null;
    assignSubjectDialogSubscription: Subscription | null;
    unassignSubjectDialogSubscription: Subscription | null;

    userIdChanges$: Subject<number>;
    loggedInUser: User | null;

    sectionOptions: Section[];
    sectionId: number;
    course: string;

    dataSource$: Observable<SubjectModel[]>;

    /** Pagination */
    pageSizeOptions$: Observable<number[]>;
    pageSize$: Observable<number>;
    pageIndex$: Observable<number>;
    total$: Observable<number>;

    sectionList$: Observable<Section[]>;

    listState$: Observable<UserSubjectListReducer.State>;

    @ViewChild(FusePerfectScrollbarDirective)
    directiveScroll: FusePerfectScrollbarDirective;

    userRecord: User;
    sectionRecord: Section[];

    get subjectDisplayedColumns(): Array<string> {
        if (!this.ablePipe.transform(ACTION_UPDATE, SUBJECT_SECTIONS)) {
            return this.SUBJECT_DISPLAYED_COLUMNS.filter(
                (column) => column !== 'options'
            );
        }
        return this.SUBJECT_DISPLAYED_COLUMNS;
    }

    get role(): UserRoles | '' {
        const value = this.userForm?.get('role')?.value;

        if (Object.values(UserRoles).includes(value)) {
            return value;
        }

        return '';
    }

    get isActive(): boolean {
        return this.userForm?.get('isActive')?.value;
    }

    get firstName(): string {
        return this.userForm?.get('firstName')?.value;
    }

    get lastName(): string {
        return this.userForm?.get('lastName')?.value;
    }

    get studentNo(): string {
        return this.userForm?.get('studentNo')?.value;
    }

    get hasAssignedSubject(): boolean {
        return !!this.role;
    }

    get isEditMode(): boolean {
        return this.mode === mode.EDIT_MODE;
    }

    get isEditingSelf(): boolean {
        return (
            this.mode === mode.EDIT_MODE &&
            !!this.loggedInUser?.id &&
            !!this.userRecord?.id &&
            `${this.loggedInUser?.id}` === `${this.userRecord?.id}`
        );
    }

    get isRoleUpdatable(): boolean {
        // Role field is Updatable when:
        // 1. Create mode
        // 2. Not updating his own User record, then allow update
        // 3. When SUPERADMIN
        return (
            this.mode === mode.CREATE_MODE ||
            !this.isEditingSelf ||
            this.loggedInUser?.role === UserRoles.SUPERADMIN
        );
    }

    get formData(): { [key in keyof CreateUserDto]: CreateUserDto[key] } {
        const data = this.userForm?.getRawValue() || {};
        const payload = {};

        // exclude disabled data
        Object.keys(data).forEach((fieldName) => {
            payload[fieldName] = data[fieldName];
        });

        return payload as CreateUserDto;
    }

    get canAssignSubject(): boolean {
        if (!this.role) {
            return false;
        }

        return true;
    }

    get currentSection(): Section | null {
        return this.userForm?.get('section')?.value || null;
    }

    set currentSection(section: Section | null) {
        const sectionRecord = this.sectionRecord;

        if (this.sectionId) {
            const filteredSection = sectionRecord.filter(
                (section) => section.id === this.sectionId
            );
            this.userForm?.patchValue({
                section: filteredSection || null,
            });
        }

        this.userForm?.patchValue({
            section: section || null,
        });
    }

    constructor(
        private route: ActivatedRoute,
        private routerService: RouterService,
        private usersService: UsersService,
        private sectionsService: SectionsService,
        private store: Store<RootState>,
        private dialog: MatDialog,
        private ablePipe: AblePipe,
        private reportsService: ReportsService
    ) {}

    ngOnInit(): void {
        this.loggedInUser = null;
        this.userRoles = Object.values(UserRoles);

        this.sectionList$ = this.searchSubject.pipe(
            debounceTime(500),
            switchMap((search) => {
                const params = createSearchPaginationLimitOptions({
                    search,
                    page: pagination.CURRENT_PAGE,
                    limit: pagination.ITEMS_PER_PAGE,
                });

                return this.sectionsService.getSections(
                    params as FindAllSectionsDto
                );
            }),
            map((sections) => {
                this.sectionRecord = sections?.data;
                return sections?.data || [];
            })
        );

        this.buildUserForm();

        this.userDetailSubscription = combineLatest([
            this.route.paramMap,
            this.store.select(AuthenticationReducer.selectCurrentUser),
            this.store.select(UsersListReducer.selectUpdatedAt),
        ])
            .pipe(
                switchMap(([params, currentUser]: [Params, User, number]) => {
                    const userId = currentUser ? params.get('userId') : null;
                    const sectionId = params.has('sectionId')
                        ? params.get('sectionId')
                        : null;

                    this.loggedInUser = currentUser || null;
                    this.userId = isNumericInteger(userId) ? +userId : null;
                    this.sectionId = isNumericInteger(sectionId)
                        ? +sectionId
                        : null;

                    if (!this.userId) {
                        return of(null);
                    }

                    this.store.dispatch(
                        UserSubjectListActions.onInit({ userId: this.userId })
                    );

                    return this.usersService
                        .getUserById(this.userId)
                        .pipe(catchError(() => of(null)));
                })
            )
            .subscribe((user: User | null) => {
                this.mode = user ? mode.EDIT_MODE : mode.CREATE_MODE;
                this.userRecord = user;

                if (user) {
                    const {
                        firstName,
                        lastName,
                        studentNo,
                        section,
                        rfidNo,
                        email,
                        username,
                        role,
                        isActive,
                    } = user[0];

                    this.userForm.patchValue({
                        firstName,
                        lastName,
                        studentNo,
                        section,
                        rfidNo,
                        email,
                        username,
                        role,
                        isActive,
                    });
                } else {
                    this.userForm.patchValue({
                        firstName: '',
                        lastName: '',
                        studentNo: '',
                        section: null,
                        rfidNo: '',
                        username: '',
                        role: '',
                        isActive: true,
                    });
                }
            });

        this.setupObservables();
    }

    private buildUserForm(): void {
        this.userForm = new FormGroup({
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl('', [Validators.required]),
            studentNo: new FormControl('', [Validators.required]),
            section: new FormControl(null, [Validators.required]),
            rfidNo: new FormControl('', [Validators.required]),
            email: new FormControl(
                { value: '', disabled: this.mode === mode.EDIT_MODE },
                [Validators.required, Validators.email]
            ),
            username: new FormControl('', [Validators.required]),
            role: new FormControl('', [Validators.required]),
            isActive: new FormControl(true, [Validators.required]),
        });
    }

    ngOnDestroy(): void {
        this.userDetailSubscription.unsubscribe();
        // this.unsubscribeDialogbox();
    }

    onToggleSort(sort: Sort): void {
        const sortData = getSortData<SubjectSortables>(sort);
        this.store.dispatch(UserSubjectListActions.onToggleSort(sortData));
    }

    unsubscribeDialogbox(): void {
        if (this.assignSubjectDialogSubscription) {
            this.assignSubjectDialogSubscription.unsubscribe();
            this.assignSubjectDialogSubscription = null;
        }

        if (this.unassignSubjectDialogSubscription) {
            this.unassignSubjectDialogSubscription.unsubscribe();
            this.unassignSubjectDialogSubscription = null;
        }
    }

    onChangePage(event: PageEvent): void {
        this.store.dispatch(
            UserSubjectListActions.onLoadUsersSubjects({
                limit: event.pageSize,
                page: event.pageIndex,
            })
        );
    }

    isAssignedSubject(subjectId: number): boolean {
        const user = this.userRecord;

        if (!user) {
            return false;
        }

        return (
            !!user.subjects?.find((subject) => subject.id === subjectId) ||
            false
        );
    }

    /**
     * Handles specific error in forms
     * @param controlName  the name of the field
     * @param errorName the error name
     */
    hasError(controlName: string, errorName: string): boolean {
        return this.userForm.controls[controlName].hasError(errorName);
    }

    /**
     * Handles the Edit and Create user
     */
    handleUser(): void {
        const formData = this.formData;

        this.isLoading = true;

        if (isNumericInteger(this.sectionId)) {
            formData['sectionId'] = this.sectionId;
        }

        // Edit User
        if (this.mode === mode.EDIT_MODE) {
            // the id of the user to be edited
            this.store.dispatch(
                UsersListActions.onUpdateUser({
                    userId: +this.userId,
                    payload: formData,
                })
            );

            // Create User
        } else {
            console.log('Create');
            this.store.dispatch(
                UsersListActions.onCreateUser({
                    payload: formData,
                })
            );
        }
    }

    exportUsers(): void {
        this.reportsService
            .downloadStudentTimeSheet(this.studentNo)
            .subscribe((url) => {
                window.open(url, '_blank');
            });
    }

    assignSubject(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.panelClass = 'citiglobal-user-assign-subject';

        this.unsubscribeDialogbox();

        this.assignSubjectDialogSubscription = this.dialog
            .open(UserAssignSubjectComponent, dialogConfig)
            .afterClosed()
            .pipe(take(1))
            .subscribe((subject) => {
                if (subject) {
                    // assign subject
                    if (
                        this.canAssignSubject &&
                        !this.isAssignedSubject(subject.id)
                    ) {
                        this.store.dispatch(
                            UserSubjectListActions.onAddUserSubject({
                                subjectId: subject.id,
                            })
                        );
                    }
                }
            });
    }

    unassignSubject(subjectId: number): void {
        this.unsubscribeDialogbox();

        this.unassignSubjectDialogSubscription = this.dialog
            .open(AlertComponent, {
                disableClose: true,
                minWidth: 280,
                data: {
                    title: 'Remove Assigned Subject',
                    message: 'Are you sure you want to remove subject?',
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
                    if (this.isAssignedSubject(subjectId)) {
                        this.store.dispatch(
                            UserSubjectListActions.onRemoveUserSubject({
                                subjectId,
                            })
                        );
                    }
                }
            });
    }

    /**
     * Handles back navigation to specified route
     */
    navigateBack(): void {
        this.routerService.back(['users']);
    }

    /**
     * Calls the reset password api that sends
     * an email to the user
     */
    resetPassword(): void {
        if (isNumericInteger(this.userId)) {
            this.store.dispatch(
                UsersListActions.onResetPasswordUser({ userId: +this.userId })
            );
        }
    }

    private setupObservables(): void {
        const listState$ = this.store.select(
            UserSubjectListReducer.selectState
        );
        this.total$ = listState$.pipe(map((state) => state.total));
        this.pageSizeOptions$ = listState$.pipe(
            map((state) => state.pageSizeOptions)
        );
        this.pageSize$ = listState$.pipe(map((state) => state.limit));
        this.pageIndex$ = listState$.pipe(map((state) => state.page));
        this.dataSource$ = this.store
            .select(UserSubjectListReducer.selectList)
            .pipe(
                tap((items) => {
                    this.directiveScroll?.scrollToTop();
                })
            );
        this.listState$ = listState$;
    }

    handleSearchSection(text: string): void {
        this.searchSubject.next(text);
    }

    handleSelectedSection(section: Section): void {
        this.currentSection = section || null;
        this.sectionId = section?.id || null;
    }

    displayFn(section: Section): string {
        return section?.name;
    }
}
