import { Directive } from '@angular/core';
import { ImgSrcDirective } from '@angular/flex-layout';

const inputs = [
  'src.smx',
  'src.lt-smx',
  'src.gt-smx',
  'src.mdx',
  'src.lt-mdx',
  'src.gt-mdx',
];
const selector = `
  img[src.smx],
  img[src.lt-smx],
  img[src.gt-smx],
  img[src.mdx],
  img[src.lt-mdx],
  img[src.gt-mdx]
`;
@Directive({
  inputs,
  selector,
})
export class CustomImgSrcDirective extends ImgSrcDirective {
  protected inputs = inputs;
}
