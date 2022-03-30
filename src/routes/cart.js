import { Router } from "express";
import { Db, ObjectId } from "mongodb";

/**
 * Add handlers below
 * Handlers take a MongoDB instance and returns an Express handler function to be registered on the router at the bottom
 */

// Add new cart document to collection
const addCartHandler = (db) => async (req, res) => {
  const cart = req.body;

  const result = await db.collection("cart").insertOne(cart);

  res.json({
    id: result.insertedId,
  });
};

// If cart document exists – update it
const updateCartHandler = (db) => async (req, res) => {
  const cartId = req.params.cartId;
  const requestBody = req.body;

  if (!ObjectId.isValid(cartId)) {
    res.sendStatus(404);
    return;
  }

  const documentCount = await db.collection("cart").count({
    _id: new ObjectId(cartId),
  });
  const cartExists = documentCount === 1;

  if (cartExists) {
    await db
      .collection("cart")
      .updateOne({ _id: new ObjectId(cartId) }, { $set: requestBody });
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};

// Find existing cart document
const findCartByIdHandler = (db) => async (req, res) => {
  const cartId = req.params.cartId;

  const cart = await db
    .collection("cart")
    .findOne({ _id: new ObjectId(cartId) });

  if (cart) {
    res.json(cart);
  } else {
    res.sendStatus(404);
  }
};

/**
 * Returns product routes.
 * @param db {Db} A connected MongoDB instance.
 * @returns {Router}
 */
export const cartRoutes = (db) => {
  const router = new Router();
  // Add routes here
  router.get("/:cartId", findCartByIdHandler(db));
  router.patch("/:cartId", updateCartHandler(db));
  router.post("/", addCartHandler(db));

  return router;
};
