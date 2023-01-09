import {RequestHandler} from "express";
import {Registry} from "../registry";
import Routage = Registry.Routage;
import Route = Registry.Route;
import {WowLogger} from "./wow-logger";
import {modules} from "../wasm/wasm-loader";

@Routage()
export class Toto {
    middlewares = [];

    @Route('get', {subPath:'/:iter', middlewares:[WowLogger.name, 'splouch']})
    test(): RequestHandler {
        return (req, res) => {
            const {iter} = req.params;
            const offset = res.locals.greet();
            // @ts-ignore
            const stringBuffer = new Uint8Array(modules['splouch'].buffer, offset)
            let {str, i, curr} = {str: '', i: 0, curr: String.fromCharCode(stringBuffer[0])}

            while('\0' !== curr){
                str += curr;
                curr = String.fromCharCode(stringBuffer[++i])
            }
            console.log(stringBuffer)
            return res
                .status(200)
                .send(`${res.locals.format(res.locals.hello, 'Toto')} fib(${iter}) = ${res.locals.fib(iter)}_${curr}`);
        }
    }
}
