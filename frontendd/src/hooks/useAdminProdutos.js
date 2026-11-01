import { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/js/useAuth.js";
import { api, getCached } from "../utils/api.js";

const vazio = { titulo: "", resumo: "", detalhe: "", imagem: "", alt: "", preco: "", custoPorMetro: "" };

function escoparFornecedor(produtos, fornecedorId) {
  return fornecedorId
    ? produtos.filter((produto) => produto.fornecedorId === fornecedorId)
    : produtos;
}

function gerarId(titulo, produtos) {
  const base = titulo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "produto";
  const ids = new Set(produtos.map((produto) => produto.id));
  let id = base;
  let sufixo = 2;

  while (ids.has(id)) {
    id = `${base}-${sufixo}`;
    sufixo += 1;
  }

  return id;
}

export default function useAdminProdutos() {
  const { user } = useAuth();
  const fornecedorId = user?.tipo === "juridica" ? user.contaId : null;
  const [cacheInicial] = useState(() => getCached("produtos"));
  const [produtos, setProdutos] = useState(() => escoparFornecedor(cacheInicial ?? [], fornecedorId));
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState(null);
  const [excluindoId, setExcluindoId] = useState(null);
  const [carregando, setCarregando] = useState(() => cacheInicial === null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const painelRef = useRef(null);

  useEffect(() => {
    let ativo = true;

    api.list("produtos")
      .then((registros) => {
        if (ativo) setProdutos(escoparFornecedor(registros, fornecedorId));
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

  const termo = busca.trim().toLowerCase();
  const filtrados = produtos.filter((produto) =>
    [produto.id, produto.titulo, produto.resumo].some((valor) => String(valor).toLowerCase().includes(termo))
  );

  function iniciarNovo() {
    setErro("");
    setAviso("");
    setEditando({ id: null, valores: { ...vazio } });
  }

  function iniciarEdicao(produto) {
    setErro("");
    setAviso("");
    setExcluindoId(null);
    setEditando({
      id: produto.id,
      valores: {
        ...produto,
        preco: String(produto.preco),
        custoPorMetro: String(produto.custoPorMetro ?? 0),
      },
    });
  }

  function cancelarEdicao() {
    setEditando(null);
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
        preco: Number(editando.valores.preco),
        custoPorMetro: Number(editando.valores.custoPorMetro),
        fornecedorId: user?.contaId ?? editando.valores.fornecedorId ?? produtos[0]?.fornecedorId ?? "PJ-001",
      };

      if (editando.id === null) {
        const criado = await api.create("produtos", { ...dados, id: gerarId(dados.titulo, produtos) });
        setProdutos((lista) => [...lista, criado]);
        setAviso(`Produto ${criado.titulo} criado.`);
      } else {
        const atualizado = await api.update("produtos", editando.id, { ...dados, id: editando.id });
        setProdutos((lista) => lista.map((produto) => (produto.id === editando.id ? atualizado : produto)));
        setAviso(`Produto ${atualizado.titulo} atualizado.`);
      }

      setEditando(null);
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(produto) {
    setErro("");

    try {
      await api.remove("produtos", produto.id);
      setProdutos((lista) => lista.filter((item) => item.id !== produto.id));
      setExcluindoId(null);
      setAviso(`Produto ${produto.titulo} excluído.`);
    } catch (error) {
      setErro(error.message);
    }
  }

  return {
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
  };
}