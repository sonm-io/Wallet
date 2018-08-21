import * as t from 'tcomb';
import { createStruct } from 'app/api/utils/runtime-types-utils';
import { IAttribute } from '../profile-attribute';

export const TypeAttribute = createStruct<IAttribute>(
    {
        label: t.String,
        value: t.String,
    },
    'IAttribute',
);
