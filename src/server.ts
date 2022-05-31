import * as path from "path";
import * as fs from "fs";
import express, {Express, RequestHandler, Router} from "express";


export interface ApiRoute{
    path: string,
    middlewares: RequestHandler[],
    router: RequestHandler,
    base: {
        methods: ('all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head')[] ,
        action: RequestHandler,
        middlewares: RequestHandler[]
    } | null
}

export function instance(): Express{
    const app = express();
    register_global_middlewares(app);
    register_api_route(app);
    return app;
}

function register_global_middlewares(app: Express){
    registerIndex(path.join('middleware', 'global'), (middleware:{run:RequestHandler}) => app.use(middleware.run))
}

function register_api_route(app: Express){
    type apiRouter  = ApiRoute & {file: string};

    const inject = (parent:Router, route:apiRouter) => {
        if(!!route.base){
            route.base.methods.forEach(method => {
                (<any>route.router)[method.toLowerCase()]("/", route.base!.middlewares, route.base!.action);
            });
        }
        parent.use(route.path, route.middlewares, route.router);
    }

    registerIndex('api',
        (api_route:apiRouter) => {
            inject(app, api_route);
            register(path.join('api', api_route.file, 'routes'),
                (sub_mod:apiRouter) => inject(<Router>api_route.router, sub_mod),
                (fi, file) => fi.isFile() && !file.startsWith('index'));
        });

}

function registerIndex<RegisterType>(dirname: string, action: (rs:RegisterType) => void){
    register(dirname, action, (fi, _) => fi.isDirectory())
}

function register<RegisterType>(dirname: string,
                                action: (rs:RegisterType) => void,
                                filter: (file_infos:fs.Stats, filename:string ) => boolean = fi => fi.isFile()){
    const register_path = path.join(__dirname, dirname);
    if(fs.existsSync(register_path))
        fs.readdirSync(register_path)
            .forEach(file => {
                const filepath = path.join(register_path, file);
                console.debug(`Load controller : ${filepath}`);
                const file_infos = fs.statSync(filepath);
                if(filter(file_infos, file)){
                    const register_stuff = require(path.join(register_path, file)).default;
                    action({...register_stuff, file});
                }
            });
}
