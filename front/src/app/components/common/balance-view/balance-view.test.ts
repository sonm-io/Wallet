import { Balance } from './index';
import { expect } from 'chai';

before(async function() {
    this.timeout(+Infinity);
    localStorage.clear();
});

describe('Balance view', async function() {
    describe('round last number position', async function() {
        it('should return rounded down value', async function() {
            const a = '12.444';
            expect(Balance.roundLastNumberPosition(a)).to.equal('12.44');
        });

        it('should return rounded up value', async function() {
            const a = '12.445';
            expect(Balance.roundLastNumberPosition(a)).to.equal('12.45');
        });

        it('should return rounded up value', async function() {
            const a = '12.495';
            expect(Balance.roundLastNumberPosition(a)).to.equal('12.5');
        });

        it('should return rounded down value', async function() {
            const a = '12.444';
            expect(Balance.roundLastNumberPosition(a)).to.equal('12.44');
        });

        it('should return cropped value', async function() {
            const a = '12.449';
            expect(Balance.roundLastNumberPosition(a)).to.equal('12.44');
        });

        it('should return cropped value', async function() {
            const a = '12.441';
            expect(Balance.roundLastNumberPosition(a)).to.equal('12.44');
        });
    });
});
