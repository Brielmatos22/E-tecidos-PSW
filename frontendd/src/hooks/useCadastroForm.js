import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/js/useAuth.js";

export default function useCadastroForm() {
  const [tipoPessoa, setTipoPessoa] = useState("fisica");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const pessoaJuridica = tipoPessoa === "juridica";
  const { signUp } = useAuth();
  const navigate = useNavigate();

  function alterarTipoPessoa(event) {
    setTipoPessoa(event.target.value);
  }

  async function enviar(event) {
    event.preventDefault();
    setErro("");
    setEnviando(true);

    const formData = new FormData(event.currentTarget);
    const valor = (campo) => String(formData.get(campo) ?? "").trim();
    const dados = {
      tipo: valor("tipo_pessoa"),
      email: valor("email"),
      senha: valor("senha"),
      ...(tipoPessoa === "fisica"
        ? {
            nome: valor("nome"),
            cpf: valor("cpf"),
            nascimento: valor("data_nascimento"),
            endereco: valor("endereco"),
          }
        : {
            razaoSocial: valor("razao_social"),
            cnpj: valor("cnpj"),
            localizacao: valor("localizacao"),
            descricao: valor("descricao"),
          }),
    };

    try {
      const user = await signUp(dados);
      navigate(user.tipo === "juridica" ? "/admin" : "/", { replace: true });
    } catch (error) {
      setErro(error.message);
    } finally {
      setEnviando(false);
    }
  }

  return { tipoPessoa, pessoaJuridica, alterarTipoPessoa, enviar, erro, enviando };
}
