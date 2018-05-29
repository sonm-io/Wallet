import * as React from 'react';
import { IBenchmarkMap, IDictionary } from 'app/api/types';
import { Benchmark } from '../benchmark';
import * as cn from 'classnames';

interface IBenchmarkShortProps {
    className?: string;
    data: IBenchmarkMap;
}

interface IState {
    benchmarkString: string[];
    propertyList: IDictionary;
    data: IBenchmarkMap;
}

export class BenchmarkShort extends React.PureComponent<
    IBenchmarkShortProps,
    IState
> {
    public state: IState = {
        benchmarkString: [],
        data: {
            cpuSysbenchMulti: 0,
            cpuSysbenchOne: 0,
            cpuCount: 0,
            gpuCount: 0,
            ethHashrate: 0,
            ramSize: 0,
            storageSize: 0,
            downloadNetSpeed: 0,
            uploadNetSpeed: 0,
            gpuRamSize: 0,
            zcashHashrate: 0,
            redshiftGpu: 0,
        },
        propertyList: {},
    };

    public static readonly defaultConfig = [
        [
            'cpuCount',
            'ramSize',
            'storageSize',
            'downloadNetSpeed',
            'uploadNetSpeed',
        ],
        ['gpuRamSize', 'redshiftGpu', 'ethHashrate', 'zcashHashrate'],
    ];

    public static getDerivedStateFromProps(
        nextProps: IBenchmarkShortProps,
        prevState: IState,
    ) {
        const state: Partial<IState> = {};

        if (nextProps.data !== prevState.data) {
            state.benchmarkString = [];

            for (const keys of BenchmarkShort.defaultConfig) {
                const line = [];

                for (const key of keys) {
                    if (nextProps.data[key as keyof IBenchmarkMap] > 0) {
                        const value =
                            nextProps.data[key as keyof IBenchmarkMap];
                        const benchmarkElement = Benchmark.defaultConfig.find(
                            item => item.key === key,
                        );
                        line.push(
                            benchmarkElement && benchmarkElement.render
                                ? benchmarkElement.render(String(value))
                                : value,
                        );
                    }
                }

                state.benchmarkString.push(line.join('/'));
            }

            state.data = nextProps.data;
        }

        return state;
    }

    public render() {
        return (
            <div className={cn(this.props.className, `sonm-benchmark-short`)}>
                {this.state.benchmarkString.map(x => (
                    <React.Fragment key={x}>{x}</React.Fragment>
                ))}
            </div>
        );
    }
}

export default BenchmarkShort;
