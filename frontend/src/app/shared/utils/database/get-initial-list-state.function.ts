import { ListState } from '../../models';

export function getInitialListState<SortableType>(): ListState<SortableType> {
  const state: ListState<SortableType> = {
    page: 0,
    total: 0,
    limit: 20,
    sort: null,
    sortDirection: null,
    sortIds: [],
    pageSizeOptions: [5, 10, 20, 100],
  }
  return state;
}
