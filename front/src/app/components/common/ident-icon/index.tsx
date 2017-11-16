import * as React from 'react';
import * as cn from 'classnames';
// import { render } from 'ethereum-blockies';
const ICON_PIXEL_SIZE = 8;

export interface IProps {
    address: string;
    className: string;
    width?: number;
}

export class IdentIcon extends React.Component<IProps, any> {
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
        if (props === null || props.address !== nextProps.address || props.width !== nextProps.width) {
            this.draw(nextProps.address);
        }
    }

    private canvas: HTMLCanvasElement | null = null;

    private draw(address: string): void {
        if (this.canvas === null) {
            return;
        }

        const canvasSize = this.getCanvasSize();

        // NOTE --  Majority of this code is referenced from: https://github.com/alexvandesande/blockies
        //          Mostly to ensure congruence to Ethereum Mist's Identicons

        // The random number is a js implementation of the Xorshift PRNG
        const randseed = new Array(4); // Xorshift: [x, y, z, w] 32 bit values

        function seedrand(seed: string) {
            for (let i = 0; i < randseed.length; i++) {
                randseed[i] = 0;
            }
            for (let i = 0; i < seed.length; i++) {
                randseed[i%4] = ((randseed[i%4] << 5) - randseed[i%4]) + seed.charCodeAt(i);
            }
        }

        function rand() {
            // based on Java's String.hashCode(), expanded to 4 32bit values
            const t = randseed[0] ^ (randseed[0] << 11);

            randseed[0] = randseed[1];
            randseed[1] = randseed[2];
            randseed[2] = randseed[3];
            randseed[3] = (randseed[3] ^ (randseed[3] >> 19) ^ t ^ (t >> 8));

            return (randseed[3]>>>0) / ((1 << 31)>>>0);
        }

        function createColor() {
            // saturation is the whole color spectrum
            const h = Math.floor(rand() * 360);
            // saturation goes from 40 to 100, it avoids greyish colors
            const s = ((rand() * 60) + 40) + '%';
            // lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
            const l = ((rand()+rand()+rand()+rand()) * 25) + '%';

            const color = 'hsl(' + h + ',' + s + ',' + l + ')';
            return color;
        }

        function createImageData(size: number): number[] {
            const width = size; // Only support square icons for now
            const height = size;

            const dataWidth = Math.ceil(width / 2);
            const mirrorWidth = width - dataWidth;

            const data: number[] = [];
            for (let y = 0; y < height; y++) {
                let row: number[] = [];
                for (let x = 0; x < dataWidth; x++) {
                    // this makes foreground and background color to have a 43% (1/2.3) probability
                    // spot color has 13% chance
                    row[x] = Math.floor(rand()*2.3);
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

        function setCanvas(
            identicon: HTMLCanvasElement,
            imageData: number[],
            color: string,
            scale: number,
            bgcolor: string,
            spotcolor: string,
        ) {
            const cc = identicon.getContext('2d');
            if (cc !== null) {
                cc.fillStyle = bgcolor;
                cc.fillRect(0, 0, canvasSize, canvasSize);
                cc.fillStyle = color;

                for (let i = 0; i < imageData.length; i++) {
                    // if data is 2, choose spot color, if 1 choose foreground
                    cc.fillStyle = (imageData[i] === 1) ? color : spotcolor;

                    // if data is 0, leave the background
                    if (imageData[i]) {
                        const row = Math.floor(i / ICON_PIXEL_SIZE);
                        const col = i % ICON_PIXEL_SIZE;

                        cc.fillRect(col * scale, row * scale, scale, scale);
                    }
                }
            }
        }

        seedrand(address);
        const scale = canvasSize / 8;
        const imageData = createImageData(8);

        setCanvas(
            this.canvas,
            imageData,
            createColor(),
            scale,
            createColor(),
            createColor()
        );
    }

    private processCanvasRef = (canvas: HTMLCanvasElement | null) => {
        if (canvas !== this.canvas) {
            this.canvas = canvas;
            this.draw(this.props.address);
            //render({ seed: this.props.address }, this.canvas as HTMLCanvasElement)
        }
    };

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
                    style={{ width: canvasSize, height: canvasSize }}
                />
            </div>
        );
    }
}
