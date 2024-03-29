import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Route from "./routes/routes.js";
import winston from "winston";
import cloudinary from "cloudinary";
import "winston-mongodb";

async function startServer() {
  dotenv.config("dotenv");

  const ENV = process.env;
  const app = express();
  mongoose.Promise = global.Promise;

  mongoose.set("strictQuery", true);
  // ENV.DB_URL
  // ENV.TESTDB
  // const DBURL = ENV.TESTDB
  const DBURL = ENV.DB_URL;
  // Connect MongoDB at default port 27017.
  mongoose.connect(
    DBURL,
    {
      useNewUrlParser: true,
    },
    (err) => {
      if (!err) {
        console.log("MongoDB Connection Succeeded." + DBURL);
      } else {
        console.log("Error in DB connection: " + err);
      }
    }
  );

  winston.add(
    new winston.transports.MongoDB({
      level: "info",
      db: DBURL,
      options: { useUnifiedTopology: true },
      name: "mongodb-logger",
      collection: "logs",
      label: "mongodb-logger",
    })
  );
  winston.add(
    new winston.transports.MongoDB({
      level: "error",
      db: DBURL,
      options: { useUnifiedTopology: true },
    })
  );

  app.use(
    cors({
      origin: [
        "https://arkanfonts.vercel.app",
        "https://arkan-font-dash.vercel.app",
        "http://localhost:3001",
        "http://localhost:3000",
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
        "Access-Control-Allow-Origin",
        "Content-Length",
        "Accept-Encoding",
        "X-CSRF-Token",
      ],
      credentials: true,
      preflightContinue: false,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(Route);
  cloudinary.config({
    cloud_name: ENV.CLD_API_KEY_NAME,
    api_key: ENV.CLD_API_KEY,
    api_secret: ENV.CLD_API_KEY_SEC,
  });
  app.listen(ENV.PORT, () => {
    console.log(`server online in port:` + ENV.PORT);
  });
}
startServer();
