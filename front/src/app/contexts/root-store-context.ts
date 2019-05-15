import * as React from 'react';
import { RootStore } from 'app/stores';

export const RootStoreContext = React.createContext<RootStore | undefined>(
    undefined,
);
