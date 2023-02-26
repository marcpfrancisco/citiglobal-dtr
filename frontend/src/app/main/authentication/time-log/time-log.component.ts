import { Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'citiglobal-time-log',
    templateUrl: './time-log.component.html',
    styleUrls: ['./time-log.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TimeLogComponent {}
