import type { Bureau } from '@/types';

export const BUREAUS: Bureau[] = [
  {
    key: 'experian',
    name: 'Experian',
    color: '#2f6df0',
    abbr: 'EX',
    addr: 'P.O. Box 4500\nAllen, TX 75013',
  },
  {
    key: 'equifax',
    name: 'Equifax',
    color: '#c0202e',
    abbr: 'EQ',
    addr: 'P.O. Box 740256\nAtlanta, GA 30374',
  },
  {
    key: 'transunion',
    name: 'TransUnion',
    color: '#1c9aa8',
    abbr: 'TU',
    addr: 'P.O. Box 2000\nChester, PA 19016',
  },
];
