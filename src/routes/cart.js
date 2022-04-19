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
  const { userId, productId, quantity, title, price } = req.body;

  const collection = await db.collection("carts");

  const inCart = await collection.count({
    _id: userId,
    "items._id": new ObjectId(productId),
  });

  // Calculate new total price to be added to cart object
  const newTotalPrice = quantity * price;

  if (inCart > 0) {
    console.log(
      "Aldready in cart, will update item and increase total quantity"
    );
    await collection.updateOne(
      { _id: userId, "items._id": new ObjectId(productId) },
      {
        $inc: {
          "items.$.quantity": quantity,
          totalPrice: newTotalPrice,
          totalQuantity: quantity,
        },
      }
    );
    res.status(200).json(userId);
  }

  // Document not exists then add document
  else {
    console.log("Not in cart, will create and update total quantity");
    await collection.updateOne(
      { _id: userId },
      {
        $inc: {
          totalQuantity: quantity,
          totalPrice: newTotalPrice,
        },
        $push: {
          items: {
            _id: new ObjectId(productId),
            quantity: quantity,
            title: title,
            price: price,
          },
        },
      },
      { upsert: true }
    );
    res.status(200).json(userId);
  }
};

const removeFromCart = (db) => async (req, res) => {
  const { userId, productId, clear } = req.body;

  const collection = await db.collection("carts");

  const cart = await collection.findOne({ _id: userId });
  const cartItemToRemove = cart.items.find(
    (item) => item._id.toString() === new ObjectId(productId).toString()
  );

  if (!clear) {
    if (cartItemToRemove.quantity > 1) {
      console.log("mulitple items left");
      await collection.updateOne(
        { _id: userId, "items._id": new ObjectId(productId) },
        {
          $inc: {
            "items.$.quantity": -1,
            totalPrice: -cartItemToRemove.price,
            totalQuantity: -1,
          },
        }
      );
    }
    // else {
    //   console.log("only one item left");
    //   await collection.updateOne(
    //     { _id: userId, "items._id": new ObjectId(productId) },
    //     {
    //       $inc: {
    //         totalPrice: -cartItemToRemove.price,
    //         totalQuantity: -1,
    //       },
    //       $pull: { items: { _id: new ObjectId(productId) } },
    //     }
    //   );
    // }
    res.status(200).json(userId);
  } else {
    const sumToSubract = cartItemToRemove.price * cartItemToRemove.quantity;

    await collection.updateOne(
      { _id: userId, "items._id": new ObjectId(productId) },
      {
        $inc: {
          totalPrice: -sumToSubract,
          totalQuantity: -cartItemToRemove.quantity,
        },
        $pull: { items: { _id: new ObjectId(productId) } },
      }
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
  router.delete("/", removeFromCart(db));

  return router;
};
