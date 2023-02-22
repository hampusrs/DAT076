import  express from "express";
import cors from "cors";
// import { Express} from "express";
import { gameRouter } from "./router/game";

export const app = express();

app.use(express.json());
app.use(cors());

app.use("/", gameRouter);
const PORT : number = 8080;

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
