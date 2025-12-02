export function generateSlug(text: string): string {
  return text
    .normalize("NFD") // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase() // caixa baixa
    .trim() // remove espaços do início/fim
    .replace(/[^a-z0-9]+/g, "-") // troca qualquer char não permitido por "-"
    .replace(/^-+|-+$/g, ""); // remove "-" do início/fim
}
