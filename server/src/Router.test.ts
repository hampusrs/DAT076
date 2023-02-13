import * as SuperTest from "supertest";
import {app} from "./index";

const request = SuperTest.default(app);

test("End-to-end test", async () => {
    const res1 = await request.get("/game");
    expect(res1.statusCode).toEqual(200);
    const res2 = await request.post("/game").send({ action : "StartGame"});
    expect(res2.statusCode).toEqual(200);
    console.log(res2.body);
    expect(res2.body.currentSong).not.toBeNull();
});
