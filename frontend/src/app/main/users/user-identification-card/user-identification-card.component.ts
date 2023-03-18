import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from '@models';
import { Store } from '@ngrx/store';
import { RootState, TimeLogReducer } from '@stores/index';
import { Observable } from 'rxjs';

@Component({
    selector: 'citiglobal-user-identification-card',
    templateUrl: './user-identification-card.component.html',
    styleUrls: ['./user-identification-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class UserIdentifcationCardComponent implements OnInit {
    static panelClass = 'citiglobal-user-identification-card';

    user$: Observable<User>;

    constructor(
        public matDialogRef: MatDialogRef<UserIdentifcationCardComponent>,
        private store: Store<RootState>
    ) {}

    ngOnInit(): void {
        // Set user
        this.user$ = this.store.select(TimeLogReducer.selectUser);
    }
}
