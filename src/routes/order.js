// _oid: String;
// items: {
//   item: {
//     id: String;
//     quantity: Number;
//   }
// }
// amount: Number;
// packed: Boolean;
// shipped: Boolean;

import { response } from "express";
import { Router } from "express";
import { Db, ObjectId } from "mongodb";

const getOrders = (db) => async (req, res) => {
  const ordersCol = await db.collection("orders");
  console.log(ordersCol);
};

const createOrder = (db) => async (req, res) => {
  const { formData, cart } = req.body;
  console.log("formdata: ", formData);
  console.log("cart: ", cart);

  const ordersCol = await db.collection("orders");
  const cartsCol = await db.collection("carts");

  const orderId = await ordersCol
    .insertOne({
      items: cart.items,
      amount: cart.totalPrice,
      userInfo: formData,
      orderStatus: { packed: false, dispatched: false },
    })
    .then((resp) => {
      console.log("response: ", resp);
      return resp.insertedId;
    });

  cartsCol.deleteOne({ _id: cart._id });
  res.json(orderId);
};

/**
 * Returns product routes.
 * @param db {Db} A connected MongoDB instance.
 * @returns {Router}
 */
export const orderRoutes = (db) => {
  const router = new Router();
  // Add routes here
  router.get("/", getOrders(db));
  router.post("/", createOrder(db));

  return router;
};
