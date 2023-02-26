import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarMultilineComponent } from './snackbar-multiline.component';

@NgModule({
  declarations: [SnackbarMultilineComponent],
  exports: [SnackbarMultilineComponent],
  imports: [MatSnackBarModule, CommonModule, FlexLayoutModule],
  providers: [SnackbarMultilineComponent],
})
export class SnackbarMultilineModule {}
