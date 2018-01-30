import * as React from 'react';
import { Dialog } from 'app/components/common/dialog';
import { Button } from 'app/components/common/button';
import { FormField, FormRow, Form, FormButtons } from 'app/components/common/form';
import { Input } from 'app/components/common/input';
import { ICurrencyInfo } from 'app/api/types';
import { IdentIcon } from 'app/components/common/ident-icon/index';

export interface IProps {
    tokenAddress: string;
    validationTokenAddress: string;
    onSubmit: (address: string) => void;
    onClickCross: () => void;
    onChangeTokenAddress: (tokenAddress: string) => void;
    tokenInfo?: ICurrencyInfo;
}

export class AddToken extends React.Component<IProps, {}> {
    protected handleSubmit = (event: any) => {
        event.preventDefault();

        this.props.onSubmit(this.props.tokenAddress);
    }

    protected handleClickCross = () => {
        this.props.onClickCross();
    }

    protected handleChangeInput = async (event: any) => {
        const address = event.target.value.trim();

        this.props.onChangeTokenAddress(address);
    }

    public render() {
        const tokenInfo = this.props.tokenInfo;

        return (
            <Dialog onClickCross={this.handleClickCross} height={tokenInfo ? 350 : 230}>
                <Form className="sonm-add-token__form" onSubmit={this.handleSubmit}>
                    <h3>Add token</h3>
                    <FormRow>
                        <FormField
                            fullWidth
                            label="Token contract address"
                            error={this.props.tokenAddress.length === 0 ? '' : this.props.validationTokenAddress}
                        >
                            <Input
                                value={this.props.tokenAddress}
                                type="text"
                                name="address"
                                onChange={this.handleChangeInput}
                            />
                        </FormField>
                    </FormRow>
                    <FormButtons>
                        <Button
                            disabled={this.props.validationTokenAddress !== '' || this.props.tokenAddress.length === 0}
                            type="submit"
                        >
                            Add token
                        </Button>
                    </FormButtons>
                    {tokenInfo ?
                        <div className="sonm-add-token__preview">
                            <IdentIcon className="sonm-add-token__preview-icon" address={tokenInfo.address}/>
                            <span  className="sonm-add-token__preview-name">{tokenInfo.name}</span>
                            <span  className="sonm-add-token__preview-ticker">{tokenInfo.symbol}</span>
                        </div>
                    : null}
                </Form>
            </Dialog>
        );
    }
}

export default AddToken;
