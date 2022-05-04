import { Router } from "express";
import { Db, ObjectId } from "mongodb";

/**
 * Add handlers below
 * Handlers take a MongoDB instance and returns an Express handler function to be registered on the router at the bottom
 */

// Pass cartId
// If cart id exists, update cart
// If id doesn't exist, create with upsert id

// Find existing cart document
const getCartById = (db) => async (req, res) => {
  const cartId = req.params.cartId;
  console.log(cartId);
  const collection = await db.collection("carts");

  const cart = await collection.findOne({ _id: new ObjectId(cartId) });

  if (cart) {
    res.json(cart);
  } else {
    console.log(cart);
    res.sendStatus(404);
  }
};

const addToCart = (db) => async (req, res) => {
  const { cartId, productId, quantity, title, price } = req.body;

  // console.log("passed data: ", req.body);
  console.log("cartId: ", cartId);

  const collection = await db.collection("carts");

  const inCart = await collection.count({
    _id: new ObjectId(cartId),
    "items._id": new ObjectId(productId),
  });

  // Calculate new total price to be added to cart object
  const newTotalPrice = quantity * price;

  if (inCart > 0) {
    console.log(
      "Already in cart, will update item and increase total quantity"
    );
    await collection.updateOne(
      { _id: new ObjectId(cartId), "items._id": new ObjectId(productId) },
      {
        $inc: {
          "items.$.quantity": quantity,
          totalPrice: newTotalPrice,
          totalQuantity: quantity,
        },
      }
    );

    res.status(200).json(cartId);
  }

  // Document not exists then add document
  else {
    console.log("Not in cart, will create and update total quantity");
    const newCart = await collection.updateOne(
      { _id: cartId !== undefined ? new ObjectId(cartId) : new ObjectId() },
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
    console.log("newCart: ", newCart);
    res.status(200).json(cartId !== undefined ? cartId : newCart);
  }
};

const removeFromCart = (db) => async (req, res) => {
  const { cartId, productId, clear } = req.body;
  console.log(req.body);

  const collection = await db.collection("carts");

  const cart = await collection.findOne({ _id: new ObjectId(cartId) });
  const cartItemToRemove = cart.items.find(
    (item) => item._id.toString() === new ObjectId(productId).toString()
  );
  console.log("item to remove:", cartItemToRemove);

  if (!clear) {
    if (cartItemToRemove.quantity > 1) {
      console.log("mulitple items left");
      await collection.updateOne(
        { _id: new ObjectId(cartId), "items._id": new ObjectId(productId) },
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
    //     { _id: cartId, "items._id": new ObjectId(productId) },
    //     {
    //       $inc: {
    //         totalPrice: -cartItemToRemove.price,
    //         totalQuantity: -1,
    //       },
    //       $pull: { items: { _id: new ObjectId(productId) } },
    //     }
    //   );
    // }
    res.status(200).json(cartId);
  } else {
    const sumToSubract = cartItemToRemove.price * cartItemToRemove.quantity;

    await collection.updateOne(
      { _id: new ObjectId(cartId), "items._id": new ObjectId(productId) },
      {
        $inc: {
          totalPrice: -sumToSubract,
          totalQuantity: -cartItemToRemove.quantity,
        },
        $pull: { items: { _id: new ObjectId(productId) } },
      }
    );
    res.status(200).json(cartId);
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
