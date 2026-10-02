# E-tecidos

Loja demonstrativa de tecidos feita com **React**, **Vite**, **React Router**, **Bootstrap** e **JSON Server**. Inclui catálogo de produtos, carrinho, login de demonstração e áreas administrativas para vendas, produtos e contas.

## Funcionalidades

- **Loja**: catálogo de tecidos com cards de produto e detalhes expansíveis.
- **Carrinho**: adicionar, alterar quantidade, remover e limpar itens (exige login).
- **Login e cadastro** com perfis de acesso por permissão.
- **Painel administrativo**: histórico de vendas, gestão de produtos e gestão de contas de pessoa física e pessoa jurídica.
- **Rodapé** e **cabeçalho** compartilhados, com layout responsivo (desktop e mobile).

## Rotas

| Rota | Acesso | Descrição |
| --- | --- | --- |
| `/` | Público | Loja |
| `/login` | Público | Entrar |
| `/cadastro` | Público | Criar conta |
| `/carrinho` | Usuário logado | Carrinho |
| `/admin` | `vendas:read` | Painel de vendas |
| `/admin/produtos` | `produtos:write` | Gestão de produtos |
| `/admin/contas/pessoa-fisica` | `contas:manage` | Contas de pessoa física |
| `/admin/contas/pessoa-juridica` | `contas:manage` | Contas de pessoa jurídica |

## Requisitos

- Node.js compatível com a versão do Vite instalada
- npm

## Instalação e execução

```bash
npm install
```

Em um terminal, inicie a API:

```bash
npm run server
```

Em outro terminal, inicie a aplicação:

```bash
npm run dev
```

Abra `http://localhost:5173`. O JSON Server roda em `http://localhost:3001`; o Vite encaminha as chamadas com prefixo `/api` para ele.

O `npm run server` executa antes o `npm run db:build`, que combina as sementes de `src/data` em `server/db.json`.

## Usuários de demonstração

| Perfil | E-mail | Senha | Acesso |
| --- | --- | --- | --- |
| Administrador | `admin@e-tecidos.com.br` | `Admin@123` | Vendas, produtos e contas |
| Fornecedor PJ | `compras@casaaurora.exemplo.com` | `Fornecedor@123` | Consulta de vendas e CRUD dos próprios produtos |
| Cliente PF | `marina.albuquerque@exemplo.com` | `Cliente@123` | Loja e carrinho, sem painel administrativo |

A área de contas é exclusiva do administrador. O fornecedor pode consultar vendas, mas não criá-las, editá-las ou excluí-las.

## API

Coleções: `produtos`, `vendas`, `contasPessoaFisica`, `contasPessoaJuridica` e `usuarios`.

```text
GET    /api/produtos
POST   /api/produtos
PUT    /api/produtos/:id
DELETE /api/produtos/:id
```

O cliente HTTP está em `src/utils/api.js`. As coleções consultadas ficam em cache no `localStorage` para exibição imediata e são atualizadas em segundo plano. Carrinho e sessão também ficam no navegador.

## Dados e persistência

Os arquivos de `src/data` são as sementes iniciais (`produtosdb.json`, `vendasdb.json`, `contasPessoasFisicasdb.json`, `contasPessoasJuridicasdb.json`, `usuariosdb.json` e `configContasAdmin.json`).

O JSON Server grava as alterações em `server/db.json` durante a execução. Ao rodar `npm run server` de novo, esse arquivo é recriado a partir das sementes, e as alterações feitas pela API não voltam para `src/data`.

O campo `custoPorMetro` dos produtos é uma estimativa fictícia, usada para calcular o lucro bruto demonstrativo no painel.

## Estrutura

```text
scripts/
  build-db.js     Gera server/db.json a partir das sementes
server/
  db.json         Banco agregado do JSON Server (gerado)
src/
  auth/           Contexto, sessão, permissões e guardas de rota
  components/     Header, Bottom (rodapé), ProdutoCard, Carrinho, AdminLayout
  data/           Sementes e configuração em JSON
  hooks/          Estado e operações das telas
  pages/          Loja, login, cadastro e páginas administrativas
  styles/         Tema visual e estilos por página
  utils/          Cliente da API e funções auxiliares
```

## Comandos

```bash
npm run dev       # inicia o Vite
npm run server    # gera o banco e inicia o JSON Server
npm run db:build  # regenera somente server/db.json
npm run build     # cria o bundle de produção
npm run preview   # serve o bundle de produção
npm run lint      # executa o ESLint
```

## Segurança

Este projeto é uma demonstração local. O JSON Server expõe usuários e senhas sem hash, e as permissões são aplicadas apenas no frontend. Não use essas credenciais, esse mecanismo de sessão nem o JSON Server em produção: para isso, é preciso autenticação no servidor, armazenamento seguro de senhas e autorização em cada endpoint.
