import { Directive } from '@angular/core';
import { LayoutDirective } from '@angular/flex-layout';

const inputs = [
  'fxLayout.smx',
  'fxLayout.lt-smx',
  'fxLayout.gt-smx',
  'fxLayout.mdx',
  'fxLayout.lt-mdx',
  'fxLayout.gt-mdx',
];
const selector = `
  [fxLayout.smx],
  [fxLayout.lt-smx],
  [fxLayout.gt-smx],
  [fxLayout.mdx],
  [fxLayout.lt-mdx],
  [fxLayout.gt-mdx]
`;

@Directive({
  inputs,
  selector,
})
export class CustomLayoutDirective extends LayoutDirective {
  protected inputs = inputs;
}
