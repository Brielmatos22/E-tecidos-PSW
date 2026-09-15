import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";

export default function Cadastro() {
  const [tipoPessoa, setTipoPessoa] = useState("fisica");
  const pessoaJuridica = tipoPessoa === "juridica";

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: integrar com o backend de cadastro
    console.log("cadastro enviado, tipo:", tipoPessoa);
  };

  return (
    <div className="pagina-cadastro">
      <Header variant="cadastro" />

      <main className="conteudo-cadastro">
        <section className="cartao-cadastro" id="cadastro" aria-labelledby="titulo-cadastro">
          <div className="introducao-cadastro">
            <p className="etiqueta">Junte-se à E-tecidos</p>
            <h1 id="titulo-cadastro">Crie seu cadastro</h1>
            <p>Preencha os dados abaixo para começar.</p>
          </div>

          <form className="formulario-cadastro" onSubmit={handleSubmit}>
            <fieldset>
              <legend>Tipo de cadastro</legend>
              <div className="opcoes-tipo">
                <label className="opcao-tipo">
                  <input
                    type="radio"
                    name="tipo_pessoa"
                    value="fisica"
                    checked={tipoPessoa === "fisica"}
                    onChange={(e) => setTipoPessoa(e.target.value)}
                  />
                  Pessoa física
                </label>
                <label className="opcao-tipo">
                  <input
                    type="radio"
                    name="tipo_pessoa"
                    value="juridica"
                    checked={tipoPessoa === "juridica"}
                    onChange={(e) => setTipoPessoa(e.target.value)}
                  />
                  Pessoa jurídica (CNPJ)
                </label>
              </div>
            </fieldset>

            <fieldset id="dados-pessoa-fisica" hidden={pessoaJuridica}>
              <legend>Dados pessoais</legend>
              <div className="grade-formulario">
                <div className="campo">
                  <label htmlFor="nome">Nome completo</label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    autoComplete="name"
                    disabled={pessoaJuridica}
                    required={!pessoaJuridica}
                  />
                </div>
                <div className="campo">
                  <label htmlFor="cpf">CPF</label>
                  <input
                    id="cpf"
                    name="cpf"
                    type="text"
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    pattern="[0-9.\-]{11,14}"
                    disabled={pessoaJuridica}
                    required={!pessoaJuridica}
                  />
                </div>
                <div className="campo">
                  <label htmlFor="data-nascimento">Data de nascimento</label>
                  <input
                    id="data-nascimento"
                    name="data_nascimento"
                    type="date"
                    disabled={pessoaJuridica}
                    required={!pessoaJuridica}
                  />
                </div>
                <div className="campo campo-largo">
                  <label htmlFor="endereco-pf">Endereço</label>
                  <input
                    id="endereco-pf"
                    name="endereco"
                    type="text"
                    autoComplete="street-address"
                    disabled={pessoaJuridica}
                    required={!pessoaJuridica}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset id="dados-pessoa-juridica" hidden={!pessoaJuridica}>
              <legend>Dados da empresa</legend>
              <div className="grade-formulario">
                <div className="campo campo-largo">
                  <label htmlFor="razao-social">Nome da empresa</label>
                  <input
                    id="razao-social"
                    name="razao_social"
                    type="text"
                    autoComplete="organization"
                    disabled={!pessoaJuridica}
                    required={pessoaJuridica}
                  />
                </div>
                <div className="campo">
                  <label htmlFor="cnpj">CNPJ</label>
                  <input
                    id="cnpj"
                    name="cnpj"
                    type="text"
                    inputMode="numeric"
                    placeholder="00.000.000/0000-00"
                    pattern="[0-9./\-]{14,18}"
                    disabled={!pessoaJuridica}
                    required={pessoaJuridica}
                  />
                </div>
                <div className="campo">
                  <label htmlFor="localizacao">Localização</label>
                  <input
                    id="localizacao"
                    name="localizacao"
                    type="text"
                    autoComplete="street-address"
                    disabled={!pessoaJuridica}
                    required={pessoaJuridica}
                  />
                </div>
                <div className="campo campo-largo">
                  <label htmlFor="descricao">Descrição do que a empresa faz</label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    rows={4}
                    disabled={!pessoaJuridica}
                    required={pessoaJuridica}
                  />
                </div>
                <div className="campo">
                  <label htmlFor="senha">Senha para login</label>
                  <input
                    id="senha"
                    name="senha"
                    type="password"
                    minLength={8}
                    autoComplete="new-password"
                    disabled={!pessoaJuridica}
                    required={pessoaJuridica}
                  />
                  <small>Mínimo de 8 caracteres.</small>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>Contato e pagamento</legend>
              <div className="grade-formulario">
                <div className="campo campo-largo">
                  <label htmlFor="email">E-mail</label>
                  <input id="email" name="email" type="email" autoComplete="email" required />
                </div>
                <div className="campo campo-largo">
                  <label htmlFor="nome-cartao">Nome no cartão</label>
                  <input id="nome-cartao" name="nome_cartao" type="text" autoComplete="cc-name" required />
                </div>
                <div className="campo campo-largo">
                  <label htmlFor="numero-cartao">Número do cartão</label>
                  <input
                    id="numero-cartao"
                    name="numero_cartao"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    required
                  />
                </div>
                <div className="campo">
                  <label htmlFor="validade">Validade</label>
                  <input id="validade" name="validade" type="month" autoComplete="cc-exp" required />
                </div>
                <div className="campo">
                  <label htmlFor="codigo-seguranca">Código de segurança</label>
                  <input
                    id="codigo-seguranca"
                    name="codigo_seguranca"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    autoComplete="cc-csc"
                    required
                  />
                </div>
              </div>
            </fieldset>

            <label className="aceite">
              <input type="checkbox" name="aceite" required />
              <span>Concordo com os termos de uso e a política de privacidade.</span>
            </label>
            <button type="submit">Criar cadastro</button>
          </form>
        </section>
      </main>
    </div>
  );
}
