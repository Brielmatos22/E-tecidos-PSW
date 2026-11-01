import AdminLayout from "../components/AdminLayout.jsx";
import { dataBR } from "../utils/formatar.js";
import useAdminContas from "../hooks/useAdminContas.js";
// Os registros desta tela são mantidos apenas em estado local.

export default function AdminContas({ tipo }) {
  const {
    cfg,
    contas,
    carregando,
    salvando,
    erro,
    busca,
    statusFiltro,
    editando,
    excluindoId,
    aviso,
    painelRef,
    filtradas,
    ativas,
    iniciarNova,
    iniciarEdicao,
    alterarCampo,
    salvar,
    alternarStatus,
    excluir,
    cancelarEdicao,
    solicitarExclusao,
    cancelarExclusao,
    alterarBusca,
    alterarStatusFiltro,
  } = useAdminContas(tipo);

  return (
    <AdminLayout titulo={cfg.titulo} descricao={cfg.descricao}>
      {erro && <p className="alert alert-danger" role="alert">{erro}</p>}
      {aviso && (
        <output className="aviso-admin">
          {aviso}
        </output>
      )}

      {editando && (
        <section className="cartao-admin painel-edicao" ref={painelRef} aria-labelledby="titulo-edicao">
          <h2 id="titulo-edicao">{editando.id === null ? "Nova conta" : `Editar conta ${editando.id}`}</h2>
          <form onSubmit={salvar}>
            <div className="grade-formulario">
              {cfg.campos.map((campo) => (
                <div className={campo.largo ? "campo campo-largo" : "campo"} key={campo.name}>
                  <label htmlFor={`campo-${campo.name}`}>{campo.label}</label>
                  {campo.type === "textarea" ? (
                    <textarea
                      id={`campo-${campo.name}`}
                      className="form-control"
                      name={campo.name}
                      rows={4}
                      value={editando.valores[campo.name]}
                      onChange={alterarCampo}
                      required
                    />
                  ) : (
                    <input
                      id={`campo-${campo.name}`}
                      className="form-control"
                      name={campo.name}
                      type={campo.type}
                      autoComplete={campo.autoComplete}
                      inputMode={campo.inputMode}
                      placeholder={campo.placeholder}
                      pattern={campo.pattern}
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
                {salvando ? "Salvando..." : "Salvar alterações"}
              </button>
              <button className="botao-admin-sec" type="button" onClick={cancelarEdicao}>
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="cartao-admin" aria-labelledby="titulo-lista-contas">
        <div className="topo-lista">
          <h2 id="titulo-lista-contas">Contas cadastradas</h2>
          <button className="botao-admin" type="button" onClick={iniciarNova} disabled={carregando}>
            Nova conta
          </button>
        </div>

        <div className="filtros-admin">
          <div className="filtro-admin filtro-busca">
            <label htmlFor="busca-conta">Buscar</label>
            <input
              className="form-control"
              id="busca-conta"
              type="search"
              placeholder="Nome, documento, e-mail ou código"
              value={busca}
              onChange={alterarBusca}
            />
          </div>
          <div className="filtro-admin">
            <label htmlFor="filtro-status-conta">Status</label>
            <select className="form-select" id="filtro-status-conta" value={statusFiltro} onChange={alterarStatusFiltro}>
              <option value="todas">Todas</option>
              <option value="ativa">Ativas</option>
              <option value="suspensa">Suspensas</option>
            </select>
          </div>
        </div>

        {carregando && <p aria-live="polite">Carregando contas...</p>}
        {!carregando && filtradas.length === 0 && (
          <p className="vazio-admin">Nenhuma conta encontrada.</p>
        )}
        {!carregando && filtradas.length > 0 && (
          <div className="tabela-rolagem">
            <table className="tabela-admin">
              <thead>
                <tr>
                  <th scope="col">Código</th>
                  {cfg.colunas.map((col) => (
                    <th scope="col" key={col.chave}>{col.rotulo}</th>
                  ))}
                  <th scope="col">Status</th>
                  <th scope="col">Cadastro em</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((conta) => (
                  <tr key={conta.id}>
                    <td>{conta.id}</td>
                    {cfg.colunas.map((col) => (
                      <td key={col.chave}>{conta[col.chave]}</td>
                    ))}
                    <td>
                      <span className={`selo ${conta.status === "ativa" ? "selo-ok" : "selo-cancelado"}`}>
                        {conta.status === "ativa" ? "Ativa" : "Suspensa"}
                      </span>
                    </td>
                    <td>{dataBR(conta.criadoEm)}</td>
                    <td>
                      {excluindoId === conta.id ? (
                        <div className="acoes-linha">
                          <button
                            className="botao-admin-sec botao-perigo"
                            type="button"
                            onClick={() => excluir(conta)}
                            aria-label={`Confirmar exclusão da conta ${conta.id}`}
                          >
                            Confirmar exclusão
                          </button>
                          <button className="botao-admin-sec" type="button" onClick={cancelarExclusao}>
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="acoes-linha">
                          <button
                            className="botao-admin-sec"
                            type="button"
                            onClick={() => iniciarEdicao(conta)}
                            aria-label={`Editar conta ${conta.id}`}
                          >
                            Editar
                          </button>
                          <button
                            className="botao-admin-sec"
                            type="button"
                            onClick={() => alternarStatus(conta)}
                            aria-label={`${conta.status === "ativa" ? "Suspender" : "Reativar"} conta ${conta.id}`}
                          >
                            {conta.status === "ativa" ? "Suspender" : "Reativar"}
                          </button>
                          <button
                            className="botao-admin-sec botao-perigo"
                            type="button"
                            onClick={() => solicitarExclusao(conta.id)}
                            aria-label={`Excluir conta ${conta.id}`}
                          >
                            Excluir
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="rodape-tabela" aria-live="polite">
          {contas.length} {contas.length === 1 ? "conta" : "contas"}, {ativas} {ativas === 1 ? "ativa" : "ativas"}.
        </p>
      </section>
    </AdminLayout>
  );
}
