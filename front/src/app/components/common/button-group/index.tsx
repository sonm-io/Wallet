import * as React from 'react';
import get from 'lodash/fp/get';

import * as cn from 'classnames';

const toString = (x: any) => String(x);

export interface IButtonGroupProps<TValue> {
  value?: TValue;
  valueList: TValue[];
  displayValuePath?: string;
  keyValuePath?: string;
  onChange?: (value: TValue) => void;
  className?: string;
  name?: string;
}

let uniqIdx = 0;
function nextUniqId() {
    return 'btnGrp' + uniqIdx++;
}

export class ButtonGroup<TValue> extends React.Component<IButtonGroupProps<TValue>, any> {
    private buttonGroupName: string;

    constructor(props: IButtonGroupProps<TValue>) {
        super(props);

        this.buttonGroupName = props.name === undefined
            ? nextUniqId()
            : props.name;
    }

    protected handleChange = (event: any) => {
        if (event.target.checked === false) {
            return;
        }

        if (this.props.onChange) {
            const key = event.target.value;
            const value = this.props.valueList.find(x => this.getKeyValue(x) === key);

            this.props.onChange(value as TValue);
        }
    }

    private getDisplayValue(raw: any) {
        const getter = this.props.displayValuePath !== undefined
            ? get(this.props.displayValuePath)
            : toString;

        return getter(raw);
    }

    private getKeyValue(raw: any) {
        const getter = this.props.keyValuePath !== undefined
            ? get(this.props.keyValuePath)
            : toString;

        return getter(raw);
    }

    public render() {
        const {
            valueList,
            value,
            className,
        } = this.props;

        return (
          <div className={cn('sonm-button-group', className)}>
              {valueList.map(x => {
                  const key = this.getKeyValue(x);

                  return (
                      <label
                          key={key}
                          className="sonm-button-group__item"
                      >
                          <input
                              className="sonm-button-group__radio"
                              type="radio"
                              value={key}
                              name={this.buttonGroupName}
                              checked={key === value}
                              onChange={this.handleChange}
                          />
                          <span className="sonm-button-group__button">
                            {this.getDisplayValue(x)}
                          </span>
                      </label>
                  );
              })}

          </div>
        );
    }
}

export default ButtonGroup;
