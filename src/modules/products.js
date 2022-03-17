import { Router } from "express";
import { Db } from "mongodb";

/**
 * Add handlers below
 * Handlers take a MongoDB instance and returns an Express handler function to be registered on the router at the bottom
 */

export function productRoutes(db) {
  const router = new Router();
  // Add routes here
  return router;
}
/**
 * Returns movie routes.
 * @param db {Db} A connected MongoDB instance.
 * @returns {Router}
 */
