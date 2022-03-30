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

import { Router } from "express";
import { Db, ObjectId } from "mongodb";

/**
 * Returns product routes.
 * @param db {Db} A connected MongoDB instance.
 * @returns {Router}
 */
export const orderRoutes = (db) => {
  const router = new Router();
  // Add routes here

  return router;
};
