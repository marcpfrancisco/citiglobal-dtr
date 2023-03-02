import { Directive } from '@angular/core';
import { LayoutAlignDirective } from '@angular/flex-layout';

const inputs = [
  'fxLayoutAlign.smx',
  'fxLayoutAlign.lt-smx',
  'fxLayoutAlign.gt-smx',
  'fxLayoutAlign.mdx',
  'fxLayoutAlign.lt-mdx',
  'fxLayoutAlign.gt-mdx',
];
const selector = `
  [fxLayoutAlign.smx],
  [fxLayoutAlign.lt-smx],
  [fxLayoutAlign.gt-smx],
  [fxLayoutAlign.mdx],
  [fxLayoutAlign.lt-mdx],
  [fxLayoutAlign.gt-mdx]
`;

@Directive({
  inputs,
  selector,
})
export class CustomLayoutAlignDirective extends LayoutAlignDirective {
  protected inputs = inputs;
}
