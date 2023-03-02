import { BreakPoint } from '@angular/flex-layout';

export const FX_LAYOUT_CUSTOM_BREAKPOINTS: Array<BreakPoint> = [
  // OVERRIDES
  {
    alias: 'sm',
    mediaQuery: 'screen and (min-width: 600px) and (max-width: 921.98px)',
    priority: 900,
  },
  {
    alias: 'lt-sm',
    overlapping: true,
    mediaQuery: 'screen and (max-width: 599.98px)',
    priority: 950,
  },
  {
    alias: 'gt-sm',
    overlapping: true,
    mediaQuery: 'screen and (min-width: 922px)',
    priority: -850,
  },
  {
    alias: 'md',
    mediaQuery: 'screen and (min-width: 960px) and (max-width: 1023.98px)',
    priority: 800,
  },
  {
    alias: 'lt-md',
    overlapping: true,
    mediaQuery: 'screen and (max-width: 959.98px)',
    priority: 850,
  },
  {
    alias: 'gt-md',
    overlapping: true,
    mediaQuery: 'screen and (min-width: 1024px)',
    priority: -750
  },
  // NEW
  {
    alias: 'smx',
    suffix: 'Smx',
    mediaQuery: 'screen and (min-width: 922px) and (max-width: 959.98px)',
    priority: 890
  },
  {
    alias: 'lt-smx',
    suffix: 'LtSmx',
    mediaQuery: 'screen and (max-width: 921.98px)',
    overlapping: true,
    priority: 940
  },
  {
    alias: 'gt-smx',
    suffix: 'GtSmx',
    mediaQuery: 'screen and (min-width: 959.98px)',
    overlapping: true,
    priority: -840
  },
  {
    alias: 'mdx',
    suffix: 'Mdx',
    mediaQuery: 'screen and (min-width: 1024px) and (max-width: 1279.98px)',
    priority: 790
  },
  {
    alias: 'lt-mdx',
    suffix: 'LtMdx',
    mediaQuery: 'screen and (max-width: 1023.98px)',
    overlapping: true,
    priority: 840
  },
  {
    alias: 'gt-mdx',
    suffix: 'GtMdx',
    mediaQuery: 'screen and (min-width: 1290px)',
    overlapping: true,
    priority: -740
  }
];
