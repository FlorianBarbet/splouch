import {RequestHandler} from "express";
import {Registry} from "../registry";
import Service = Registry.Service;

@Service
export class WowLogger {

    wow(): RequestHandler {
        return (req, res, next) => {
            console.log("WoooW");
            return next();
        }
    }

    run = [this.wow];
}
