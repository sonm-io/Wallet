PropertyList:

    <PropertyList
        dataSource={{id: 2, startDate: 'today', endDate: 'unknown', timeLeft: 6}}
        config={[{
            name: 'Deal ID',
            key: 'id',
        }, {
            name: 'Start date',
            key: 'startDate',
        }, {
             name: 'End date',
             key: 'endDate',
        }, {
            name: 'Time left',
            key: 'timeLeft',
            render: (value) => `${value} H`
        }]}
    />
