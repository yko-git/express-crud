require("dotenv").config();
import express, { Request, Response } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user";
import bcrypt from "bcrypt";

const app = express();

passport.use(
  new LocalStrategy(
    {
      usernameField: "loginId",
      passwordField: "password",
      session: false,
    },
    async (loginId: string, password: string, done: any) => {
      const user = await User.findOne({
        where: { loginId: loginId },
      });
      try {
        if (user) {
          let userMatch = await bcrypt.compare(
            `${password}${process.env.MYPEPPER}`,
            user.dataValues.authorizeToken
          );
          if (userMatch) {
            return done(null, loginId, {
              message: "ユーザーID・パスワードが正しく認証されました。",
            });
          }
        }

        throw new Error();
      } catch (error) {
        return done(null, false, {
          message: "認証情報と一致するレコードがありません。",
        });
      }
    }
  )
);

export default passport;
