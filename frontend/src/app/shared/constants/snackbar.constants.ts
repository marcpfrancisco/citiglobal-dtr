import { MatSnackBarConfig } from '@angular/material/snack-bar';

export const DEFAULT_SNACKBAR_CONFIG: MatSnackBarConfig = {
    verticalPosition: 'top',
    duration: 3000, // dismiss after 3 seconds
    panelClass: ['mat-toolbar', 'green-600'], // red-600 for error message, green-600 for success message
};
