var SNMT = artifacts.require('./SNMT.sol');
var fs = require('fs');

module.exports = async function(deployer) {
    await deployer.deploy(SNMT).then(() => {
        // Write to file.
        const data = 'export CI_SONM_TOKEN_ADDRESS="' + SNMT.address + '"';
        fs.writeFile('../env.sh', data, err => {
            if (err) throw err;
            console.log('[+] ' + SNMT.address + ' - address saved!');
        });
    });
};
