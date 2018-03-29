var SNMT = artifacts.require('./SNMT.sol');

module.exports = function(deployer) {
    var accs = [
        '0x53b14178576e5597a0ab529ba8ba46166599c3af',
        '0xb8d3051d9a97247e592cbc49a1dc14cfa2c0aee0',
        '0x718db7fa19c11cc9194446ccbdf8fcda136f7def',
        '0x3be5424b83fb410703d357907f1e9cdb0f7279fd',
        '0xebbab4c50d7c5da77144868c8823ea2a8e045997',
        '0x526dddd8c6c7931a6fb7347e51fe998ec1071bbf',
        '0x2ff692f128cc338b581ed5985e67128872a269c8',
        '0x2149102165db89851a97f5a654601905d57c6c52',
        '0xd779fe662ff911415616ee85402352b3ba3a715f',
        '0xa1cd8fcc583452f658301d70c5e6ac7208f330df',
    ];
    SNMT.deployed().then(function(snmt) {
        for (i = 0; i < accs.length; i++) {
            console.log('[+] get tokens for ' + accs[i]);
            snmt.getTokens({ from: accs[i] });
        }
    });
};
