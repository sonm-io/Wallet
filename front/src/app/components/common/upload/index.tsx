import * as React from 'react';
import * as cn from 'classnames';
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

export class Upload extends React.PureComponent<IUploadProps, any> {
    protected handleChange = (event: any) => {
        const file = event.target.files[0];
        const { onOpenTextFile } = this.props;

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
    }

    protected inputNode?: HTMLInputElement;

    protected onClick = (event: any) => {
        if (this.inputNode) {
            event.stopPropagation();

            this.inputNode.click();
        }
    }

    protected saveInputRef = (ref: HTMLInputElement | null) => {
        if (ref !== null && this.inputNode !== ref) {
            this.inputNode = ref;
        }
    }

    public render() {
        const { className, buttonProps, children } = this.props;

        return (
            <div className={cn('sonm-upload', className)} onClickCapture={this.onClick}>
                <input
                    type="file"
                    onChange={this.handleChange}
                    style={{display: 'none'}}
                    ref={this.saveInputRef}
                />
                <Button
                    style={{width: '100%', boxSizing: 'border-box'}}
                    {...buttonProps}
                >
                    {children}
                </Button>
            </div>
        );
    }
}

export default Upload;
