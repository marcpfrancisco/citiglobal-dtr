import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'citiglobal-section-list',
    templateUrl: './section-list.component.html',
    styleUrls: ['./section-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SectionListComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
