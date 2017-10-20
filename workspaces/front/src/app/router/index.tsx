import { default as Router } from 'universal-router';
import { routes } from './routes';
import { navigate } from './navigate';

const router = new Router(routes);
const resolve = router.resolve.bind(router);

export { resolve, navigate };
