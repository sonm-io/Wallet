Input:

    <Input />

Input with prefix:

    <div style={{ display: 'grid', 'gridTemplateColumns': '200px 200px', 'gap': '10px' }}>

        <Input prefix="from" />
        <Input prefix="to" />

    </div>

With postfix:

    const { Icon } = require ('../icon');

    const Postfix = <Icon i="Eye" />;

    <Input postfix={Postfix} />
