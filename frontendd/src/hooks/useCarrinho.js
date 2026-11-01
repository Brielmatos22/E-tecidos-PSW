import { useEffect, useState } from "react";

const STORAGE_KEY = "e-tecidos-carrinho";

function lerCarrinhoSalvo() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY);
    return salvo ? JSON.parse(salvo) : [];
  } catch {
    return [];
  }
}

export default function useCarrinho() {
  const [carrinho, setCarrinho] = useState(lerCarrinhoSalvo);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrinho));
  }, [carrinho]);

  function adicionarAoCarrinho(produto) {
    setCarrinho((atual) => {
      const itemExistente = atual.some((item) => item.id === produto.id);

      if (itemExistente) {
        return atual.map((item) =>
          item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }

      return [...atual, { id: produto.id, quantidade: 1 }];
    });
  }

  function atualizarQuantidade(produtoId, quantidade) {
    setCarrinho((atual) => {
      if (quantidade <= 0) {
        return atual.filter((item) => item.id !== produtoId);
      }

      return atual.map((item) =>
        item.id === produtoId ? { ...item, quantidade } : item
      );
    });
  }

  function removerDoCarrinho(produtoId) {
    setCarrinho((atual) => atual.filter((item) => item.id !== produtoId));
  }

  function limparCarrinho() {
    setCarrinho([]);
  }

  return { carrinho, adicionarAoCarrinho, atualizarQuantidade, removerDoCarrinho, limparCarrinho };
}
