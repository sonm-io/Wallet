export interface ILand {
    name: string;
    abCode2: string;
    abCode3: string;
    isoNumber: string;
    phoneCode?: string;
    domain?: string;
}

export interface ILandMap {
    [lowerCaseKey: string]: ILand;
}
