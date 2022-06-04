import {instance} from "./server";
import {Registry} from "./registry";
import "./registry-example";
import path from "path";
import fs from "fs";

const port = 8000;
export const app = instance();

Registry.loadExpress(app, () => app.listen(port, () => console.log(`server up on ${port}`)));

// test wasm
const wasmDir = path.join(__dirname,'../wasm/splouch_bg.wasm');
const wasmBuffer = fs.readFileSync(wasmDir);
WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
   console.log((<any>wasmModule.instance.exports).fib(8));
});




