import { useState } from "react";
import Header from "../components/Header.jsx";
import ProdutoCard from "../components/ProdutoCard.jsx";
import produtos from "../data/produtos.js";

export default function Index() {
  const [abertoId, setAbertoId] = useState(null);

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

          <div className="grade-produtos">
            {produtos.map((produto) => (
              <ProdutoCard
                key={produto.id}
                produto={produto}
                aberto={abertoId === produto.id}
                onAbrirFechar={(open) => setAbertoId(open ? produto.id : null)}
                onHoverImagem={() => setAbertoId(null)}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
