import { NgModule } from '@angular/core';
import { BREAKPOINT, FlexLayoutModule } from '@angular/flex-layout';
import { FX_LAYOUT_CUSTOM_BREAKPOINTS } from './constants/breakpoints.constant';
import {
  CustomClassDirective,
  CustomFlexAlignDirective,
  CustomFlexDirective,
  CustomFlexFillDirective,
  CustomFlexOffsetDirective,
  CustomFlexOrderDirective,
  CustomImgSrcDirective,
  CustomLayoutAlignDirective,
  CustomLayoutDirective,
  CustomLayoutGapDirective,
  CustomShowHideDirective,
} from './directives';

const OVERRIDEN_DECLARATIONS = [
  CustomFlexDirective,
  CustomFlexAlignDirective,
  CustomFlexFillDirective,
  CustomFlexOffsetDirective,
  CustomFlexOrderDirective,
  CustomLayoutDirective,
  CustomLayoutAlignDirective,
  CustomLayoutGapDirective,
  CustomClassDirective,
  CustomImgSrcDirective,
  CustomShowHideDirective,
];

@NgModule({
  imports: [FlexLayoutModule],
  declarations: OVERRIDEN_DECLARATIONS,
  providers: [
    {
      provide: BREAKPOINT,
      useValue: FX_LAYOUT_CUSTOM_BREAKPOINTS,
      multi: true,
    },
  ],
  exports: [FlexLayoutModule, ...OVERRIDEN_DECLARATIONS],
})
export class FxLayoutOverridesModule {}
