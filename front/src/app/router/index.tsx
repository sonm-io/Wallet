import { default as Router } from 'universal-router';
import { univeralRouterArgument } from './routes';
import { navigate } from './navigate';

const router = new Router(univeralRouterArgument);
const resolve = router.resolve.bind(router);

export { resolve, navigate };
