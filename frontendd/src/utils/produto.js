import produtos from "../data/produtosdb.json";

export function nomeProduto(id) {
  return produtos.find((produto) => produto.id === id)?.titulo ?? id;
}
