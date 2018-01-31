select:
    
    <BlackSelect 
        keyIndex='id'
        options={[
            { title: 'qwerty', id: '1' },
            { title: 'zxcvvb', id: '2' }
        ]}
        value='2'
    />
    
one more:

    <BlackSelect 
        options={['one', 'two', 'three']}
        value='two'
    /> 
    
ololo:

    <BlackSelect 
        options={[
            {ololo: 1, view: '111'},
            {ololo: 2, view: '222'},
        ]}
        keyIndex='ololo'
        value='222'
        render={(record, idKey) => {
            return record.view + '_' + idKey + '_' + record[idKey];
        }}
        value='two'
    />     