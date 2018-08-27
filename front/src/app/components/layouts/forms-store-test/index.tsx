import * as React from 'react';
import * as cn from 'classnames';
import { Layout, IHasRootStore } from 'app/components/layouts/layout';
import { FormField } from 'app/components/common/form';
import { Input } from 'app/components/common/input';
import { IChangeParams } from 'app/components/common/types';

export interface IFormsStoreTestProps extends IHasRootStore {
    className?: string;
}

export class FormsStoreTest extends Layout<IFormsStoreTestProps> {
    constructor(props: IFormsStoreTestProps) {
        super(props);
    }

    protected handleChangeInput = (params: IChangeParams<boolean | string>) => {
        const key = params.name as keyof IOrderCreateParams;
        const value: IOrderCreateParams[keyof IOrderCreateParams] =
            params.value;
        this.props.onUpdateField(key, value);
    };

    public render() {
        const p = this.props;
        return (
            <div className={cn('forms-store-test', this.props.className)}>
                <FormField
                    label="Price, SNM/h"
                    error={p.validation.price}
                    horizontal
                >
                    <Input
                        name="price"
                        value={p.price}
                        onChange={this.handleChangeInput}
                    />
                </FormField>
                <FormField
                    label="Price, SNM/h"
                    error={p.validation.price}
                    horizontal
                >
                    <Input
                        name="price"
                        value={p.price}
                        onChange={this.handleChangeInput}
                    />
                </FormField>
            </div>
        );
    }
}
