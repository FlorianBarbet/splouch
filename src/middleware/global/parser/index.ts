import bodyParser from "body-parser";

export default {
    run: bodyParser.json({limit: '50mb'})
}