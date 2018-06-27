import { default as Router } from 'universal-router';
import { navigate } from './navigate';
import { INavigator, IDataLoader } from './types';
import { createRoutes } from './routes';
import { DataLoader } from './loader';
import { Navigator } from './navigator';

const loader: IDataLoader = new DataLoader();
const navigator: INavigator = new Navigator(loader, navigate);
const routes = createRoutes(loader, navigator);

const router = new Router(routes, {
    context: {
        breadcrumbs: [],
    },
});
const resolve = router.resolve.bind(router);

export { resolve };
