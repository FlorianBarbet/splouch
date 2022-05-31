import {ApiRoute} from "../../server";
import {Router} from "express";

export const router = Router();

export default <ApiRoute> {
    path: '/hello-world',
    middlewares: [],
    router,
    base:{
        methods: ['get'],
        action:async (req, res) => {
            res.status(200).send("Hello world !");
        },
        middlewares: [],
    }
}
