const express = require("express");
const app = express();

// リクエストが来るたびに処理が走るコールバック
app.use((req, res) => {
  console.log("リクエストを受け付けました");
  res.send({ message: "ok" });
});

app.listen(3000, () => {
  console.log("リクエストをポート3000で待受中");
});
