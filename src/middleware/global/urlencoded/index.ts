import bodyParser from "body-parser";

export default {
    run: bodyParser.urlencoded({limit: '50mb', extended: true})
}