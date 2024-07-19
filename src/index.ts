import express, { Request, Response } from "express";
import Users from "./models/users";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "ok" });
});

app.listen(3000);
console.log("Server is online..");

app.post("/auth/signup", async (req: Request, res: Response) => {
  try {
    const user = await Users.create({
      loginId: "hoge@example.com",
      name: "hoge",
      iconUrl: "http://localhost",
      authorize_token: "password",
    });
    console.log(user.toJSON());
  } catch (error) {
    console.log(error);
  }
});
