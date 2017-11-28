import * as React from 'react';
import * as cn from 'classnames';
import RcUpload from 'rc-upload';
import { IButtonProps, Button } from '../button';

export interface IUploadProps {
    buttonProps?: IButtonProps;
    className?: string;
    children: any;
    onStartUpload?: any;
}

export function Upload({ className, buttonProps, children, onStartUpload }: IUploadProps) {
    return (
        <RcUpload onStart={onStartUpload} className={cn('sonm-upload', className)}>
            <Button
                {...buttonProps}
            >
                {children}
            </Button>
        </RcUpload>
    );
}

export default Upload;
