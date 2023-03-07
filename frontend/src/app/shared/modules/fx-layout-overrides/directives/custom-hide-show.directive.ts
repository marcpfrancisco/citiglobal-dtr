import { Directive } from "@angular/core";
import { ShowHideDirective } from "@angular/flex-layout";

const inputs = [
  'fxHide.smx',
  'fxHide.lt-smx',
  'fxHide.gt-smx',
  'fxHide.mdx',
  'fxHide.lt-mdx',
  'fxHide.gt-mdx',
  'fxShow.smx',
  'fxShow.lt-smx',
  'fxShow.gt-smx',
  'fxShow.mdx',
  'fxShow.lt-mdx',
  'fxShow.gt-mdx',
];

const selector = `
  [fxHide.smx],
  [fxHide.lt-smx],
  [fxHide.gt-smx],
  [fxHide.mdx],
  [fxHide.lt-mdx],
  [fxHide.gt-mdx],
  [fxShow.smx],
  [fxShow.lt-smx],
  [fxShow.gt-smx],
  [fxShow.mdx],
  [fxShow.lt-mdx],
  [fxShow.gt-mdx]
`;

@Directive({
  inputs, 
  selector,
})
export class CustomShowHideDirective extends ShowHideDirective {
  protected inputs = inputs;
}
