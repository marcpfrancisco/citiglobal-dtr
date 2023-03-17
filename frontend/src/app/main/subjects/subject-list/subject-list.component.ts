import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectSortables } from '@enums';
import { fuseAnimations } from '@fuse/animations';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { SubjectModel } from '@models';
import { Store } from '@ngrx/store';
import { AblePipe } from '@pipes';
import { RootState, SubjectListReducer } from '@stores/index';
import { SubjectListActions } from '@stores/subjects';
import { getSortData } from '@utils';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
    selector: 'citiglobal-subject-list',
    templateUrl: './subject-list.component.html',
    styleUrls: ['./subject-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SubjectListComponent implements OnInit {
    readonly SUBJECT_SORTABLES = SubjectSortables;

    displayedColumns = [
        SubjectSortables.SUBJECT_CODE,
        SubjectSortables.DESCRIPTION,
        SubjectSortables.PUBLISHED_AT,
        SubjectSortables.ACTIVE,
    ];

    // Table Related properties
    total$: Observable<number>;
    dataSource$: Observable<SubjectModel[]>;
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
        this.store.dispatch(SubjectListActions.onInit());
    }

    onToggleSort(sort: Sort): void {
        const sortData = getSortData<SubjectSortables>(sort);
        this.store.dispatch(SubjectListActions.onToggleSort(sortData));
    }

    onChangePage(event: PageEvent): void {
        this.store.dispatch(
            SubjectListActions.onLoadSubject({
                limit: event.pageSize,
                page: event.pageIndex,
            })
        );
    }

    onSelectRow(data: SubjectModel): void {
        this.router.navigate(['edit', data.id], {
            relativeTo: this.activatedRoute,
        });
    }

    onCreate(): void {
        this.router.navigate(['create'], { relativeTo: this.activatedRoute });
    }

    handleSearch(searchTerm: string): void {
        this.store.dispatch(
            SubjectListActions.onSearch({ search: searchTerm })
        );
    }

    onShowFilters(): void {
        this.store.dispatch(SubjectListActions.onShowFilters());
    }

    private setupObservables(): void {
        const listState$ = this.store.select(SubjectListReducer.selectState);
        this.total$ = listState$.pipe(map((state) => state.total));
        this.pageSizeOptions$ = listState$.pipe(
            map((state) => state.pageSizeOptions)
        );
        this.pageSize$ = listState$.pipe(map((state) => state.limit));
        this.pageIndex$ = listState$.pipe(map((state) => state.page));
        this.dataSource$ = this.store
            .select(SubjectListReducer.selectList)
            .pipe(
                tap((items) => {
                    this.directiveScroll?.scrollToTop();
                })
            );
        this.search$ = listState$.pipe(map((state) => state.search));
        this.hasFilters$ = this.store.select(
            SubjectListReducer.selectHasFilters
        );

        this.listState$ = listState$;
    }
}
