import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { pagination } from '@constants';
import { SubjectModel } from '@models';
import { SubjectsService } from '@services';
import { createSearchPaginationLimitOptions } from '@utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';

@Component({
    selector: 'citiglobal-user-assign-subject',
    templateUrl: './user-assign-subject.component.html',
    styleUrls: ['./user-assign-subject.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class UserAssignSubjectComponent implements OnInit {
    private searchSubject = new BehaviorSubject<string>('');

    subjectList$: Observable<SubjectModel[]>;
    selectedSubject: SubjectModel = null;

    constructor(
        public matDialogRef: MatDialogRef<UserAssignSubjectComponent>,
        private subjectService: SubjectsService
    ) {}

    ngOnInit(): void {
        this.subjectList$ = this.searchSubject.pipe(
            debounceTime(500),
            switchMap((search) =>
                this.subjectService.getSubjects(
                    createSearchPaginationLimitOptions({
                        search,
                        page: pagination.CURRENT_PAGE,
                        limit: pagination.ITEMS_PER_PAGE,
                    })
                )
            ),
            map((paginated) => paginated?.data || [])
        );
    }

    handleSearch(text: string): void {
        this.searchSubject.next(text);
    }

    handleSelected(value: SubjectModel): void {
        this.selectedSubject = value;
    }

    getOptionText(subject: SubjectModel): string {
        if (subject) {
            return `${subject?.subjectCode}`;
        }
        return '';
    }
}
