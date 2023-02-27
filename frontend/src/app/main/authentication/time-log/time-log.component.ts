import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { Store } from '@ngrx/store';
import { RootState } from '@stores/index';
import { interval, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'citiglobal-time-log',
    templateUrl: './time-log.component.html',
    styleUrls: ['./time-log.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TimeLogComponent implements OnInit {
    currentDate: Date | null;

    unsubscribe$: Subject<any>;
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
            .subscribe((date) => (this.currentDate = date));
    }
}
