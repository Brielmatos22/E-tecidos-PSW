import { useCallback, useMemo, useState } from "react";
import { AuthContext } from "../js/context.js";

const SESSION_KEY = "e-tecidos:session:v1";

function readSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "null");
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  const signIn = useCallback(async (email, senha) => {
    const response = await fetch("/api/usuarios");
    if (!response.ok) throw new Error("Não foi possível validar o acesso agora.");

    const usuarios = await response.json();
    const usuario = usuarios.find((item) =>
      item.email.toLowerCase() === email.trim().toLowerCase() && item.senha === senha
    );

    if (!usuario) throw new Error("E-mail ou senha inválidos.");

    const sessao = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
      contaId: usuario.contaId,
      permissoes: usuario.permissoes,
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessao));
    setUser(sessao);
    return sessao;
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}