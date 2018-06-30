PropertyList:

    <PropertyList
        dataSource={{id: 2, startDate: 'today', endDate1: 'unknown', endDate2: 'wed', endDate3: 'erwfer', timeLeft: 6}}
        title="Title Title Title Title Title Title Title Title Title Title Title Title"
        config={[{
            name: 'Deal ID',
            key: 'id',
        }, {
            name: 'Start date',
            key: 'startDate',
        }, {
             name: 'End date 1',
             key: 'endDate1',
        }, {
             name: 'End date 2',
             key: 'endDate2',
        }, {
             name: 'End date 3',
             key: 'endDate3',
        }, {
            name: 'Time left',
            key: 'timeLeft',
            render: (value) => `${value} H`
        }, {
            name: 'Computed value',
            key: undefined,
            render: (_, data) => `${data.id} = ${data.timeLeft} H`
        }]}
    />
