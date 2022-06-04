import {RequestHandler} from "express";
import {Registry} from "../registry";
import Service = Registry.Service;

@Service
export class GreetingService {
    hello(): RequestHandler {
        return (req, res, next) => {
            res.locals.hello = 'Hello';
            return next();
        }
    }
    world: () => RequestHandler = () => {
        return (req, res, next) => {
            res.locals.world = 'World';
            res.locals.format = this.format;
            return next();
        }
    }

    format = (start:string, end:string): string  =>{
        return `${start} ${end}`;
    }

    run = [this.world, this.hello];
}
