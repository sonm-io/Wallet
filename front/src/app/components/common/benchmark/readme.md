### With default config

```js
const data = {
    cpuCount: 6,
    gpuCount: 8,
    ethHashrate: 21.12,
    ramSize: 2594,
    cpuSysbenchMulti: 5401,
    cpuSysbenchOne: 10356,
    storageSize: 10,
    downloadNetSpeed: 10,
    uploadNetSpeed: 8,
    zcashHashrate: 283,
    redshiftGpu: 2,
    gpuRamSize: 1024,
    networkOverlay: false,
    networkOutbound: false,
    networkIncoming: false,
};

<Benchmark data={data} />;
```

### With custom config: single Key and comopsite

```js
const data = {
    gpuCount: '8192 Mb',
    ethHashrate: 2,
    uploadNetSpeed: 50,
    downloadNetSpeed: 150,
};

const config = [
    {
        id: 'gpuCount',
        name: 'GPU Count',
    },
    {
        id: 'ethHashrate',
        name: 'GPU Ethash',
        renderValue: value => `${value} MH/s`,
    },
    {
        type: 'composite',
        name: 'Network speed',
        render: data =>
            `up ${data.uploadNetSpeed}, down ${data.downloadNetSpeed}`,
    },
];

<Benchmark data={data} config={config} />;
```

### Only certain keys and order, override names

```js
const data = {
    cpuCount: 6,
    gpuCount: 8,
    ethHashrate: 21.12,
    ramSize: 2594,
    cpuSysbenchMulti: 5401,
    cpuSysbenchOne: 10356,
    storageSize: 10,
    downloadNetSpeed: 10,
    uploadNetSpeed: 8,
    zcashHashrate: 283,
    redshiftGpu: 2,
    gpuRamSize: 1024,
    networkOverlay: false,
    networkOutbound: false,
    networkIncoming: false,
};

const names = {
    networkSpeed: 'NETWORK SPEED',
    zcashHashrate: 'ZCASH',
};

<Benchmark
    data={data}
    ids={['cpu', 'networkSpeed', 'zcashHashrate', 'redshiftGpu']}
    names={names}
/>;
```
