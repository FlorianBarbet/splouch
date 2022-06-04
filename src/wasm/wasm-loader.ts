import path from "path";
import fs from "fs";
import {Registry} from "../registry";
import Service = Registry.Service;
import {RequestHandler} from "express";

const modules: {[module_name: string]: WebAssembly.WebAssemblyInstantiatedSource } = {};

const module_path = process.env.WASM_MODULE_PATH || path.join(__dirname, 'modules');
console.debug(`process.env.WASM_MODULE_PATH = ${process.env.WASM_MODULE_PATH}`);
console.debug(`WebAssembly module dir : ${module_path}`);

if(fs.existsSync(module_path))
    fs.readdirSync(module_path)
        .forEach(file => {
            const wasmBuffer = fs.readFileSync(path.join(module_path, file));
            WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
                const module_name = file.replace('_bg.wasm', '');
                console.debug(`Load WebAssembly file : ${file}`);
                modules[module_name] = wasmModule;
                const function_names = Object.keys(wasmModule.instance.exports).filter(e => e !== 'memory');
                const exported: (() => RequestHandler)[] = function_names
                    .map(fn_name => {
                        return () => (req, res, next) => {
                            res.locals[fn_name] = wasmModule.instance.exports[fn_name];
                            return next();
                        };
                    });
                @Service
                class WasmService{
                    service_name = module_name;
                    function_names = function_names;
                    run  = exported;
                }
            });
        });

export {modules};
