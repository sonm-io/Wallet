import * as React from 'react';
import * as cn from 'classnames';
import RcUpload from 'rc-upload';
import { IButtonProps, Button } from '../button';

const MAX_FILE_SIZE = 100 * 1024;

export interface IUploadProps {
    buttonProps?: IButtonProps;
    className?: string;
    children: any;
    onOpenTextFile?: (params: IFileOpenResult) => void;
}

export interface IFileOpenResult {
    text?: string;
    error?: any;
    fileName?: string;
}

export function Upload({ className, buttonProps, children, onOpenTextFile }: IUploadProps) {
    function beforeUpload(file: File) {
        const cancelUpload = true;

        if (file.size > MAX_FILE_SIZE) {
            throw new Error('Too big file');
        }

        if (onOpenTextFile) {
            const fileReader = new FileReader();

            fileReader.onload = () => onOpenTextFile({
                text: fileReader.result,
                fileName: file.name,
            });
            fileReader.onerror = error => onOpenTextFile({
                error,
                fileName: file.name,
            });

            fileReader.readAsText(file);
        }

        return cancelUpload;
    }

    return (
        <RcUpload beforeUpload={beforeUpload} className={cn('sonm-upload', className)}>
            <Button
                style={{ width: '100%', boxSizing: 'border-box' }}
                {...buttonProps}
            >
                {children}
            </Button>
        </RcUpload>
    );
}

export default Upload;
