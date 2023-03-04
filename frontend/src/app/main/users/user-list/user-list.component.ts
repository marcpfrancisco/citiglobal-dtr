import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { UserSortables } from '@enums';
import { fuseAnimations } from '@fuse/animations';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { Section, User } from '@models';
import { Store } from '@ngrx/store';
import { AblePipe } from '@pipes';
import { RootState } from '@stores/index';
import { getSortData } from '@utils';
import { isObjectLike } from 'lodash';
import { Observable } from 'rxjs';

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
    dataSource$: Observable<Section[]>;
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
        private store: Store<RootState>,
        private dialog: MatDialog,
        private ablePipe: AblePipe
    ) {}

    ngOnInit(): void {}

    onToggleSort(sort: Sort): void {
        const sortData = getSortData<UserSortables>(sort);
        // this.store.dispatch(FloristsListActions.onToggleSort(sortData));
    }

    //   onChangePage(event: PageEvent): void {
    //     this.store.dispatch(
    //       FloristsListActions.onLoadFlorists({
    //         limit: event.pageSize,
    //         page: event.pageIndex,
    //       })
    //     );
    //   }

    onSelectRow(data: User): void {
        this.router.navigate(['edit', data.id], {
            relativeTo: this.activatedRoute,
        });
    }

    onCreate(): void {
        this.router.navigate(['create'], { relativeTo: this.activatedRoute });
    }

    isDeleted(user: User): boolean {
        return !isObjectLike(user) || !!user.deletedAt;
    }

    //   handleSearch(searchTerm: string): void {
    //     this.store.dispatch(FloristsListActions.onSearch({ search: searchTerm }));
    //   }

    // onShowFilters(): void {
    //     this.store.dispatch(FloristsListActions.onShowFilters());
    //   }
}
