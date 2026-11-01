import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../auth/js/useAuth.js";
import { hasPermission } from "../auth/js/permissoes.js";

const rotulosPerfil = {
  admin: "Administrador",
  juridica: "Pessoa jurídica",
  fisica: "Pessoa física",
};

function CartLink() {
  return (
    <Link className="nav-carrinho" to="/carrinho" aria-label="Carrinho" title="Carrinho">
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 4.5h2l2.2 9.5a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H6.3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="18" r="1.5" fill="currentColor" />
        <circle cx="17" cy="18" r="1.5" fill="currentColor" />
      </svg>
    </Link>
  );
}

export default function Header({ variant = "home" }) {
  const { user, signOut } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);
  const menor = variant !== "home";
  const inicial = user?.nome?.trim()?.[0]?.toUpperCase() ?? "";
  const perfil = user ? rotulosPerfil[user.tipo] ?? "Conta" : "Visitante";

  useEffect(() => {
    if (!menuAberto) return undefined;

    function fecharAoClicarFora(event) {
      if (!menuRef.current?.contains(event.target)) setMenuAberto(false);
    }

    function fecharComEscape(event) {
      if (event.key === "Escape") setMenuAberto(false);
    }

    document.addEventListener("pointerdown", fecharAoClicarFora);
    document.addEventListener("keydown", fecharComEscape);

    return () => {
      document.removeEventListener("pointerdown", fecharAoClicarFora);
      document.removeEventListener("keydown", fecharComEscape);
    };
  }, [menuAberto]);

  function sair() {
    signOut();
    setMenuAberto(false);
  }

  return (
    <header className={`cabeca${menor ? " cabeca-menor" : ""}`}>
      <div className="dv-header">
        <div className="dv-titulo">
          <Link className="tituloProjeto" to="/">E-tecidos</Link>
        </div>

        <nav className="dv-ul header-desktop-nav" aria-label="Navegação principal">
          <ul>
            {variant === "home" && !user && (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/cadastro">Cadastro</Link></li>
                <li><a href="#sobre">Sobre nós</a></li>
                <li><a href="#contatos">Contatos</a></li>
                <li><a href="#ajuda">Ajuda</a></li>
              </>
            )}
           {variant === "home" && user && (
  <>
    <li><CartLink /></li>
    <li><Link to="/">Início</Link></li>

    {hasPermission(user, "vendas:read") && (
      <li><NavLink to="/admin">Vendas</NavLink></li>
    )}

    {hasPermission(user, "produtos:write") && (
      <li><NavLink to="/admin/produtos">Produtos</NavLink></li>
    )}

    {hasPermission(user, "contas:manage") && (
      <>
        <li>
          <NavLink to="/admin/contas/pessoa-fisica">
            Pessoa física
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/contas/pessoa-juridica">
            Pessoa jurídica
          </NavLink>
        </li>
      </>
    )}

    <li>
      <Link to="/" onClick={signOut}>
        Sair
      </Link>
    </li>
  </>
)}
            {variant === "admin" && user && (
              <>
                <li><CartLink /></li>
                <li><Link to="/">Início</Link></li>
                {hasPermission(user, "vendas:read") && <li><NavLink to="/admin" end>Vendas</NavLink></li>}
                {hasPermission(user, "produtos:write") && <li><NavLink to="/admin/produtos">Produtos</NavLink></li>}
                {hasPermission(user, "contas:manage") && (
                  <>
                    <li><NavLink to="/admin/contas/pessoa-fisica">Pessoa física</NavLink></li>
                    <li><NavLink to="/admin/contas/pessoa-juridica">Pessoa jurídica</NavLink></li>
                  </>
                )}
                <li><Link to="/" onClick={signOut}>Sair</Link></li>
              </>
            )}
            {variant === "cadastro" && (
              <>
                <li><Link to="/">Início</Link></li>
                <li><a href="#cadastro">Cadastro</a></li>
              </>
            )}
          </ul>
        </nav>

        <div className="header-mobile-actions">
          {user && <CartLink />}
          {!user && <Link className="botao-login-mobile" to="/login">Login</Link>}
          <div className="menu-usuario" ref={menuRef}>
            <button
              className="botao-menu-usuario"
              type="button"
              aria-label={user ? `Abrir menu da conta ${user.nome}` : "Abrir menu"}
              aria-expanded={menuAberto}
              aria-controls="menu-usuario-painel"
              aria-haspopup="true"
              onClick={() => setMenuAberto((aberto) => !aberto)}
            >
              {user && <span className="menu-usuario-inicial" aria-hidden="true">{inicial}</span>}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c.7-3.4 3.2-5.2 7-5.2s6.3 1.8 7 5.2" />
              </svg>
            </button>

            {menuAberto && (
              <div className="menu-usuario-painel" id="menu-usuario-painel">
                <div className="menu-usuario-identidade">
                  <strong>{user?.nome ?? "Bem-vindo à E-tecidos"}</strong>
                  <span>{user ? perfil : "Acesse sua conta para comprar"}</span>
                  {user && <small>{user.email}</small>}
                </div>

                <nav className="menu-usuario-secao" aria-label="Navegação da conta">
                  <h2>Navegação</h2>
                  <ul>
                    <li><Link to="/" onClick={() => setMenuAberto(false)}>Início</Link></li>
                    {user ? (
                      <>
                        <li><Link to="/carrinho" onClick={() => setMenuAberto(false)}>Carrinho</Link></li>
                        {hasPermission(user, "vendas:read") && <li><Link to="/admin" onClick={() => setMenuAberto(false)}>Vendas</Link></li>}
                        {hasPermission(user, "produtos:write") && <li><Link to="/admin/produtos" onClick={() => setMenuAberto(false)}>Produtos</Link></li>}
                        {hasPermission(user, "contas:manage") && (
                          <>
                            <li><Link to="/admin/contas/pessoa-fisica" onClick={() => setMenuAberto(false)}>Pessoa física</Link></li>
                            <li><Link to="/admin/contas/pessoa-juridica" onClick={() => setMenuAberto(false)}>Pessoa jurídica</Link></li>
                          </>
                        )}
                        <li><button type="button" onClick={sair}>Sair</button></li>
                      </>
                    ) : (
                      <>
                        <li><Link to="/login" onClick={() => setMenuAberto(false)}>Login</Link></li>
                        <li><Link to="/cadastro" onClick={() => setMenuAberto(false)}>Cadastro</Link></li>
                      </>
                    )}
                  </ul>
                </nav>

                <section className="menu-usuario-secao" id="menu-sobre">
                  <h2>Sobre nós</h2>
                  <p>Tecidos selecionados para roupas, decoração e projetos autorais, para pessoas e empresas.</p>
                </section>

                <section className="menu-usuario-secao">
                  <h2>Contato</h2>
                  <ul>
                    <li><a href="mailto:contato@e-tecidos.com.br">contato@e-tecidos.com.br</a></li>
                    <li><span>(00) 0000-0000</span></li>
                    <li><span>Segunda a sexta, das 9h às 18h</span></li>
                  </ul>
                </section>

                <section className="menu-usuario-secao" id="menu-ajuda">
                  <h2>Ajuda</h2>
                  <ul>
                    <li><a href="mailto:contato@e-tecidos.com.br?subject=Perguntas%20frequentes">Perguntas frequentes</a></li>
                    <li><a href="mailto:contato@e-tecidos.com.br?subject=Trocas%20e%20devolucoes">Trocas e devoluções</a></li>
                    <li><a href="mailto:contato@e-tecidos.com.br?subject=Privacidade">Política de privacidade</a></li>
                  </ul>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
