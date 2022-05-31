import {RequestHandler} from "express";

export function log(): RequestHandler{
    return (_req, _res, next) => {
        console.log('Hello world !');
        next();
    }
}

export default {
    run: log(),
    order: 1,
}
