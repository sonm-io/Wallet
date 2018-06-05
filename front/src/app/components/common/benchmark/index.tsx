import * as React from 'react';
import { IBenchmarkMap } from 'app/api/types';
import {
    PropertyList,
    IPropertyItemConfig,
    IDictionary,
} from '../property-list';

interface IBenchmarkProps {
    className?: string;
    keys?: Array<keyof IBenchmarkMap>;
    data: Partial<IBenchmarkMap>;
    title?: string;
}

interface IState {
    keys: Array<keyof IBenchmarkMap>;
    config: Array<IPropertyItemConfig<keyof IBenchmarkMap>>;
    data: Partial<IBenchmarkMap>;
    propertyList: IDictionary<IBenchmarkMap>;
}

class BenchmarkList extends PropertyList<IBenchmarkMap> {}

export class Benchmark extends React.PureComponent<IBenchmarkProps, IState> {
    public state: IState = {
        config: Array.prototype,
        keys: Array.prototype,
        data: {},
        propertyList: {},
    };

    public static readonly emptyBenchmark: IBenchmarkMap = {
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
        networkOverlay: 0,
        networkOutbound: 0,
        networkIncoming: 0,
    };

    public static readonly defaultConfig: Array<
        IPropertyItemConfig<keyof IBenchmarkMap>
    > = [
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
            render: value => `${value} Gb`,
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
            name: 'GPU RAM size',
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
        {
            key: 'networkOverlay',
            name: 'Overlay is allowed',
            render: value => (value > 0 ? 'Yes' : 'No'),
        },
        {
            key: 'networkOutbound',
            name: 'Outbound connection is allowed',
            render: value => (value > 0 ? 'Yes' : 'No'),
        },
        {
            key: 'networkIncoming',
            name: 'Incoming connection is allowed',
            render: value => (value > 0 ? 'Yes' : 'No'),
        },
    ];

    public static getDerivedStateFromProps(
        nextProps: IBenchmarkProps,
        prevState: IState,
    ) {
        if (
            nextProps.keys !== prevState.keys ||
            nextProps.data !== prevState.data
        ) {
            const keys = nextProps.keys;
            const data = nextProps.data;
            const config = (keys !== undefined && keys.length > 0
                ? Benchmark.defaultConfig.filter(x => keys.indexOf(x.key) > -1)
                : Benchmark.defaultConfig
            ).filter(x => x.key in data);

            return {
                keys: nextProps.keys,
                data: nextProps.data,
                config,
                propertyList: config.reduce<IDictionary<IBenchmarkMap>>(
                    (acc, x) => ((acc[x.key] = String(data[x.key])), acc),
                    {},
                ),
            };
        }

        return null;
    }

    public render() {
        return (
            <BenchmarkList
                title={this.props.title}
                className={this.props.className}
                dataSource={this.state.propertyList}
                config={this.state.config}
            />
        );
    }
}

export default Benchmark;
