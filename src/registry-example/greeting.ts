import {RequestHandler} from "express";
import {Registry} from "../registry";
import Routage = Registry.Routage;
import Route = Registry.Route;

@Routage({path: '/test'})
export class Greeting {
    middlewares = ['GreetingService']

    @Route('get', {subPath: '/:name?'})
    greet(): RequestHandler {
        return (req, res) => {
            return res.status(200).send(`${res.locals.format(res.locals.hello,res.locals.world)} - ${req.params['name']}`);
        }
    }
}
