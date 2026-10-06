import Header from "../components/Header.jsx";
import Bottom from "../components/Bottom.jsx";
import useCadastroForm from "../hooks/useCadastroForm.js";

export default function Cadastro() {
  const { tipoPessoa, pessoaJuridica, alterarTipoPessoa, enviar } = useCadastroForm();

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

          <form className="formulario-cadastro" onSubmit={enviar}>
            <fieldset className="border rounded p-3 mb-4">
              <legend className="float-none w-auto px-2 fs-6 fw-semibold">Tipo de cadastro</legend>
              <div className="opcoes-tipo">
                <label className="opcao-tipo">
                  <input
                    type="radio"
                    name="tipo_pessoa"
                    value="fisica"
                    checked={tipoPessoa === "fisica"}
                    onChange={alterarTipoPessoa}
                  />
                  <span>Pessoa física</span>
                </label>
                <label className="opcao-tipo">
                  <input
                    type="radio"
                    name="tipo_pessoa"
                    value="juridica"
                    checked={tipoPessoa === "juridica"}
                    onChange={alterarTipoPessoa}
                  />
                  <span>Pessoa jurídica (CNPJ)</span>
                </label>
              </div>
            </fieldset>

            <fieldset className="border rounded p-3 mb-4" id="dados-pessoa-fisica" hidden={pessoaJuridica}>
              <legend className="float-none w-auto px-2 fs-6 fw-semibold">Dados pessoais</legend>
              <div className="grade-formulario">
                <div className="campo">
                  <label htmlFor="nome">Nome completo</label>
                  <input
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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

            <fieldset className="border rounded p-3 mb-4" id="dados-pessoa-juridica" hidden={!pessoaJuridica}>
              <legend className="float-none w-auto px-2 fs-6 fw-semibold">Dados da empresa</legend>
              <div className="grade-formulario">
                <div className="campo campo-largo">
                  <label htmlFor="razao-social">Nome da empresa</label>
                  <input
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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

            <fieldset className="border rounded p-3 mb-4">
              <legend className="float-none w-auto px-2 fs-6 fw-semibold">Contato e pagamento(Opcional)</legend>
              <div className="grade-formulario">
                <div className="campo campo-largo">
                  <label htmlFor="email">E-mail</label>
                  <input className="form-control" id="email" name="email" type="email" autoComplete="email"/>
                </div>
                <div className="campo campo-largo">
                  <label htmlFor="nome-cartao">Nome no cartão</label>
                  <input className="form-control" id="nome-cartao" name="nome_cartao" type="text" autoComplete="cc-name"/>
                </div>
                <div className="campo campo-largo">
                  <label htmlFor="numero-cartao">Número do cartão</label>
                  <input
                    className="form-control"
                    id="numero-cartao"
                    name="numero_cartao"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                  />
                </div>
                <div className="campo">
                  <label htmlFor="validade">Validade</label>
                  <input className="form-control" id="validade" name="validade" type="month" autoComplete="cc-exp"/>
                </div>
                <div className="campo">
                  <label htmlFor="codigo-seguranca">Código de segurança</label>
                  <input
                    className="form-control"
                    id="codigo-seguranca"
                    name="codigo_seguranca"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    autoComplete="cc-csc"
                  />
                </div>
              </div>
            </fieldset>

            <div className="aceite">
              <input id="aceite" type="checkbox" name="aceite" required />
              <label htmlFor="aceite">
              <span>Concordo com os termos de uso e a política de privacidade.</span>
              </label>
            </div>
            <button type="submit">Criar cadastro</button>
          </form>
        </section>
      </main>
      <Bottom />
    </div>
  );
}
