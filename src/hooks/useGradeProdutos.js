import { useState } from "react";

export default function useGradeProdutos() {
  const [abertoId, setAbertoId] = useState(null);

  function alternarDetalhes(id) {
    setAbertoId((atual) => (id === null || atual === id ? null : id));
  }

  function fecharDetalhes() {
    setAbertoId(null);
  }

  return { abertoId, alternarDetalhes, fecharDetalhes };
}
