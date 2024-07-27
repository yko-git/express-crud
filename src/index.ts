require("dotenv").config();
import express, { Request, Response } from "express";
import User from "./models/user";
import bodyParser from "body-parser";
import passport from "./auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

if (!process.env.MYPEPPER || !process.env.JWT_SECRET) {
  console.error("env vars are not set.");
  process.exit(1);
}

const app = express();
app.listen(3000);
console.log("Server is online.");

// passportの初期化
app.use(passport.initialize());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// index
app.get("/", (req: Request, res: Response) => {
  res.send({ message: "ok" });
});

// auth/signup
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
    res.json({ message: "登録ができませんでした。" });
  }
});

// auth/login
app.post(
  "/auth/login",
  passport.authenticate("local", {
    session: false,
  }),
  (req: Request, res: Response) => {
    try {
      // jwtのtokenを作成
      const user = req.user;
      const payload = { user: req.user };
      const token = jwt.sign(payload, `${process.env.JWT_SECRET}` as string, {
        expiresIn: "3m",
      });
      res.json({ user, token });
    } catch (error) {
      return res.status(401).send("認証ができませんでした。");
    }
  }
);

// user
app.get(
  "/user",
  passport.authenticate("jwt", {
    session: false,
  }),
  function (req, res) {
    res.send(req.user);
  }
);
