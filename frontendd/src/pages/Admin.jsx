import AdminLayout from "../components/AdminLayout.jsx";
import { brl, dataBR } from "../utils/formatar.js";
import useAdminVendas, { rotuloTipo } from "../hooks/useAdminVendas.js";

const classesStatus = {
  Pago: "selo-ok",
  Pendente: "selo-pendente",
  Cancelado: "selo-cancelado",
};

export default function Admin() {
  const {
    busca,
    status,
    tipo,
    produtos,
    faturamento,
    lucroBruto,
    pendentes,
    porProduto,
    maiorTotal,
    filtradas,
    totalVendas,
    alterarBusca,
    alterarStatus,
    alterarTipo,
    carregando,
    salvando,
    erro,
    aviso,
    editando,
    excluindoId,
    painelRef,
    iniciarNova,
    iniciarEdicao,
    alterarCampo,
    salvar,
    excluir,
    setEditando,
    setExcluindoId,
    podeGerenciarVendas,
  } = useAdminVendas();

  return (
    <AdminLayout
      titulo="Histórico de vendas"
      descricao="Acompanhe o histórico, o faturamento e o lucro bruto estimado. Dados e custos demonstrativos."
    >
      {erro && <p className="alert alert-danger" role="alert">{erro}</p>}
      {aviso && <output className="aviso-admin">{aviso}</output>}

      {editando && podeGerenciarVendas && (
        <section className="cartao-admin painel-edicao" ref={painelRef} aria-labelledby="titulo-edicao-venda">
          <h2 id="titulo-edicao-venda">{editando.id === null ? "Nova venda" : `Editar venda ${editando.id}`}</h2>
          <form onSubmit={salvar}>
            <div className="grade-formulario">
              <div className="campo">
                <label htmlFor="venda-data">Data</label>
                <input className="form-control" id="venda-data" name="data" type="date" value={editando.valores.data} onChange={alterarCampo} required />
              </div>
              <div className="campo">
                <label htmlFor="venda-cliente">Cliente</label>
                <input className="form-control" id="venda-cliente" name="cliente" value={editando.valores.cliente} onChange={alterarCampo} required />
              </div>
              <div className="campo">
                <label htmlFor="venda-tipo">Tipo de cliente</label>
                <select className="form-select" id="venda-tipo" name="tipo" value={editando.valores.tipo} onChange={alterarCampo}>
                  <option value="fisica">Pessoa física</option>
                  <option value="juridica">Pessoa jurídica</option>
                </select>
              </div>
              <div className="campo">
                <label htmlFor="venda-produto">Produto</label>
                <select className="form-select" id="venda-produto" name="produto" value={editando.valores.produto} onChange={alterarCampo} required>
                  {produtos.map((produto) => <option key={produto.id} value={produto.id}>{produto.titulo}</option>)}
                </select>
              </div>
              <div className="campo">
                <label htmlFor="venda-metros">Metros</label>
                <input className="form-control" id="venda-metros" name="metros" type="number" min="0.01" step="0.01" value={editando.valores.metros} onChange={alterarCampo} required />
              </div>
              <div className="campo">
                <label htmlFor="venda-valor">Valor (R$)</label>
                <input className="form-control" id="venda-valor" name="valor" type="number" min="0.01" step="0.01" value={editando.valores.valor} onChange={alterarCampo} required />
              </div>
              <div className="campo">
                <label htmlFor="venda-pagamento">Pagamento</label>
                <input className="form-control" id="venda-pagamento" name="pagamento" value={editando.valores.pagamento} onChange={alterarCampo} required />
              </div>
              <div className="campo">
                <label htmlFor="venda-status">Status</label>
                <select className="form-select" id="venda-status" name="status" value={editando.valores.status} onChange={alterarCampo}>
                  <option>Pago</option><option>Pendente</option><option>Cancelado</option>
                </select>
              </div>
            </div>
            <div className="acoes-form">
              <button className="botao-admin" type="submit" disabled={salvando}>{salvando ? "Salvando..." : "Salvar venda"}</button>
              <button className="botao-admin-sec" type="button" onClick={() => setEditando(null)} disabled={salvando}>Cancelar</button>
            </div>
          </form>
        </section>
      )}

      <dl className="resumo-admin">
        <div className="resumo-item">
          <dt>Faturamento (pedidos pagos)</dt>
          <dd>{brl(faturamento)}</dd>
        </div>
        <div className="resumo-item">
          <dt>Pedidos registrados</dt>
          <dd>{totalVendas}</dd>
        </div>
        <div className="resumo-item">
          <dt>Lucro bruto estimado</dt>
          <dd>{brl(lucroBruto)}</dd>
        </div>
        <div className="resumo-item">
          <dt>Pagamentos pendentes</dt>
          <dd>{pendentes}</dd>
        </div>
      </dl>

      <section className="cartao-admin" aria-labelledby="titulo-por-produto">
        <h2 id="titulo-por-produto">Faturamento por tecido</h2>
        <ul className="barras">
          {porProduto.map((p) => (
            <li className="barra-linha" key={p.id}>
              <span>{p.titulo}</span>
              <span className="barra-trilho" aria-hidden="true">
                <span className="barra-preench" style={{ width: `${(p.total / maiorTotal) * 100}%` }} />
              </span>
              <span className="barra-valor">
                {brl(p.total)}<br />
                <small>Lucro: {brl(p.lucro)}</small>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="cartao-admin" aria-labelledby="titulo-vendas">
        <div className="topo-lista">
          <h2 id="titulo-vendas">Vendas</h2>
          {podeGerenciarVendas && (
            <button className="botao-admin" type="button" onClick={iniciarNova} disabled={carregando}>Nova venda</button>
          )}
        </div>

        <div className="filtros-admin">
          <div className="filtro-admin filtro-busca">
            <label htmlFor="busca-venda">Buscar</label>
            <input
              className="form-control"
              id="busca-venda"
              type="search"
              placeholder="Cliente ou nº do pedido"
              value={busca}
              onChange={alterarBusca}
            />
          </div>
          <div className="filtro-admin">
            <label htmlFor="filtro-status">Status</label>
            <select className="form-select" id="filtro-status" value={status} onChange={alterarStatus}>
              <option value="todos">Todos</option>
              <option value="Pago">Pago</option>
              <option value="Pendente">Pendente</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          <div className="filtro-admin">
            <label htmlFor="filtro-tipo">Tipo de cliente</label>
            <select className="form-select" id="filtro-tipo" value={tipo} onChange={alterarTipo}>
              <option value="todos">Todos</option>
              <option value="fisica">Pessoa física</option>
              <option value="juridica">Pessoa jurídica</option>
            </select>
          </div>
        </div>

        {carregando && <p aria-live="polite">Carregando vendas...</p>}
        {!carregando && filtradas.length === 0 && (
          <p className="vazio-admin">Nenhuma venda encontrada com esses filtros.</p>
        )}
        {!carregando && filtradas.length > 0 && (
          <div className="tabela-rolagem">
            <table className="tabela-admin">
              <thead>
                <tr>
                  <th scope="col">Pedido</th>
                  <th scope="col">Data</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Tecido</th>
                  <th scope="col" className="num">Metros</th>
                  <th scope="col">Pagamento</th>
                  <th scope="col" className="num">Valor</th>
                  <th scope="col" className="num">Lucro estimado</th>
                  <th scope="col">Status</th>
                  {podeGerenciarVendas && <th scope="col">Ações</th>}
                </tr>
              </thead>
              <tbody>
                {filtradas.map((v) => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{dataBR(v.data)}</td>
                    <td>{v.cliente}</td>
                    <td>{rotuloTipo[v.tipo]}</td>
                    <td>{v.produtoTitulo}</td>
                    <td className="num">{v.metros} m</td>
                    <td>{v.pagamento}</td>
                    <td className="num">{brl(v.valor)}</td>
                    <td className="num">{brl(v.lucro)}</td>
                    <td>
                      <span className={`selo ${classesStatus[v.status]}`}>{v.status}</span>
                    </td>
                    {podeGerenciarVendas && (
                      <td>
                      {excluindoId === v.id ? (
                        <div className="acoes-linha">
                          <button className="botao-admin-sec botao-perigo" type="button" onClick={() => excluir(v)}>Confirmar</button>
                          <button className="botao-admin-sec" type="button" onClick={() => setExcluindoId(null)}>Cancelar</button>
                        </div>
                      ) : (
                        <div className="acoes-linha">
                          <button className="botao-admin-sec" type="button" onClick={() => iniciarEdicao(v)}>Editar</button>
                          <button className="botao-admin-sec botao-perigo" type="button" onClick={() => setExcluindoId(v.id)}>Excluir</button>
                        </div>
                      )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="rodape-tabela" aria-live="polite">
          Exibindo {filtradas.length} de {totalVendas} vendas.
        </p>
      </section>
    </AdminLayout>
  );
}
