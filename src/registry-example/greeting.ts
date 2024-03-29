import {RequestHandler} from "express";
import {Registry} from "../registry";
import Routage = Registry.Routage;
import Route = Registry.Route;
import {GreetingService} from "./greeting-service";

@Routage({path: '/greet'})
export class Greeting {
    middlewares = [GreetingService.name]

    @Route('get', {subPath: '/:name?'})
    greet(): RequestHandler {
        return (req, res) => {
            return res
                .status(200)
                .send(`${res.locals.format(res.locals.hello,res.locals.world)} - ${req.params['name'] || 'Unknown'}`);
        }
    }
}
