import { Directive } from '@angular/core';
import { FlexAlignDirective } from '@angular/flex-layout';

const inputs = [
  'fxFlexAlign.smx',
  'fxFlexAlign.lt-smx',
  'fxFlexAlign.gt-smx',
  'fxFlexAlign.mdx',
  'fxFlexAlign.lt-mdx',
  'fxFlexAlign.gt-mdx',
];
const selector = `
  [fxFlexAlign.smx],
  [fxFlexAlign.lt-smx],
  [fxFlexAlign.gt-smx],
  [fxFlexAlign.mdx],
  [fxFlexAlign.lt-mdx],
  [fxFlexAlign.gt-mdx]
`;

@Directive({
  inputs,
  selector,
})
export class CustomFlexAlignDirective extends FlexAlignDirective {
  protected inputs = inputs;
}
