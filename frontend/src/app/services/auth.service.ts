import { Injectable } from '@angular/core';

import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AuthUser, SignInUserSession } from '@models';

@Injectable({ providedIn: 'root' })
export class AuthService {}
