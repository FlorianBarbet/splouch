import {Registry} from './registry';
import express from "express";
import './wasm/wasm-loader';
import './registry-example';
import {emitter, envvar} from "./envvar-reloader";

emitter.on("onchange_envvar", (event) => {
    console.debug(`change detected on ${event}`)
    console.debug(envvar);
});

Registry.use(express(), {port:8000});
