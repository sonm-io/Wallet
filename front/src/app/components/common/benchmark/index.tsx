import * as React from 'react';
import { IBenchmarkMap } from 'app/api/types';
import { PropertyList, IPropertyListItem } from '../property-list';

interface IBenchmarkProps {
    className?: string;
    keys: string[];
    data: IBenchmarkMap;
}

interface IState {
    keys: string[];
    config: IPropertyListItem[];
    data: IBenchmarkMap;
}

export class Benchmark extends React.PureComponent<IBenchmarkProps, IState> {
    public state = {
        config: Array.prototype,
        keys: Array.prototype,
        data: {} as IBenchmarkMap,
    };

    public static readonly defaultConfig = [
        {
            key: 'cpuSysbenchMulti',
            name: 'Benchmark multicore',
        },
        {
            key: 'cpuSysbenchOne',
            name: 'Benchmark one core',
        },
        {
            key: 'cpuCount',
            name: 'CPU Count',
        },
        {
            key: 'gpuCount',
            name: 'GPU Count',
        },
        {
            key: 'ethHashrate',
            name: 'Ethereum HashRate',
            render: value => `${value} MH/s`,
        },
        {
            key: 'ramSize',
            name: 'RAM size',
            render: value => `${value} Mb`,
        },
        {
            key: 'storageSize',
            name: 'Storage size',
            render: value => `${value} Mb`,
        },
        {
            key: 'downloadNetSpeed',
            name: 'Download net speed',
            render: value => `${value} Mbps`,
        },
        {
            key: 'uploadNetSpeed',
            name: 'Upload net speed',
            render: value => `${value} Mbps`,
        },
        {
            key: 'gpuRamSize',
            name: 'RAM size',
            render: value => `${value} Mb`,
        },
        {
            key: 'zcashHashrate',
            name: 'ZCash hashrate',
            render: value => `${value} h/sol`,
        },
        {
            key: 'redshiftGpu',
            name: 'Redshift',
            render: value => `${value}`,
        },
    ] as IPropertyListItem[];

    public static getDerivedStateFromProps(
        nextProps: IBenchmarkProps,
        prevState: IState,
    ) {
        const state: Partial<IState> = {};

        if (
            nextProps.keys !== prevState.keys ||
            nextProps.data !== prevState.data
        ) {
            const config = Benchmark.defaultConfig
                .filter(item => nextProps.data[item.key] > 0)
                .filter(
                    item =>
                        nextProps.keys.length === 0 ||
                        nextProps.keys.indexOf(item.key) !== -1,
                );

            state.config = config;
            state.keys = nextProps.keys;
            state.data = nextProps.data;
        }

        return state;
    }

    public render() {
        return (
            <PropertyList
                className={this.props.className}
                dataSource={this.props.data}
                config={this.state.config}
            />
        );
    }
}

export default Benchmark;
