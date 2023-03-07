import {
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Params } from '@angular/router';
import { ACTION_UPDATE, mode, SUBJECT_SECTIONS } from '@constants';
import { SectionSortables, SubjectSortables, UserRoles } from '@enums';
import { fuseAnimations } from '@fuse/animations';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { CreateUserDto } from '@interfaces';
import { Section, SubjectModel, User } from '@models';
import { Store } from '@ngrx/store';
import { AblePipe } from '@pipes';
import { RouterService, UsersService } from '@services';
import {
    AuthenticationReducer,
    RootState,
    UsersListReducer,
} from '@stores/index';
import { UsersListActions } from '@stores/users';
import { getSortData, isNumericInteger } from '@utils';
import { combineLatest, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';

@Component({
    selector: 'citiglobal-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class UserEditComponent implements OnInit, OnDestroy {
    readonly USER_ROLES = UserRoles;
    readonly COURSE_SECTION_SORTABLES = SectionSortables;
    readonly SUBJECT_SORTABLES = SubjectSortables;

    COURSE_SECTION_DISPLAYED_COLUMNS = [
        SectionSortables.SECTION,
        SectionSortables.COURSE,
        SectionSortables.PUBLISHED_AT,
        SectionSortables.ACTIVE,
        'options',
    ];

    SUBJECT_DISPLAYED_COLUMNS = [
        SubjectSortables.SUBJECT_CODE,
        SubjectSortables.DESCRIPTION,
        SubjectSortables.START_TIME,
        SubjectSortables.END_TIME,
        SubjectSortables.PUBLISHED_AT,
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

    userDetailSubscription: Subscription;
    userIdChanges$: Subject<number>;
    loggedInUser: User | null;

    /** Pagination */
    pageSizeOptions$: Observable<number[]>;
    pageSize$: Observable<number>;
    pageIndex$: Observable<number>;
    total$: Observable<number>;

    courseSubjectDateSource$: Observable<SubjectModel[]>;
    studentDataSource$: Observable<Section[]>;

    @ViewChild(FusePerfectScrollbarDirective)
    directiveScroll: FusePerfectScrollbarDirective;

    userRecord: User;

    get courseSectionDisplayedColumns(): Array<string> {
        if (!this.ablePipe.transform(ACTION_UPDATE, SUBJECT_SECTIONS)) {
            return this.COURSE_SECTION_DISPLAYED_COLUMNS.filter(
                (column) => column !== 'options'
            );
        }
        return this.COURSE_SECTION_DISPLAYED_COLUMNS;
    }

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

    get canAssignCourseAndSection(): boolean {
        if (!this.role) {
            return false;
        }

        return true;
    }

    get canAssignSubject(): boolean {
        if (!this.role) {
            return false;
        }

        return true;
    }

    constructor(
        private route: ActivatedRoute,
        private routerService: RouterService,
        private usersService: UsersService,
        private store: Store<RootState>,
        private ablePipe: AblePipe
    ) {}

    ngOnInit(): void {
        this.loggedInUser = null;
        this.userRoles = Object.values(UserRoles);

        this.buildUserForm();

        this.userDetailSubscription = combineLatest([
            this.route.paramMap,
            this.store.select(AuthenticationReducer.selectCurrentUser),
            this.store.select(UsersListReducer.selectUpdatedAt),
        ])
            .pipe(
                switchMap(([params, currentUser]: [Params, User, number]) => {
                    const userId = currentUser ? params.get('userId') : null;

                    this.loggedInUser = currentUser || null;
                    this.userId = isNumericInteger(userId) ? +userId : null;

                    if (!this.userId) {
                        return of(null);
                    }

                    return this.usersService
                        .getUserById(this.userId)
                        .pipe(catchError(() => of(null)));
                })
            )
            .subscribe((user: User | null) => {
                this.mode = user ? mode.EDIT_MODE : mode.CREATE_MODE;

                this.userRecord = user;

                if (user) {
                    this.userForm.setValue({
                        firstName: user[0]?.firstName || '',
                        lastName: user[0]?.lastName || '',
                        studentNo: user[0]?.studentNo || '',
                        rfidNo: user[0]?.rfidNo || '',
                        username: user[0]?.username || '',
                        role: user[0]?.role || '',
                        isActive: user[0]?.isActive || false,
                    });
                }

                // if (user) {
                //     this.userForm.setValue({
                //         firstName: user[0]?.firstName || '',
                //         lastName: user[0]?.lastName || '',
                //         studentId: user[0]?.studentId || '',
                //         rfidNo: user[0]?.rfidNo || '',
                //         role: user[0]?.role || '',
                //         isActive: user[0]?.isActive || false,
                //     });
                // }
            });

        this.setupObservables();
    }

    buildUserForm(): void {
        this.userForm = new FormGroup({
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl('', [Validators.required]),
            studentNo: new FormControl('', [Validators.required]),
            rfidNo: new FormControl('', [Validators.required]),
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
        const sortData = getSortData<SectionSortables>(sort);
        // this.store.dispatch(UsersFloristsActions.onToggleSort(sortData));
    }

    // unsubscribeDialogbox(): void {
    //   if (this.assignFloristDialogSubscription) {
    //     this.assignFloristDialogSubscription.unsubscribe();
    //     this.assignFloristDialogSubscription = null;
    //   }

    //   if (this.unassignFloristDialogSubscription) {
    //     this.unassignFloristDialogSubscription.unsubscribe();
    //     this.unassignFloristDialogSubscription = null;
    //   }
    // }

    onChangePage(event: PageEvent): void {
        // this.store.dispatch(
        //   UsersFloristsActions.onLoadUsersFlorists({
        //     limit: event.pageSize,
        //     page: event.pageIndex,
        //   })
        // );
    }

    trackByFn(index, florist): number {
        return florist?.id; // or item.id
    }

    /**
     * Handles the Edit and Create user
     */
    handleUser(): void {
        const formData = this.formData;

        this.isLoading = true;
        // Edit User
        if (this.mode === mode.EDIT_MODE) {
            console.log(formData, 'Update');
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

    assignCourseAndSection(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.panelClass = 'citiglobal-user-assign-course-section';

        // this.unsubscribeDialogbox();

        // this.assignFloristDialogSubscription = this.dialog
        //   .open(UserAssignFloristComponent, dialogConfig)
        //   .afterClosed()
        //   .pipe(take(1))
        //   .subscribe((florist) => {
        //     if (florist) {
        //       // assign florist
        //       if (this.canAssignCourseAndSection && !this.isAssignedFlorist(florist.id)) {
        //         this.store.dispatch(
        //           UsersFloristsActions.onAddUserFlorist({ floristId: florist.id })
        //         );
        //       }
        //     }
        //   });
    }

    assignSubject(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.panelClass = 'citiglobal-user-assign-subject';

        // this.unsubscribeDialogbox();

        // this.assignFloristDialogSubscription = this.dialog
        //   .open(UserAssignFloristComponent, dialogConfig)
        //   .afterClosed()
        //   .pipe(take(1))
        //   .subscribe((florist) => {
        //     if (florist) {
        //       // assign florist
        //       if (this.canAssignCourseAndSection && !this.isAssignedFlorist(florist.id)) {
        //         this.store.dispatch(
        //           UsersFloristsActions.onAddUserFlorist({ floristId: florist.id })
        //         );
        //       }
        //     }
        //   });
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
        // const listState$ = this.store.select(UsersFloristsListReducer.selectState);
        // this.total$ = listState$.pipe(map((state) => state.total));
        // this.pageSizeOptions$ = listState$.pipe(
        //   map((state) => state.pageSizeOptions)
        // );
        // this.pageSize$ = listState$.pipe(map((state) => state.limit));
        // this.pageIndex$ = listState$.pipe(map((state) => state.page));
        // this.dataSource$ = this.store
        //   .select(UsersFloristsListReducer.selectList)
        //   .pipe(
        //     tap((items) => {
        //       this.directiveScroll?.scrollToTop();
        //     })
        //   );
        // this.listState$ = listState$;
    }
}
