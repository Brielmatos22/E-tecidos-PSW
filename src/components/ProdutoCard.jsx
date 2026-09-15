export default function ProdutoCard({ produto, aberto, onAbrirFechar, onHoverImagem }) {
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
        <details
          className="mais-produto"
          open={aberto}
          onToggle={(event) => onAbrirFechar(event.target.open)}
        >
          <summary>Saiba mais</summary>
          <p>{produto.detalhe}</p>
        </details>
      </div>
    </article>
  );
}
