import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeLogSortables } from '@enums';
import { fuseAnimations } from '@fuse/animations';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { Section, TimeLog } from '@models';
import { Store } from '@ngrx/store';
import { AblePipe } from '@pipes';
import { LogsListReducer, RootState } from '@stores/index';
import { LogsListActions } from '@stores/logs';
import { getSortData } from '@utils';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

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
    dataSource$: Observable<TimeLog[]>;
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

    ngOnInit(): void {
        this.setupObservables();
        this.store.dispatch(LogsListActions.onInit());
    }

    onToggleSort(sort: Sort): void {
        const sortData = getSortData<TimeLogSortables>(sort);
        this.store.dispatch(LogsListActions.onToggleSort(sortData));
    }

    onChangePage(event: PageEvent): void {
        this.store.dispatch(
            LogsListActions.onLoadTimeLogs({
                limit: event.pageSize,
                page: event.pageIndex,
            })
        );
    }

    onSelectRow(data: Section): void {
        this.router.navigate(['edit', data.id], {
            relativeTo: this.activatedRoute,
        });
    }

    onCreate(): void {
        this.router.navigate(['create'], { relativeTo: this.activatedRoute });
    }

    handleSearch(searchTerm: string): void {
        this.store.dispatch(LogsListActions.onSearch({ search: searchTerm }));
    }

    onShowFilters(): void {
        this.store.dispatch(LogsListActions.onShowFilters());
    }

    exportTimeSheet(): void {
        this.store.dispatch(LogsListActions.onExportTimeSheet());
    }

    private setupObservables(): void {
        const listState$ = this.store.select(LogsListReducer.selectState);
        this.total$ = listState$.pipe(map((state) => state.total));
        this.pageSizeOptions$ = listState$.pipe(
            map((state) => state.pageSizeOptions)
        );
        this.pageSize$ = listState$.pipe(map((state) => state.limit));
        this.pageIndex$ = listState$.pipe(map((state) => state.page));
        this.dataSource$ = this.store.select(LogsListReducer.selectList).pipe(
            tap((items) => {
                this.directiveScroll?.scrollToTop();
            })
        );
        this.search$ = listState$.pipe(map((state) => state.search));
        this.hasFilters$ = this.store.select(LogsListReducer.selectHasFilters);

        this.listState$ = listState$;
    }
}
