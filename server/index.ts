import  express from "express";
import { Express} from "express";
import { gameRouter } from "./src/router/Game";

const app : Express = express();

app.use(express.json());

app.use("/", gameRouter);

app.listen(8080);