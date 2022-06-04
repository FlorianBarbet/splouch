import {Registry} from './registry';
import express from "express";
import './wasm/wasm-loader';
import './registry-example';

Registry.use(express(), {port:8000});
