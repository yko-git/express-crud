import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "ok" });
});

app.listen(3000, () => {
  console.log("リクエストをポート3000で待受中");
});
