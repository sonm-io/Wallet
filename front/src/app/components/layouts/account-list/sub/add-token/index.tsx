import * as React from 'react';
import { Dialog } from 'app/components/common/dialog';
import { Button } from 'app/components/common/button';
import { FormField, FormRow, Form } from 'app/components/common/form';
import { Input } from 'app/components/common/input';
import { validateEtherAddress } from 'app/utils/validation/validate-ether-address';

export interface IProps {
    validationString?: string;
    existingTokens: string[];
    onSubmit: (address: string) => void;
    onClickCross: () => void;
}

export class AddToken extends React.Component<IProps, any> {
    public state = {
        address: '',
        validationString: '',
    };

    protected handleSubmit = (event: any) => {
        event.preventDefault();

        const validation = validateEtherAddress(this.state.address);

        if (validation.length) {
            this.setState({ validationString: validation.join(' ;') });
        } else {
            this.props.onSubmit(this.state.address);
        }
    }

    public componentWillReceiveProps(next: IProps) {
        if (next.validationString !== this.props.validationString) {
            this.setState({ validationString: next.validationString });
        }
    }

    protected handleClickCross = () => {
        this.props.onClickCross();
    }

    protected handleChangeInput = (event: any) => {
        this.setState({
            [event.target.name]: event.target.value,
            validationString: '',
        });
    }

    public render() {
        return (
            <Dialog onClickCross={this.handleClickCross}>
                <Form className="sonm-wallets-create-account__form" onSubmit={this.handleSubmit}>
                    <h3>Add tokent</h3>
                    <FormRow>
                        <FormField
                            fullWidth
                            label="Token contract address"
                            error={this.state.validationString}
                        >
                            <Input
                                type="text"
                                name="address"
                                onChange={this.handleChangeInput}
                            />
                        </FormField>
                    </FormRow>
                    <Button
                        type="submit"
                    >
                        Add token
                    </Button>
                </Form>
            </Dialog>
        );
    }
}

export default AddToken;
