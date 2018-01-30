import * as React from 'react';
import { Dialog } from 'app/components/common/dialog';
import { Button } from 'app/components/common/button';
import { FormField, FormRow, Form, FormButtons } from 'app/components/common/form';
import { Input } from 'app/components/common/input';
import { IdentIcon } from 'app/components/common/ident-icon/index';
import { MainStore } from 'app/stores/main';
import { observer } from 'mobx-react';

export interface IProps {
    /*tokenAddress: string;
    validationTokenAddress: string;
    onSubmit: (address: string) => void;
    onClickCross: () => void;
    onChangeTokenAddress: (tokenAddress: string) => void;
    tokenInfo?: ICurrencyInfo;*/
    mainStore: MainStore;
    onClickCross: () => void;
}

@observer
export class AddToken extends React.Component<IProps, {}> {
    protected handleSubmit = (event: any) => {
        event.preventDefault();

        this.props.mainStore.approveCandidateToken();
    }

    protected handleChangeInput = async (event: any) => {
        const address = event.target.value.trim();

        this.props.mainStore.setCandidateTokenAddress(address);
    }

    public render() {
        const tokenInfo = this.props.mainStore.candidateTokenInfo;
        const tokenAddress = this.props.mainStore.candidateTokenAddress;
        const validation = this.props.mainStore.validationCandidateToken;

        return (
            <Dialog onClickCross={this.props.onClickCross} height={tokenInfo ? 350 : 230}>
                <Form className="sonm-add-token__form" onSubmit={this.handleSubmit}>
                    <h3>Add token</h3>
                    <FormRow>
                        <FormField
                            fullWidth
                            label="Token contract address"
                            error={tokenAddress.length === 0 ? '' : validation}
                        >
                            <Input
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
