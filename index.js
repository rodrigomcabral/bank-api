//routes > controllers > services > repositories  > db
//send routes > validate and reply them > each rules > access and edit db 

import express from "express";
import accountsRouter from "./routes/account.routes.js";
import winston from "winston";
import cors from "cors";
import AccountService from "./services/account.service.js";
import Schema from "./schema/index.js";

import { promises as fs } from "fs";
//build graphql schema/types
import { buildSchema } from "graphql";
//bridge between server and the express
import { graphqlHTTP } from "express-graphql";

const { readFile, writeFile } = fs;

//recording logs
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, timestamp, label, message }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "my-bank-api.log" }),
  ],
  format: combine(label({ label: "my-bank-api" }), timestamp(), myFormat),
});

//to use a file_name everywhere: global.fileName = "accounts.json";

const app = express();
app.use(express.json());
//cors is used to select in which port is going to allow the app. Comes from express 
app.use(express.static("public"));
//starts here and then we redirect to the routes
app.use("/account", accountsRouter);
//set endpoints independents to be requested
app.use(cors());

// const schema = buildSchema(`
//   type Account {
//     id: Int
//     name: String
//     balance: Float
//   }
//   input AccountInput {
//     id: Int
//     name: String
//     balance: Float
//   }
//   type Query {
//     getAccounts: [Account]
//     getAccount(id: Int): Account
//   }
//   type Mutation {
//     createAccount(account: AccountInput): Account
//     deleteAccount(id: Int): Boolean
//     updateAccount(account: AccountInput): Account
//   }
// `);

//how to respond when the request is made
const root = {
  getAccounts: () => {
    AccountService.getAccounts();
  },
  getAccount: (args) => {
    return AccountService.getAccount(args.id);
  },
  createAccount({ account }) {
    return AccountService.createAccount(account);
  },
  deleteAccount(args) {
    AccountService.deleteAccount(args.id);
  },
  updateAccount({ account }) {
    return AccountService.updateAccount(account);
  },
};

//define endpoints
app.use(
  "/graphql",
  graphqlHTTP({
    schema: Schema,
    //rootValue: root,
    graphiql: true,
  })
);

//we use async/await in case we are handling promises
app.listen(3000, async () => {
  try {
    await readFile("accounts.json");
    //console.log("API started and file created");
    global.logger.info("API started!");
  } catch (error) {
    //check if the file already exists or create one using JSON.stringify bc it will come as an object and we want js
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    writeFile("accounts.json", JSON.stringify(initialJson))
      .then(() => {
        global.logger.info("API started and file created");
      })
      .catch((error) => {
        global.logger.error(error);
        //console.log(error);
      });
  }
});
