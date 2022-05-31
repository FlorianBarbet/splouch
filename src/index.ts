import {instance} from "./server";

const port = 8000;
const app = instance();

app.listen(port, () => console.log(`server is listening on ${port}`));
