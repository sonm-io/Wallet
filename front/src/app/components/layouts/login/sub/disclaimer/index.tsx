import * as React from 'react';
import { Dialog } from 'app/components/common/dialog';
import { Button } from 'app/components/common/button';

interface IProps {
    onClose: () => void;
    onCloseForever: () => void;
    noTimer?: boolean;
}

export class Disclaimer extends React.PureComponent<IProps, any> {
    public static TIMER_TIME_SEC = 10;

    protected startTime: number;
    protected timer: any;

    public state = {
        dontShowButtonText: '',
        locked: true,
    };

    protected checkTimer = () => {
        const now = Date.now();
        const end = this.startTime + 1000 * Disclaimer.TIMER_TIME_SEC;
        let dontShowButtonText = "I understand, don't show again";

        if (end > now) {
            dontShowButtonText = String(Math.ceil((end - now) / 1000));

            if (dontShowButtonText !== this.state.dontShowButtonText) {
                this.setState({ dontShowButtonText });
            }

            this.timer = setTimeout(this.checkTimer, 50);
        } else {
            this.setState({ dontShowButtonText, locked: false });
        }
    };

    public componentWillUnmount() {
        window.clearTimeout(this.timer);
    }

    public componentDidMount() {
        this.startTime = Date.now();
        if (!this.props.noTimer) {
            this.checkTimer();
        }
    }

    public render() {
        return (
            <Dialog className="sonm-disclaimer" color="dark">
                <h1>Welcome to SONM Wallet</h1>
                <p className="sonm-disclaimer__marker">
                    Before you start, please read carefully and understand this
                    information for your safety. Your funds may be stolen if you
                    do not heed these warnings.
                </p>
                <p>
                    The main purpose of the SONM Wallet is the operational work
                    with the SONM system.
                </p>
                <p>
                    For your convenience the Wallet is made as a utility tool
                    with a wide range of functions that include aсcount
                    management, sending Ether and SNM tokens.
                </p>
                <p>
                    We take reasonable security measures about the safety of
                    your Keystore files and Private Keys, but we must explicitly
                    note that independent security audit was not performed yet.
                    Besides, we (like many other projects) use external
                    libraries and dependencies that may contain vulnerabilities,
                    that may lead to an information leak.
                </p>
                <p className="sonm-disclaimer__border">
                    <b>Only cold storage! </b>
                    <br />
                    Cryptocurrencies are a fast evolving technology, many
                    different wallets were hacked at different times. The only
                    way to keep your cryptocurrency funds safe is the cold
                    storage. Safety requires a solid understanding of what is
                    happening, ideally, you should understand why the cold
                    storage is the only safe option. This is a subject of
                    personal research.
                </p>
                <ul>
                    <h2>Restrictions</h2>
                    <li>
                        <b className="sonm-disclaimer__pink">
                            WE STRONGLY RECOMMEND
                        </b>{' '}
                        you to use the SONM Wallet only for practical work with
                        SONM system, for practical exercises with Ether and SONM
                        tokens.
                    </li>
                    <li>
                        <b className="sonm-disclaimer__pink">DO NOT</b> use the
                        SONM Wallet to store significant amounts of Ether and
                        tokens. Any working online wallets can potentially be
                        hacked.
                    </li>
                    <li>
                        The way to safely work with Ether and tokens is the
                        subject of a separate personal study by every citizen
                        and is{' '}
                        <b className="sonm-disclaimer__pink">NOT TRIVIAL. </b>
                        It requires specialized knowledge and research.
                    </li>
                </ul>
                <p>
                    Thank you for reading this text. SONM Team always cares
                    about your well-being!
                </p>
                <div className="sonm-disclaimer__buttons">
                    {this.props.noTimer ? null : (
                        <Button
                            disabled={this.state.locked}
                            transparent
                            onClick={this.props.onCloseForever}
                            className="sonm-disclaimer__timer"
                        >
                            {this.state.dontShowButtonText}
                        </Button>
                    )}
                    <Button autoFocus onClick={this.props.onClose}>
                        I UNDERSTAND
                    </Button>
                </div>
            </Dialog>
        );
    }
}

export default Disclaimer;
