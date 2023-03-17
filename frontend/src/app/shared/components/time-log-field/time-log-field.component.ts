import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState, TimeLogReducer } from '@stores/index';
import { TimeLogActions } from '@stores/time-log';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { isNumericInteger } from '../../utils/number';

@Component({
    selector: 'citiglobal-time-log-field',
    templateUrl: './time-log-field.component.html',
    styleUrls: ['./time-log-field.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TimeLogFieldComponent implements OnInit {
    private timeLogSubject = new Subject<string>();
    private subscription: Subscription;
    private finalizedTimeLogInterval = 200;

    @Input()
    timeLogInterval = this.finalizedTimeLogInterval;

    @Output()
    timeLog = new EventEmitter<string>();

    rfidValue: string;

    constructor(private store: Store<RootState>) {
        this.store
            .select(TimeLogReducer.selectCurrentRfidValue)
            .subscribe((value) => (this.rfidValue = value));
    }

    ngOnInit(): void {
        this.subscription = this.timeLogSubject
            .pipe(debounceTime(this.finalizedTimeLogInterval))
            .subscribe((value) => {
                this.timeLog.emit(value);

                this.rfidValue = '';
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        const debounceInterval = changes?.timeLogInterval?.currentValue;

        if (isNumericInteger(debounceInterval) && debounceInterval > 10) {
            this.finalizedTimeLogInterval = debounceInterval;
        }
    }

    handleSearch(event: Event): void {
        const value = (event?.target as HTMLInputElement)?.value;
        this.timeLogSubject.next(value);
    }
}
