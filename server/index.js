import app from "./app.js";
import { connectToDb } from "./config/db.js";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectToDb();

    app.listen(PORT, () => {
      console.log("Server running on port", PORT);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
