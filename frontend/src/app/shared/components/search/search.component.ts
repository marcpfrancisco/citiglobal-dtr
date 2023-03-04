import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { isString } from 'lodash';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { isNumericInteger } from '@utils';

@Component({
    selector: 'citiglobal-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SearchComponent implements OnInit, OnDestroy, OnChanges {
    private searchSubject = new Subject<string>();

    private subscription: Subscription;

    private finalizedSearchInterval = 200;

    @Input()
    searchInterval = this.finalizedSearchInterval;

    @Input()
    searchValue = '';

    @Output()
    search = new EventEmitter<string>();

    constructor() {}

    ngOnInit(): void {
        this.subscription = this.searchSubject
            .pipe(
                debounceTime(this.finalizedSearchInterval),
                distinctUntilChanged()
            )
            .subscribe((value) => this.search.emit(value));
    }

    ngOnDestroy(): void {
        this.searchSubject.complete();
        this.subscription.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const debounceInterval = changes?.searchInterval?.currentValue;

        if (isNumericInteger(debounceInterval) && debounceInterval > 10) {
            this.finalizedSearchInterval = debounceInterval;
        }
    }

    handleSearch(event: Event): void {
        const value = (event?.target as HTMLInputElement)?.value || '';

        this.searchSubject.next(isString(value) ? value : '');
    }
}
