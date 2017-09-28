'use strict'

const Web3 = require('web3');

let main = async function() {
    const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io'));
    console.log(await web3.eth.getBalance('0x6Ffc014F1dEee1175Cb1c35ADD333fcBE135527f'));
}

main();