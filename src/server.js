// import express, { Express } from "express";
import express from "express";
import { Db } from "mongodb";
import cors from "cors";
import { productRoutes } from "./routes/product.js";
import { orderRoutes } from "./routes/order.js";
import { cartRoutes } from "./routes/cart.js";

/**
 * Returns a bootstrapped Express server
 * @param db {Db} A connected MongoDB instance
 * @returns {Express}
 */
export function createServer(db) {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use("/products", productRoutes(db));
  app.use("/orders", orderRoutes(db));
  app.use("/cart", cartRoutes(db));

  return app;
}
