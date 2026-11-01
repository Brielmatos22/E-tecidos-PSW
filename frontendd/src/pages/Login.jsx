import { Link } from "react-router-dom";
import useLoginForm from "../hooks/useLoginForm.js";

export default function Login() {
  const { register, errors, erro, entrando, enviar } = useLoginForm();

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

          {erro && <p className="alert alert-danger" role="alert">{erro}</p>}

          <form className="formulario-login" onSubmit={enviar} noValidate>
            <div className="campo-login">
              <label htmlFor="email-login">E-mail</label>
              <input
                id="email-login"
                className="form-control"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="voce@exemplo.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-login-erro" : undefined}
                {...register("email")}
              />
              {errors.email && <small className="text-danger" id="email-login-erro">{errors.email.message}</small>}
            </div>
            <div className="campo-login">
              <div className="rotulo-senha">
                <label htmlFor="senha-login">Senha</label>
                <a href="#esqueci-senha">Esqueci a senha</a>
              </div>
              <input
                id="senha-login"
                className="form-control"
                name="senha"
                type="password"
                autoComplete="current-password"
                title="A senha deve ter pelo menos 8 caracteres, uma letra maiúscula e um caractere especial."
                aria-invalid={Boolean(errors.senha)}
                aria-describedby={errors.senha ? "senha-login-erro" : "senha-login-ajuda"}
                {...register("senha")}
              />
              <small id="senha-login-ajuda">Use 8 ou mais caracteres, uma letra maiúscula e um caractere especial.</small>
              {errors.senha && <small className="text-danger" id="senha-login-erro">{errors.senha.message}</small>}
            </div>
            <button className="botao-login" type="submit" disabled={entrando}>
              {entrando ? "Entrando..." : "Entrar"}
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
