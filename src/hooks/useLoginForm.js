import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/js/useAuth.js";

export default function useLoginForm() {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function alterarCampo(event) {
    const { name, value } = event.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  async function enviar(event) {
    event.preventDefault();
    setErro("");
    setEntrando(true);

    try {
      const user = await signIn(form.email, form.senha);
      const destino = location.state?.from
        ?? (user.permissoes.includes("vendas:read") ? "/admin" : "/");
      navigate(destino, { replace: true });
    } catch (error) {
      setErro(error.message);
    } finally {
      setEntrando(false);
    }
  }

  return { form, erro, entrando, alterarCampo, enviar };
}
