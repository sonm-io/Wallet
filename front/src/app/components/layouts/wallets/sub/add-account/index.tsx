import * as React from 'react';
import Upload from '../../../../common/upload';
import { Dialog } from '../../../../common/dialog';
import { Button } from 'app/components/common/button';
import { IValidation } from '../../../../../../ipc/types';

interface IProps {
    className?: string;
    validation?: IValidation;
    onSubmit: (state: any) => void;
}

export class AddAccount extends React.PureComponent<IProps, any> {
    public state = {
        visible: false,
        password: '',
        json: '',
    }

    private handleSubmit = (event: any) => {
        event.preventDefault();

        this.props.onSubmit({
            json: this.state.json,
            password: this.state.password,
        });
    }

    private handleOpenTextFile = (text?: string, error?: any) => {
        this.setState({ json: text });
    }

    protected handleChangeInput = (event: any) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    public render() {
        return (
            <Dialog>
                <form className="sonm-wallets-add-account__content" onSubmit={this.handleSubmit}>
                    <h3 className="sonm-wallets-add-account__header">Add account</h3>
                    <Upload
                        onOpenTextFile={this.handleOpenTextFile}
                        className="sonm-wallets-add-account__upload"
                        buttonProps={{square: true, height: 40, transparent: true}}
                    >
                        Select wallet file
                    </Upload>

                    <label className="sonm-wallets-add-account__label">
                        <span className="sonm-wallets-add-account__label-text">Enter account password</span>
                        <input
                            type="password"
                            className="sonm-wallets-add-account__input"
                            name="password"
                            onChange={this.handleChangeInput}
                        />
                    </label>
                    <Button
                        className="sonm-wallets-add-account__submit"
                        type="submit"
                        square
                        transparent
                        height={40}
                    >
                        Create
                    </Button>
                </form>
            </Dialog>
        );
    }
}

export default AddAccount;
