calendar:

    <Calendar value={new Date()} name="1" onChange={e => console.log(JSON.stringify(e))}/>

calendar:

    <Calendar value={new Date(2020, 0, 20)} targetDate={new Date(2020, 0, 7)} name="1" onChange={e => console.log(JSON.stringify(e))}/>

calendar:

    <Calendar
        value={new Date(2020, 0, 15)}
        disableBefore={new Date(2020, 0, 7)}
        name="1"
        onChange={e => console.log(JSON.stringify(e))}/>

calendar:

    <Calendar
        value={new Date(2020, 0, 15)}
        disableAfter={new Date(2020, 0, 22)}
        name="1"
        onChange={e => console.log(JSON.stringify(e))}/>
