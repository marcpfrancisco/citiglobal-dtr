import { Directive } from '@angular/core';
import { FlexDirective } from '@angular/flex-layout';

const inputs = [
  'fxFlex.smx',
  'fxFlex.lt-smx',
  'fxFlex.gt-smx',
  'fxFlex.mdx',
  'fxFlex.lt-mdx',
  'fxFlex.gt-mdx',
];
const selector = `
  [fxFlex.smx],
  [fxFlex.lt-smx],
  [fxFlex.gt-smx],
  [fxFlex.mdx],
  [fxFlex.lt-mdx],
  [fxFlex.gt-mdx]
`;

@Directive({
  inputs,
  selector,
})
export class CustomFlexDirective extends FlexDirective {
  protected inputs = inputs;
}
