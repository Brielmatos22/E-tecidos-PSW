import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", senha: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: integrar com o backend de autenticação
    console.log("login:", form);
  };

  return (
    <div className="pagina-login">
      <main className="area-login">
        <section className="cartao-login" aria-labelledby="titulo-login">
          <Link className="marca-login" to="/">
            E-tecidos
          </Link>
          <div className="introducao-login">
            <h1 id="titulo-login">Bem-vindo de volta</h1>
            <p>Entre na sua conta para continuar.</p>
          </div>

          <a className="botao-google" href="#login-google">
            <svg aria-hidden="true" viewBox="0 0 24 24" role="img">
              <path
                fill="#4285F4"
                d="M21.35 12.27c0-.71-.06-1.4-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.22Z"
              />
              <path
                fill="#34A853"
                d="M12 21.91c2.63 0 4.84-.87 6.45-2.42l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.91Z"
              />
              <path
                fill="#FBBC05"
                d="M6.53 13.93a5.86 5.86 0 0 1 0-3.86V7.54H3.29a9.77 9.77 0 0 0 0 8.92l3.24-2.53Z"
              />
              <path
                fill="#EA4335"
                d="M12 6.04c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.13 14.63 2.25 12 2.25a9.74 9.74 0 0 0-8.71 5.29l3.24 2.53C7.3 7.76 9.46 6.04 12 6.04Z"
              />
            </svg>
            Continuar com o Google
          </a>

          <div className="divisor-login">
            <span>ou entre com seu e-mail</span>
          </div>

          <form className="formulario-login" onSubmit={handleSubmit}>
            <div className="campo-login">
              <label htmlFor="email-login">E-mail</label>
              <input
                id="email-login"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="voce@exemplo.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="campo-login">
              <div className="rotulo-senha">
                <label htmlFor="senha-login">Senha</label>
                <a href="#esqueci-senha">Esqueci a senha</a>
              </div>
              <input
                id="senha-login"
                name="senha"
                type="password"
                autoComplete="current-password"
                minLength={8}
                pattern="(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}"
                title="A senha deve ter pelo menos 8 caracteres, uma letra maiúscula e um caractere especial."
                value={form.senha}
                onChange={handleChange}
                required
              />
              <small>Use 8 ou mais caracteres, uma letra maiúscula e um caractere especial.</small>
            </div>
            <button className="botao-login" type="submit">
              Entrar
            </button>
          </form>

          <p className="link-cadastro">
            Ainda não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
