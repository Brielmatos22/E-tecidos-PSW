import Header from "./Header.jsx";
import Bottom from "./Bottom.jsx";

export default function AdminLayout({ titulo, descricao, children }) {
  return (
    <div className="pagina-admin">
      <Header variant="admin" />

      <main className="conteudo-admin">
        <div className="intro-admin">
          <p className="etiqueta">Área do administrador</p>
          <h1>{titulo}</h1>
          <p>{descricao}</p>
        </div>
        {children}
      </main>
      <Bottom />
    </div>
  );
}
