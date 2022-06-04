import {RequestHandler} from "express";
import {Registry} from "../registry";
import Service = Registry.Service;
import {modules} from "../wasm/wasm-loader";

@Service
export class WowLogger {

    wow(): RequestHandler {
        return (req, res, next) => {
            console.log(`WoooW fib(21) = ${(<any>modules['splouch'].instance.exports).fib(21)}`);
            return next();
        }
    }

    run = [this.wow];
}
