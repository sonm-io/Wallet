import * as t from 'tcomb';
import { isHexDeximal } from 'common/utils';

export const TypeEthereumAddress = t.refinement(
    t.String,
    (s: string) => s.length === 42 && s.startsWith('0x') && isHexDeximal(s),
    'EthereumAddress',
);
