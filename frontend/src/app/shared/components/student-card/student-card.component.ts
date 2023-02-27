import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'citiglobal-student-card',
    templateUrl: './student-card.component.html',
    styleUrls: ['./student-card.component.scss'],
    animations: fuseAnimations,
})
export class StudentCardComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
