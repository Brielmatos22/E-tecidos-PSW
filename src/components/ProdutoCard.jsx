import { brl } from "../utils/formatar.js";
import { Link } from "react-router-dom";

export default function ProdutoCard({ produto, aberto, onAbrirFechar, onHoverImagem, onAdicionarCarrinho }) {
  return (
    <article className="produto">
      <div className="area-imagem">
        <img
          className="imagem-produto"
          src={produto.imagem}
          alt={produto.alt}
          onMouseEnter={onHoverImagem}
        />
      </div>
      <div className="info-produto">
        <h2>{produto.titulo}</h2>
        <p className="resumo-produto">{produto.resumo}</p>
        <p className="preco-produto">{brl(produto.preco)}</p>
        <div className="mais-produto">
          <button
            className="botao-detalhes"
            type="button"
            aria-expanded={aberto}
            aria-controls={`detalhe-produto-${produto.id}`}
            onClick={() => onAbrirFechar(produto.id)}
          >
            Saiba mais
          </button>
          <p id={`detalhe-produto-${produto.id}`} hidden={!aberto}>{produto.detalhe}</p>
        </div>
        {onAdicionarCarrinho ? (
          <button className="botao-carrinho botao-principal botao-produto" type="button" onClick={() => onAdicionarCarrinho(produto)}>
            Adicionar ao carrinho
          </button>
        ) : (
          <Link className="botao-carrinho botao-secundario botao-produto" to="/login">
            Entrar para comprar
          </Link>
        )}
      </div>
    </article>
  );
}
