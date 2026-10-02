import { useEffect, useRef, useState } from "react";
import CONFIG from "../data/configContasAdmin.json";
import { api, getCached } from "../utils/api.js";

export default function useAdminContas(tipo) {
  const cfg = CONFIG[tipo];
  const collection = tipo === "fisica" ? "contasPessoaFisica" : "contasPessoaJuridica";
  const [cacheInicial] = useState(() => getCached(collection));
  const [contas, setContas] = useState(() => cacheInicial ?? []);
  const [carregando, setCarregando] = useState(() => cacheInicial === null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todas");
  const [editando, setEditando] = useState(null);
  const [excluindoId, setExcluindoId] = useState(null);
  const [aviso, setAviso] = useState("");
  const painelRef = useRef(null);
  const abrindoEdicao = editando !== null;

  useEffect(() => {
    let ativo = true;

    api.list(collection)
      .then((registros) => {
        if (ativo) setContas(registros);
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
  }, [collection]);

  useEffect(() => {
    if (abrindoEdicao) painelRef.current?.scrollIntoView({ block: "center" });
  }, [abrindoEdicao, editando?.id]);

  const termo = busca.trim().toLowerCase();
  const filtradas = contas.filter(
    (conta) =>
      (statusFiltro === "todas" || conta.status === statusFiltro) &&
      (!termo ||
        conta.id.toLowerCase().includes(termo) ||
        cfg.colunas.some((coluna) => String(conta[coluna.chave]).toLowerCase().includes(termo)))
  );
  const ativas = contas.filter((conta) => conta.status === "ativa").length;

  function iniciarNova() {
    setAviso("");
    setEditando({ id: null, valores: { ...cfg.vazio } });
  }

  function iniciarEdicao(conta) {
    setAviso("");
    setExcluindoId(null);
    setEditando({ id: conta.id, valores: { ...conta } });
  }

  function alterarCampo(event) {
    const { name, value } = event.target;
    setEditando((atual) => ({ ...atual, valores: { ...atual.valores, [name]: value } }));
  }

  async function salvar(event) {
    event.preventDefault();
    setErro("");
    setSalvando(true);

    try {
      if (editando.id === null) {
        const maior = contas.reduce((maximo, conta) => Math.max(maximo, Number(conta.id.split("-")[1])), 0);
        const nova = {
          ...editando.valores,
          id: `${cfg.prefixo}-${String(maior + 1).padStart(3, "0")}`,
          status: "ativa",
          criadoEm: new Date().toISOString().slice(0, 10),
        };
        const criada = await api.create(collection, nova);
        setContas((lista) => [...lista, criada]);
        setAviso(`Conta ${criada.id} criada.`);
      } else {
        const atualizada = await api.update(collection, editando.id, editando.valores);
        setContas((lista) => lista.map((conta) => (conta.id === editando.id ? atualizada : conta)));
        setAviso(`Conta ${editando.id} atualizada.`);
      }

      setEditando(null);
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  }

  async function alternarStatus(conta) {
    const novoStatus = conta.status === "ativa" ? "suspensa" : "ativa";
    setErro("");

    try {
      const atualizada = await api.patch(collection, conta.id, { status: novoStatus });
      setContas((lista) => lista.map((item) => (item.id === conta.id ? atualizada : item)));
      setAviso(`Conta ${conta.id} ${novoStatus === "ativa" ? "reativada" : "suspensa"}.`);
    } catch (error) {
      setErro(error.message);
    }
  }

  async function excluir(conta) {
    setErro("");

    try {
      await api.remove(collection, conta.id);
      setContas((lista) => lista.filter((item) => item.id !== conta.id));
      if (editando?.id === conta.id) setEditando(null);
      setExcluindoId(null);
      setAviso(`Conta ${conta.id} excluída.`);
    } catch (error) {
      setErro(error.message);
    }
  }

  function cancelarEdicao() {
    setEditando(null);
  }

  function solicitarExclusao(id) {
    setExcluindoId(id);
  }

  function cancelarExclusao() {
    setExcluindoId(null);
  }

  function alterarBusca(event) {
    setBusca(event.target.value);
  }

  function alterarStatusFiltro(event) {
    setStatusFiltro(event.target.value);
  }

  return {
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
  };
}
