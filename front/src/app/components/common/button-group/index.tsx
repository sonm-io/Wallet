import * as React from 'react';
import { Group, Button } from 'antd/lib/radio';
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
}

export class ButtonGroup<TValue> extends React.Component<IButtonGroupProps<TValue>, any> {
    public handleChange = (e: any) => {
        const {
            onChange,
            keyValuePath,
            valueList,
        } = this.props;

        if  (e.target.checked) {
            const key = e.target.value;
            const getKeyValue = keyValuePath !== undefined
                ? get(keyValuePath)
                : toString;
            const value = valueList.find(x => String(getKeyValue(x)) === key);

            if (onChange) {
                onChange(value as TValue);
            }
        }
    }

    public render() {
        const {
            valueList,
            value,
            className,
            displayValuePath,
            keyValuePath,
        } = this.props;

        const getDisplayValue = displayValuePath !== undefined
            ? get(displayValuePath)
            : toString;

        const getKeyValue = keyValuePath !== undefined
            ? get(keyValuePath)
            : toString;

        return (
          <Group
              className={cn('sonm-button-group', className)}
              value={value}
              onChange={this.handleChange}
          >
              {valueList.map(x => {
                  const key = getKeyValue(x);

                  return (
                      <Button
                          key={key}
                          className="sonm-button-group__item"
                          value={key}
                      >
                          {getDisplayValue(x)}
                      </Button>
                  );
              })}

          </Group>
        );
    }
}

export default ButtonGroup;
