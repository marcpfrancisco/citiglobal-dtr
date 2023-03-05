import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserRoles } from '@enums';
import { fuseAnimations } from '@fuse/animations';
import { Store } from '@ngrx/store';
import { AuthenticationReducer, RootState } from '@stores/index';
import { createUserFullName } from '@utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'citiglobal-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DashboardComponent implements OnInit {
    isAdmin$: Observable<boolean>;
    isStudent$: Observable<boolean>;
    name$: Observable<string>;

    constructor(private store: Store<RootState>) {}

    ngOnInit(): void {
        this.setupObservables();
    }

    private setupObservables(): void {
        const currentUser$ = this.store.select(
            AuthenticationReducer.selectCurrentUser
        );

        this.isAdmin$ = currentUser$.pipe(
            map(
                (user) =>
                    user?.role === UserRoles.SUPERADMIN ||
                    user?.role === UserRoles.ADMINISTRATOR
            )
        );
        this.isStudent$ = currentUser$.pipe(
            map((user) => user?.role === UserRoles.STUDENT)
        );
        this.name$ = currentUser$.pipe(map((user) => user?.fullName));

        currentUser$.subscribe((res) => console.log(res));
    }
}
