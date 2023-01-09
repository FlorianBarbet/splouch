import dotenv from "dotenv";
import fs from "fs";
import {EventEmitter} from "events";

dotenv.config();

let timeout: NodeJS.Timeout;
const emitter = new EventEmitter();
fs.watch(".env", (event, filename) => {
    if(event === 'change'){
        clearTimeout(timeout);
        timeout = setTimeout(() => emitter.emit("onchange_envvar", filename), 250);
    }
});

emitter.on("onchange_envvar", () => {
    dotenv.config({override: true});
})

export {
    emitter
}
