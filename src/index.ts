require("dotenv").config();
import express, { Request, Response } from "express";
import User from "./models/user";
import bodyParser from "body-parser";
import passport, { hashedBcrypt } from "./auth";
import jwt from "jsonwebtoken";

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
app.post("/auth/signup", async (req, res, next) => {
  try {
    const hashedPassword = await hashedBcrypt(req);

    const { user: params } = req.body;
    const { loginId, name, iconUrl, authorizeToken } = params || {};
    const user = { loginId, name, iconUrl, authorizeToken };
    user.authorizeToken = hashedPassword;

    const searchUser = await User.findAll({
      where: {
        loginId: req.body.user.loginId,
      },
    });

    if (searchUser.some((user) => user.loginId)) {
      return res.status(422).send("user情報がすでに登録されています");
    }

    await User.create(user);
    res.send("user情報の登録が完了しました");
  } catch (error) {
    return res.status(503).send("userが正しく登録できませんでした");
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
    } catch (err) {
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
