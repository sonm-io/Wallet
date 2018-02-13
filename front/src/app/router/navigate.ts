import * as queryStr from 'query-string';
import { history } from './history';
import * as get from 'lodash/fp/get';

export interface INavigateArgument {
    path?: string;
    query?: any;
    mergeQuery?: any;
}

const getLocation = get('location.pathname');
const getSearch = get('location.search');

/**
 *
 * @param path url main part
 * @param query
 * @param mergeQuery will be merged with existing query params
 */
export function navigate({
    path,
    query,
    mergeQuery,
}: INavigateArgument): string {
    if (path == null) {
        path = getLocation(history);
    }

    if (mergeQuery) {
        const existingQuery = queryStr.parse(getSearch(history));

        query = { ...existingQuery, ...mergeQuery };
    }

    if (query) {
        query = Object.keys(query).reduce((acc: any, key) => {
            if (query[key] !== undefined) {
                acc[key] = query[key];
            }

            return acc;
        }, {});
    }

    const url =
        query && Object.keys(query).length > 0
            ? `${path}?${queryStr.stringify(query)}`
            : path;

    (history as any).push(url);

    return url || '';
}
