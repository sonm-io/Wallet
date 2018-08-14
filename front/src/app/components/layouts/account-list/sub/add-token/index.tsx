import * as React from 'react';
import { Dialog } from 'app/components/common/dialog';
import { Button } from 'app/components/common/button';
import {
    FormField,
    FormRow,
    Form,
    FormButtons,
} from 'app/components/common/form';
import { Input } from 'app/components/common/input';
import { IdentIcon } from 'app/components/common/ident-icon/index';
import { observer } from 'mobx-react';
import { Balance } from 'app/components/common/balance-view';
import {
    Layout,
    IHasRootStore,
    withRootStore,
} from 'app/components/layouts/layout';

export interface IProps extends IHasRootStore {
    onClickCross: () => void;
}

export const AddToken = withRootStore(
    observer(
        class extends Layout<IProps> {
            protected handleSubmit = (event: any) => {
                event.preventDefault();
                this.rootStore.addToken.approveCandidateToken();
                this.props.onClickCross();
            };

            protected handleChangeInput = async (event: any) => {
                const address = event.target.value.trim();
                this.rootStore.addToken.setCandidateTokenAddress(address);
            };

            protected handleClose = () => {
                this.rootStore.addToken.resetCandidateToken();
                this.props.onClickCross();
            };

            public render() {
                const rootStore = this.rootStore;
                const tokenInfo = rootStore.addToken.candidateTokenInfo;
                const tokenAddress = rootStore.addToken.candidateTokenAddress;
                const validation = rootStore.addToken.validationCandidateToken;

                return (
                    <Dialog
                        onClickCross={this.handleClose}
                        height={tokenInfo ? 380 : 260}
                    >
                        <Form
                            className="sonm-add-token__form"
                            onSubmit={this.handleSubmit}
                        >
                            <h3>Add token</h3>
                            <FormRow>
                                <FormField
                                    fullWidth
                                    label="Token contract address"
                                    error={
                                        tokenAddress.length === 0
                                            ? ''
                                            : rootStore.localizator.getMessageText(
                                                  validation,
                                              )
                                    }
                                >
                                    <Input
                                        autoFocus
                                        value={tokenAddress}
                                        type="text"
                                        name="address"
                                        onChangeDeprecated={
                                            this.handleChangeInput
                                        }
                                    />
                                </FormField>
                            </FormRow>
                            <FormButtons>
                                <Button
                                    disabled={
                                        !!validation.length ||
                                        !tokenAddress.length
                                    }
                                    type="submit"
                                >
                                    Add token
                                </Button>
                            </FormButtons>
                            {tokenInfo ? (
                                <div className="sonm-add-token__preview">
                                    <IdentIcon
                                        className="sonm-add-token__preview-icon"
                                        address={tokenInfo.address}
                                    />
                                    <span className="sonm-add-token__preview-name">
                                        {tokenInfo.name}
                                    </span>
                                    <span className="sonm-add-token__preview-ticker">
                                        <Balance
                                            className="sonm-add-token__sonm"
                                            balance={tokenInfo.balance}
                                            symbol={tokenInfo.symbol}
                                            decimalPointOffset={
                                                tokenInfo.decimalPointOffset
                                            }
                                        />
                                    </span>
                                </div>
                            ) : null}
                        </Form>
                    </Dialog>
                );
            }
        },
    ),
);

export default AddToken;
