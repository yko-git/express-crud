require("dotenv").config();
import express, { Request, Response } from "express";
import { User } from "./models/user";
import bodyParser from "body-parser";
import passport, { hash } from "./auth";
import jwt from "jsonwebtoken";
import { Post } from "./models/post";
import { sequelize } from "./models";

if (!process.env.MYPEPPER || !process.env.JWT_SECRET) {
  console.error("env vars are not set.");
  process.exit(1);
}

const app = express();
app.listen(3000);

(async () => {
  // await sequelize.sync({ alter: true });
  console.log("synchronized");
})();

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
    const { id, loginId, name, iconUrl, authorizeToken } = params || {};
    const user = { id, loginId, name, iconUrl, authorizeToken };
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
    console.log(error);
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
        expiresIn: "30days",
      });
      res.json({ user, token });
    } catch (err) {
      return res.status(401).json({ errorMessage: "認証ができませんでした。" });
    }
  }
);

// user
app.get(
  "/user",
  passport.authenticate("jwt", {
    session: false,
  }),
  async (req: any, res: Response) => {
    const { user } = req.user;
    if (!user) {
      return res.status(500).json({ errorMessage: "認証ができませんでした。" });
    } else {
      return res.send(user);
    }
  }
);

// /user/posts
app.get(
  "/user/posts",
  passport.authenticate("jwt", {
    session: false,
  }),
  async (req: any, res: Response) => {
    const { user } = req.user;
    try {
      const posts = await User.getUserPost(user, req);
      return res.json({ posts });
    } catch (err) {
      console.log(err);
      return res
        .status(401)
        .json({ errorMessage: "情報が取得できませんでした。" });
    }
  }
);

// posts
app.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  async (req: any, res: Response) => {
    const { user } = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ errorMessage: "情報が取得できませんでした。" });
    }
    try {
      const post = await Post.createPost(req, user);
      res.json({ post });
    } catch (err) {
      console.log(err);
      return res.status(401).json({ errorMessage: "登録ができませんでした。" });
    }
  }
);

app.get(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  async (req: any, res) => {
    try {
      const status = req.query;
      const posts = await Post.findAll({ where: status });
      return res.json({ posts });
    } catch (err) {
      console.log(err);
      return res
        .status(401)
        .json({ errorMessage: "情報が取得できませんでした。" });
    }
  }
);

app.get(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  async (req: any, res) => {
    const params = req.params;
    const id = params.id.slice(1, params.id.length);
    const posts = await Post.findOne({
      where: {
        id: id,
      },
    });

    if (posts) {
      return res.json({ posts });
    } else {
      return res
        .status(401)
        .json({ errorMessage: "情報が取得できませんでした。" });
    }
  }
);

app.delete(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  async (req: any, res) => {
    try {
      await Post.deletePost(req);
      return res.json("投稿を削除しました。");
    } catch (err) {
      return res
        .status(401)
        .json({ errorMessage: "情報が取得できませんでした。" });
    }
  }
);

app.patch(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  async (req: any, res) => {
    try {
      await Post.updatePost(req);
      res.json("投稿を更新しました。");
    } catch (err) {
      console.log(err);
      return res.status(401).json({ errorMessage: "登録ができませんでした。" });
    }
  }
);
