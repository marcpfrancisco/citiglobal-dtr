import {
    Component,
    HostListener,
    Inject,
    OnInit,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { Store } from '@ngrx/store';
import { RootState, TimeLogReducer } from '@stores/index';
import { TimeLogActions } from '@stores/time-log';
import { getCurrentTimeStamp, isNumericInteger } from '@utils';
import { interval, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
    selector: 'citiglobal-time-log',
    templateUrl: './time-log.component.html',
    styleUrls: ['./time-log.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TimeLogComponent implements OnInit {
    private rfidNoSubject = new Subject<string>();
    private subscription: Subscription;
    private finalizedTimeLogInterval = 200;

    timeLogInterval = this.finalizedTimeLogInterval;

    currentTime: number | null;

    unsubscribe$: Subject<any>;
    search$: Observable<string>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private fuseConfigService: FuseConfigService,
        private store: Store<RootState>,
        @Inject('APP_BUILD_VERSION') public buildVersion: string
    ) {
        // Configure the layout
        this.fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true,
                },
                toolbar: {
                    hidden: true,
                },
                footer: {
                    hidden: true,
                },
                sidepanel: {
                    hidden: true,
                },
            },
        };
    }

    ngOnInit(): void {
        this.search$ = this.store.select(TimeLogReducer.selectRFIDNo);

        interval(1000)
            .pipe(map(() => new Date()))
            .subscribe((date) => {
                this.currentTime = getCurrentTimeStamp();
            });

        this.subscription = this.rfidNoSubject
            .pipe(
                debounceTime(this.finalizedTimeLogInterval),
                distinctUntilChanged()
            )
            .subscribe((rfidNo) => {
                this.store.dispatch(TimeLogActions.onSearchRFID({ rfidNo }));
            });
    }

    ngOnDestroy(): void {
        this.rfidNoSubject.complete();
        this.subscription.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const debounceInterval = changes?.timeLogInterval?.currentValue;

        if (isNumericInteger(debounceInterval) && debounceInterval > 10) {
            this.finalizedTimeLogInterval = debounceInterval;
        }
    }

    handleSearch(rfidNo: string): void {
        if (rfidNo) {
            this.rfidNoSubject.next(rfidNo ? rfidNo : '');
        }
    }
}
