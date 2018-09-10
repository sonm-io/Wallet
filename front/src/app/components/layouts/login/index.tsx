import * as React from 'react';
import * as cn from 'classnames';
import { Button } from 'app/components/common/button';
import { Api, NetworkEnum } from 'app/api';
import { IValidation } from 'ipc/types';
import { BlackSelect } from 'app/components/common/black-select';
import { Dialog } from 'app/components/common/dialog';
import { LoadMask } from 'app/components/common/load-mask';
import { setFocus } from 'app/components/common/utils/setFocus';
import { IFileOpenResult, Upload } from 'app/components/common/upload';
import { Icon } from 'app/components/common/icon';
import { Input } from 'app/components/common/input';
import {
    Form,
    FormButtons,
    FormHeader,
    FormRow,
    FormField,
} from 'app/components/common/form';
import shortString from 'app/utils/short-string';
import { Disclaimer } from './sub/disclaimer/index';
import { localizator } from 'app/localization';
import { IChangeParams } from 'app/components/common/types';
import { RootStore } from 'app/stores';
import { withRootStore, IHasRootStore } from '../layout';
import { Wallet } from 'app/entities/wallet';

interface IProps extends IHasRootStore {
    className?: string;
    onLogin: (wallet: Wallet) => void;
}

class BlackWalletSelect extends BlackSelect<Wallet> {}

enum EnumAction {
    selectWallet,
    createNew,
    enterPassword,
    importWallet,
    disclaimer,
}

interface IRefs {
    loginBtn: Button | null;
}

// NetworkEnum.live,
const networkSelectList = [NetworkEnum.live, NetworkEnum.rinkeby].map(x =>
    x.toString(),
);
const defaultNetwork = NetworkEnum.live;

const emptyValidation: IValidation = {};

interface IState {
    currentAction: EnumAction;
    password: string;
    newName: string;
    newPassword: string;
    newPasswordConfirmation: string;
    encodedWallet: string;
    encodedWalletFileName: string;
    listOfWallets: Wallet[];
    name: string;
    pending: boolean;
    error: string;
    network: NetworkEnum;
    serverValidation: IValidation;
}

const emptyForm: Pick<IState, any> = {
    password: '',
    newName: '',
    newPassword: '',
    newPasswordConfirmation: '',
    encodedWallet: '',
    encodedWalletFileName: '',
    network: defaultNetwork,
};

class LoginLayout extends React.Component<IProps, IState> {
    // ToDo make stateless

    protected get rootStore() {
        return this.props.rootStore as RootStore;
    }

    protected nodes: IRefs = {
        loginBtn: null,
    };

    public state = {
        currentAction: EnumAction.disclaimer,
        password: '',
        newName: '',
        newPassword: '',
        newPasswordConfirmation: '',
        encodedWallet: '',
        encodedWalletFileName: '',
        listOfWallets: [] as Wallet[],
        name: '',
        pending: false,
        error: '',
        network: defaultNetwork,
        serverValidation: emptyValidation,
    };

    protected noTimer = false;

    public componentDidMount() {
        const hideDisclaimer = true;
        this.noTimer = hideDisclaimer;
        this.setState({
            currentAction: hideDisclaimer
                ? EnumAction.selectWallet
                : EnumAction.disclaimer,
        });

        this.getWalletList();
    }

    protected getWalletList = async () => {
        this.setState({ pending: true });

        const { data: walletlList } = await Api.getWalletList();

        if (walletlList === undefined) {
            return;
        }

        const listOfWallets = walletlList.map(w => new Wallet(w));

        let name = this.state.name;
        const savedName = window.localStorage.getItem('sonm-last-used-wallet');

        if (savedName && listOfWallets.some(x => x.name === savedName)) {
            name = savedName;
        } else if (listOfWallets.length > 0) {
            name = listOfWallets[0].name;
        }

        const update: Pick<IState, 'pending' | 'listOfWallets' | 'name'> = {
            pending: false,
            listOfWallets,
            name,
        };

        this.setState(update, () => {
            if (this.state.currentAction !== EnumAction.disclaimer) {
                this.nextAction();
            }
        });

        this.fastLogin();
    };

    protected nextAction() {
        let currentAction = EnumAction.selectWallet;
        let name = this.state.name;

        if (this.state.listOfWallets.length === 1) {
            name = this.state.listOfWallets[0].name;
            currentAction = EnumAction.enterPassword;
        }

        if (this.state.listOfWallets.length === 0) {
            currentAction = EnumAction.createNew;
        }

        this.setState({ name, currentAction });
    }

