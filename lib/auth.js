import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

// Reuse one connection between requests, and fail fast (10s) instead of hanging for 30s
const globalForMongo = globalThis;
const client =
  globalForMongo._mentorlagbeMongo ??
  new MongoClient(process.env.MONGODB_URI, { maxPoolSize: 5, serverSelectionTimeoutMS: 10000 });
globalForMongo._mentorlagbeMongo = client;
const db = client.db("mentorlagbe");   // SAME database name as the Express server (server/db.js)

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true, minPasswordLength: 6 },
  user: {
    modelName: "users",   // BetterAuth and Express share the same "users" collection
    additionalFields: {
      role:  { type: "string", required: true, defaultValue: "student", input: true },
      plan:  { type: "string", required: false, defaultValue: "free", input: false }, // user can never set this
      phone: { type: "string", required: false, input: true },
      bio:   { type: "string", required: false, input: true },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Security: nobody can sign up as "admin" or as "pro"
        before: async (user) => ({
          data: {
            ...user,
            role: ["student", "tutor"].includes(user.role) ? user.role : "student",
            plan: "free",
            createdAt: new Date(),
          },
        }),
      },
    },
  },
  session: { cookieCache: { enabled: true, strategy: "jwt", maxAge: 5 * 24 * 60 * 60 } },
  plugins: [jwt()],
});
