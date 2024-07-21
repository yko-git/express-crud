import express, { Request, Response } from "express";
import User from "./models/user";
import bodyParser from "body-parser";
// import passport from "./auth";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "ok" });
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.listen(3000);
console.log("Server is online.");

app.post("/auth/signup", async (req: Request, res: Response) => {
  try {
    const user = await User.create({
      loginId: req.body.user.loginId,
      name: req.body.user.name,
      iconUrl: req.body.user.iconUrl,
      authorize_token: req.body.user.authorize_token,
    });
    console.log(`req.body:${req.body}`);
  } catch (error) {
    console.log(error);
  }
});