    protected async fastLogin() {
        if (window.localStorage.getItem('sonm-4ever')) {
            const { data: success } = await Api.unlockWallet('2', '2');
            if (success) {
                const wallet = this.findWalletByName('2');
                this.props.onLogin(wallet);
            }
        }
    }

    protected openDialog(
        currentAction: EnumAction,
        event: React.MouseEvent<HTMLAnchorElement>,
    ) {
        event.preventDefault();

        const update: Pick<IState, any> = { ...emptyForm };

        update.currentAction = currentAction;

        this.setState(update);
    }

    protected handleStartLogin = this.openDialog.bind(
        this,
        EnumAction.enterPassword,
    );
    protected handleStartCreateNew = this.openDialog.bind(
        this,
        EnumAction.createNew,
    );
    protected handleStartImport = this.openDialog.bind(
        this,
        EnumAction.importWallet,
    );

    protected findWalletByName(name: string) {
        const wallet = this.state.listOfWallets.find(x => x.name === name);

        if (wallet === undefined) {
            throw new Error('wallet_not_found');
        }

        return wallet;
    }

    protected handleSubmitLogin = async (event: any) => {
        event.preventDefault();
        this.setState({ pending: true });
        try {
            const { validation, data: success } = await Api.unlockWallet(
                this.state.password,
                this.state.name,
            );

            if (validation) {
                this.setState({
                    serverValidation: localizator.localizeValidationMessages(
                        validation,
                    ),
                });
            }

            const wallet = this.findWalletByName(this.state.name);

            if (success) {
                this.props.onLogin(wallet);
                return;
            }
        } catch (e) {
            this.setState({ error: String(e) });
        }

        this.setState({ pending: false });
    };

    protected handleSubmitCreate = async (event: any) => {
        event.preventDefault();

        const valid = this.validateNewName() && this.validateNewPassword();

        if (valid) {
            this.setState({
                pending: true,
            });

            try {
                const {
                    validation,
                    data: walletListItem,
                } = await Api.createWallet(
                    this.state.newPassword,
                    this.state.newName,
                    this.state.network.toString(),
                );

                if (validation) {
                    this.setState({
                        pending: false,
                        serverValidation: localizator.localizeValidationMessages(
                            validation,
                        ),
                    });
                } else if (walletListItem) {
                    window.localStorage.setItem(
                        'sonm-last-used-wallet',
                        this.state.newName,
                    );

                    this.props.onLogin(new Wallet(walletListItem));
                    return;
                }
            } catch (e) {
                this.setState({
                    pending: false,
                    error: String(e),
                });
            }
        }
    };

    protected handleSubmitImport = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        const valid = this.validateNewName();

