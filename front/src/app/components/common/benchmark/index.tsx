import * as React from 'react';
import { IBenchmarkMap } from 'app/api/types';
import {
    PropertyList,
    IPropertyItemConfig,
    IPropertyListCssClasses,
} from '../property-list';
import Icon from 'app/components/common/icon';

enum EnumCompositeBenchmarks {
    cpu = 'cpu',
    networkSpeed = 'networkSpeed',
}

type IBenchmarkId = keyof IBenchmarkMap | EnumCompositeBenchmarks;
type IBenchmarkNames = { [key in IBenchmarkId]?: string };
type IBenchmarkConfigItem = IPropertyItemConfig<
    Partial<IBenchmarkMap>,
    EnumCompositeBenchmarks
>;

interface IBenchmarkProps {
    className?: string;
    cssClasses?: Partial<IPropertyListCssClasses>;
    title?: string;
    data: Partial<IBenchmarkMap>;
    /**
     * If config is not specified, then BenchmarkList.defaultConfig will be used.
     */
    config?: IBenchmarkConfigItem[];
    /**
     * If ids passed, then only that benchmarks will be shown in specified order.
     */
    ids?: IBenchmarkId[];
    /**
     * Pass it to override benchmark names in config.
     */
    names?: IBenchmarkNames;
}

interface IState {
    config: IBenchmarkConfigItem[];
    ids?: IBenchmarkId[];
    names?: IBenchmarkNames;
}

class BenchmarkPropertyList extends PropertyList<
    Partial<IBenchmarkMap>,
    EnumCompositeBenchmarks
> {}

export class Benchmark extends React.PureComponent<IBenchmarkProps, IState> {
    public state: IState = {
        config: Array.prototype,
    };

    protected static readonly dash = (
        <span className="benchmark__dash">&mdash;&mdash;</span>
    );

    protected static overrideNames = (
        config: IBenchmarkConfigItem[],
        names: IBenchmarkNames,
    ): IBenchmarkConfigItem[] =>
        config.map(
            cfg =>
                cfg.id === undefined || names[cfg.id] === undefined
                    ? cfg
                    : { ...cfg, name: names[cfg.id] },
        );

    // #region Configuragion presets

    protected static readonly allBenchmarks: IBenchmarkConfigItem[] = [
        {
            id: 'cpuSysbenchMulti',
        },
        {
            id: 'cpuSysbenchOne',
        },
        {
            id: 'cpuCount',
        },
        {
            id: 'gpuCount',
            renderValue: (value: number) =>
                value === 0
                    ? Benchmark.dash
                    : value === 1
                        ? `${value} unit`
                        : `${value} units`,
        },
        {
            id: 'ethHashrate',
            renderValue: value =>
                value === 0 ? Benchmark.dash : `${value} MH/s`,
        },
        {
            id: 'ramSize',
            renderValue: value =>
                value === 0 ? Benchmark.dash : `${value} MB`,
        },
        {
            id: 'storageSize',
            renderValue: value =>
                value === 0 ? Benchmark.dash : `${value} GB`,
        },
        {
            id: 'downloadNetSpeed',
            renderValue: value => `${value} Mbps`,
        },
        {
            id: 'uploadNetSpeed',
            renderValue: value => `${value} Mbps`,
        },
        {
            id: 'gpuRamSize',
            renderValue: value =>
                value === 0 ? Benchmark.dash : `${value} MB`,
        },
        {
            id: 'zcashHashrate',
            renderValue: value =>
                value === 0 ? Benchmark.dash : `${value} sol/s`,
        },
        {
            id: 'redshiftGpu',
            renderValue: value =>
                value === 0 ? Benchmark.dash : `${value} K/Ex. time in s`,
        },
        {
            id: 'networkOverlay',
            renderValue: PropertyList.renderers.booleanYesNo,
        },
        {
            type: 'single',
            id: 'networkOutbound',
            renderValue: PropertyList.renderers.booleanYesNo,
        },
        {
            id: 'networkIncoming',
            renderValue: PropertyList.renderers.booleanYesNo,
        },
        // Composite benchmarks:
        {
            type: 'composite',
            id: EnumCompositeBenchmarks.cpu,
            render: data =>
                `${data.cpuSysbenchMulti} (${data.cpuCount} threads)`,
        },
        {
            type: 'composite',
            id: EnumCompositeBenchmarks.networkSpeed,
            render: data =>
                data.uploadNetSpeed === 0 && data.downloadNetSpeed === 0 ? (
                    Benchmark.dash
                ) : (
                    <div className="benchmark__network-speed">
                        {data.uploadNetSpeed}
                        <Icon i="ArrowUp" /> {data.downloadNetSpeed}
                        <Icon i="ArrowDown" /> Mbps
                    </div>
                ),
        },
    ];

    public static detailsPanelNames: IBenchmarkNames = {
        cpuSysbenchMulti: 'Benchmark multicore',
        cpuSysbenchOne: 'Benchmark one core',
        cpuCount: 'CPU Count',
        gpuCount: 'GPU Count',
        ethHashrate: 'GPU Ethash',
        ramSize: 'RAM size',
        storageSize: 'Storage size',
        downloadNetSpeed: 'Download net speed',
        uploadNetSpeed: 'Upload net speed',
        gpuRamSize: 'GPU RAM size',
        zcashHashrate: 'GPU Equihash',
        redshiftGpu: 'Redshift',
        networkOverlay: 'Overlay is allowed',
        networkOutbound: 'Outbound connection is allowed',
        networkIncoming: 'Incoming connection is allowed',
    };

    public static detailsPanelIds: IBenchmarkId[] = Object.keys(
        Benchmark.detailsPanelNames,
    ) as IBenchmarkId[];

    public static gridItemNames: IBenchmarkNames = {
        [EnumCompositeBenchmarks.cpu]: 'CPU',
        [EnumCompositeBenchmarks.networkSpeed]: 'Network speed',
        redshiftGpu: 'Redshift benchmark',
        ramSize: 'RAM',
        gpuCount: 'GPU #',
        ethHashrate: 'GPU Ethash',
        storageSize: 'Storage',
        gpuRamSize: 'GPU RAM',
        zcashHashrate: 'GPU Equihash',
    };

    public static gridItemIds: IBenchmarkId[] = [
        EnumCompositeBenchmarks.cpu,
        EnumCompositeBenchmarks.networkSpeed,
        'redshiftGpu',
        'ramSize',
        'gpuCount',
        'ethHashrate',
        'storageSize',
        'gpuRamSize',
        'zcashHashrate',
    ];

    // #endregion

    public static getDerivedStateFromProps(
        nextProps: IBenchmarkProps,
        prevState: IState,
    ) {
        const ids = nextProps.ids;
        const names = nextProps.names;

        if (
            ids !== prevState.ids ||
            names !== prevState.names ||
            nextProps.config !== prevState.config
        ) {
            let config = nextProps.config || Benchmark.allBenchmarks;
            if (ids) {
                config = ids
                    .filter(id => config.some(cfg => cfg.id === id))
                    .map(
                        id =>
                            config.find(
                                cfg => cfg.id === id,
                            ) as IBenchmarkConfigItem,
                    );
            }
            if (names) {
                config = Benchmark.overrideNames(config, names);
            }
            return {
                config,
                names,
                ids,
            };
        }
        return null;
    }

    public render() {
        return (
            <BenchmarkPropertyList
                className={this.props.className}
                cssClasses={this.props.cssClasses}
                title={this.props.title}
                data={this.props.data}
                config={this.state.config}
            />
        );
    }
}

export default Benchmark;
