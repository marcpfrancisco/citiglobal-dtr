import {
    Component,
    HostBinding,
    Inject,
    ViewEncapsulation,
} from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { isString } from 'lodash';

const SPLITTER_PATTERN = '\n';

@Component({
    selector: 'citiglobal-snackbar-multiline',
    templateUrl: './snackbar-multiline.component.html',
    styleUrls: ['./snackbar-multiline.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SnackbarMultilineComponent {
    // alternatively also the host parameter in the @Component()` decorator can be used
    @HostBinding('class.mat-simple-snackbar') setClassName = true;

    get messages(): Array<string> {
        let message: string | Error = this.message;

        if ((message as unknown) instanceof Error) {
            message = (message as unknown as Error)?.message;
        }

        if (isString(message)) {
            return message.trim().split(SPLITTER_PATTERN);
        }

        // accept finite number!
        switch (typeof message) {
            case 'number':
                if (!isFinite(message)) {
                    return [];
                }

                return [`${message}`];

            case 'boolean':
                return [message ? 'true' : 'false'];

            default:
                return [];
        }
    }

    constructor(@Inject(MAT_SNACK_BAR_DATA) private message: string) {}
}
