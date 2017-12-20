import * as React from 'react';
import * as cn from 'classnames';
const ICON_PIXEL_SIZE = 8;

export interface IProps {
    address: string;
    className?: string;
    width?: number;
}

const ETHER_ADDRESS = ['0x', '0x0', '0', '0x0000000000000000000000000000000000000000'];

export class IdentIcon extends React.Component<IProps, any> {
    private icons: any = {
        '0x': 'icon-ether.svg',
        '0x45ccf7cfb6de9b86c86e2d6fb079b01b5c90ee2c': 'icon-sonm.svg',
    };

    public static defaultProps: Partial<IProps> = {
        width: 75,
    };

    public componentWillMount() {
        this.updateDataUrl(null, this.props);
    }

    public componentWillReceiveProps(next: IProps) {
        this.updateDataUrl(this.props, next);
    }

    private updateDataUrl(props: IProps | null, nextProps: IProps) {
        const address = nextProps.address;

        if (props === null || props.address !== address || props.width !== nextProps.width) {
            this.draw(address);
        }
    }

    protected checkAddress(address: string): boolean {
        return (address.length === 40 && !address.startsWith('0x'))
            || (address.length === 42 && address.startsWith('0x'))
            || (ETHER_ADDRESS.indexOf(address) !== -1);
    }

    private canvas: HTMLCanvasElement | null = null;

    private draw(address: string): void {
        if (this.canvas === null) { return; }

        const canvasSize = this.getCanvasSize();

        if (!this.checkAddress(address)) {
            drawGray(this.canvas);
            return;
        }

        if (this.icons[address]) {
            drawCustomIcon(this.canvas, this.icons[address]);
            return;
        }

        if (ETHER_ADDRESS.indexOf(address) !== -1) {
            drawEthereumIcon(this.canvas);
            return;
        }

        function drawCustomIcon(canvas: HTMLCanvasElement, icon: string) {
            const context = canvas.getContext('2d');

            if (context !== null) {
                context.fillStyle = '#d3d3d3';
                context.fillRect(0, 0, canvasSize, canvasSize);

                const svg = require(`svg-url-loader?encoding=base64!./${icon}`);

                const img = new Image();
                img.onload = function() {
                    context.drawImage(img, 0, 0);
                };
                img.src = svg;
            }
        }

        function drawGray(canvas: HTMLCanvasElement) {
            const context = canvas.getContext('2d');

            if (context !== null) {
                context.fillStyle = '#d3d3d3';
                context.fillRect(0, 0, canvasSize, canvasSize);
            }
        }

        function drawEthereumIcon(canvas: HTMLCanvasElement) {
            const context = canvas.getContext('2d');

            if (context !== null) {
                context.fillStyle = '#d3d3d3';
                context.fillRect(0, 0, canvasSize, canvasSize);
            }
        }

        const seed = (address.length === 42 ? address : '0x' + address).toLowerCase();

        // The random number is a js implementation of the Xorshift PRNG
        const randseed: number[] = new Array(4); // Xorshift: [x, y, z, w] 32 bit values

        function seedrand(seedStr: string) {
            for (let i = 0; i < randseed.length; i++) {
                randseed[i] = 0;
            }
            for (let i = 0; i < seedStr.length; i++) {
                randseed[i % 4] = ((randseed[i % 4] << 5) - randseed[i % 4]) + seed.charCodeAt(i);
            }
        }

        function rand() {
            // based on Java's String.hashCode(), expanded to 4 32bit values
            const t = randseed[0] ^ (randseed[0] << 11);

            randseed[0] = randseed[1];
            randseed[1] = randseed[2];
            randseed[2] = randseed[3];
            randseed[3] = (randseed[3] ^ (randseed[3] >> 19) ^ t ^ (t >> 8));

            return (randseed[3] >>> 0) / ((1 << 31) >>> 0);
        }

        function createColor() {
            // saturation is the whole color spectrum
            const h = Math.floor(rand() * 360);
            // saturation goes from 40 to 100, it avoids greyish colors
            const s = ((rand() * 60) + 40) + '%';
            // lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
            const l = ((rand() + rand() + rand() + rand()) * 25) + '%';

            const color = 'hsl(' + h + ',' + s + ',' + l + ')';
            return color;
        }

        function createImageData(size: number) {
            const width = size; // Only support square icons for now
            const height = size;

            const dataWidth = Math.ceil(width / 2);
            const mirrorWidth = width - dataWidth;

            const data = [];
            for (let y = 0; y < height; y++) {
                let row = [];
                for (let x = 0; x < dataWidth; x++) {
                    // this makes foreground and background color to have a 43% (1/2.3) probability
                    // spot color has 13% chance
                    row[x] = Math.floor(rand() * 2.3);
                }
                const r = row.slice(0, mirrorWidth);
                r.reverse();
                row = row.concat(r);

                for (let i = 0; i < row.length; i++) {
                    data.push(row[i]);
                }
            }

            return data;
        }

        function buildOpts(seed: string) {
            seedrand(seed);

            return {
                size: ICON_PIXEL_SIZE,
                scale: canvasSize / ICON_PIXEL_SIZE,
                color: createColor(),
                bgcolor: createColor(),
                spotcolor: createColor(),
            };
        }

        function renderIcon(opts: any, canvas: HTMLCanvasElement) {
            const imageData = createImageData(opts.size);
            const width = Math.sqrt(imageData.length);

            const cc = canvas.getContext('2d');
            if (cc !== null) {
                cc.fillStyle = opts.bgcolor;
                cc.fillRect(0, 0, canvasSize, canvasSize);
                cc.fillStyle = opts.color;

                for (let i = 0; i < imageData.length; i++) {

                    // if data is 0, leave the background
                    if (imageData[i]) {
                        const row = Math.floor(i / width);
                        const col = i % width;

                        // if data is 2, choose spot color, if 1 choose foreground
                        cc.fillStyle = (imageData[i] === 1) ? opts.color : opts.spotcolor;

                        cc.fillRect(col * opts.scale, row * opts.scale, opts.scale, opts.scale);
                    }
                }
            }
            return canvas;
        }

        const opts = buildOpts(seed);

        renderIcon(opts, this.canvas);
    }

    private processCanvasRef = (canvas: HTMLCanvasElement | null) => {
        if (canvas !== this.canvas) {
            this.canvas = canvas;
            this.draw(this.props.address);
        }
    }

    public shouldComponentUpdate() {
        return false;
    }

    private getCanvasSize(): number {
        const x = this.props.width as number / ICON_PIXEL_SIZE;

        return Math.ceil(x) * ICON_PIXEL_SIZE;
    }

    public render() {
        const {
            className,
            width,
        } = this.props;
        const canvasSize = this.getCanvasSize();

        const correction = `-${(canvasSize - (width as number)) / 2}px`;

        return (
            <div
                className={cn(className, 'sonm-ident-icon__wrapper')}
                style={{ width: width as number, height: width as number }}
            >
                <canvas
                    className="sonm-ident-icon__canvas"
                    ref={this.processCanvasRef}
                    width={canvasSize}
                    height={canvasSize}
                    style={{ width: canvasSize, height: canvasSize, marginTop: correction, marginLeft: correction }}
                />
            </div>
        );
    }
}

export default IdentIcon;
