import {Registry} from './registry';
import express from "express";
import './wasm/wasm-loader';
import './registry-example';
import {emitter, envvar} from "./envvar-reloader";
import {type} from "os";
emitter.on("onchange_envvar", (event) => {
    console.debug(`change detected on ${event}`)
});

Registry.use(express(), {port:8000});
