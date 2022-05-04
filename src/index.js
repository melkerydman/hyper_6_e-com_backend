import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";
import { createServer } from "./server.js";

/**
 * Init MongoDB as first step of the process, the server depends on the data from the database
 * Create server and start running. Server includes all routes to API calls.
 */

// Use a MongoDB url from the environment if it exists,
// otherwise use a locally running one.
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

// Name of the db in MongoDB
const DB_NAME = "data-interaction";

// Use PORT from the environment or default to 8080.
// const PORT = process.env.PORT || 8080;
// console.log(PORT);

async function main() {
  // const client = new MongoClient(DB_URL);
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  await client.connect();

  // Declare database variable
  const db = client.db(DB_NAME);

  // Server takes db as an argument, in order to make it accessible to all routes and route handlers
  const server = createServer(db);

  server.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Something went wrong", err);

  // process.exit() takes an exit code. 0 indicates that everything went
  // OK, anything else indicates an error.
  process.exit(1);
});
