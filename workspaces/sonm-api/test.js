'use strict'

const Web3 = require('web3');
const api = require('./index');

let main = async function() {
    try {
        const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io'));
        console.log(await web3.eth.getBalance('0x6Ffc014F1dEee1175Cb1c35ADD333fcBE135527f'));

        await api.init({
            user: {
                address: '0x6Ffc014F1dEee1175Cb1c35ADD333fcBE135527f',
                privateKey: 'e3d90c923a8b1b324b6483d1fbf640d80d9971ed982afb63c75f35fa54dc5edc',
            },
            connectionUrl: 'https://rinkeby.infura.io'
        });

        console.log(await api.getBalance());
        console.log(await api.getTokenBalance());

        console.log('1111');
    } catch ( err ) {
        console.log(err.stack);
    }
}

main();