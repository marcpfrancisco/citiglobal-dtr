import { Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'citiglobal-admin-login',
    templateUrl: './admin-login.component.html',
    styleUrls: ['./admin-login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AdminLoginComponent {}
