import {RequestHandler} from "express";
import {Registry} from "../registry";
import Routage = Registry.Routage;
import Route = Registry.Route;
import {GreetingService} from "./greeting-service";
import dotenv from "dotenv";

@Routage({path: '/reload'})
export class Reload {
    middlewares = []

    @Route('get', {subPath: '/'})
    reloadingEnv(): RequestHandler {
        return (req, res) => {
            const envvar = dotenv.config({override: true});
            return res
                .status(200)
                .send({envvar});
        }
    }
}
