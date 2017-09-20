'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const contract = require('truffle-contract');

module.exports = async function (app) {
    const balance = await app.data.web3.eth.getBalance(app.data.account);

    //dummy contract
    const tutorialToken = contract(await fs.readJson(`${__dirname}/../../contracts/TutorialToken.json`));
    tutorialToken.setProvider(app.data.provider);

    //dirty hack for web3@1.8.0 support
    tutorialToken.currentProvider.sendAsync = function () {
        return tutorialToken.currentProvider.send.apply(tutorialToken.currentProvider, arguments);
    };

    const cc = await tutorialToken.at(_.get(app.data.config, 'contracts.TutorialToken'));
    const tokenBalance = _.get(await cc.balanceOf(app.data.account), 'c[0]', 0);

    return {
        balance: balance,
        token_balance: tokenBalance,
    }
};