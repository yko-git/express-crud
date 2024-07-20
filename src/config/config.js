require("dotenv").config();

 const configs = {
  development: {
    username: "root",
    password: process.env.SECRET_KEY,
    database: "database_development",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};

const config = configs[process.env.NODE_ENV || "development"];

module.exports = config;
