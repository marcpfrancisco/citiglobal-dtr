import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSortables } from '@enums';
import { fuseAnimations } from '@fuse/animations';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { User } from '@models';
import { Store } from '@ngrx/store';
import { AblePipe } from '@pipes';
import { PermissionsService } from '@services';
import { RootState, UsersListReducer } from '@stores/index';
import { UsersListActions } from '@stores/users';
import { getSortData } from '@utils';
import { isObjectLike } from 'lodash';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
    selector: 'citiglobal-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class UsersListComponent implements OnInit {
    readonly USER_SORTABLES = UserSortables;

    displayedColumns = [
        UserSortables.NAME,
        UserSortables.ROLE,
        UserSortables.CREATED_AT,
        UserSortables.ACTIVE,
    ];

    // Table Related properties
    total$: Observable<number>;
    dataSource$: Observable<User[]>;
    pageSizeOptions$: Observable<number[]>;
    pageSize$: Observable<number>;
    pageIndex$: Observable<number>;
    search$: Observable<string>;

    listState$: Observable<any>;
    hasFilters$: Observable<boolean>;

    @ViewChild(FusePerfectScrollbarDirective)
    directiveScroll: FusePerfectScrollbarDirective;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private permissionService: PermissionsService,
        private store: Store<RootState>
    ) {}

    ngOnInit(): void {
        this.setupObservables();
        this.store.dispatch(UsersListActions.onInit());
    }

    onToggleSort(sort: Sort): void {
        const sortData = getSortData<UserSortables>(sort);
        this.store.dispatch(UsersListActions.onToggleSort(sortData));
    }

    onChangePage(event: PageEvent): void {
        this.store.dispatch(
            UsersListActions.onLoadUsers({
                limit: event.pageSize,
                page: event.pageIndex,
            })
        );
    }

    onSelectRow(data: User): void {
        // do not go to edit page if user is deleted to prevent 404 not found errors
        if (this.isDeleted(data)) {
            return;
        }
        // go to edit/details page. (if edit is allowed)
        if (
            this.permissionService.can({ actions: ['read'], subject: 'User' })
        ) {
            this.router.navigate(['edit', data.id], {
                relativeTo: this.activatedRoute,
            });
        }
    }

    onCreate(): void {
        this.router.navigate(['create'], { relativeTo: this.activatedRoute });
    }

    isDeleted(user: User): boolean {
        return !isObjectLike(user) || !!user.deletedAt;
    }

    handleSearch(searchTerm: string): void {
        this.store.dispatch(UsersListActions.onSearch({ search: searchTerm }));
    }

    onShowFilters(): void {
        this.store.dispatch(UsersListActions.onShowFilters());
    }

    private setupObservables(): void {
        const listState$ = this.store.select(UsersListReducer.selectState);
        this.total$ = listState$.pipe(map((state) => state.total));
        this.pageSizeOptions$ = listState$.pipe(
            map((state) => state.pageSizeOptions)
        );
        this.pageSize$ = listState$.pipe(map((state) => state.limit));
        this.pageIndex$ = listState$.pipe(map((state) => state.page));
        this.dataSource$ = this.store.select(UsersListReducer.selectList).pipe(
            tap((items) => {
                this.directiveScroll?.scrollToTop();
            })
        );
        this.search$ = listState$.pipe(map((state) => state.search));
        this.hasFilters$ = this.store.select(UsersListReducer.selectHasFilters);

        this.listState$ = listState$;
    }
}
