import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTION_UPDATE, SUBJECT_STUDENTS } from '@constants';
import { StudentSortables } from '@enums';
import { fuseAnimations } from '@fuse/animations';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { Section } from '@models';
import { Store } from '@ngrx/store';
import { AblePipe } from '@pipes';
import { RootState } from '@stores/index';
import { getSortData } from '@utils';
import { Observable } from 'rxjs';
import { Student } from '@models';

@Component({
    selector: 'citiglobal-student-list',
    templateUrl: './student-list.component.html',
    styleUrls: ['./student-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class StudentListComponent implements OnInit {
    readonly STUDENT_SORTABLES = StudentSortables;

    displayedColumns = [
        StudentSortables.FIRSTNAME,
        StudentSortables.LASTNAME,
        StudentSortables.SECTION,
        StudentSortables.STUDENT_ID,
        StudentSortables.MOBILE_NUMBER,
        StudentSortables.CREATED_AT,
        StudentSortables.ACTIVE,
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
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {}

    onToggleSort(sort: Sort): void {
        const sortData = getSortData<StudentSortables>(sort);
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

    onSelectRow(data: Student): void {
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
