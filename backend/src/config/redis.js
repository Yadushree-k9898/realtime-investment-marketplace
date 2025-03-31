const Redis = require("ioredis");
require("dotenv").config();

const redis = new Redis(process.env.REDIS_URL, {
    retryStrategy: (times) => {
        console.log(`🔄 Redis reconnect attempt #${times}`);
        return Math.min(times * 50, 2000); // Exponential backoff, max 2s
    },
    reconnectOnError: (err) => {
        console.error("❌ Redis Connection Error:", err);
        return true; // Try to reconnect
    },
});

redis.on("connect", () => console.log("✅ Connected to Redis"));
redis.on("error", (err) => console.error("❌ Redis Error:", err));
redis.on("reconnecting", () => console.log("🔄 Redis Reconnecting..."));

process.on("SIGINT", async () => {
    await redis.quit();
    console.log("🚪 Redis connection closed");
    process.exit(0);
});

module.exports = redis;
