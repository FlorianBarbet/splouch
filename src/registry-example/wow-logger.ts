import {RequestHandler} from "express";
import {Registry} from "../registry";
import Service = Registry.Service;
import {modules} from "../wasm/wasm-loader";

@Service
export class WowLogger {

    wow(): RequestHandler {
        return (req, res, next) => {
            return next();
        }
    }

    run = [this.wow];
}
