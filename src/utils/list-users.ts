import { User } from "../models/User";
import { db } from "@/data/postgresql/db";

export const listUsers = async (page: number = 1, pageSize: number = 10) => {
  const users: User[] = await db`SELECT * FROM users LIMIT ${page} OFFSET ${
    (page - 1) * pageSize
  }`;
  return users;
};
