import * as Router from 'universal-router';
import { routes } from './routes';

const router = new Router(routes);
const resolve = router.resolve.bind(router);

export { resolve };
