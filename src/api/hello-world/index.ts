import {ApiRoute} from "../../server";
import {Router} from "express";

export const router = Router();

export default <ApiRoute> {
    router,
    middlewares: [],
    base:{
        params: ['name?', 'lastname?'],
        methods: ['get'],
        action:async (req, res) => {
            if(!!res.locals.service) res.locals.service.hi()
            if(!!req.params['name'] && !!req.params['lastname'])
                return res.status(200).send(`Hello world ${req.params['name']} ${req.params['lastname']} !`);

            if(!!req.params['name'])
                return res.status(200).send(`Hello world ${req.params['name']} !`);


            res.status(200).send(`Hello world !`);
        },
    }
}
