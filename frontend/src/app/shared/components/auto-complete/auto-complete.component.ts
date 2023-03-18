import {
    Component,
    ContentChild,
    EventEmitter,
    Input,
    Output,
    TemplateRef,
    ViewEncapsulation,
} from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
    selector: 'citiglobal-auto-complete',
    templateUrl: './auto-complete.component.html',
    styleUrls: ['./auto-complete.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AutoCompleteComponent {
    private lastValue: unknown | null = null;

    /** Inputs */
    @Input() placeholder = '';
    @Input() options = [];
    @Input() displayOption: () => string;
    @Input() value: any;

    @Input() hasLabel = '';

    @Input() required: boolean;

    /** Emitted Events */
    @Output() search = new EventEmitter<string>();
    @Output() selected = new EventEmitter<any>();

    /** Customize Option Value */
    @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

    get isRequired(): boolean {
        return this.required === true;
    }

    handleInput(event: Event): void {
        const target = event?.target as HTMLInputElement;
        const keyword = target?.value || '';

        this.search.emit(keyword);

        if (!keyword) {
            this.lastValue = null;
            this.selected.emit(null);
        }
    }

    optionSelected(event: MatAutocompleteSelectedEvent): void {
        const selected = event?.option?.value;

        this.lastValue = selected;
        this.selected.emit(selected);
    }
}
