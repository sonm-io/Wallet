import * as React from 'react';
import { IBenchmarkMap, IDictionary } from 'app/api/types';
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
    propertyList: IDictionary;
}

export class Benchmark extends React.PureComponent<IBenchmarkProps, IState> {
    public state: IState = {
        config: Array.prototype,
        keys: Array.prototype,
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

    public static readonly defaultConfig: IPropertyListItem[] = [
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
    ];

    public static getDerivedStateFromProps(
        nextProps: IBenchmarkProps,
        prevState: IState,
    ) {
        const state: Partial<IState> = {};

        if (
            nextProps.keys !== prevState.keys ||
            nextProps.data !== prevState.data
        ) {
            const config: IPropertyListItem[] = Benchmark.defaultConfig
                .filter(
                    item => nextProps.data[item.key as keyof IBenchmarkMap] > 0,
                )
                .filter(
                    item =>
                        nextProps.keys.length === 0 ||
                        nextProps.keys.indexOf(item.key) !== -1,
                );

            const propertyList: IDictionary = {};
            config.map((item: IPropertyListItem) => {
                propertyList[item.key] =
                    nextProps.data[item.key as keyof IBenchmarkMap];
            });
            state.config = config;
            state.keys = nextProps.keys;
            state.data = nextProps.data;
            state.propertyList = propertyList;
        }

        return state;
    }

    public render() {
        return (
            <PropertyList
                className={this.props.className}
                dataSource={this.state.propertyList}
                config={this.state.config}
            />
        );
    }
}

export default Benchmark;
