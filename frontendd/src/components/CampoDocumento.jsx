import { useState } from "react";
import { formatarCPF, formatarCNPJ, mensagemCPF, mensagemCNPJ } from "../utils/documentos.js";

const TIPOS = {
  cpf: {
    rotulo: "CPF",
    placeholder: "000.000.000-00",
    inputMode: "numeric",
    maxLength: 14,
    formatar: formatarCPF,
    mensagem: mensagemCPF,
  },
  cnpj: {
    rotulo: "CNPJ",
    placeholder: "00.000.000/0000-00",
    inputMode: "text", // o CNPJ novo pode ter letras
    maxLength: 18,
    formatar: formatarCNPJ,
    mensagem: mensagemCNPJ,
  },
};

export default function CampoDocumento({ tipo, valor, onChange, name = tipo, ...resto }) {
  const [tocado, setTocado] = useState(false);
  const config = TIPOS[tipo];
  const erro = tocado ? config.mensagem(valor) : "";

  return (
    <div>
      <label htmlFor={name}>{config.rotulo}</label>
      <input
        id={name}
        name={name}
        value={valor}
        placeholder={config.placeholder}
        inputMode={config.inputMode}
        maxLength={config.maxLength}
        aria-invalid={Boolean(erro)}
        onChange={(event) => onChange(config.formatar(event.target.value))}
        onBlur={() => setTocado(true)}
        {...resto}
      />
      {erro && <small role="alert">{erro}</small>}
    </div>
  );
}