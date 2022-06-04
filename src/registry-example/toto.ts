import {RequestHandler} from "express";
import {Registry} from "../registry";
import Routage = Registry.Routage;
import Route = Registry.Route;

@Routage()
export class Toto {
    middlewares = ['GreetingService'];

    @Route('get', {middlewares:['WowLogger', 'splouch']})
    test(): RequestHandler {
        return (req, res) => {
            return res.status(200).send(`${res.locals.format(res.locals.hello, 'Toto')} fib(21) = ${res.locals.fib(21)}`);
        }
    }
}
