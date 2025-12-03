import { db } from "@/infra/sql";
import { Medicine, zLeaflet } from "@/models/Medicine";
import { z } from "zod";
import { BadResponse } from "../errors/error-handler";

const zLeafletUpdate = zLeaflet.partial();
type LeafletUpdateInput = z.infer<typeof zLeafletUpdate>;

export const setLeafletUpdate = async (
  medicine_id: string,
  fields: LeafletUpdateInput
) => {
  const [medicine] = await db<
    Medicine[]
  >`SELECT * FROM medicines WHERE id = ${medicine_id}`;

  if (!medicine) {
    throw new BadResponse("Medicamento não encontrado", 404);
  }

  const parsedData = zLeafletUpdate.parse(fields);
  if (Object.keys(parsedData).length === 0) {
    return null;
  }

  const result = await db<Medicine[]>`
    UPDATE medicines
    SET leaflet_data = leaflet_data || ${db.json(parsedData)}
    WHERE id = ${medicine_id}
    RETURNING *
  `;

  return result[0];
};
