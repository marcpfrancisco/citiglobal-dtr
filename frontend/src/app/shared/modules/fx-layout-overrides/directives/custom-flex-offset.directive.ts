import { Directive } from '@angular/core';
import { FlexOffsetDirective } from '@angular/flex-layout';

const inputs = [
  'fxFlexOffset.smx',
  'fxFlexOffset.lt-smx',
  'fxFlexOffset.gt-smx',
  'fxFlexOffset.mdx',
  'fxFlexOffset.lt-mdx',
  'fxFlexOffset.gt-mdx',
];
const selector = `
  [fxFlexOffset.smx],
  [fxFlexOffset.lt-smx],
  [fxFlexOffset.gt-smx],
  [fxFlexOffset.mdx],
  [fxFlexOffset.lt-mdx],
  [fxFlexOffset.gt-mdx]
`;

@Directive({
  inputs,
  selector,
})
export class CustomFlexOffsetDirective extends FlexOffsetDirective {
  protected inputs = inputs;
}
