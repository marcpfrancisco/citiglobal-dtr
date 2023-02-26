import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTreeModule } from '@angular/material/tree';
import { CdkTableModule } from '@angular/cdk/table';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule, MediaMarshaller } from '@angular/flex-layout';

@NgModule({
    exports: [
        CdkTableModule,
        DragDropModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatRippleModule,
        MatIconModule,
        MatSortModule,
        MatPaginatorModule,
        MatButtonModule,
        MatSelectModule,
        MatFormFieldModule,
        MatTabsModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
        MatMomentDateModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatToolbarModule,
        MatDialogModule,
        MatMenuModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatTreeModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatTooltipModule,
        FlexLayoutModule,
    ],
})
export class SharedMaterialModule {
    lastValue: Array<MediaMarshaller['activatedBreakpoints']>;

    constructor(m: MediaMarshaller) {
        // hack until resolve: https://github.com/angular/flex-layout/issues/1201
        // @ts-ignore
        m.subject.subscribe((x) => {
            if (
                // @ts-ignore
                m.activatedBreakpoints.filter((b) => b.alias === 'print')
                    .length === 0
            ) {
                // @ts-ignore
                this.lastValue = [...m.activatedBreakpoints];
            } else {
                // @ts-ignore
                m.activatedBreakpoints = [...this.lastValue];
                // @ts-ignore
                m.hook.collectActivations = () => {};
                // @ts-ignore
                m.hook.deactivations = [...this.lastValue];
            }
        });
    }
}
