import dotenv from "dotenv";
import fs from "fs";
import {EventEmitter} from "events";

const ext  = process.env.ENV_TYPE ?? "";
const conf_path = process.env.CONF_PATH ?? undefined;
const path = `${(conf_path || ".env")}${ext}`;

const encoding = process.env.DOT_ENV_ENCODING ?? "utf-8";
const debug = process.env.DEBUG === 'true'



dotenv.config({path, encoding, debug});

let timeout: NodeJS.Timeout;
const emitter = new EventEmitter();
const envvar: {[name: string]:string|boolean|number} = {};
fs.watch(path || ".env", (event, filename) => {
    if(event === 'change'){
        clearTimeout(timeout);
        timeout = setTimeout(() => emitter.emit("onchange_envvar", filename), 250);
    }
});

emitter.on("onchange_envvar", () => {
    const {parsed} = dotenv.config({override: true, path, encoding, debug});
    // let add some cast and unary operations.
    for(const key in parsed){
       const value = parsed[key];

       if(value.toLowerCase().match('^(true|false)$')) envvar[key] = value.toLowerCase() === 'true'
       else {
           const numeric_value = +value
           envvar[key] = isNaN(numeric_value) ? value : numeric_value;
       }
    }
});

export {
    emitter,
    envvar
}
