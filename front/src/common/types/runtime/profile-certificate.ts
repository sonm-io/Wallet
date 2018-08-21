import * as t from 'tcomb';
import { createStruct } from 'app/api/utils/runtime-types-utils';
import { TypeEthereumAddress } from './etherium-address';
import { ICertificate } from '../profile-certificate';

export const TypeCertifcate = createStruct<ICertificate>(
    {
        address: TypeEthereumAddress,
        status: t.Number,
    },
    'ICertificate',
);
