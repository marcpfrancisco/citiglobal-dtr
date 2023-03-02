import { Directive } from '@angular/core';
import { LayoutGapDirective } from '@angular/flex-layout';

const inputs = [
  'fxLayoutGap.smx',
  'fxLayoutGap.lt-smx',
  'fxLayoutGap.gt-smx',
  'fxLayoutGap.mdx',
  'fxLayoutGap.lt-mdx',
  'fxLayoutGap.gt-mdx',
];
const selector = `
  [fxLayoutGap.smx],
  [fxLayoutGap.lt-smx],
  [fxLayoutGap.gt-smx],
  [fxLayoutGap.mdx],
  [fxLayoutGap.lt-mdx],
  [fxLayoutGap.gt-mdx]
`;

@Directive({
  inputs,
  selector,
})
export class CustomLayoutGapDirective extends LayoutGapDirective {
  protected inputs = inputs;
}
