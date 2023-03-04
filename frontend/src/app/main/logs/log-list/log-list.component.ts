import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeLogSortables } from '@enums';
import { fuseAnimations } from '@fuse/animations';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { Section } from '@models';
import { Store } from '@ngrx/store';
import { AblePipe } from '@pipes';
import { RootState } from '@stores/index';
import { getSortData } from '@utils';
import { Observable } from 'rxjs';

@Component({
    selector: 'citiglobal-log-list',
    templateUrl: './log-list.component.html',
    styleUrls: ['./log-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class LogListComponent implements OnInit {
    readonly TIMELOG_SORTABLES = TimeLogSortables;

    displayedColumns = [
        TimeLogSortables.NAME,
        TimeLogSortables.DATE,
        TimeLogSortables.TIME_IN,
        TimeLogSortables.TIME_OUT,
        TimeLogSortables.TIME_RENDERED,
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
        const sortData = getSortData<TimeLogSortables>(sort);
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

    onSelectRow(data: Section): void {
        this.router.navigate(['edit', data.id], {
            relativeTo: this.activatedRoute,
        });
    }

    onCreate(): void {
        this.router.navigate(['create'], { relativeTo: this.activatedRoute });
    }

    //   handleSearch(searchTerm: string): void {
    //     this.store.dispatch(FloristsListActions.onSearch({ search: searchTerm }));
    //   }

    // onShowFilters(): void {
    //     this.store.dispatch(FloristsListActions.onShowFilters());
    //   }
}
