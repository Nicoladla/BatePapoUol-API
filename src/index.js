import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";

import dayjs from "dayjs";

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
  to: joi.string().required().min(3),
  text: joi.string().required(),
  type: joi.string().required().min(7).max(15),
});

const inputMessage = {
  from: undefined,
  to: "Todos",
  text: "entra na sala...",
  type: "status",
  time: undefined,
};
const exitMessage = {
  from: undefined,
  to: "Todos",
  text: "sai da sala...",
  type: "status",
  time: undefined,
};

async function DeleteInactiveUsers() {
  const hours = dayjs().hour();
  const minutes = dayjs().minute();
  const seconds = dayjs().second();

  try {
    const usersExist = await db.collection("users").find().toArray();
    if (usersExist.length === 0) return;

    usersExist.forEach(async (user) => {
      const idleTime = Date.now() - user.lastStatus;
      if (idleTime < 10000) return;

      await db.collection("users").deleteOne({ name: user.name });

      await db.collection("messages").insertOne({
        ...exitMessage,
        from: user.name,
        time: `${hours}:${minutes}:${seconds}`,
      });
    });
  } catch (error) {
    console.log(error);
  }
}
setInterval(DeleteInactiveUsers, 5000);

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

    const hours = dayjs().hour();
    const minutes = dayjs().minute();
    const seconds = dayjs().second();

    await db.collection("messages").insertOne({
      ...inputMessage,
      from: user.name,
      time: `${hours}:${minutes}:${seconds}`,
    });

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/participants", async (req, res) => {
  const users = await db.collection("users").find().toArray();
  res.send(users);
});

app.post("/messages", async (req, res) => {
  const message = req.body;
  const name = req.headers.user;

  try {
    const userExist = await db.collection("users").findOne({ name });
    if (!userExist) {
      return res.status(422).send("User not found");
    }

    const { error } = messageSchema.validate(message, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(422).send(errors);
    }
    if (message.type !== "message" && message.type !== "private_message") {
      return res.sendStatus(422);
    }

    const hours = dayjs().hour();
    const minutes = dayjs().minute();
    const seconds = dayjs().second();

    await db.collection("messages").insertOne({
      ...message,
      from: name,
      time: `${hours}:${minutes}:${seconds}`,
    });

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.get("/messages", async (req, res) => {
  const user = req.headers.user;
  const limit = Number(req.query.limit);

  try {
    const messages = await db
      .collection("messages")
      .find({ $or: [{ from: user }, { to: user }, { to: "Todos" }] })
      .toArray();

    res.send(messages.slice(-limit));
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.post("/status", async (req, res) => {
  const user = req.headers.user;

  try {
    const userExist = await db.collection("users").findOne({ name: user });
    if (!userExist) {
      return res.sendStatus(404);
    }

    const lastStatus = Date.now();
    await db
      .collection("users")
      .updateOne({ name: user }, { $set: { lastStatus } });

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(process.env.PORT_EXPRESS, () =>
  console.log(`App running on port ${process.env.PORT_EXPRESS}`)
);
