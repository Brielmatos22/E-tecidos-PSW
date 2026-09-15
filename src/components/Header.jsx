import { Link } from "react-router-dom";

export default function Header({ variant = "home" }) {
  const menor = variant === "cadastro";

  return (
    <header className={`cabeca${menor ? " cabeca-menor" : ""}`}>
      <div className="dv-header">
        <div className="dv-titulo">
          {variant === "home" ? (
            <p className="tituloProjeto">E-tecidos</p>
          ) : (
            <Link className="tituloProjeto" to="/">
              E-tecidos
            </Link>
          )}
        </div>

        <nav className="dv-ul" aria-label="Navegação principal">
          {variant === "home" ? (
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/cadastro">Cadastro</Link></li>
              <li><a href="#sobre">Sobre nós</a></li>
              <li><a href="#contatos">Contatos</a></li>
              <li><a href="#ajuda">Ajuda</a></li>
            </ul>
          ) : (
            <ul>
              <li><Link to="/">Início</Link></li>
              <li><a href="#cadastro">Cadastro</a></li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
}
