import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import ProdutoCard from "../components/ProdutoCard.jsx";
import Bottom from "../components/Bottom.jsx";
import useGradeProdutos from "../hooks/useGradeProdutos.js";
import { api, getCached } from "../utils/api.js";
import { useAuth } from "../auth/js/useAuth.js";

export default function Index({ onAdicionarCarrinho }) {
  const { abertoId, alternarDetalhes, fecharDetalhes } = useGradeProdutos();
  const { user } = useAuth();
  const [cacheInicial] = useState(() => getCached("produtos"));
  const [produtos, setProdutos] = useState(() => cacheInicial ?? []);
  const [carregando, setCarregando] = useState(() => cacheInicial === null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    api.list("produtos")
      .then((registros) => {
        if (ativo) setProdutos(registros);
      })
      .catch((error) => {
        if (ativo) setErro(error.message);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  let listaProdutos;
  if (carregando) {
    listaProdutos = <p aria-live="polite">Carregando produtos...</p>;
  } else if (produtos.length === 0) {
    listaProdutos = <p>Nenhum produto disponível no momento.</p>;
  } else {
    listaProdutos = (
      <div className="grade-produtos">
        {produtos.map((produto) => (
          <ProdutoCard
            key={produto.id}
            produto={produto}
            aberto={abertoId === produto.id}
            onAbrirFechar={alternarDetalhes}
            onHoverImagem={fecharDetalhes}
            onAdicionarCarrinho={user ? onAdicionarCarrinho : null}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <Header variant="home" />

      <main className="vitrine">
        <section className="produtos" aria-labelledby="titulo-produtos">
          <div className="cabecalho-produtos">
            <p className="etiqueta">Nossa coleção</p>
            <h1 id="titulo-produtos">Tecidos para cada projeto</h1>
            <p>Conheça alguns dos nossos produtos. Passe o mouse na imagem ou leia mais sobre cada opção.</p>
          </div>

          {erro && <p className="alert alert-danger" role="alert">{erro}</p>}
          {listaProdutos}
        </section>
      </main>
      <Bottom />
    </>
  );
}
