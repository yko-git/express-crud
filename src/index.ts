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
app.post(
  "/auth/signup",
  async (req, res, next) => {
    let hashedPassword = await bcrypt.hash(
      `${req.body.user.password}${process.env.MYPEPPER}`,
      10
    );

    const searchUser = await User.findAll({
      where: {
        loginId: req.body.user.loginId,
      },
    });
    let result: string[] = [];
    searchUser.forEach((value) => {
      result.push(value.dataValues.loginId);
    });

    if (result.length <= 1) {
      console.log("user情報が登録されました");
      next();
    } else {
      console.log("user情報がすでに登録されています");
      return res.status(401).send("user情報がすでに登録されています");
    }
    const { user: params } = req.body;
    const { loginId, name, iconUrl, authorizeToken } = params || {};
    const user = { loginId, name, iconUrl, authorizeToken };
    user.authorizeToken = hashedPassword;
    await User.create(user);
    next();
  },
  (req, res, next) => {
    res.send("user情報の登録が完了しました");
  }
);

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
app.get("/user", function (req, res, next) {
  passport.authenticate(
    "jwt",
    {
      session: false,
    },
    function (err: any, user: any) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).send("認証ができませんでした。");
      } else {
        return res.send(user.user);
      }
    }
  )(req, res, next);
});
