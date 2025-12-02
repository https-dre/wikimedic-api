import { Favorite } from "@/models/Favorite";

export interface IFavoriteRepository {
  save(data: Omit<Favorite, "id">): Promise<Favorite>;
  deleteById(id: string): Promise<void>;
  findByUserId(userId: string): Promise<Favorite[]>;
}