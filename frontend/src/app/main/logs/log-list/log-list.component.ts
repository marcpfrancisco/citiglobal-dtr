import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'citiglobal-log-list',
    templateUrl: './log-list.component.html',
    styleUrls: ['./log-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class LogListComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
