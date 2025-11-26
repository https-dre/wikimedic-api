import z from "zod";

const zImage = z.object({
  key: z.string(),
  url: z.string().url()
})

export const zMedicine = z.object({
  id: z.string(),
  images: z.array(zImage).optional(),
  name: z.string(),
  numRegistro: z.string(),
  categoria: z.string(),
  indicacao: z.string(),
  contraindicacao: z.string(),
  reacao_adversa: z.string(),
  cuidados: z.string(),
  posologia: z.string(),
  riscos: z.string(),
  especiais: z.string(),
  superdose: z.string(),
});

export type Medicamento = z.infer<typeof zMedicine>;
export type MedicineImage = z.infer<typeof zImage>;

export const zLeaflet = z.object({
  indicacoes: z.array(z.string()),
  contraindicacoes: z.array(z.string()),
  reacoes_adversas: z.array(z.string()),
  cuidados: z.array(z.string()),
  posologia: z.array(z.string()),
  riscos: z.array(z.string()),
  superdose: z.array(z.string())
});

export const zSqlMedicine = z.object({
  id: z.string().uuid(),
  commercial_name: z.string(),
  description: z.string(),
  registry_code: z.string(),
  created_at: z.date(),
  leaflet_data: zLeaflet
})

export type Medicine = z.infer<typeof zSqlMedicine>;
export type MedicineWithoutLeaflet = Omit<Medicine, "leaflet_data">;