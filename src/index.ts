import {Registry} from './registry';
import express from "express";
import './wasm/wasm-loader';
import './registry-example';
import {emitter} from "./envvar-reloader";
emitter.on("onchange_envvar", (event) => {
    console.debug(`change detected on ${event}`)
});

Registry.use(express(), {port:8000});
