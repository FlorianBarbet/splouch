import {Registry} from './registry';
import express from "express";
import './wasm/wasm-loader';
import './registry-example';
import dotenv from 'dotenv';

dotenv.config();
Registry.use(express(), {port:8000});
