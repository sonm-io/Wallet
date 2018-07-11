import { expect } from 'chai';
import { BalanceUtils } from './utils';

class BalanceUtilsSuite extends BalanceUtils {
    public static test() {
        describe('Balance view', async function() {
            describe('roundLastNumberPosition', async function() {
                it('should round down, no trailing point', async function() {
                    expect(
                        BalanceUtils.roundLastNumberPosition('1.4'),
                    ).to.equal('1');
                });
                it('should round up integer int, no trailing point', async function() {
                    expect(
                        BalanceUtils.roundLastNumberPosition('1.5'),
                    ).to.equal('2');
                });
                it('should round up decimal part', async function() {
                    expect(
                        BalanceUtils.roundLastNumberPosition('1.19'),
                    ).to.equal('1.2');
                });
                it('should round up decimal part', async function() {
                    expect(
                        BalanceUtils.roundLastNumberPosition('1.199'),
                    ).to.equal('1.2');
                });
                it('should round up int part when decimals are nines', async function() {
                    expect(
                        BalanceUtils.roundLastNumberPosition('1.999'),
                    ).to.equal('2');
                });
                it('should reset to zeros integer part after increased digit', async function() {
                    expect(
                        BalanceUtils.roundLastNumberPosition('199.99'),
                    ).to.equal('200');
                });
                it('should add integer digit when all digits are nines', async function() {
                    expect(
                        BalanceUtils.roundLastNumberPosition('9.999'),
                    ).to.equal('10');
                });
                it('should add integer digit when all digits are nines', async function() {
                    expect(
                        BalanceUtils.roundLastNumberPosition('999.99'),
                    ).to.equal('1000');
                });
                it('should cutOff, no trailing point', async function() {
                    expect(
                        BalanceUtils.roundLastNumberPosition('0.7', true),
                    ).to.equal('0');
                });

                it('should return rounded down value', async function() {
                    const a = '11.444';
                    expect(BalanceUtils.roundLastNumberPosition(a)).to.equal(
                        '11.44',
                    );
                });

                it('should return rounded up value', async function() {
                    const a = '12.445';
                    expect(BalanceUtils.roundLastNumberPosition(a)).to.equal(
                        '12.45',
                    );
                });

                it('should return rounded up value', async function() {
                    const a = '13.495';
                    expect(BalanceUtils.roundLastNumberPosition(a)).to.equal(
                        '13.5',
                    );
                });

                it('should return rounded up value', async function() {
                    const a = '0.0299';
                    expect(BalanceUtils.roundLastNumberPosition(a)).to.equal(
                        '0.03',
                    );
                });

                it('should return rounded up value', async function() {
                    const a = '0.0209';
                    expect(BalanceUtils.roundLastNumberPosition(a)).to.equal(
                        '0.021',
                    );
                });

                it('should return rounded up value', async function() {
                    const a = '14.0299';
                    expect(BalanceUtils.roundLastNumberPosition(a)).to.equal(
                        '14.03',
                    );
                });

                it('should round up value which ends with few 9', async function() {
                    const a = '0.0599999';
                    expect(BalanceUtils.roundLastNumberPosition(a)).to.equal(
                        '0.06',
                    );
                });

                it('should round up value which ends with few 9', async function() {
                    const a = '0.0799';
                    expect(BalanceUtils.roundLastNumberPosition(a)).to.equal(
                        '0.08',
                    );
                });

                it('should round up value which ends with few 9', async function() {
                    const a = '1.9999999';
                    expect(BalanceUtils.roundLastNumberPosition(a)).to.equal(
                        '2',
                    );
                });

                it('should round up value which ends with few 9', async function() {
                    const a = '0.9999999';
                    expect(BalanceUtils.roundLastNumberPosition(a)).to.equal(
                        '1',
                    );
                });

                it('should return rounded down value', async function() {
                    const a = '15.444';
                    expect(BalanceUtils.roundLastNumberPosition(a)).to.equal(
                        '15.44',
                    );
                });

                it('should return cropped value', async function() {
                    const a = '16.449';
                    expect(
                        BalanceUtils.roundLastNumberPosition(a, true),
                    ).to.equal('16.44');
                });

                it('should return cropped value', async function() {
                    const a = '17.441';
                    expect(
                        BalanceUtils.roundLastNumberPosition(a, true),
                    ).to.equal('17.44');
                });

                it('should return original value', async function() {
                    const a = '18';
                    expect(
                        BalanceUtils.roundLastNumberPosition(a, true),
                    ).to.equal('18');
                });

                it('should return original value', async function() {
                    const a = '18.10';
                    expect(
                        BalanceUtils.roundLastNumberPosition(a, true),
                    ).to.equal('18.1');
                });
            });

            describe('roundOrCrop', async function() {
                it('should return the same number if decimal part length <= decimalDigitAmount', async function() {
                    expect(BalanceUtils.roundOrCrop('0.1234', 4)).to.equal(
                        '0.1234',
                    );
                });
                it('should round', async function() {
                    expect(
                        BalanceUtils.roundOrCrop('0.12345', 4, true),
                    ).to.equal('0.1235');
                });
                it('should crop number', async function() {
                    expect(BalanceUtils.roundOrCrop('0.12345', 4)).to.equal(
                        '0.1234',
                    );
                });
            });
        });
    }
}

BalanceUtilsSuite.test();
