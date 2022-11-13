import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URL);
await mongoClient.connect();
const db = mongoClient.db("batepapo-uol");

const userSchema = joi.object({
  name: joi.string().required().min(3),
});
const messageSchema = joi.object({
  from: joi.string().required(),
  to: joi.string().required(),
  text: joi.string().required(),
  type: joi.string().required(),
  time: joi.string().required(),
});

app.post("/participants", async (req, res) => {
  const user = req.body;

  const { error } = userSchema.validate(user, { abortEarly: true });

  if (error) {
    return res.sendStatus(422);
  }

  try {
    const userExist = await db.collection("users").findOne({ name: user.name });

    if (userExist) {
      return res.sendStatus(409);
    }

    await db
      .collection("users")
      .insertOne({ name: user.name, lastStatus: Date.now() });
  
      //Ainda falta enviar a msg de status, instalar a biblioteca dayjs.
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(process.env.PORT_EXPRESS, () =>
  console.log(`App running on port ${process.env.PORT_EXPRESS}`)
);
