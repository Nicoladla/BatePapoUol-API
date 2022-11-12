import express, { application } from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URL);
await mongoClient.connect();
const db = mongoClient.db();

app.listen(process.env.PORT_EXPRESS, () =>
  console.log(`App running on port ${process.env.PORT_EXPRESS}`)
);
