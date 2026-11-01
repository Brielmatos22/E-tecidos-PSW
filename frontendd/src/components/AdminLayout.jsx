import Header from "./Header.jsx";
import Bottom from "./Bottom.jsx";
import { useAuth } from "../auth/js/useAuth.js";

export default function AdminLayout({ titulo, descricao, children }) {
  const { user } = useAuth();
  const etiqueta = user?.tipo === "juridica" ? "Administração da sua loja" : "Área do administrador";

  return (
    <div className="pagina-admin">
      <Header variant="admin" />

      <main className="conteudo-admin">
        <div className="intro-admin">
          <p className="etiqueta">{etiqueta}</p>
          <h1>{titulo}</h1>
          <p>{descricao}</p>
        </div>
        {children}
      </main>
      <Bottom />
    </div>
  );
}
