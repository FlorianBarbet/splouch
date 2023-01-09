import dotenv from "dotenv";
import fs from "fs";
import {EventEmitter} from "events";

dotenv.config();

let timeout: NodeJS.Timeout;
const emitter = new EventEmitter();
const envvar: {[name: string]:string|boolean|number} = {};
fs.watch(".env", (event, filename) => {
    if(event === 'change'){
        clearTimeout(timeout);
        timeout = setTimeout(() => emitter.emit("onchange_envvar", filename), 250);
    }
});

emitter.on("onchange_envvar", () => {
    const {parsed} = dotenv.config({override: true});
    // let add some cast and unary operations.
    for(const key in parsed){
       const value = parsed[key];
       if(value.toLowerCase() === 'true' || value.toLowerCase() === 'false') envvar[key] = value === 'true'
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
