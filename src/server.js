// import express, { Express } from "express";
import express from "express";
import { Db } from "mongodb";
import cors from "cors";
import { productRoutes } from "./modules/products.js";

/**
 * Returns a bootstrapped Express server
 * @param db {Db} A connected MongoDB instance
 * @returns {Express}
 */
export function createServer(db) {
  const app = express();

  app.use(express.json());
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );
  app.use("/products", productRoutes(db));

  return app;
}
