import * as React from 'react';
import { Dialog } from 'app/components/common/dialog';
import { ConfirmationPanel } from 'app/components/common/confirmation-panel';
import { Form, FormHeader, FormRow } from 'app/components/common/form';
import { FixedSelect, ISelectItem } from 'app/components/common/fixed-select';
import { rootStore } from 'app/stores/';
import { observer } from 'mobx-react';

export interface IProps {
    address: string;
    className?: string;
    onClose: () => void;
}

@observer
export class KYC extends React.Component<IProps, any> {
    protected static readonly list: ISelectItem<string>[] = [
        {
            value: 'Superpuper test KYC service',
            stringValue: 'Superpuper test KYC service',
        },
    ];

    public state = {
        password: '',
        link: '',
        validationPassword: '',
        selectedValue: KYC.list[0].value,
    };

    protected handleSubmit = async (password: string) => {
        const link = await rootStore.mainStore.getKYCLink(
            password,
            this.props.address,
            '0x5db024c6469634f4b307135cb76e8e6806f007b3',
            '20',
        );

        if (link) {
            this.setState({
                link,
            });
        } else {
            this.setState({
                validationPassword:
                    rootStore.mainStore.serverValidation.password,
            });
        }
    };

    protected handleChangeSelect = (params: any) => {
        this.setState({
            selectedValue: params.value,
        });
    };

    public render() {
        const when = this.state.link === '' ? 'before' : 'after';
        const link = `http://185.186.245.196:8080/${this.state.link}`;

        return (
            <Dialog
                onClickCross={this.props.onClose}
                className={`sonm-show-kyc__dialog sonm-show-kyc__dialog--${when}`}
            >
                <Form className="sonm-show-kyc__form">
                    <FormHeader>
                        {when === 'before'
                            ? 'Select KYC service'
                            : 'Click on link'}
                    </FormHeader>
                    {when === 'before' ? (
                        <React.Fragment>
                            <FormRow key="before">
                                <FixedSelect
                                    className="sonm-show-kyc__select"
                                    name="kycService"
                                    options={KYC.list}
                                    value={this.state.selectedValue}
                                    hasBalloon
                                    compareValues={FixedSelect.compareAsJson}
                                    onChange={this.handleChangeSelect}
                                />
                            </FormRow>
                            <ConfirmationPanel
                                onSubmit={this.handleSubmit}
                                onCancel={this.props.onClose}
                                validationMessage={
                                    rootStore.mainStore.serverValidation
                                        .password
                                }
                            />
                        </React.Fragment>
                    ) : (
                        <a href={link} target="_blank">
                            Link to KYC service
                        </a>
                    )}
                </Form>
            </Dialog>
        );
    }
}

export default KYC;
