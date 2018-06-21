import * as React from 'react';

const Svg = require('./icon.svg').default;

export interface IMyProfileLinkProps {
    onClick: () => void;
}

export function MyProfileLink(props: IMyProfileLinkProps) {
    return (
        <a className="my-profile-link" onClick={props.onClick}>
            <Svg />
        </a>
    );
}
