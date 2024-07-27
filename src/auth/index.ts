require("dotenv").config();
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user";
import bcrypt from "bcrypt";
import {
  Strategy as JWTStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";

// passport-jwtの設定
const opts: StrategyOptions = {
  //JWTをリクエストから取得する方法を指定（Bearerトークンから取得）
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //シークレット文字列
  secretOrKey: `${process.env.JWT_SECRET}`,
};

// JWT トークンの検証（受信したJWTトークンの検証・ログイン中のユーザーか判定）
passport.use(
  new JWTStrategy(opts, (jwt_payload: any, done: any) => {
    done(null, jwt_payload);
  })
);

// ログイン処理（strategy）の定義
passport.use(
  "local",
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
      if (user) {
        let userMatch = await bcrypt.compare(
          `${password}${process.env.MYPEPPER}`,
          user.dataValues.authorizeToken
        );
        if (userMatch) {
          const { loginId, name, iconUrl, createdAt, updatedAt } = user;
          return done(
            null,
            {
              loginId,
              name,
              iconUrl,
              createdAt,
              updatedAt,
            },
            {
              message: "ユーザーID・パスワードが正しく認証されました。",
            }
          );
        }
      } else {
        done(null, false, {
          message: "認証情報と一致するレコードがありません。",
        });
      }
    }
  )
);

export default passport;
