import {instance} from './server';
import {Registry} from './registry';
import './registry-example';
import './wasm/wasm-loader';


const port = 8001;
export const app = instance();
Registry.use(app, {port});




