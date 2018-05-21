import * as React from 'react';
import * as cn from 'classnames';
import * as debounce from 'lodash/fp/debounce';

export interface ITextInputProps {
    value?: string;
    type?: 'text' | 'password';
    name?: string;
    autoFocus?: boolean;
    allowAutoComplete?: boolean;
    prefix?: string;
    onChangeDeprecated?: (event: any) => void;
    onChange?: (params: ITextChangeParams) => void;
    debounceInterval?: number;
    className?: string;
    readOnly?: boolean;
    placeholder?: string;
}

export interface ITextChangeParams {
    name: string;
    value: string;
}

interface IFocusable {
    focus: () => void;
}

interface IState {
    value: string;
    debounceInterval: number;
    onChangeProp: (params: ITextChangeParams) => void;
    handleChange: (params: ITextChangeParams) => void;
}

const emptyFn: (...a: any[]) => void = Function.prototype as any;

export class Input extends React.Component<ITextInputProps, IState>
    implements IFocusable {
    protected inputNode: IFocusable | null = null;

    public state = {
        value: '',
        debounceInterval: 0,
        onChangeProp: emptyFn,
        handleChange: emptyFn,
    };

    public static defaultValues = {
        value: '',
        type: 'text',
    };

    public static getDerivedStateFromProps(
        nextProps: ITextInputProps,
        prevState: IState,
    ) {
        const nextState: Partial<IState> = {};

        if (nextProps.value !== prevState.value) {
            nextState.value = nextProps.value;
        }

        if (
            nextProps.onChange &&
            (nextProps.debounceInterval !== prevState.debounceInterval ||
                nextProps.onChange !== prevState.onChangeProp)
        ) {
            nextState.debounceInterval = nextProps.debounceInterval;
            nextState.onChangeProp = nextProps.onChange;
            nextState.handleChange = nextProps.debounceInterval
                ? debounce(nextProps.debounceInterval)(nextProps.onChange)
                : nextProps.onChange;
        }

        return nextState;
    }

    protected saveRef = (ref: HTMLInputElement) => {
        if (this.props.autoFocus && !this.inputNode && ref !== null) {
            ref.focus();
        }
        this.inputNode = ref;
    };

    protected handleChange = (event: any) => {
        const value = event.target.value;

        if (this.props.onChangeDeprecated) {
            this.props.onChangeDeprecated(event);
        }

        this.state.handleChange({
            name: this.props.name,
            value,
        });

        this.setState({
            value,
        });
    };

    public render() {
        const {
            allowAutoComplete,
            prefix,
            className,
            name,
            value,
            placeholder,
        } = this.props;

        return (
            <div
                className={cn('sonm-input', className, {
                    'sonm-input--readonly': this.props.readOnly,
                })}
            >
                {prefix ? (
                    <span className="sonm-input__prefix">{prefix}</span>
                ) : null}
                <input
                    className="sonm-input__input"
                    ref={this.saveRef}
                    autoComplete={allowAutoComplete ? 'on' : 'off'}
                    name={name}
                    value={value}
                    onChange={this.handleChange}
                    placeholder={placeholder}
                />
                <div className="sonm-input__underline" />
            </div>
        );
    }

    public focus() {
        if (this.inputNode) {
            this.inputNode.focus();
        }
    }
}
