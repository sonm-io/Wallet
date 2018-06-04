display balance:

    <Balance
        decimal="20000000000000000000000000000000000"
        symbol="ETH"
        widthPx={330}
    />

display balance:

    <div style={{ border: '1px solid black', width: '100px', height: '50px' }}>
        <Balance
            decimalDigitAmount={4}
            decimalPointOffset={3}
            balance="9000000000000987654321"
            symbol="ETH"
        />
    </div>

rounding:

    <Balance
        decimalDigitAmount={3}
        decimalPointOffset={4}
        balance="75555555555554321"
        symbol="ETH"
        maxWidthPx={330}
        maxWidthPx={330}
        round
    />

rounding:

    <Balance
        decimalDigitAmount={3}
        decimalPointOffset={4}
        balance="29"
        symbol="ETH"
        round
    />

rounding:

    <React.Fragment>
        <Balance
            decimalPointOffset={5}
            balance="4333331234567890987654321"
            symbol="ETH"
            round
        />  
        <span style={{ margin: '0 5px' }} />
        <Balance
            decimalDigitAmount={3}
            decimalPointOffset={5}
            balance="4333331234567890987654321"
            symbol="ETH"
            round
        />
        <span style={{ margin: '0 5px' }} />
        <Balance
            decimalDigitAmount={3}
            decimalPointOffset={5}
            balance="4333331234567890987654321"
            symbol="ETH"
            round
        />
    </React.Fragment>

rounding:

    <React.Fragment>
        <Balance
            decimalPointOffset={5}
            balance="234567"
            symbol="ETH"
        />
        <span style={{ margin: '0 5px' }} />
        <Balance
            decimalDigitAmount={3}
            decimalPointOffset={5}
            balance="234567"
            symbol="ETH"
        />
        <span style={{ margin: '0 5px' }} />
        <Balance
            decimalDigitAmount={3}
            decimalPointOffset={5}
            balance="234567"
            symbol="ETH"
            round
        />  
    </React.Fragment>
