require("dotenv").config();
import express, { Request, Response } from "express";
import User from "./models/user";
import bodyParser from "body-parser";
import passport from "./auth";
import jwt from "jsonwebtoken";

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

app.post("/auth/signup", async (req: Request, res: Response) => {
  try {
    const user = await User.create({
      loginId: req.body.user.loginId,
      name: req.body.user.name,
      iconUrl: req.body.user.iconUrl,
      authorize_token: req.body.user.authorize_token,
    });
  } catch (error) {
    console.log(error);
  }
});

// passportの初期化
app.use(passport.initialize());

app.post(
  "/auth/signin",
  passport.authenticate("local", { session: false }),
  (req, res, next) => {
    // jwtのtokenを作成
    const user = req.user;
    const payload = { user: req.user };
    const token = jwt.sign(payload, `${process.env.JWT_SECRET}` as string, {
      expiresIn: "1m",
    });
    res.json({ user, token });
  }
);

app.listen(3000);
console.log("Server is online.");
