import { mongo } from "@/data/mongoDB/conn";
import { toMedic } from "./toMedic";
import { Medicamento } from "@/models/Medicamento";
import { db } from "@/data/postgresql/db";
import { logger } from "@/logger";

type Leaflet_Data = {
  indicacoes: string[];
  contraindicacoes: string[];
  reacoes_adversas: string[];
  cuidados: string[];
  posologia: string[];
  riscos: string[];
  superdose: string[];
};

type SqlMedicine = {
  id: string;
  commercial_name: string;
  registry_code: string;
  created_at: Date;
  leaflet_data: Leaflet_Data;
};

const parseToSqlMedicine = (data: Medicamento): SqlMedicine => {
  const toArray = (text: string | undefined) => (text ? [text] : []);
  return {
    id: data.id,
    commercial_name: data.name,
    registry_code: data.numRegistro,
    created_at: new Date(),
    leaflet_data: {
      indicacoes: toArray(data.indicacao),
      contraindicacoes: toArray(data.contraindicacao),
      reacoes_adversas: toArray(data.reacao_adversa),
      cuidados: toArray(data.cuidados),
      posologia: toArray(data.posologia),
      riscos: toArray(data.riscos),
      superdose: toArray(data.superdose),
    },
  };
};

export const migrateMongoToPostgreSQL = async () => {
  try {
    await mongo.conn();
    const MedicamentoCollection = mongo.db.collection("Medicamento");
    logger.info("Get from MongoDB")
    const docs = await MedicamentoCollection.find().toArray();
    const medicamentos = docs.map((doc) => toMedic(doc));
    console.log(medicamentos.length);
    const sql_medicines = medicamentos.map((m) => parseToSqlMedicine(m));
    await db`INSERT INTO medicines ${db(sql_medicines)}`;
  } catch (err) {
    logger.fatal(err);
    process.exit(1);
  }
};

migrateMongoToPostgreSQL();