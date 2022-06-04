import path from "path";
import fs from "fs";

const modules: {[name: string]: WebAssembly.WebAssemblyInstantiatedSource } = {};

const module_path = process.env.WASM_MODULE_PATH || path.join(__dirname, 'modules');
console.debug(`process.env.WASM_MODULE_PATH = ${process.env.WASM_MODULE_PATH}`);
console.debug(`WebAssembly module dir : ${module_path}`);

if(fs.existsSync(module_path))
    fs.readdirSync(module_path)
        .forEach(file => {
            const wasmBuffer = fs.readFileSync(path.join(module_path, file));
            WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
                console.debug(`Load WebAssembly file : ${file}`);
                modules[file.replace('_bg.wasm', '')] = wasmModule;
            });
        });

export {modules};
