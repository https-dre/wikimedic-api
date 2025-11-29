import postgres from "postgres";

type UserWithoutPassword = {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: Date;
};
export const listUsersFromDb = async (db: postgres.Sql) => {
  const users: UserWithoutPassword[] =
    await db`SELECT id, name, email, phone, created_at FROM users`;
  return users;
};
