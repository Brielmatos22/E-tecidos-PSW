import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../auth/js/useAuth.js";

const schemaLogin = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
  senha: z
    .string()
    .min(8, "Use 8 ou mais caracteres, uma letra maiúscula e um caractere especial.")
    .regex(
      /(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}/,
      "Use 8 ou mais caracteres, uma letra maiúscula e um caractere especial."
    ),
});

function destinoPorPerfil(user) {
  switch (user.tipo) {
    case "admin":
    case "juridica":
      return "/admin";
    case "fisica":
    default:
      return "/";
  }
}

export default function useLoginForm() {
  const [erro, setErro] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schemaLogin),
    defaultValues: { email: "", senha: "" },
  });

  async function autenticar(form) {
    setErro("");

    try {
      const user = await signIn(form.email, form.senha);
      const destino = location.state?.from ?? destinoPorPerfil(user);
      navigate(destino, { replace: true });
    } catch (error) {
      setErro(error.message);
    }
  }

  return {
    register,
    errors,
    erro,
    entrando: isSubmitting,
    enviar: handleSubmit(autenticar),
  };
}
