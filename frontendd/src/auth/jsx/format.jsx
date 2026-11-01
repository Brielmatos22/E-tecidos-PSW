import { useState } from "react";
import CampoDocumento from "../components/CampoDocumento.jsx";

export default function Exemplo() {
  const [cpf, setCpf] = useState("");

  return <CampoDocumento tipo="cpf" valor={cpf} onChange={setCpf} required />;
}