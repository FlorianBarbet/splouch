import {RequestHandler} from "express";

export function log(): RequestHandler{
    return (_req, res, next) => {
        console.log('Hello world !');
        res.locals.service = {
            hi:() => {
                console.log('Hi ho');
            }
        }
        next();
    }
}

export default {
    run: log(),
    order: 1,
}
