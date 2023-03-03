import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { SortDirection } from '../enums/sort-direction.enum';
import { ListState } from '../models/list-state.model';

@Pipe({ name: 'listStateMatSort' })
export class ListStateMatSortPipe implements PipeTransform {
    transform<SortableType>(
        listState$: Observable<ListState<SortableType>>
    ): Observable<Sort> {
        return listState$.pipe(
            map((state) => {
                const sort: Sort = {
                    active: '',
                    direction: '',
                };
                // active
                sort.active = (state.sort as any) ?? '';

                // direction
                switch (state.sortDirection) {
                    case SortDirection.ASC:
                        sort.direction = 'asc';
                        break;

                    case SortDirection.DESC:
                        sort.direction = 'desc';
                        break;

                    default:
                        break;
                }

                return sort;
            })
        );
    }
}
