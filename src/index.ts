import {instance} from "./server";
import {Registry} from "./registry";
import * as Example from "./registry-example";

const port = 8000;
export const app = instance();

Example.setup();
Registry.loadExpress(app, () => app.listen(port, () => console.log(`server up on ${port}`)));






