import { MongoClient } from "mongodb";
import { createServer } from "./server";

/**
 * Init MongoDB as first step of the process, the server depends on the data from the database
 * Create server and start running. Server includes all routes to API calls.
 */

// Use a MongoDB url from the environment if it exists,
// otherwise use a locally running one.
const DB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017";
// Name of the db in MongoDB
const DB_NAME = "e-com-api";

// Use PORT from the environment or default to 8080.
const PORT = process.env.PORT || 8080;

async function main() {
  const client = new MongoClient(DB_URL);
  await client.connect();

  // Declare database variable
  const db = client.db(DB_NAME);

  // Server takes db as an argument, in order to make it accessible to all routes and route handlers
  const server = createServer(db);

  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Something went wrong", err);

  // process.exit() takes an exit code. 0 indicates that everything went
  // OK, anything else indicates an error.
  process.exit(1);
});
