require("dotenv").config();
import express, { Request, Response } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user";

const app = express();

passport.use(
  new LocalStrategy(
    {
      usernameField: "loginId",
      passwordField: "authorizeToken",
      session: false,
    },
    (loginId: string, authorizeToken: string, done: any) => {
      User.findOne({
        where: { loginId: loginId, authorizeToken: authorizeToken },
      })
        .then((user) => {
          if (user) {
            return done(null, loginId);
          }

          throw new Error();
        })
        .catch((error) => {
          // エラー処理

          return done(null, false, {
            message: "認証情報と一致するレコードがありません。",
          });
        });
    }
  )
);

export default passport;
