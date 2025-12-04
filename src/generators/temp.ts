import { db } from "@/infra/sql";
import { FavoriteSQLRepository } from "@/lib/repositories";

export const favoriteRepository = new FavoriteSQLRepository(db);

