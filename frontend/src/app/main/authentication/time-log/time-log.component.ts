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
import { isString } from 'lodash';
import { interval, Observable, Subject, Subscription } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    switchMap,
} from 'rxjs/operators';

@Component({
    selector: 'citiglobal-time-log',
    templateUrl: './time-log.component.html',
    styleUrls: ['./time-log.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TimeLogComponent implements OnInit {
    currentTime: number | null;

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
        interval(1000)
            .pipe(map(() => new Date()))
            .subscribe((date) => {
                this.currentTime = getCurrentTimeStamp();
            });
    }

    ngOnDestroy(): void {}

    handleSearch(rfidNo: string): void {
        if (rfidNo) {
            this.store.dispatch(TimeLogActions.onSearchRFID({ rfidNo }));
        }
    }
}
