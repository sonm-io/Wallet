import { default as Router } from 'universal-router';
import { navigate } from './navigate';
import { INavigator, IDataLoader } from './types';
import { createRoutes } from './routes';
import { DataLoader } from './loader';
import { Navigator } from './navigator';
import { RootStore } from 'app/stores';

export const getResolveMethod = (rootStore: RootStore) => {
    const loader: IDataLoader = new DataLoader(rootStore);
    const navigator: INavigator = new Navigator(loader, navigate);
    const routes = createRoutes(loader, navigator);

    const router = new Router(routes, {
        context: {
            breadcrumbs: [],
        },
    });

    return router.resolve.bind(router);
};
