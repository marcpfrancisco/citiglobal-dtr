import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AblePipe } from './able.pipe';

const PIPES = [AblePipe];

@NgModule({
    declarations: PIPES,
    exports: PIPES,
    imports: [CommonModule],
    providers: [AblePipe],
})
export class PipesModule {}
