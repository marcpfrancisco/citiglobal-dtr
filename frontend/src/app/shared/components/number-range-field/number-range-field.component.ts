import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { isPlatformBrowser } from '@angular/common';
import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    HostBinding,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    PLATFORM_ID,
    Self,
    ViewEncapsulation,
} from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    FormGroup,
    NgControl,
} from '@angular/forms';
import {
    MAT_FORM_FIELD,
    MatFormField,
    MatFormFieldControl,
} from '@angular/material/form-field';
import { isFunction, isObjectLike, isString } from 'lodash';
import { Subject, Subscription } from 'rxjs';

import { transformNumberValue } from './transform-number-value.function';

type OnChangeFn = (value: NumberRangeValue | null) => void;
type OnFocusFn = () => void;

enum ValueStatus {
    NONE = 'none',
    RANGE = 'range',
    MAX = 'max',
    MIN = 'min',
    INVALID = 'invalid',
}

enum ActiveInput {
    NONE = 'none',
    FROM = 'from',
    TO = 'to',
}

export interface NumberRangeValue {
    from: number | null;
    to: number | null;
}

@Component({
    selector: 'citiglobal-number-range-field',
    templateUrl: './number-range-field.component.html',
    styleUrls: ['./number-range-field.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: MatFormFieldControl,
            useExisting: forwardRef(() => NumberRangeFieldComponent),
        },
    ],
})
export class NumberRangeFieldComponent
    implements
        ControlValueAccessor,
        MatFormFieldControl<NumberRangeValue | null>,
        OnInit,
        OnDestroy
{
    static nextId = 0;

    private inputError: Error | null;
    private isDisabled: boolean;
    private isRequired: boolean;
    private isFocused: boolean;
    private placeholderLabel: string;

    private onChange: OnChangeFn;
    private onTouched: OnFocusFn;

    private activeInput: ActiveInput;

    hovered: boolean;
    touched: boolean;

    stateChanges: Subject<void>;

    controlType: 'citiglobal-number-range-field';

    formGroup: FormGroup;

    formChangesSubscription: Subscription;

    @HostBinding()
    id = `citiglobal-number-range-field-${NumberRangeFieldComponent.nextId++}`;

    get showSlider(): boolean {
        return this.activeInput !== ActiveInput.NONE;
    }

    get activeFromInput(): boolean {
        return this.activeInput === ActiveInput.FROM;
    }

    get activeToInput(): boolean {
        return this.activeInput === ActiveInput.TO;
    }

    get valueStatus(): ValueStatus {
        const { from, to } = this.value || { from: null, to: null };

        if (from === null && to === null) {
            return ValueStatus.NONE;
        }

        if (to === null) {
            return ValueStatus.MIN;
        }

        if (from === null) {
            return ValueStatus.MAX;
        }

        if (from > to) {
            return ValueStatus.INVALID;
        }

        return ValueStatus.RANGE;
    }

    get error(): string {
        return this.inputError?.message || '';
    }

    get errorState(): boolean {
        return this.touched && !!this.error;
    }

    get empty(): boolean {
        return this.value === null;
    }

    get displayMode(): boolean {
        return !this.hovered && !this.focused;
    }

    @HostBinding('class.floating')
    get shouldLabelFloat() {
        return this.focused || this.hovered || !this.empty;
    }

    get focused(): boolean {
        return this.isFocused;
    }

    set focused(isFocused: boolean) {
        const oldValue = this.isRequired;

        this.isFocused = coerceBooleanProperty(isFocused);

        if (this.isRequired !== oldValue) {
            this.stateChanges.next();
        }
    }

    @Input()
    prefix: string;

    @Input()
    suffix: string;

    @Input()
    min: number | null;

    @Input()
    max: number | null;

    @Input()
    get placeholder(): string {
        return this.placeholderLabel;
    }

    set placeholder(label: string) {
        const oldValue = this.placeholderLabel;

        this.placeholderLabel = isString(label) ? label : '';

        if (oldValue !== this.placeholderLabel) {
            this.stateChanges.next();
        }
    }

    @Input()
    get value(): NumberRangeValue {
        const { from: inputFrom, to: inputTo } = this.formGroup.getRawValue();
        const from = transformNumberValue(inputFrom);
        const to = transformNumberValue(inputTo);

        return from === null && to === null ? null : { from, to };
    }

    set value(input: NumberRangeValue) {
        const oldValue = this.value;
        const { from: inputFrom, to: inputTo } = isObjectLike(input)
            ? input
            : { from: null, to: null };
        const from = transformNumberValue(inputFrom);
        const to = transformNumberValue(inputTo);

        this.formGroup.patchValue({
            from,
            to,
        });

        if (oldValue?.from !== from || oldValue?.to !== to) {
            this.stateChanges.next();

            if (this.onChange) {
                this.onChange(this.value);
            }
        }
    }

    @Input()
    get disabled(): boolean {
        return this.isDisabled;
    }

    set disabled(isDisabled: boolean) {
        const oldValue = this.isDisabled;

        this.isDisabled = coerceBooleanProperty(isDisabled);

        if (this.isDisabled !== oldValue) {
            this.stateChanges.next();
        }
    }

    @Input()
    get required(): boolean {
        return this.isRequired;
    }

    set required(isRequired: boolean) {
        const oldValue = this.isRequired;

        this.isRequired = coerceBooleanProperty(isRequired);

        if (this.isRequired !== oldValue) {
            this.stateChanges.next();
        }
    }

    @Output()
    errorEvent = new EventEmitter<Error>();

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Optional() @Self() public ngControl: NgControl,
        // no choice about naming from Angular Material.
        @Optional() @Inject(MAT_FORM_FIELD) public matFormField: MatFormField,
        private elementRef: ElementRef
    ) {
        // Replace the provider from above with this.
        if (this.ngControl != null) {
            // Setting the value accessor directly (instead of using
            // the providers) to avoid running into a circular import.
            this.ngControl.valueAccessor = this;
        }

        this.inputError = null;
        this.focused = false;
        this.touched = false;
        this.hovered = false;

        this.isDisabled = false;
        this.isRequired = false;
        this.placeholderLabel = '';

        this.min = null;
        this.max = null;

        this.activeInput = ActiveInput.NONE;

        this.formGroup = new FormGroup({
            from: new FormControl(null),
            to: new FormControl(null),
        });

        this.stateChanges = new Subject();
    }

    ngOnInit(): void {
        this.formChangesSubscription = this.formGroup.valueChanges.subscribe(
            ({ from, to }: NumberRangeValue) => {
                const adjusted = this.getLimitValues(from, to);

                if (adjusted) {
                    this.formGroup.patchValue(adjusted);
                    return;
                }

                // inspect error
                const errorBefore = this.inputError;
                const errorValue =
                    this.valueStatus === ValueStatus.INVALID
                        ? new Error('Invalid number range')
                        : null;

                this.inputError = errorValue;

                if (errorBefore !== errorValue) {
                    // emit error
                    if (this.inputError) {
                        this.errorEvent.emit(errorValue);
                    }
                }

                this.stateChanges.next();
                this.onChange(this.value);
            }
        );
    }

    ngOnDestroy(): void {
        this.formChangesSubscription.unsubscribe();
        this.stateChanges.complete();
    }

    ///////////////////////////////////////////////////////
    // Field methods
    ///////////////////////////////////////////////////////
    formatPlaceholder(suffix: string): string {
        const prefix = this.placeholderLabel;

        return prefix ? `${prefix} ${suffix}` : suffix;
    }

    formatDisplay(value: number | string | null): string {
        let displayString =
            value === null || typeof value === 'undefined' ? '' : `${value}`;

        if (this.prefix) {
            displayString = `${this.prefix}${displayString}`;
        }

        if (this.suffix) {
            displayString = `${displayString}${this.suffix}`;
        }

        return displayString;
    }

    onFocusIn(event: FocusEvent) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        if (!this.focused) {
            this.focused = true;
            this.stateChanges.next();
        }
    }

    onFocusOut(event: FocusEvent) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        if (
            !this.elementRef.nativeElement.contains(
                event.relatedTarget as Element
            )
        ) {
            this.touched = true;
            this.focused = false;

            if (this.onTouched) {
                this.onTouched();
            }

            this.stateChanges.next();
        }
    }

    onMouseLeave(event: MouseEvent): void {
        this.hovered = false;
        // this.focused = false;
        // this.stateChanges.next();
    }

    onMouseEnter(event: MouseEvent): void {
        this.hovered = true;
    }

    toggleActivateInput(inputFor: ActiveInput | string): void {
        const oldValue = this.activeInput;

        switch (inputFor) {
            case ActiveInput.FROM:
            case ActiveInput.TO:
                this.activeInput =
                    oldValue === inputFor ? ActiveInput.NONE : inputFor;
                break;

            default:
                this.activeInput = ActiveInput.NONE;
        }
    }

    protected getLimitValues(
        from: number | null,
        to: number | null
    ): NumberRangeValue | null {
        const min = transformNumberValue(this.min);
        const max = transformNumberValue(this.max);
        let fromValue = transformNumberValue(from);
        let toValue = transformNumberValue(to);
        let adjusted = false;

        if (fromValue !== null && min !== null && fromValue < min) {
            fromValue = min;
            adjusted = true;
        }

        if (toValue !== null && max !== null && toValue > max) {
            toValue = max;
            adjusted = true;
        }

        return adjusted ? { from: fromValue, to: toValue } : null;
    }

    ///////////////////////////////////////////////////////
    //  ControlValueAccessor methods for
    //  Angular Reactive forms
    ///////////////////////////////////////////////////////
    writeValue(value: NumberRangeValue | null): void {
        this.value = value;
    }

    registerOnChange(fn: OnChangeFn): void {
        if (isFunction(fn)) {
            this.onChange = fn;
        }
    }

    registerOnTouched(fn: OnFocusFn): void {
        if (isFunction(fn)) {
            this.onTouched = fn;
        }
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    setDescribedByIds(ids: string[]): void {
        // only when in browser
        if (isPlatformBrowser(this.platformId)) {
            this.elementRef.nativeElement.setAttribute(
                'aria-describedby',
                ids.join(' ')
            );
        }
    }

    onContainerClick(event: MouseEvent) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        // if (!this.focused) {
        //   this.fromInputRef?.nativeElement?.focus();
        // }

        this.touched = true;
    }
}
