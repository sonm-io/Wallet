Download file: 

    <DownloadFile 
        data="12345" 
        address="0x88057f14236687831e1fd205e8efb9e45166fe72"
        fileName='12345.json'
    >
        download 12345
    </DownloadFile>
   
Async getter:

        <DownloadFile 
            getData={() => new Promise(done => setTimeout(() => done('async'), 1000) )} 
            address="0x88057f14236687831e1fd205e8efb9e45166fe72"
            fileName='async.json'
        >
            download async getter
        </DownloadFile>       