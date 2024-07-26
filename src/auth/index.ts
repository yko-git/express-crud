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
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: `${process.env.JWT_SECRET}`,
};

passport.use(
  new JWTStrategy(opts, (jwt_payload: any, done: any) => {
    done(null, jwt_payload);
  })
);

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
