import { ListState, ListStateParam } from '../../models';

export function getParamFromListState<SortableType>(
  listState: ListState<SortableType>
): ListStateParam<SortableType>{

  const param: ListStateParam<SortableType> = {};

  param.page = listState.page;
  param.limit = listState.limit;

  // Sort Param
  if (listState.sort !== null) {
    param.sort = listState.sort;
  }
  if (listState.sortDirection !== null) {
    param.sortDirection = listState.sortDirection;
  }
  if (listState.search !== null) {
    param.search = listState.search;
  }

  return param;
}
