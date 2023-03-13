import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { isString } from 'lodash';
import { Subject, Subscription } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    mapTo,
    switchMap,
} from 'rxjs/operators';
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

    rfidValue: string = '';

    constructor() {}

    ngOnInit(): void {
        this.subscription = this.timeLogSubject
            .pipe(debounceTime(this.finalizedTimeLogInterval))
            .subscribe((value) => {
                this.timeLog.emit(value);
                this.rfidValue = null;
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        const debounceInterval = changes?.timeLogInterval?.currentValue;

        if (isNumericInteger(debounceInterval) && debounceInterval > 10) {
            this.finalizedTimeLogInterval = debounceInterval;
        }
    }

    handleSearch(event: Event): void {
        const value = (event?.target as HTMLInputElement)?.value || '';
        this.timeLogSubject.next(value ? value : '');
        this.rfidValue = value;
    }
}
