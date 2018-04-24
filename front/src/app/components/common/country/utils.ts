import * as lands from './lands-utils';

export const getFlagImgUrl = (ab2Code: string) =>
    `https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.1.0/flags/4x3/${ab2Code}.svg`;

export const getByAbCode2 = (abCode2: string): lands.ILand =>
    lands.getMap('abCode2')[abCode2];
