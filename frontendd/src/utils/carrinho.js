export function prepararItensCarrinho(itens, produtos) {
  return itens.map((item) => {
    const produto = produtos.find((candidato) => candidato.id === item.id) ?? null;
    return {
      ...item,
      produto,
      subtotal: produto ? produto.preco * item.quantidade : 0,
    };
  });
}

export function calcularResumoCarrinho(itens) {
  const subtotal = itens.reduce((soma, item) => soma + item.subtotal, 0);
  const frete = itens.length > 0 ? 25 : 0;

  return { subtotal, frete, total: subtotal + frete };
}
