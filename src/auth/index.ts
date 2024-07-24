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
        where: { loginId: loginId, authorizeToken: password },
      });
      let hashedPassword = await bcrypt.hash(
        `${password}${process.env.MYPEPPER}`,
        10
      );
      try {
        if (user) {
          if (user.dataValues.authorizeToken === hashedPassword) {
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
