import AdminLayout from "../components/AdminLayout.jsx";
import useAdminProdutos from "../hooks/useAdminProdutos.js";

const campos = [
  { name: "titulo", label: "Nome do produto", type: "text" },
  { name: "preco", label: "Preço (R$)", type: "number", step: "0.01" },
  { name: "custoPorMetro", label: "Custo por metro (R$)", type: "number", step: "0.01" },
  { name: "resumo", label: "Resumo", type: "text", largo: true },
  { name: "detalhe", label: "Descrição completa", type: "textarea", largo: true },
  { name: "imagem", label: "URL da imagem", type: "url", largo: true },
  { name: "alt", label: "Descrição acessível da imagem", type: "text", largo: true },
];

export default function AdminProdutos() {
  const {
    produtos,
    filtrados,
    busca,
    editando,
    excluindoId,
    carregando,
    salvando,
    erro,
    aviso,
    painelRef,
    setBusca,
    setExcluindoId,
    iniciarNovo,
    iniciarEdicao,
    cancelarEdicao,
    alterarCampo,
    salvar,
    excluir,
  } = useAdminProdutos();

  return (
    <AdminLayout
      titulo="Produtos"
      descricao="Cadastre, atualize e remova os produtos disponíveis na loja."
    >
      {erro && <p className="alert alert-danger" role="alert">{erro}</p>}
      {aviso && <output className="aviso-admin">{aviso}</output>}

      {editando && (
        <section className="cartao-admin painel-edicao" ref={painelRef} aria-labelledby="titulo-edicao-produto">
          <h2 id="titulo-edicao-produto">{editando.id === null ? "Novo produto" : `Editar ${editando.valores.titulo}`}</h2>
          <form onSubmit={salvar}>
            <div className="grade-formulario">
              {campos.map((campo) => (
                <div className={campo.largo ? "campo campo-largo" : "campo"} key={campo.name}>
                  <label htmlFor={`produto-${campo.name}`}>{campo.label}</label>
                  {campo.type === "textarea" ? (
                    <textarea
                      id={`produto-${campo.name}`}
                      className="form-control"
                      name={campo.name}
                      rows={4}
                      value={editando.valores[campo.name]}
                      onChange={alterarCampo}
                      required
                    />
                  ) : (
                    <input
                      id={`produto-${campo.name}`}
                      className="form-control"
                      name={campo.name}
                      type={campo.type}
                      step={campo.step}
                      min={["preco", "custoPorMetro"].includes(campo.name) ? "0" : undefined}
                      value={editando.valores[campo.name]}
                      onChange={alterarCampo}
                      required
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="acoes-form">
              <button className="botao-admin" type="submit" disabled={salvando}>
                {salvando ? "Salvando..." : "Salvar produto"}
              </button>
              <button className="botao-admin-sec" type="button" onClick={cancelarEdicao} disabled={salvando}>
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="cartao-admin" aria-labelledby="titulo-lista-produtos">
        <div className="topo-lista">
          <h2 id="titulo-lista-produtos">Produtos cadastrados ({produtos.length})</h2>
          <button className="botao-admin" type="button" onClick={iniciarNovo} disabled={carregando}>Novo produto</button>
        </div>
        <div className="filtros-admin">
          <div className="filtro-admin filtro-busca">
            <label htmlFor="busca-produto">Buscar</label>
            <input
              className="form-control"
              id="busca-produto"
              type="search"
              placeholder="Nome ou descrição"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />
          </div>
        </div>

        {carregando && <p aria-live="polite">Carregando produtos...</p>}
        {!carregando && filtrados.length === 0 && (
          <p className="vazio-admin">Nenhum produto encontrado.</p>
        )}
        {!carregando && filtrados.length > 0 && (
          <div className="tabela-rolagem">
            <table className="tabela-admin">
              <thead>
                <tr><th scope="col">Produto</th><th scope="col">Preço</th><th scope="col">Custo/m</th><th scope="col">Ações</th></tr>
              </thead>
              <tbody>
                {filtrados.map((produto) => (
                  <tr key={produto.id}>
                    <td><strong>{produto.titulo}</strong><br /><small>{produto.id}</small></td>
                    <td>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(produto.preco)}</td>
                    <td>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(produto.custoPorMetro ?? 0)}</td>
                    <td>
                      {excluindoId === produto.id ? (
                        <div className="acoes-linha">
                          <button className="botao-admin-sec botao-perigo" type="button" onClick={() => excluir(produto)}>Confirmar exclusão</button>
                          <button className="botao-admin-sec" type="button" onClick={() => setExcluindoId(null)}>Cancelar</button>
                        </div>
                      ) : (
                        <div className="acoes-linha">
                          <button className="botao-admin-sec" type="button" onClick={() => iniciarEdicao(produto)}>Editar</button>
                          <button className="botao-admin-sec botao-perigo" type="button" onClick={() => setExcluindoId(produto.id)}>Excluir</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}