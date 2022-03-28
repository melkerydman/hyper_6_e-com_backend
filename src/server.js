// import express, { Express } from "express";
import express from "express";
import { Db } from "mongodb";
import { productRoutes } from "./modules/products.js";

/**
 * Returns a bootstrapped Express server
 * @param db {Db} A connected MongoDB instance
 * @returns {Express}
 */
export function createServer(db) {
  const app = express();

  app.use(express.json());
  app.use("/products", productRoutes(db));

  return app;
}
