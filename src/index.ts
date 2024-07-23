require("dotenv").config();
import express, { Request, Response } from "express";
import User from "./models/user";
import bodyParser from "body-parser";
import passport from "./auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const app = express();

if (process.env.MYPEPPER) {
  app.listen(3000);
  console.log("Server is online.");
}

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
    let hashedPassword = await bcrypt.hash(
      `${req.body.user.password}${process.env.MYPEPPER}`,
      10
    );
    const user = await User.create({
      loginId: req.body.user.loginId,
      name: req.body.user.name,
      iconUrl: req.body.user.iconUrl,
      authorizeToken: hashedPassword,
    });
  } catch (error) {
    console.log(error);

    res.json({ error });
  }
});

// passportの初期化
app.use(passport.initialize());

app.post(
  "/auth/signin",
  passport.authenticate("local", { session: false }),
  (req: Request, res: Response, next) => {
    // jwtのtokenを作成
    const user = req.user;
    const payload = { user: req.user };
    const token = jwt.sign(payload, `${process.env.JWT_SECRET}` as string, {
      expiresIn: "1m",
    });
    res.json({ user, token });
  }
);
