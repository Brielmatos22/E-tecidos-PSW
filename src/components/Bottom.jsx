import { Link } from "react-router-dom";
import { useAuth } from "../auth/js/useAuth.js";
import { hasPermission } from "../auth/js/permissoes.js";

export default function Bottom() {
  const ano = new Date().getFullYear();
  const { user } = useAuth();
  const podeAcessarVendas = hasPermission(user, "vendas:read");
  const podeAcessarProdutos = hasPermission(user, "produtos:write");
  const caminhoAdmin = podeAcessarVendas ? "/admin" : "/admin/produtos";

  return (
    <footer className="rodape footer-desktop">
      <div className="rodape-conteudo">
        <section className="rodape-bloco" id="sobre" aria-labelledby="rodape-sobre">
          <h2 className="rodape-titulo" id="rodape-sobre">
            E-tecidos
          </h2>
          <p>
            Tecidos selecionados para roupas, decoração e projetos autorais, para quem compra
            como pessoa física ou como empresa.
          </p>
        </section>

        <nav className="rodape-bloco" aria-labelledby="rodape-navegacao">
          <h2 className="rodape-titulo" id="rodape-navegacao">
            Navegação
          </h2>
          <ul>
            <li><Link to="/">Início</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/cadastro">Cadastro</Link></li>
            {(podeAcessarVendas || podeAcessarProdutos) && (
              <li><Link to={caminhoAdmin}>Área do administrador</Link></li>
            )}
          </ul>
        </nav>

        <section className="rodape-bloco" id="contatos" aria-labelledby="rodape-contatos">
          <h2 className="rodape-titulo" id="rodape-contatos">
            Contatos
          </h2>
          <ul>
            <li><a href="mailto:contato@e-tecidos.com.br">contato@e-tecidos.com.br</a></li>
            <li>(00) 0000-0000</li>
            <li>Segunda a sexta, das 9h às 18h</li>
          </ul>
        </section>

        <section className="rodape-bloco" id="ajuda" aria-labelledby="rodape-ajuda">
          <h2 className="rodape-titulo" id="rodape-ajuda">
            Ajuda
          </h2>
          <ul>
            <li><a href="#ajuda">Perguntas frequentes</a></li>
            <li><a href="#ajuda">Trocas e devoluções</a></li>
            <li><a href="#ajuda">Política de privacidade</a></li>
          </ul>
        </section>
      </div>

      <p className="rodape-copy">© {ano} E-tecidos. Todos os direitos reservados.</p>
    </footer>
  );
}
