import { Directive } from '@angular/core';
import { ClassDirective } from '@angular/flex-layout';

const inputs = [
  'ngClass.smx',
  'ngClass.lt-smx',
  'ngClass.gt-smx',
  'ngClass.mdx',
  'ngClass.lt-mdx',
  'ngClass.gt-mdx',
];
const selector = `
  [ngClass.smx],
  [ngClass.lt-smx],
  [ngClass.gt-smx],
  [ngClass.mdx],
  [ngClass.lt-mdx],
  [ngClass.gt-mdx],
`;
@Directive({
  inputs,
  selector,
})
export class CustomClassDirective extends ClassDirective {
  protected inputs = inputs;
}
