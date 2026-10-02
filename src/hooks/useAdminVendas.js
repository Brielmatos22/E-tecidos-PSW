import { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/js/useAuth.js";
import { hasPermission } from "../auth/js/permissoes.js";
import { api, getCached } from "../utils/api.js";

export const classeStatus = {
  Pago: "selo-ok",
  Pendente: "selo-pendente",
  Cancelado: "selo-cancelado",
};

export const rotuloTipo = {
  fisica: "Pessoa física",
  juridica: "Pessoa jurídica",
};

function escoparFornecedor(registros, fornecedorId) {
  return fornecedorId
    ? registros.filter((registro) => registro.fornecedorId === fornecedorId)
    : registros;
}

export default function useAdminVendas() {
  const { user } = useAuth();
  const fornecedorId = user?.tipo === "juridica" ? user.contaId : null;
  const [cacheInicial] = useState(() => ({
    produtos: getCached("produtos"),
    vendas: getCached("vendas"),
  }));
  const [produtos, setProdutos] = useState(() => escoparFornecedor(cacheInicial.produtos ?? [], fornecedorId));
  const [vendas, setVendas] = useState(() => escoparFornecedor(cacheInicial.vendas ?? [], fornecedorId));
  const [carregando, setCarregando] = useState(
    () => cacheInicial.produtos === null || cacheInicial.vendas === null
  );
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [editando, setEditando] = useState(null);
  const [excluindoId, setExcluindoId] = useState(null);
  const painelRef = useRef(null);
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("todos");
  const [tipo, setTipo] = useState("todos");

  useEffect(() => {
    let ativo = true;

    Promise.all([api.list("produtos"), api.list("vendas")])
      .then(([listaProdutos, listaVendas]) => {
        if (ativo) {
          setProdutos(escoparFornecedor(listaProdutos, fornecedorId));
          setVendas(escoparFornecedor(listaVendas, fornecedorId));
        }
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
  }, [fornecedorId]);

  useEffect(() => {
    if (editando) painelRef.current?.scrollIntoView({ block: "center" });
  }, [editando]);

  const pagas = vendas.filter((venda) => venda.status === "Pago");
  const faturamento = pagas.reduce((soma, venda) => soma + venda.valor, 0);
  const ticketMedio = pagas.length ? faturamento / pagas.length : 0;
  const produtoPorId = new Map(produtos.map((produto) => [produto.id, produto]));
  const lucroDaVenda = (venda) => venda.valor - (produtoPorId.get(venda.produto)?.custoPorMetro ?? 0) * venda.metros;
  const lucroBruto = pagas.reduce((soma, venda) => soma + lucroDaVenda(venda), 0);
  const pendentes = vendas.filter((venda) => venda.status === "Pendente").length;
  const porProduto = produtos.map((produto) => ({
    id: produto.id,
    titulo: produto.titulo,
    total: pagas
      .filter((venda) => venda.produto === produto.id)
      .reduce((soma, venda) => soma + venda.valor, 0),
    lucro: pagas
      .filter((venda) => venda.produto === produto.id)
      .reduce((soma, venda) => soma + lucroDaVenda(venda), 0),
  }));
  const maiorTotal = Math.max(...porProduto.map((produto) => produto.total), 1);
  const termo = busca.trim().toLowerCase();
  const filtradas = vendas.filter(
    (venda) =>
      (status === "todos" || venda.status === status) &&
      (tipo === "todos" || venda.tipo === tipo) &&
      (!termo || venda.cliente.toLowerCase().includes(termo) || venda.id.toLowerCase().includes(termo))
  ).map((venda) => ({
    ...venda,
    produtoTitulo: produtoPorId.get(venda.produto)?.titulo ?? venda.produto,
    lucro: lucroDaVenda(venda),
  }));

  function iniciarNova() {
    setErro("");
    setAviso("");
    setEditando({
      id: null,
      valores: {
        data: new Date().toISOString().slice(0, 10),
        cliente: "",
        tipo: "fisica",
        produto: produtos[0]?.id ?? "",
        metros: "1",
        valor: "",
        pagamento: "Pix",
        status: "Pendente",
        fornecedorId: user?.contaId ?? produtos[0]?.fornecedorId ?? "PJ-001",
      },
    });
  }

  function iniciarEdicao(venda) {
    setErro("");
    setAviso("");
    setExcluindoId(null);
    setEditando({ id: venda.id, valores: { ...venda } });
  }

  function alterarCampo(event) {
    const { name, value } = event.target;
    setEditando((atual) => ({ ...atual, valores: { ...atual.valores, [name]: value } }));
  }

  async function salvar(event) {
    event.preventDefault();
    setErro("");
    setAviso("");
    setSalvando(true);

    try {
      const dados = {
        ...editando.valores,
        metros: Number(editando.valores.metros),
        valor: Number(editando.valores.valor),
      };

      if (editando.id === null) {
        const maiorNumero = vendas.reduce((maior, venda) => {
          const numero = Number(String(venda.id).split("-").at(-1));
          return Math.max(maior, numero);
        }, 0);
        const criada = await api.create("vendas", { ...dados, id: `V-${maiorNumero + 1}` });
        setVendas((lista) => [criada, ...lista]);
        setAviso(`Venda ${criada.id} criada.`);
      } else {
        const atualizada = await api.update("vendas", editando.id, { ...dados, id: editando.id });
        setVendas((lista) => lista.map((venda) => (venda.id === editando.id ? atualizada : venda)));
        setAviso(`Venda ${atualizada.id} atualizada.`);
      }

      setEditando(null);
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(venda) {
    setErro("");

    try {
      await api.remove("vendas", venda.id);
      setVendas((lista) => lista.filter((item) => item.id !== venda.id));
      setExcluindoId(null);
      setAviso(`Venda ${venda.id} excluída.`);
    } catch (error) {
      setErro(error.message);
    }
  }

  function alterarBusca(event) {
    setBusca(event.target.value);
  }

  function alterarStatus(event) {
    setStatus(event.target.value);
  }

  function alterarTipo(event) {
    setTipo(event.target.value);
  }

  return {
    busca,
    status,
    tipo,
    produtos,
    vendas,
    carregando,
    salvando,
    erro,
    aviso,
    editando,
    excluindoId,
    painelRef,
    faturamento,
    ticketMedio,
    lucroBruto,
    pendentes,
    porProduto,
    maiorTotal,
    filtradas,
    totalVendas: vendas.length,
    alterarBusca,
    alterarStatus,
    alterarTipo,
    iniciarNova,
    iniciarEdicao,
    alterarCampo,
    salvar,
    excluir,
    setEditando,
    setExcluindoId,
    podeGerenciarVendas: hasPermission(user, "vendas:write"),
  };
}
