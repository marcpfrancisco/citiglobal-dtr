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
import { ActivatedRoute, Params, Router } from '@angular/router';
import { mode } from '@constants';
import { SectionSortables, SubjectSortables, UserRoles } from '@enums';
import { fuseAnimations } from '@fuse/animations';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { CreateUserDto } from '@interfaces';
import { User, SubjectModel, Section } from '@models';
import { Store } from '@ngrx/store';
import { UsersService } from '@services';
import {
    AuthenticationReducer,
    RootState,
    UsersListReducer,
} from '@stores/index';
import { UsersListActions } from '@stores/users';
import { getSortData, isNumericInteger } from '@utils';
import { Subscription, Subject, Observable, of, combineLatest } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
    selector: 'citiglobal-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class UserEditComponent implements OnInit, OnDestroy {
    readonly USER_ROLES = UserRoles;
    readonly SECTION_SORTABLES = SectionSortables;
    readonly SUBJECT_SORTABLES = SubjectSortables;

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

    subjectDateSource$: Observable<SubjectModel[]>;
    studentDataSource$: Observable<Section[]>;

    @ViewChild(FusePerfectScrollbarDirective)
    directiveScroll: FusePerfectScrollbarDirective;

    userRecord: User;

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

    get userName(): string {
        return this.userForm?.get('fullName')?.value;
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
            if (this.isDisabledField(fieldName)) {
                return;
            }

            payload[fieldName] = data[fieldName];
        });

        return payload as CreateUserDto;
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private usersService: UsersService,
        private store: Store<RootState>,
        private dialog: MatDialog
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

                this.userForm.setValue({
                    fullName: user[0]?.fullName || '',
                    role: user[0]?.role || '',
                    isActive: user[0]?.isActive || false,
                });

                this.refreshDisabledFields();
            });

        this.setupObservables();
    }

    buildUserForm(): void {
        this.userForm = new FormGroup({
            fullName: new FormControl('', [Validators.required]),
            role: new FormControl('', [Validators.required]),
            isActive: new FormControl(true, [Validators.required]),
        });
    }

    ngOnDestroy(): void {
        this.userDetailSubscription.unsubscribe();
        // this.unsubscribeDialogbox();
    }

    refreshDisabledFields(): void {
        const form = this.userForm;
        const isEditingSelf = this.isEditingSelf;

        // disable form control
        if (form) {
            this.setDisabledField('name', false);
            this.setDisabledField('role', !this.isRoleUpdatable);
            this.setDisabledField('isActive', isEditingSelf);
        }
    }

    setDisabledField(fieldName: string, disabled?: boolean): boolean {
        const isDisabled = disabled !== false;
        const field = this.userForm?.get(fieldName);

        if (field) {
            if (!isDisabled) {
                field.enable({ onlySelf: true });
            } else {
                field.disable({ onlySelf: true });
            }
        }

        return isDisabled;
    }

    isDisabledField(fieldName: string): boolean {
        const field = this.userForm?.get(fieldName);

        if (field) {
            return field.disabled;
        }

        return true;
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
            // the id of the user to be edited
            this.store.dispatch(
                UsersListActions.onUpdateUser({
                    userId: this.userId,
                    payload: formData,
                })
            );

            // Create User
        } else {
            this.store.dispatch(
                UsersListActions.onCreateUser({
                    payload: formData,
                })
            );
        }
    }

    /**
     * Handles back navigation to specified route
     */
    navigateBack(): void {
        this.router.navigate(['users']);
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
