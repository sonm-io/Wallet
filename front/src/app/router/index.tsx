import { default as Router } from 'universal-router';
import { univeralRoutes } from './routes';
import { navigate } from './navigate';

const router = new Router(univeralRoutes, {
    context: {
        breadcrumbs: [],
    },
});
const resolve = router.resolve.bind(router);

export { resolve, navigate };
