import express, { Request, Response } from "express";
const bodyParser = require("body-parser");

const app = express();
const models = require("./models");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "ok" });
});

app.listen(3000);
console.log("Server is online..");

app.post("/auth/signup", async (req: Request, res: Response) => {
  try {
    const user = await models.Users.create({
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
