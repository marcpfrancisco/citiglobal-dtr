import { Directive } from '@angular/core';
import { FlexOrderDirective } from '@angular/flex-layout';

const inputs = [
  'fxFlexOrder.smx',
  'fxFlexOrder.lt-smx',
  'fxFlexOrder.gt-smx',
  'fxFlexOrder.mdx',
  'fxFlexOrder.lt-mdx',
  'fxFlexOrder.gt-mdx',
];
const selector = `
  [fxFlexOrder.smx],
  [fxFlexOrder.lt-smx],
  [fxFlexOrder.gt-smx],
  [fxFlexOrder.mdx],
  [fxFlexOrder.lt-mdx],
  [fxFlexOrder.gt-mdx]
`;

@Directive({
  inputs,
  selector,
})
export class CustomFlexOrderDirective extends FlexOrderDirective {
  protected inputs = inputs;
}
