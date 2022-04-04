import { Router } from "express";
import { Db, ObjectId } from "mongodb";

/**
 * Add handlers below
 * Handlers take a MongoDB instance and returns an Express handler function to be registered on the router at the bottom
 */

// Find existing cart document
const getCartById = (db) => async (req, res) => {
  const cartId = req.params.cartId;
  const collection = await db.collection("carts");

  const cart = await collection.findOne({ _id: cartId });

  if (cart) {
    res.json(cart);
  } else {
    console.log(cart);
    res.sendStatus(404);
  }
};

const addToCart = (db) => async (req, res) => {
  const userId = req.body.userId;
  const productId = req.body.productId;
  const quantity = req.body.quantity;

  console.log("typeof userId: ", typeof userId);

  const collection = await db.collection("carts");

  const inCart = await collection.count({
    _id: userId,
    "items._id": new ObjectId(productId),
  });

  if (inCart > 0) {
    console.log(
      "Aldready in cart, will update item and increase total quantity"
    );
    const result = await collection.updateOne(
      { _id: userId, "items._id": new ObjectId(productId) },
      { $inc: { "items.$.quantity": quantity, totalQuantity: quantity } }
    );
    res.status(200).json(userId);
  }

  // Document not exists then add document
  else {
    console.log("Not in cart, will create and update total quantity");
    const result = await collection.updateOne(
      { _id: userId },
      {
        $inc: {
          totalQuantity: quantity,
        },
        $push: { items: { _id: new ObjectId(productId), quantity: quantity } },
      },
      { upsert: true }
    );
    res.status(200).json(userId);
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
  router.get("/:cartId", getCartById(db));
  // router.patch("/:cartId", updateCartHandler(db));
  // router.post("/", addCartHandler(db));
  router.post("/", addToCart(db));

  return router;
};
