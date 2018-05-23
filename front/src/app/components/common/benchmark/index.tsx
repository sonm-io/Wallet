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
}

export class Benchmark extends React.PureComponent<IBenchmarkProps, IState> {
    public state = {
        config: Array.prototype,
        keys: Array.prototype,
        data: {} as IBenchmarkMap,
    };

    public static readonly defaultKeys = {
        cpuSysbenchMulti: 'cpuSysbenchMulti',
        cpuSysbenchOne: 'cpuSysbenchOne',
        cpuCount: 'CPU Count',
        gpuCount: 'GPU Count',
        ethHashrate: 'Ethereum HashRate',
        ramSize: 'Ram Size',
        storageSize: 'Storage Size',
        downloadNetSpeed: 'Download net speed',
        uploadNetSpeed: 'Upload net speed',
        gpuRamSize: 'GPU Ram size',
        zcashHashrate: 'ZCahs hashrate',
        redshiftGpu: 'Redshift',
    } as IDictionary;

    public static getDerivedStateFromProps(
        nextProps: IBenchmarkProps,
        prevState: IState,
    ) {
        const state: Partial<IState> = {};

        if (
            nextProps.keys !== prevState.keys ||
            nextProps.data !== prevState.data
        ) {
            const config = [] as IPropertyListItem[];
            Object.keys(Benchmark.defaultKeys)
                .filter(key => nextProps.data[key] !== undefined)
                .filter(
                    key =>
                        nextProps.keys.length === 0 ||
                        nextProps.keys.indexOf(key) !== -1,
                )
                .map(key => {
                    config.push({
                        key,
                        name: Benchmark.defaultKeys[key],
                    } as IPropertyListItem);
                });

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
