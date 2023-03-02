import { Directive } from '@angular/core';
import { FlexFillDirective } from '@angular/flex-layout';

const inputs = [
  'fxFlexFill.smx',
  'fxFlexFill.lt-smx',
  'fxFlexFill.gt-smx',
  'fxFlexFill.mdx',
  'fxFlexFill.lt-mdx',
  'fxFlexFill.gt-mdx',
];
const selector = `
  [fxFlexFill.smx],
  [fxFlexFill.lt-smx],
  [fxFlexFill.gt-smx]
  [fxFlexFill.mdx],
  [fxFlexFill.lt-mdx],
  [fxFlexFill.gt-mdx]
`;

@Directive({
  inputs,
  selector,
})
export class CustomFlexFillDirective extends FlexFillDirective {
  protected inputs = inputs;
}