        if (valid) {
            this.setState({
                pending: true,
            });

            const { password, newName, encodedWallet } = this.state;

            const { data: walletInfo, validation } = await Api.importWallet(
                password,
                newName,
                encodedWallet,
            );

            if (validation) {
                this.setState({
                    serverValidation: localizator.localizeValidationMessages(
                        validation,
                    ),
                    pending: false,
                });
            } else if (walletInfo) {
                this.props.onLogin(new Wallet(walletInfo));
                return;
            }
        }
    };

    protected validateNewName() {
        let valid = true;

        if (this.state.newName.length < 1 || this.state.newName.length > 20) {
            this.setState({
                serverValidation: {
                    newName: localizator.getMessageText('wallet_name_length'),
                },
            });
            valid = false;
        } else {
            const foundByName = this.state.listOfWallets.find(
                x => x.name === this.state.newName,
            );
            if (foundByName) {
                this.setState({
                    serverValidation: {
                        newName: localizator.getMessageText(
                            'wallet_allready_exists',
                        ),
                    },
                });
                valid = false;
            }
        }

        return valid;
    }

    protected validateNewPassword() {
        let valid = true;

        if (this.state.newPassword.length < 1) {
            this.setState({
                serverValidation: {
                    newPassword: localizator.getMessageText(
                        'password_required',
                    ),
                },
            });
            valid = false;
        }

        if (this.state.newPassword !== this.state.newPasswordConfirmation) {
            this.setState({
                serverValidation: {
                    newPasswordConfirmation: localizator.getMessageText(
                        'password_not_match',
                    ),
                },
            });
            valid = false;
        }

        return valid;
    }

    protected handleChangeInput = (params: IChangeParams<string>) => {
        const name = params.name;
        this.setState({
            serverValidation: {
                ...(this.state.serverValidation as any),
                [name]: '',
            },
            [name]: params.value,
        } as any);
    };

    protected handleChangeSelect = (params: any) => {
        this.setState({
            [params.name]: params.value.toLowerCase(),
        });
    };

    protected handleChangeWallet = (params: any) => {
        this.setState(
            { name: params.value },
            () => this.nodes.loginBtn && this.nodes.loginBtn.focus(),
        );

        window.localStorage.setItem('sonm-last-used-wallet', params.value);
    };

    protected handleReturn = () => {
        this.setState({
            currentAction: EnumAction.selectWallet,
            serverValidation: {},
        });
    };

    protected saveLoginBtnRef = (ref: Button | null) => {
        if (!ref) {
            return;
        }

        if (!this.nodes.loginBtn) {
            ref.focus();
        }

        this.nodes.loginBtn = ref;
    };

    protected renderWalletOption(record: Wallet) {
        return (
            <span
                className={`sonm-login__wallet-option sonm-login__wallet-option--${
                    record.chainId
                }`}
            >
                {record.name}
            </span>
        );
    }

    protected renderSelect() {
        return (
            <form
                className="sonm-login__wallet-form"
                onSubmit={this.handleStartLogin}
            >
                <BlackWalletSelect
                    render={this.renderWalletOption}
                    className="sonm-login__wallet-select"
                    name="name"
                    onChange={this.handleChangeWallet}
                    value={this.state.name}
                    keyIndex="name"
                    options={this.state.listOfWallets}
                />
                <Button
                    height={50}
                    square
                    className="sonm-login__wallet-login"
                    onClick={this.handleStartLogin}
                    type="submit"
                    ref={this.saveLoginBtnRef}
                    disabled={this.state.listOfWallets.length === 0}
                >
                    {localizator.getMessageText('login')}
                </Button>
            </form>
        );
    }

    protected handleOpenTextFile = (params: IFileOpenResult) => {
        if (params.error) {
            this.setState({
                serverValidation: { encodedWallet: params.error },
                encodedWallet: '',
            });
        } else {
            this.setState({
                serverValidation: {},
                encodedWallet: params.text,
                encodedWalletFileName: params.fileName,
            });
        }
    };

    protected renderImportWalletPopup() {
        if (this.state.currentAction !== EnumAction.importWallet) {
            return null;
        }

        return (
            <Dialog onClickCross={this.handleReturn} color="dark">
                <Form
                    onSubmit={this.handleSubmitImport}
                    className="sonm-login__form"
                    theme="dark"
                >
                    <FormHeader>Import wallet</FormHeader>
                    <FormRow>
                        <FormField
                            fullWidth
                            label="Wallet file"
                            error={this.state.serverValidation.encodedWallet}
                            success={
                                this.state.encodedWalletFileName
                                    ? shortString(
                                          this.state.encodedWalletFileName,
                                          20,
                                      )
                                    : ''
                            }
                        >
                            <Upload
                                onOpenTextFile={this.handleOpenTextFile}
                                buttonProps={{
                                    square: true,
                                    height: 40,
                                    transparent: true,
                                }}
                            >
                                Select file
                            </Upload>
                        </FormField>
                    </FormRow>
                    <FormRow>
                        <FormField
                            fullWidth
                            label="Wallet name"
                            error={this.state.serverValidation.newName}
                        >
                            <Input
                                className="sonm-login__input"
                                name="newName"
                                onChange={this.handleChangeInput}
                            />
                        </FormField>
                    </FormRow>
                    <FormRow>
                        <FormField
                            fullWidth
                            label="Password for file"
                            error={this.state.serverValidation.password}
                        >
                            <Input
                                type="password"
                                className="sonm-login__input"
                                name="password"
                                onChange={this.handleChangeInput}
                            />
                        </FormField>
                    </FormRow>
                    <FormButtons>
                        <Button className="sonm-login__import" type="submit">
                            Import
                        </Button>
                    </FormButtons>
                </Form>
            </Dialog>
        );
    }

    protected renderLoginPopup() {
        if (this.state.currentAction !== EnumAction.enterPassword) {
            return null;
        }

        return (
            <Dialog onClickCross={this.handleReturn} color="dark">
                <Form
                    className="sonm-login__popup-content"
                    onSubmit={this.handleSubmitLogin}
                    theme="dark"
                >
                    <h3 className="sonm-login__popup-header">
                        {localizator.getMessageText('enter_password')}
                    </h3>
                    <div className="sonm-login__label">
                        <span className="sonm-login__label-text">
                            {localizator.getMessageText('password')}
                        </span>
                        <span className="sonm-login__label-error">
                            {this.state.serverValidation.password}
                        </span>
                        <Input
                            ref={setFocus}
                            type="password"
                            className="sonm-login__input"
                            name="password"
                            onChange={this.handleChangeInput}
                        />
                    </div>
                    <Button className="sonm-login__create" type="submit">
                        {localizator.getMessageText('login')}
                    </Button>
                </Form>
            </Dialog>
        );
    }

    protected renderCreateWalletPopup() {
        if (this.state.currentAction !== EnumAction.createNew) {
            return null;
        }

        return (
            <Dialog onClickCross={this.handleReturn} color="dark">
                <Form
                    className="sonm-login__popup-content"
                    onSubmit={this.handleSubmitCreate}
                    theme="dark"
                >
                    <h3 className="sonm-login__popup-header">
                        {localizator.getMessageText('new_wallet')}
                    </h3>
                    <div className="sonm-login__label">
                        <span className="sonm-login__label-text">
                            {localizator.getMessageText('wallet_name')}
                        </span>
                        <span className="sonm-login__label-error">
                            {this.state.serverValidation.newName}
                        </span>
                        <Input
                            ref={setFocus}
                            type="text"
                            className="sonm-login__input"
                            name="newName"
                            onChange={this.handleChangeInput}
                        />
                    </div>
                    <div className="sonm-login__label">
                        <span className="sonm-login__label-text">
                            {localizator.getMessageText('password')}
                        </span>
                        <span className="sonm-login__label-error">
                            {this.state.serverValidation.newPassword}
                        </span>
                        <Input
                            type="password"
                            className="sonm-login__input"
                            name="newPassword"
                            onChange={this.handleChangeInput}
                        />
                    </div>
                    <div className="sonm-login__label">
                        <span className="sonm-login__label-text">
                            {localizator.getMessageText('confirm_password')}
                        </span>
                        <span className="sonm-login__label-error">
                            {
                                this.state.serverValidation
                                    .newPasswordConfirmation
                            }
                        </span>
                        <Input
                            type="password"
                            className="sonm-login__input"
                            name="newPasswordConfirmation"
                            onChange={this.handleChangeInput}
                        />
                    </div>
                    <div className="sonm-login__label">
                        <span className="sonm-login__label-text">
                            {localizator.getMessageText('ethereum_network')}
                        </span>
                        <BlackSelect
                            value={String(this.state.network)}
                            name="network"
                            className="sonm-login__network-type"
                            onChange={this.handleChangeSelect}
                            options={networkSelectList}
                        />
                    </div>
                    <Button className="sonm-login__create" type="submit">
                        {localizator.getMessageText('create_wallet')}
                    </Button>
                </Form>
            </Dialog>
        );
    }

    protected handleCloseDisclaimer = () => {
        this.noTimer = true;
        this.nextAction();
    };

    protected handleCloseDisclaimerForever = () => {
        window.localStorage.setItem('sonm-hide-disclaimer', '1');
        this.handleCloseDisclaimer();
    };

    protected renderDisclaimer() {
        if (this.state.currentAction !== EnumAction.disclaimer) {
            return null;
        }

        return (
            <Disclaimer
                onCloseForever={this.handleCloseDisclaimerForever}
                onClose={this.handleCloseDisclaimer}
                noTimer={this.noTimer}
            />
        );
    }

    protected handleInfo = (event: any) => {
        event.preventDefault();

        this.setState({ currentAction: EnumAction.disclaimer });
    };

    public render() {
        const { className } = this.props;
        const l = localizator.getMessageText;

        return (
            <LoadMask visible={this.state.pending} className="sonm-login__spin">
                <div className={cn('sonm-login', className)}>
                    <div className="sonm-login__errors">{this.state.error}</div>
                    <div
                        className={cn('sonm-login__center', {
                            'sonm-login__center--blurred':
                                this.state.currentAction !==
                                EnumAction.selectWallet,
                        })}
                    >
                        <div className="sonm-login__logo" />
                        {this.renderSelect()}
                        <div className="sonm-login__actions">
                            <a
                                href="#create"
                                className="sonm-login__action-button sonm-login__create-button"
                                onClick={this.handleStartCreateNew}
                            >
                                {l('create_wallet')}
                            </a>
                            <a
                                href="#import"
                                className="sonm-login__action-button sonm-login__import-button"
                                onClick={this.handleStartImport}
                            >
                                <Icon i="Export" />
                                {l('import_wallet')}
                            </a>
                            <Icon
                                tag="a"
                                onClick={this.handleInfo}
                                href="#info"
                                className="sonm-login__action-button sonm-login__info-button"
                                i="Info"
                            />
                        </div>
                    </div>
                    {this.renderCreateWalletPopup()}
                    {this.renderLoginPopup()}
                    {this.renderImportWalletPopup()}
                    {this.renderDisclaimer()}
                </div>
                <div className="sonm-login__version">Version: {VERSION}</div>
            </LoadMask>
        );
    }
}

export const Login = withRootStore(LoginLayout);
