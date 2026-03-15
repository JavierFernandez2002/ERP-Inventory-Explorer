import app from "./app";
import { redisClient } from "./config/redis";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();