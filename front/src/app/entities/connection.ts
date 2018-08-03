export interface IConnectionInfo {
    ethNodeURL: string;
    snmNodeURL: string;
    isTest: boolean;
}

export const defaultConnectionInfo = Object.freeze({
    isTest: true,
    ethNodeURL: '',
    snmNodeURL: '',
});
