import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "./db/schema/user";

const db = drizzle(process.env.DATABASE_URL!);
async function main() {
  // const user: typeof users.$inferInsert = {
  //   id: "1",
  //   name: "John Doe",
  //   email: "johndoe@example.com",
  //   emailVerified: true,
  //   image: "https://randomuser.me/api/portraits/men/1.jpg",
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  //   username: "johndoe123",
  //   role: "user",
  //   banned: false,
  //   banReason: null,
  //   banExpires: null,
  // };
  // await db.insert(users).values(user);
  // console.log("New user created!");
  const userall = await db.select().from(users);
  console.log("Getting all users from the database: ", userall);
}
main();
