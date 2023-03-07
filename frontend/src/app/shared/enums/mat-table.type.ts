export interface ColumnConfig<Sortables> {
  access?: string & Sortables;
  sortable?: boolean;
}

export type ColumnDefinition<Sortables> = {
  [key in string]: ColumnConfig<Sortables>;
}
