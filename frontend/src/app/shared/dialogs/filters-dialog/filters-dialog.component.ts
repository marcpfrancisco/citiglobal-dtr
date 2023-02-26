import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  FiltersInput,
  FiltersType,
  FloristsService,
  InvoiceService,
  OrdersService,
  SitesService,
  UsersService,
  ProductsService,
  FilterOptionsEndpointType,
} from '@bloomlocal/ng-shared';
import {
  createSearchPaginationLimitOptions,
  DEFAULT_FILTER_PAGINATION_LIMIT,
  DEFAULT_MOMENT_DATE_FORMATS,
  Florist,
  Product,
  ProductCodeSuggestion,
  Site,
  User,
  UserRoles,
} from '@bloomlocal/shared';
import { Store } from '@ngrx/store';
import { isArray, isNumber } from 'lodash';
import { Observable, of, Subscription } from 'rxjs';
import {
  catchError,
  debounceTime,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { AuthenticationReducer, RootState } from '../../../stores';
import {
  MultiSelectFiltersDialogComponent,
  MultiSelectFiltersDialogData,
  MultiSelectFiltersDialogResponse,
} from '../multi-select-filters-dialog/multi-select-filters-dialog.component';

type EntityOptions<Entity> = Observable<Array<Entity>>;
type PopulateOptionsCallback<Entity> = (
  searchKeyword: string
) => EntityOptions<Entity>;

export interface FiltersDialogData {
  name?: string;
  inputs: FiltersInput[];
  value?: any; // will be used to populate the forms
}

export enum FilterInputType {
  TEXT = 'text',
  NUMBER = 'number',
  NUMBER_RANGE = 'number-range',
  CHECKBOX = 'checkbox',
  SELECT = 'select',
  MULTI_SELECT = 'multi-select',
  DATE = 'date',
  DATE_RANGE = 'date-range',
  SITE_OPTIONS = 'site-options',
  USER_OPTIONS = 'user-options',
  FLORIST_OPTIONS = 'florist-options',
  PRODUCT_CODE_SUGGESTIONS = 'product-code-suggestions',
}

@Component({
  selector: 'bloomlocal-filters-dialog',
  templateUrl: './filters-dialog.component.html',
  styleUrls: ['./filters-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: DEFAULT_MOMENT_DATE_FORMATS },
  ],
})
export class FiltersDialogComponent implements OnInit, OnDestroy {
  static panelClass = 'bloomlocal-filters-dialog';

  form: FormGroup;
  readonly types = FiltersType;
  readonly INPUT_TYPE = FilterInputType;

  filterName: string;

  inputs: FiltersInput[];
  value: any;

  showSiteFilter: boolean;
  sessionUserSubscription: Subscription;

  selectOptions: {
    [key in string]?:
      | EntityOptions<User>
      | EntityOptions<Site>
      | EntityOptions<Florist>
      | EntityOptions<Product>
      | EntityOptions<ProductCodeSuggestion>;
  };
  isSelectOptionsLoading: {
    [key in string]?: boolean;
  };

  constructor(
    public matDialogRef: MatDialogRef<FiltersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: FiltersDialogData,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private siteService: SitesService,
    private userService: UsersService,
    private floristService: FloristsService,
    private ordersService: OrdersService,
    private invoiceService: InvoiceService,
    private productService: ProductsService,
    private store: Store<RootState>
  ) {}

  ngOnInit(): void {
    this.selectOptions = {};
    this.isSelectOptionsLoading = {};

    this.inputs = this.data.inputs;
    this.form = this.createForm(this.data);

    this.showSiteFilter = false;
    this.sessionUserSubscription = this.store
      .select(AuthenticationReducer.selectCurrentUser)
      .subscribe(
        // hide site filter if Florist: https://arcanys.atlassian.net/browse/BH-489
        (user) => {
          switch (this.filterName) {
            case 'order-filter':
              this.showSiteFilter = user.role !== UserRoles.FLORIST;
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.sessionUserSubscription.unsubscribe();
  }

  getInputType(type: FiltersType): FilterInputType {
    switch (type) {
      case FiltersType.TEXT:
        return FilterInputType.TEXT;

      case FiltersType.NUMBER:
        return FilterInputType.NUMBER;

      case FiltersType.NUMBER_RANGE:
        return FilterInputType.NUMBER_RANGE;

      case FiltersType.SELECT:
        return FilterInputType.SELECT;

      case FiltersType.MULTI_SELECT:
        return FilterInputType.MULTI_SELECT;
      case FiltersType.DATE:
        return FilterInputType.DATE;

      case FiltersType.DATE_RANGE:
        return FilterInputType.DATE_RANGE;

      case FiltersType.CHECKBOX:
        return FilterInputType.CHECKBOX;

      case FiltersType.USERS:
      case FiltersType.FLORIST_REP_USERS:
      case FiltersType.ORDER_ASSIGNEE:
        return FilterInputType.USER_OPTIONS;

      case FiltersType.FLORISTS:
      case FiltersType.ORDER_FLORISTS:
      case FiltersType.INVOICE_FLORISTS:
        return FilterInputType.FLORIST_OPTIONS;

      case FiltersType.SITES:
        return FilterInputType.SITE_OPTIONS;

      case FiltersType.PRODUCT_SKU:
        return FilterInputType.PRODUCT_CODE_SUGGESTIONS;

      case FiltersType.TEXT:
      default:
        return FilterInputType.TEXT;
    }
  }

  createDefaultControl<Type, Value>(
    input: FiltersInput<Type>,
    defaultValue?: Value,
    validators?: ValidatorFn | ValidatorFn[] | AbstractControlOptions
  ): AbstractControl {
    // Initialize validator
    const finalizedValidators = isArray(validators)
      ? validators
      : [objectInputValidator];

    if (input.required && !finalizedValidators.includes(Validators.required)) {
      // add required validator at the beginning of the array
      finalizedValidators.unshift(Validators.required);
    }

    // Builds the form control
    return this.formBuilder.control(
      isNumber(defaultValue) ? defaultValue : defaultValue || null,
      finalizedValidators
    );
  }

  createForm(data: FiltersDialogData): FormGroup {
    const group = {};

    this.filterName = data.name || '';

    data.inputs.forEach((input) => {
      const name = input.name;
      const defaultValue = data?.value ? data.value[name] : null;
      let control: AbstractControl;

      group[input.name] = control;

      switch (input.type) {
        case FiltersType.SITES:
          // create a sitesOptions
          group[name] = control = this.createDefaultControl(
            input,
            defaultValue
          );
          this.createSitesOptions(input, control);

          break;

        case FiltersType.USERS:
          group[name] = control = this.createDefaultControl(
            input,
            defaultValue
          );
          this.createUsersOptions(input, control, [
            UserRoles.FLORIST_REPRESENTATIVE,
          ]);

          break;

        case FiltersType.FLORIST_REP_USERS:
          group[name] = control = this.createDefaultControl(
            input,
            defaultValue
          );
          this.createFloristRepUsersOptions(input, control);
          break;

        case FiltersType.DATE_RANGE:
          const dateRange = data.value[input.name];
          const dateRangeGroup = this.formBuilder.group({
            from: [dateRange?.from ?? null],
            to: [dateRange?.to ?? null],
          });
          group[input.name] = dateRangeGroup;

          break;

        case FiltersType.FLORISTS:
          // Create list of Florists Options
          group[name] = control = this.createDefaultControl(
            input,
            defaultValue
          );
          this.createFloristsOptions(input, control);
          break;

        // Order Filters
        case FiltersType.ORDER_ASSIGNEE:
          // create assignee options
          group[name] = control = this.createDefaultControl(
            input,
            defaultValue
          );
          this.createOrderAssigneeOptions(input, control);
          break;

        case FiltersType.ORDER_FLORISTS:
          group[name] = control = this.createDefaultControl(
            input,
            defaultValue
          );
          this.createOrderFloristsOptions(input, control);
          break;

        case FiltersType.INVOICE_FLORISTS:
          group[name] = control = this.createDefaultControl(
            input,
            defaultValue
          );
          this.createInvoiceFloristsOptions(input, control);
          break;

        case FiltersType.PRODUCT_SKU:
          group[name] = control = this.createDefaultControl(
            input,
            defaultValue,
            []
          );
          this.createProductSkuOptions(input, control);
          break;

        default:
          group[name] = this.formBuilder.control(
            data?.value ? data.value[name] : null,
            input.required ? [Validators.required] : []
          );
          break;
      }
    });

    return new FormGroup(group);
  }

  showMultiSelectFiltersDialog(input: FiltersInput): void {
    // acquire the form control
    const control = this.form.get(input.name);

    const dialogData: MultiSelectFiltersDialogData = {
      input,
      value: control.value,
    };
    const dialogRef = this.dialog.open(MultiSelectFiltersDialogComponent, {
      panelClass: MultiSelectFiltersDialogComponent.panelClass,
      data: dialogData,
    });

    dialogRef
      .afterClosed()
      .subscribe((result: MultiSelectFiltersDialogResponse) => {
        // set value only if not cancelled
        if (result) {
          if (!result?.cancelled) {
            control.setValue(result.data);
          }
        }
      });
  }

  getMultiSelectValueLabel(input: FiltersInput): string {
    // get values
    const values: any[] = this.form.get(input.name)?.value ?? [];

    return (
      input.options
        // include option only if in value
        .filter((option) => values.includes(option.value))
        // gather labels
        .map((option) => option.label)
        .join(', ')
    );
  }

  onReset(): void {
    this.inputs.forEach((input) => {
      const formControl = this.form.get(input.name);
      formControl.setValue(input.resetValue);
    });
  }

  sitesNameDisplayFn(site: Site): string {
    return site && site.name ? site.name : null;
  }

  usersNameDisplayFn(user: User): string {
    return user && user.name ? user.name : null;
  }

  floristsNameDisplayFn(florist: Florist): string {
    return florist?.name || null;
  }

  applyAndClose(): void {
    this.matDialogRef.close(this.form.value);
  }

  private createSelectOptions<Entity>(
    input: FiltersInput,
    control: AbstractControl,
    callback: PopulateOptionsCallback<Entity>
  ): void {
    // set initial value
    this.isSelectOptionsLoading[input.name] = false;

    // populate options
    this.selectOptions[input.name] = control.valueChanges.pipe(
      debounceTime(200),
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value?.name ?? '')),
      switchMap((search) => {
        this.isSelectOptionsLoading[input.name] = false;

        if (!search) {
          return [];
        }

        this.isSelectOptionsLoading[input.name] = true;

        return callback(search);
      }),
      tap(() => (this.isSelectOptionsLoading[input.name] = false))
    );
  }

  private createUsersOptions(
    input: FiltersInput,
    control: AbstractControl,
    userTypes: Array<UserRoles> | null
  ): void {
    this.createSelectOptions<User>(input, control, (search) =>
      this.userService
        .getUsers(
          createSearchPaginationLimitOptions({
            search,
            limit: DEFAULT_FILTER_PAGINATION_LIMIT,
            ...(userTypes ? { roles: userTypes } : {}),
          })
        )
        .pipe(
          map((result) => result.data),
          catchError(() => of([]))
        )
    );
  }

  private createProductSkuOptions(
    input: FiltersInput,
    control: AbstractControl
  ): void {
    this.createSelectOptions<ProductCodeSuggestion>(
      input,
      control,
      (search) => {
        const options = createSearchPaginationLimitOptions({
          search,
          limit: DEFAULT_FILTER_PAGINATION_LIMIT,
        });

        return (
          // there are 2 endpoints, Order or in Product service.
          (
            input?.optionsEndpoint === FilterOptionsEndpointType.ORDER_SERVICE
              ? // Order service product code suggestions, or,
                this.ordersService.getProductCodeSuggestions(options)
              : // default product code suggestions
                this.productService.getProductCodeSuggestions(options)
          ).pipe(
            map((result) => {
              return result.data;
            }),
            catchError(() => of([]))
          )
        );
      }
    );
  }

  private createSitesOptions(
    input: FiltersInput,
    control: AbstractControl
  ): void {
    this.createSelectOptions<Site>(input, control, (search) =>
      this.siteService
        .getSites(
          createSearchPaginationLimitOptions({
            search,
            limit: DEFAULT_FILTER_PAGINATION_LIMIT,
            join: [],
          })
        )
        .pipe(
          map((result) => result.data),
          catchError(() => of([]))
        )
    );
  }

  private createFloristsOptions(
    input: FiltersInput,
    control: AbstractControl
  ): void {
    this.createSelectOptions<Florist>(input, control, (search) =>
      this.floristService
        .getFlorists(
          createSearchPaginationLimitOptions({
            search,
            limit: DEFAULT_FILTER_PAGINATION_LIMIT,
            join: [],
          })
        )
        .pipe(
          map((result) => result.data),
          catchError(() => of([]))
        )
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////
  // Florist Filter options
  /////////////////////////////////////////////////////////////////////////////////////
  private createFloristRepUsersOptions(
    input: FiltersInput,
    control: AbstractControl
  ): void {
    this.createSelectOptions<User>(input, control, (search) =>
      this.floristService
        .getFilterAllFloristRepUsers(
          createSearchPaginationLimitOptions({
            search,
            limit: DEFAULT_FILTER_PAGINATION_LIMIT,
          })
        )
        .pipe(
          map((result) => result.data),
          catchError(() => of([]))
        )
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////
  // Order Filter options
  /////////////////////////////////////////////////////////////////////////////////////
  private createOrderAssigneeOptions(
    input: FiltersInput,
    control: AbstractControl
  ): void {
    this.createSelectOptions<User>(input, control, (search) =>
      this.ordersService
        .getFilterAllAssignedUsers(
          createSearchPaginationLimitOptions({
            search,
            limit: DEFAULT_FILTER_PAGINATION_LIMIT,
          })
        )
        .pipe(
          map((result) => result.data),
          catchError(() => of([]))
        )
    );
  }

  private createOrderFloristsOptions(
    input: FiltersInput,
    control: AbstractControl
  ): void {
    this.createSelectOptions<Florist>(input, control, (search) =>
      this.ordersService
        .getFilterAllFlorists(
          createSearchPaginationLimitOptions({
            search,
            limit: DEFAULT_FILTER_PAGINATION_LIMIT,
            join: [],
          })
        )
        .pipe(
          map((result) => result.data),
          catchError(() => of([]))
        )
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////
  // Invoice Filter options
  /////////////////////////////////////////////////////////////////////////////////////
  private createInvoiceFloristsOptions(
    input: FiltersInput,
    control: AbstractControl
  ): void {
    this.createSelectOptions<Florist>(input, control, (search) =>
      this.invoiceService
        .getFilterAllFlorists(
          createSearchPaginationLimitOptions({
            search,
            limit: DEFAULT_FILTER_PAGINATION_LIMIT,
            join: [],
          })
        )
        .pipe(
          map((result) => result.data),
          catchError(() => of([]))
        )
    );
  }
}

// For validation of object as dropdown list
export const objectInputValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) {
    return null;
  }
  const inputValue = control.value;

  return typeof inputValue === 'string' || typeof inputValue === 'number'
    ? { validSiteValueRequired: true }
    : null;
};
