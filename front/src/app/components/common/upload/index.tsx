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
    public state = {
        pending: false,
    };

    protected handleChange = (event: any) => {
        if (this.state.pending) {
            return;
        }

        const { onOpenTextFile } = this.props;
        if (!onOpenTextFile) {
            return;
        }

        const file = event.target.files[0];
        if (file.size > MAX_FILE_SIZE) {
            throw new Error('Too big file');
        }

        const fileReader = new FileReader();

        fileReader.addEventListener('load', () => {
            this.setState({ pending: false });
            onOpenTextFile({
                text: fileReader.result,
                fileName: file.name,
            });
        });

        fileReader.addEventListener('error', (error: any) => {
            this.setState({ pending: false });
            onOpenTextFile({
                error: String(error),
                fileName: file.name,
            });
        });

        this.setState({ pending: true });
        try {
            fileReader.readAsText(file);
        } catch (e) {
            this.setState({ pending: false });
            onOpenTextFile({
                error: String(e),
                fileName: file.name,
            });
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
            <Button
                disabled={this.state.pending}
                style={{width: '100%', boxSizing: 'border-box'}}
                {...buttonProps}
                className={cn('sonm-upload', className)}
                type="button"
            >
                <label className="sonm-upload__label">
                    <input
                        key="file"
                        type="file"
                        className="sonm-upload__input"
                        onChange={this.handleChange}
                        ref={this.saveInputRef}
                    />
                    {children}
                </label>
            </Button>
        );
    }
}

export default Upload;
