import * as React from 'react';
import { Dialog } from 'app/components/common/dialog';
import { Button } from 'app/components/common/button';
import { FormField, FormRow, Form, FormButtons } from 'app/components/common/form';
import { Input } from 'app/components/common/input';
import { IdentIcon } from 'app/components/common/ident-icon/index';
import { AddTokenStore } from 'app/stores/add-token';
import { observer } from 'mobx-react';

export interface IProps {
    addTokenStore: AddTokenStore;
    onClickCross: () => void;
}

@observer
export class AddToken extends React.Component<IProps, {}> {
    protected handleSubmit = (event: any) => {
        event.preventDefault();

        this.props.addTokenStore.approveCandidateToken();

        this.props.onClickCross();
    }

    protected handleChangeInput = async (event: any) => {
        const address = event.target.value.trim();

        this.props.addTokenStore.setCandidateTokenAddress(address);
    }

    protected handleClose = () => {
        this.props.addTokenStore.resetCandidateToken();

        this.props.onClickCross();
    }

    public render() {
        const tokenInfo = this.props.addTokenStore.candidateTokenInfo;
        const tokenAddress = this.props.addTokenStore.candidateTokenAddress;
        const validation = this.props.addTokenStore.validationCandidateToken;

        return (
            <Dialog onClickCross={this.handleClose} height={tokenInfo ? 380 : 260}>
                <Form className="sonm-add-token__form" onSubmit={this.handleSubmit}>
                    <h3>Add token</h3>
                    <FormRow>
                        <FormField
                            fullWidth
                            label="Token contract address"
                            error={tokenAddress.length === 0 ? '' : validation}
                        >
                            <Input
                                autoFocus
                                value={tokenAddress}
                                type="text"
                                name="address"
                                onChange={this.handleChangeInput}
                            />
                        </FormField>
                    </FormRow>
                    <FormButtons>
                        <Button
                            disabled={!!validation.length || !tokenAddress.length}
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
