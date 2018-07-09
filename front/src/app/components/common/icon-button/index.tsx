import React from 'react';
import { Icon, IIconProps } from 'app/components/common/icon';

export const IconButton = (props: IIconProps) => (
    <Icon {...props} tag="button" />
);
