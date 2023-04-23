import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { UserRoles } from '@enums';
import { isArray } from 'lodash';

UserRoles;
@Injectable({
    providedIn: 'root',
})
export class RouterService {
    private history: Array<string>;

    constructor(private router: Router, private location: Location) {
        this.history = [];

        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                // if more than 20, shift first item
                if (this.history.length >= 20) {
                    this.history.splice(0, 1);
                }

                // push new entrys
                this.history.push(event.urlAfterRedirects);
            }
        });
    }

    back(fallback?: Array<string>): void {
        this.history.pop();

        // if there's history, then go back
        if (this.history.length > 0) {
            this.location.back();
            return;
        }

        // use fallbabck if no previous URL
        if (isArray(fallback)) {
            this.router.navigate(fallback);
            return;
        }

        // go back to home page if no URL
        this.router.navigateByUrl('/sections');
    }

    navigateToLandingPage(role: UserRoles): void {
        switch (role) {
            case UserRoles.SUPERADMIN:
                this.router.navigate(['sections']);
                break;

            case UserRoles.ADMINISTRATOR:
                this.router.navigate(['sections']);
                break;

            case UserRoles.STUDENT:
                this.router.navigate(['logs']);
                break;

            default:
                break;
        }
    }
}
