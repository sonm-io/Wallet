calendar:

    <Calendar value={Date.now() + 24*60*60*1000} name="1" onChange={e => console.log(JSON.stringify(e))}/>

calendar:

    <Calendar value={new Date(2020, 0, 20)} targetDate={new Date(2020, 0, 7)} name="1" onChange={e => console.log(JSON.stringify(e))}/>
