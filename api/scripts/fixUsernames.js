// scripts/fixUsernames.js
import mongoose from "mongoose";
import User from "../models/user.model.js"; // adjust path if needed

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/yourdbname";

async function runMigration() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Find users without username OR with empty string
    const usersWithoutUsername = await User.find({
      $or: [{ username: { $exists: false } }, { username: "" }, { username: null }],
    });

    console.log(`🔎 Found ${usersWithoutUsername.length} users missing username`);

    for (const user of usersWithoutUsername) {
      // Default username = prefix of email before @
      let fallback = user.email.split("@")[0];

      // Ensure uniqueness (append random suffix if conflict)
      let base = fallback;
      let counter = 1;
      while (await User.exists({ username: fallback })) {
        fallback = `${base}${counter}`;
        counter++;
      }

      user.username = fallback;
      await user.save();

      console.log(`✅ Fixed user ${user.email} -> username: ${user.username}`);
    }

    console.log("🎉 Migration completed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

runMigration();
