import * as t from 'tcomb';
import { createStruct } from 'app/api/utils/runtime-types-utils';
import { IProfileAttribute } from '../profile-attribute';

export const TypeProfileAttribute = createStruct<IProfileAttribute>(
    {
        label: t.String,
        value: t.String,
    },
    'IAttribute',
);
