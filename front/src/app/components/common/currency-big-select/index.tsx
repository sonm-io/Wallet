import * as React from 'react';
import { BigSelect, Option } from '../big-select';
import { CurrencyItem, ICurrencyItemProps } from './sub/item';

import * as cn from 'classnames';

export interface ICurrencyBigSelectProps {
    className?: string;
    currencies?: ICurrencyItemProps[];
    value?: string;
    onChange?: (value: any) => void;
    returnPrimitive?: boolean;
}

export { ICurrencyItemProps } from './sub/item';

export class CurrencyBigSelect extends React.PureComponent<ICurrencyBigSelectProps, any> {
    public render() {
        const {
            value,
            currencies,
            className,
        } = this.props;

        return (
            <BigSelect
                value={value}
                className={cn('sonm-currency-big-select', className)}
                dropdownClassName="sonm-currency-big-select__dropdown"
                onChange={this.handleChange}
            >
                {
                    currencies && currencies.map(currency => {
                        return (
                            <Option
                                title={currency.name}
                                value={currency.address}
                                key={currency.address}
                            >
                                <CurrencyItem {...currency} className="sonm-currency-big-select__option"/>
                            </Option>
                        );
                    })
                }
            </BigSelect>
        );
    }

    protected handleChange = (address: any) => {
        if (this.props.onChange && this.props.currencies) {
            if (this.props.returnPrimitive) {
                this.props.onChange(address as string);
            } else {
                this.props.onChange(this.props.currencies.find(x => x.address as string === address));
            }
        }
    }
}

export default CurrencyBigSelect;
