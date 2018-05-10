import * as React from 'react';
import { getByAbCode2, getFlagImgUrl } from './utils';

export interface ICountryComponentProps {
    abCode2: string;
    flagHeightPx?: number;
    hasName?: boolean;
}

export function Country(props: ICountryComponentProps) {
    if (props.abCode2 === undefined) {
        return null;
    }

    const land = getByAbCode2(props.abCode2.toUpperCase());

    if (land === undefined) {
        return null;
    }

    return (
        <div className="country-component">
            {props.flagHeightPx ? (
                <img
                    style={{ height: `${props.flagHeightPx}px` }}
                    className="country-component__flag"
                    src={getFlagImgUrl(land.abCode2.toLowerCase())}
                />
            ) : null}
            {props.hasName ? (
                <div className="country-component__name">{land.name}</div>
            ) : null}
        </div>
    );
}

export default Country;
