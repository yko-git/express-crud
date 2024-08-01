require("dotenv").config();
import express, { Request, Response } from "express";
import User from "./models/user";
import bodyParser from "body-parser";
import passport, { hash } from "./auth";
import jwt from "jsonwebtoken";
import Post from "./models/post";

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
    const hashedPassword = await hash(req);

    const { user: params } = req.body;
    const { loginId, name, iconUrl, authorizeToken } = params || {};
    const user = { loginId, name, iconUrl, authorizeToken };
    user.authorizeToken = hashedPassword;

    const searchUser = await User.findAll({
      where: {
        loginId: req.body.user.loginId,
      },
    });

    if (searchUser.length) {
      return res
        .status(400)
        .json({ errorMessage: "user情報がすでに登録されています" });
    }

    await User.create(user);
    res.json({ errorMessage: "user情報の登録が完了しました" });
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "userが正しく登録できませんでした" });
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
      return res.status(401).json({ errorMessage: "認証ができませんでした。" });
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
        return res
          .status(500)
          .json({ errorMessage: "認証ができませんでした。" });
      } else {
        return res.send(user.user);
      }
    }
  )(req, res, next);
});

// posts
app.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { post: params } = req.body;
      const { userId, title, body, status, categoryIds } = params || {};
      const post = { userId, title, body, status, categoryIds };

      await Post.create(post);
      res.json({ post });
    } catch (err) {
      return res.status(401).json({ errorMessage: "登録ができませんでした。" });
    }
  }
);

app.get(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const posts = await Post.findAll();
    if (posts) {
      res.json({ posts });
    } else {
      return res.status(401).json({ errorMessage: "取得ができませんでした。" });
    }
  }
);
