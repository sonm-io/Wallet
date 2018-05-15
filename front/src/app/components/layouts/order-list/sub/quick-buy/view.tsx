import * as React from 'react';
import { Dialog } from 'app/components/common/dialog';
import { Input } from 'app/components/common/input';
import { Form, FormField } from 'app/components/common/form';
import { Button } from 'app/components/common/button';

interface IProps {
    onChangePassword: (event: any) => void;
    onSubmit: () => void;
    onClickCross: () => void;
    validationPassword: string;
    password: string;
}

export class QuickBuyView extends React.Component<IProps, any> {
    public handleSubmit = (event: any) => {
        event.preventDefault();

        this.props.onSubmit();
    };

    public render() {
        return (
            <Dialog onClickCross={this.props.onClickCross}>
                <h3>Quick buy</h3>
                <Form onSubmit={this.handleSubmit}>
                    <FormField
                        label="Account password"
                        error={this.props.validationPassword}
                    >
                        <Input
                            onChange={this.props.onChangePassword}
                            type="password"
                            name="password"
                            value={this.props.password}
                        />
                    </FormField>
                    <Button type="submit">Submit</Button>
                </Form>
            </Dialog>
        );
    }
}

export default QuickBuyView;
