import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';

@Component({
    selector: 'citiglobal-filter-list',
    templateUrl: './filter-list.component.html',
    styleUrls: ['./filter-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class FilterListComponent implements OnInit {
    @Input() hasFilters: boolean;
    @Output() buttonClick = new EventEmitter<void>();
    constructor() {}
    ngOnInit(): void {}
    onClick(): void {
        this.buttonClick.emit();
    }
}
