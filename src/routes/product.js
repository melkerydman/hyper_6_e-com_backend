// import express from "express";
import { Router } from "express";
import { Db, ObjectId } from "mongodb";

/**
 * Add handlers below
 * Handlers take a MongoDB instance and returns an Express handler function to be registered on the router at the bottom
 */

const getProductById = (db) => async (req, res) => {
  const productId = req.params.id;

  if (!ObjectId.isValid(productId)) {
    res.sendStatus(404);
    return;
  }

  const product = await db
    .collection("products")
    .findOne({ _id: new ObjectId(productId) });

  if (product) {
    res.json(product);
  } else {
    res.sendStatus(404);
  }
};

const getProducts = (db) => async (req, res) => {
  console.log("find all products");
  const products = await db.collection("products").find({}).toArray();

  res.json(products);
};

/**
 * Returns product routes.
 * @param db {Db} A connected MongoDB instance.
 * @returns {Router}
 */
export const productRoutes = (db) => {
  const router = new Router();
  // Add routes here
  router.get("/:id", getProductById(db));
  router.get("/", getProducts(db));

  return router;
};
