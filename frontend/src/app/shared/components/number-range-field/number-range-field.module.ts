import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { OverlayModule } from '@angular/cdk/overlay';

import { NumberRangeFieldComponent } from './number-range-field.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    NumberRangeFieldComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatIconModule,
    MatInputModule,
    MatSliderModule,
    OverlayModule,
    MatButtonModule
  ],
  providers: [],
  exports: [NumberRangeFieldComponent],
})
export class NumberRangeFieldModule {}
