import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { ACTION_UPDATE, SUBJECT_SUBJECTS } from '@constants';
import { SubjectSortables } from '@enums';
import { fuseAnimations } from '@fuse/animations';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { Section, Subject } from '@models';
import { Store } from '@ngrx/store';
import { AblePipe } from '@pipes';
import { RootState } from '@stores/index';
import { getSortData } from '@utils';
import { Observable } from 'rxjs';

@Component({
    selector: 'citiglobal-subject-list',
    templateUrl: './subject-list.component.html',
    styleUrls: ['./subject-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SubjectListComponent implements OnInit {
    readonly SUBJECT_SORTABLES = SubjectSortables;

    SUBJECT_LIST_DISPLAYED_COLUMNS = [
        SubjectSortables.SUBJECT_CODE,
        SubjectSortables.NAME,
        SubjectSortables.PUBLISHED_AT,
        SubjectSortables.ACTIVE,
        'options',
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

    get displayedColumns(): Array<string> {
        if (!this.ablePipe.transform(ACTION_UPDATE, SUBJECT_SUBJECTS)) {
            return this.SUBJECT_LIST_DISPLAYED_COLUMNS.filter(
                (column) => column !== 'options'
            );
        }
        return this.SUBJECT_LIST_DISPLAYED_COLUMNS;
    }

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private store: Store<RootState>,
        private dialog: MatDialog,
        private ablePipe: AblePipe
    ) {}

    ngOnInit(): void {}

    onToggleSort(sort: Sort): void {
        const sortData = getSortData<SubjectSortables>(sort);
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

    onSelectRow(data: Subject): void {
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
