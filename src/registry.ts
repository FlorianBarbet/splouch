import express, {Express, RequestHandler, Router, RouterOptions} from "express";

type RouteOptions =   {subPath?: string, middlewares?: string[]}
type RouteConfigurer = {method: string, action: any, options: RouteOptions};

export interface Registry {
    router?: Router
    path?: string
    routes?: RouteConfigurer[] // auto-injected, should be transparent for user
    middlewares: string[]  // user should provide it to know which services he wants to use
}

export interface Middleware {
    run: (() => RequestHandler)[]
}


export namespace Registry{
    type Constructor<T> = {
        new(...args: any[]): T;
        readonly prototype: T;
    }

    const beans: { [classname: string]: Registry } = {};
    const services: { [classname: string]: Middleware } = {};

    let _build_timer: NodeJS.Timeout;
    let server: Express;
    let start_server: (() => void);

    export function Routage(options?:RouterOptions & {path?:string}){
        return <T extends Constructor<Registry>>(inst: T) => {
            inst.prototype['router'] = Router(options);
            inst.prototype['path'] = options?.path || `/${inst.name.toLowerCase()}`;
            beans[inst.name.toLowerCase()] = new inst();
            console.debug(`${inst.name} registered as router`);
            _build_launcher();
            return inst;
        }
    }

    export function Route(method: string, options?: RouteOptions){
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            if(!target['routes'])  target['routes'] = [];
            target['routes'].push({method, action:descriptor.value, options});
        }
    }

    export function Service<T extends Constructor<Middleware>>(inst: T) {
        services[inst.name.toLowerCase()] = new inst();
        console.debug(`${inst.name} registered as service`);
        _build_launcher();
        return inst;
    }

    function _build_launcher(){
        clearTimeout(_build_timer);
        _build_timer = setTimeout(() => _build(), 500);
    }

    const _format_middlewares = (middlewares: string[]) : RequestHandler[] => {
        return middlewares.flatMap(attr_classname => {
            const attr_inst = services[attr_classname.toLowerCase()];
            if(!attr_inst) throw new Error(`${attr_classname} not found as middleware`);
            return attr_inst.run.map(e => e());
        });
    };

    function _build(){
        if(!server) throw new Error('Express has not been settings up !');
        Object.keys(beans)
            .forEach(classname => {
                const instance = beans[classname];
                const beanProperties = instance.middlewares;
                if(beanProperties.length > 0) instance.router?.use(..._format_middlewares(beanProperties));
                Promise.all(
                    instance.routes!.map(route => {
                        const uri = !!route.options?.subPath ? `${instance.path}${route.options.subPath}`:instance.path;
                        const specific_middlewares = _format_middlewares(route.options?.middlewares || []);
                        (<any>instance.router!)[route.method.toLowerCase()](uri,  ...specific_middlewares, route.action());
                    })
                ).then(() => server!.use(instance.router!));
            });
        start_server();
    }

    export function loadExpress(app:  Express, cb:() => void = () => server.listen(8000, () => console.log(`server is listening on ${8000}`))){
        server = app || express();
        start_server = cb;
    }
}
