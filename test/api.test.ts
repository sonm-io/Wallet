const {expect} = require('chai');
import { api } from 'worker/api';

const vasyaCfg = require('./data/Vasya_11111111.json');

before(async function() {
    //this.timeout(+Infinity);
});

describe('Api',  () => {
    it('should work', async function() {
        //this.timeout(+Infinity);
        // console.log(endpoints);
        // console.log(endpoints.ping());

        console.log(await api.checkAccount({}, '11111111'));

        expect(true).equal(true);
    });
});
