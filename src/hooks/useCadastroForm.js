import { useState } from "react";

export default function useCadastroForm() {
  const [tipoPessoa, setTipoPessoa] = useState("fisica");
  const pessoaJuridica = tipoPessoa === "juridica";

  function alterarTipoPessoa(event) {
    setTipoPessoa(event.target.value);
  }

  function enviar(event) {
    event.preventDefault();
   
    console.log("cadastro enviado, tipo:", tipoPessoa);
  }

  return { tipoPessoa, pessoaJuridica, alterarTipoPessoa, enviar };
}
