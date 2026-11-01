import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { brl } from "../utils/formatar.js";
import { calcularResumoCarrinho, prepararItensCarrinho } from "../utils/carrinho.js";
import { api, getCached } from "../utils/api.js";

export default function Carrinho({ itens = [], onAdicionar, onAtualizarQuantidade, onRemover, onLimpar }) {
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

  const itensComProdutos = prepararItensCarrinho(itens, produtos);
  const { subtotal, frete, total } = calcularResumoCarrinho(itensComProdutos);

  if (carregando) {
    return (
      <main className="conteudo-carrinho" aria-live="polite">
        Carregando carrinho...
      </main>
    );
  }

  if (itensComProdutos.length === 0) {
    return (
      <div className="pagina-carrinho">
        <main className="conteudo-carrinho">
          <section className="cartao-carrinho vazio-carrinho" aria-labelledby="titulo-carrinho-vazio">
            <p className="etiqueta">Carrinho</p>
            <h1 id="titulo-carrinho-vazio">Seu carrinho está vazio</h1>
            <p>Adicione tecidos favoritos para continuar sua compra.</p>
            <Link className="botao-carrinho botao-principal" to="/">
              Voltar para a loja
            </Link>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="pagina-carrinho">
      <main className="conteudo-carrinho">
        {erro && <p className="alert alert-danger" role="alert">{erro}</p>}
        <section className="cartao-carrinho" aria-labelledby="titulo-carrinho">
          <div className="cabecalho-carrinho">
            <div>
              <p className="etiqueta">Carrinho</p>
              <h1 id="titulo-carrinho">Seu pedido</h1>
            </div>
            <button className="botao-carrinho botao-secundario" type="button" onClick={onLimpar}>
              Limpar carrinho
            </button>
          </div>

          <div className="lista-carrinho">
            {itensComProdutos.map((item) => (
              <article className="item-carrinho" key={item.id}>
                {!item.produto ? (
                  <>
                    <p>Este produto não está mais disponível.</p>
                   <button
                      type="button"
                      className="botao-link"
                      onClick={() => onRemover(item.id)}
                    >
                      Remover
                    </button>
                  </>
                ) : (
                  <>
                    <img
                      src={item.produto.imagem}
                      alt={item.produto.alt}
                      className="miniatura-carrinho"
                    />

                    <div className="detalhes-item-carrinho">
                      <div className="mb-2">
                        <h2>{item.produto.titulo}</h2>
                        <p>{brl(item.produto.preco)} cada</p>
                      </div>

                      <div className="acoes-item-carrinho">
                        <div
                          className="controle-quantidade"
                          aria-label={`Quantidade de ${item.produto.titulo}`}
                        >
                          <button
                            type="button"
                            onClick={() => onAtualizarQuantidade(item.id, item.quantidade - 1)}
                            aria-label={`Diminuir quantidade de ${item.produto.titulo}`}
                          >
                            −
                          </button>
                          <span>{item.quantidade}</span>
                          <button
                            type="button"
                            onClick={() => onAdicionar(item.produto)}
                            aria-label={`Aumentar quantidade de ${item.produto.titulo}`}
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="botao-link"
                          onClick={() => onRemover(item.id)}
                        >
                          Remover
                        </button>
                      </div>
                    </div>

                    <strong className="valor-item-carrinho">{brl(item.subtotal)}</strong>
                  </>
                )}
              </article>
            ))}
          </div>

          <aside className="resumo-carrinho" aria-labelledby="titulo-resumo-carrinho">
            <h2 id="titulo-resumo-carrinho">Resumo</h2>
            <dl>
              <div>
                <dt>Subtotal</dt>
                <dd>{brl(subtotal)}</dd>
              </div>
              <div>
                <dt>Frete</dt>
                <dd>{brl(frete)}</dd>
              </div>
              <div className="total-carrinho">
                <dt>Total</dt>
                <dd>{brl(total)}</dd>
              </div>
            </dl>
            <button className="botao-carrinho botao-principal" type="button">
              Finalizar compra
            </button>
          </aside>
        </section>
      </main>
    </div>
  );
}
