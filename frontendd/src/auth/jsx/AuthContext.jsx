import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../js/context.js";

const SESSION_KEY = "e-tecidos:session:v1";
const SESSION_REFRESHED_EVENT = "e-tecidos:session-refreshed";
const SESSION_EXPIRED_EVENT = "e-tecidos:session-expired";

function readSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "null");
    return session?.token ? session : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  useEffect(() => {
    const handleSessionRefresh = (event) => setUser(event.detail);
    const handleSessionExpiration = () => setUser(null);
    window.addEventListener(SESSION_REFRESHED_EVENT, handleSessionRefresh);
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpiration);
    return () => {
      window.removeEventListener(SESSION_REFRESHED_EVENT, handleSessionRefresh);
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpiration);
    };
  }, []);

  const saveSession = useCallback((sessao) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessao));
    setUser(sessao);
  }, []);

  const signIn = useCallback(async (email, senha) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message ?? "Não foi possível entrar.");

    const sessao = { ...result.user, token: result.token };
    saveSession(sessao);
    return sessao;
  }, [saveSession]);

  const signUp = useCallback(async (dados) => {
    const response = await fetch("/api/auth/cadastrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message ?? "Não foi possível criar o cadastro.");

    const sessao = { ...result.user, token: result.token };
    saveSession(sessao);
    return sessao;
  }, [saveSession]);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, signIn, signUp, signOut }), [user, signIn, signUp, signOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}