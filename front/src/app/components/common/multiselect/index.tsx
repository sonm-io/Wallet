import * as React from 'react';
import * as get from 'lodash/fp/get';
import {
    IMultiSelectInputProps,
    IMultiSelectOptionalInputProps,
} from './types';
//import { Input } from '../input';
import { Button } from '../button';
import { DropdownInput } from '../dropdown-input';
import { Checkbox } from '../checkbox';
import { ITogglerChangeParams } from '../toggler';
import * as debounce from 'lodash/fp/debounce';
import Icon from '../icon';

const DebounceWait = 100; //ms

export class MultiSelect<T> extends React.Component<
    IMultiSelectInputProps<T>,
    any
> {
    public static readonly defaultProps: IMultiSelectOptionalInputProps = {
        label: '',
        className: '',
        nameIndex: '',
        valueIndex: '',
        filterPlaceHolder: '',
        panelStyle: {},
    };

    public constructor(props: IMultiSelectInputProps<T>) {
        super(props);

        this.state = {
            filteredList: props.list,
        };

        this.renderFilteredList = this.renderFilteredList.bind(this);
    }

    // Helpers

    protected getValue = (item: any) => {
        return this.props.valueIndex ? get(this.props.valueIndex)(item) : item;
    };

    protected getName = (item: any) => {
        return this.props.nameIndex ? get(this.props.nameIndex)(item) : item;
    };

    protected getLabelValue = () => {
        return this.props.value.length === 1
            ? this.getName(this.props.value[0])
            : this.props.value.length.toString();
    };

    protected filterList = debounce(DebounceWait)((value: string) => {
        const filteredInputValue = value.trim().toLowerCase();
        const filteredList =
            filteredInputValue === ''
                ? this.props.list
                : this.props.list.filter(item =>
                      this.getName(item)
                          .toLowerCase()
                          .includes(filteredInputValue),
                  );

        this.setState({
            filteredList,
        });
    });

    protected createListItem(item: any) {
        const value = this.getValue(item);
        const name = this.getName(item);
        const checked = this.props.value.some(
            row => this.getValue(row) === value,
        );

        return (
            <div key={value}>
                <Checkbox
                    name={value}
                    title={name}
                    value={checked}
                    onChange={this.onChangeCheckbox}
                />
            </div>
        );
    }

    protected renderFilteredList() {
        return this.state.filteredList.map((i: T) =>
            this.createListItem.call(this, i),
        );
    }

    // Event Handlers

    protected onChangeFilter = (event: any) => {
        const value = event.target.value;
        this.filterList(value);
    };

    protected onRequireClose = () => {
        this.filterList('');
        this.props.onRequireClose && this.props.onRequireClose();
    };

    protected onChangeCheckbox = (params: ITogglerChangeParams) => {
        let itemValue = params.name;
        let value = this.props.value.slice(0);
        if (params.value) {
            value.push(this.state.filteredList.find(
                (row: T) => this.getValue(row) === itemValue,
            ) as T);
        } else {
            value = value.filter(item => this.getValue(item) !== itemValue);
        }

        this.props.onChange({
            value,
            name: this.props.name,
            valueString: params.name,
        });
    };

    protected onClickApply = () => {
        this.props.onRequireClose && this.props.onRequireClose();
    };

    protected onClickClear = () => {
        this.props.onChange({
            value: [],
            name: this.props.name,
            valueString: '',
        });
    };

    public render() {
        const { className } = this.props;

        const panelStyle =
            this.props.panelStyle || MultiSelect.defaultProps.panelStyle;

        return (
            <div className="multiselect__container">
                <DropdownInput
                    className={className}
                    valueString={`${this.props.label}: ${this.getLabelValue()}`}
                    onRequireClose={this.onRequireClose}
                    onButtonClick={this.props.onButtonClick}
                    hasBalloon
                    isExpanded={this.props.isExpanded}
                >
                    <div style={panelStyle}>
                        <div className="multiselect__input-container">
                            <input
                                className="multiselect__input"
                                name="filter"
                                onChange={this.onChangeFilter}
                                placeholder={this.props.filterPlaceHolder}
                            />
                        </div>

                        <div className="multiselect__list-container">
                            {this.renderFilteredList()}
                        </div>

                        <div className="multiselect__apply-button-container">
                            <Button
                                color="violet"
                                className="multiselect__apply-button"
                                onClick={this.onClickApply}
                            >
                                APPLY
                            </Button>
                        </div>
                    </div>
                </DropdownInput>
                {this.props.clearBtn ? (
                    <button
                        className="multiselect__clear-button"
                        onClick={this.onClickClear}
                    >
                        <Icon i="Close" />
                    </button>
                ) : null}
            </div>
        );
    }
}

export default MultiSelect;

export * from './types';
