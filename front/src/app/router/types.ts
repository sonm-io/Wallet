import { DataLoader } from './loader';
import { Navigator } from './navigator';

export interface IUrlParams {
    [key: string]: string;
}

export interface IContext {
    query: any;
    route: any;
    pathname: string;
    params?: IRouterResult;
    next: () => IRouterResult;
    breadcrumbs: Array<IBreadcrumb>;
}

export type TFnAction = (ctx: IContext, params: any) => Promise<IRouterResult>;

export interface IBreadcrumb {
    path: string;
    title: string;
}

export interface IUniversalRouterItem {
    path: string | RegExp;
    action?: TFnAction;
    children?: Array<IUniversalRouterItem>;
    breadcrumbTitle?: string;
}

export interface IRouterResult {
    content?: React.ReactNode;
    browserTabTitle?: string;
    pageTitle?: string;
    props?: any;
    pathKey?: string;
    loader?: () => never;
}

export type LazyInterface<T> = { [P in keyof T]: T[P] };

export type IDataLoader = LazyInterface<DataLoader>;

export type INavigator = LazyInterface<Navigator>;
