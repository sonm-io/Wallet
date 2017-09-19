'use strict';

module.exports = async function() {
    console.log('111');

    const balance = await app.data.web3.eth.getBalance('0x23ea8516453f743b729a57b53369a6b50d98ae2c');
    // const balance = await web3.eth.getBalance(account);
    // console.log(balance);
};