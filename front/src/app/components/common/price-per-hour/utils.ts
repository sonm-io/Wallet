import { BN } from 'bn.js';

const SEC_IN_HOUR = new BN('3600');

export const getPricePerHour = (usdWeiPerSeconds: string) => {
    return new BN(usdWeiPerSeconds).mul(SEC_IN_HOUR).toString();
};
