import { Balance } from './index';
import { expect } from 'chai';

describe('Balance view', async function() {
    describe('roundLastNumberPosition', async function() {
        it('should return rounded down value', async function() {
            const a = '11.444';
            expect(Balance.roundLastNumberPosition(a)).to.equal('11.44');
        });

        it('should return rounded up value', async function() {
            const a = '12.445';
            expect(Balance.roundLastNumberPosition(a)).to.equal('12.45');
        });

        it('should return rounded up value', async function() {
            const a = '13.495';
            expect(Balance.roundLastNumberPosition(a)).to.equal('13.5');
        });

        it('should return rounded up value', async function() {
            const a = '0.0299';
            expect(Balance.roundLastNumberPosition(a)).to.equal('0.03');
        });

        it('should return rounded up value', async function() {
            const a = '0.0209';
            expect(Balance.roundLastNumberPosition(a)).to.equal('0.021');
        });

        it('should return rounded up value', async function() {
            const a = '14.0299';
            expect(Balance.roundLastNumberPosition(a)).to.equal('14.03');
        });

        it('should round up value which ends with few 9', async function() {
            const a = '0.0599999';
            expect(Balance.roundLastNumberPosition(a)).to.equal('0.06');
        });

        it('should round up value which ends with few 9', async function() {
            const a = '0.0799';
            expect(Balance.roundLastNumberPosition(a)).to.equal('0.08');
        });

        it('should round up value which ends with few 9', async function() {
            const a = '1.9999999';
            expect(Balance.roundLastNumberPosition(a)).to.equal('2');
        });

        it('should round up value which ends with few 9', async function() {
            const a = '0.9999999';
            expect(Balance.roundLastNumberPosition(a)).to.equal('1');
        });

        it('should return rounded down value', async function() {
            const a = '15.444';
            expect(Balance.roundLastNumberPosition(a)).to.equal('15.44');
        });

        it('should return cropped value', async function() {
            const a = '16.449';
            expect(Balance.roundLastNumberPosition(a, true)).to.equal('16.44');
        });

        it('should return cropped value', async function() {
            const a = '17.441';
            expect(Balance.roundLastNumberPosition(a, true)).to.equal('17.44');
        });

        it('should return original value', async function() {
            const a = '18';
            expect(Balance.roundLastNumberPosition(a, true)).to.equal('18');
        });

        it('should return original value', async function() {
            const a = '18.10';
            expect(Balance.roundLastNumberPosition(a, true)).to.equal('18.1');
        });
    });
});
