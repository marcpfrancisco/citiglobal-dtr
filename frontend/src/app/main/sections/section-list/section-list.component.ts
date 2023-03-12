import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTION_UPDATE, SUBJECT_SECTIONS } from '@constants';
import { SectionSortables } from '@enums';
import { fuseAnimations } from '@fuse/animations';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { Section } from '@models';
import { Store } from '@ngrx/store';
import { AblePipe } from '@pipes';
import { RootState, SectionListReducer } from '@stores/index';
import { SectionListActions } from '@stores/sections';
import { getSortData } from '@utils';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
    selector: 'citiglobal-section-list',
    templateUrl: './section-list.component.html',
    styleUrls: ['./section-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SectionListComponent implements OnInit {
    readonly SECTION_SORTABLES = SectionSortables;

    displayedColumns = [
        SectionSortables.SECTION,
        SectionSortables.COURSE,
        SectionSortables.PUBLISHED_AT,
        SectionSortables.ACTIVE,
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

    ngOnInit(): void {
        this.setupObservables();
        this.store.dispatch(SectionListActions.onInit());
    }

    onToggleSort(sort: Sort): void {
        const sortData = getSortData<SectionSortables>(sort);
        this.store.dispatch(SectionListActions.onToggleSort(sortData));
    }

    onChangePage(event: PageEvent): void {
        this.store.dispatch(
            SectionListActions.onLoadSections({
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
        this.store.dispatch(
            SectionListActions.onSearch({ search: searchTerm })
        );
    }

    onShowFilters(): void {
        this.store.dispatch(SectionListActions.onShowFilters());
    }

    private setupObservables(): void {
        const listState$ = this.store.select(SectionListReducer.selectState);
        this.total$ = listState$.pipe(map((state) => state.total));
        this.pageSizeOptions$ = listState$.pipe(
            map((state) => state.pageSizeOptions)
        );
        this.pageSize$ = listState$.pipe(map((state) => state.limit));
        this.pageIndex$ = listState$.pipe(map((state) => state.page));
        this.dataSource$ = this.store
            .select(SectionListReducer.selectList)
            .pipe(
                tap((items) => {
                    this.directiveScroll?.scrollToTop();
                })
            );
        this.search$ = listState$.pipe(map((state) => state.search));
        this.hasFilters$ = this.store.select(
            SectionListReducer.selectHasFilters
        );

        this.listState$ = listState$;
    }
}
