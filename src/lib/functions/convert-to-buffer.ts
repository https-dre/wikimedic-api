import Stream from "stream";

/**
 * Converte um Stream (como o BusboyFileStream) para um Buffer.
 * @param stream O Stream de leitura do arquivo.
 * @returns Um Promise que resolve para o Buffer completo do arquivo.
 */
export function toBufferFromStream(stream: Stream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => {
      chunks.push(chunk as Buffer);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    stream.on("error", reject);
  });
}