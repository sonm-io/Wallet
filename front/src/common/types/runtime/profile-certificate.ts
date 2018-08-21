import * as t from 'tcomb';
import { createStruct } from 'app/api/utils/runtime-types-utils';
import { TypeEthereumAddress } from './etherium-address';
import { IProfileCertificate } from '../profile-certificate';

export const TypeProfileCertifcate = createStruct<IProfileCertificate>(
    {
        address: TypeEthereumAddress,
        status: t.Number,
    },
    'ICertificate',
);
