# E-tecidos — versão React

Conversão do projeto estático (HTML + CSS + JS) para React, usando Vite e React Router.

## Estrutura

```
src/
  main.jsx            -> ponto de entrada, monta o BrowserRouter
  App.jsx             -> define as rotas (/, /login, /cadastro)
  style.css           -> o mesmo CSS original, sem alterações
  data/
    produtos.js        -> dados dos cards de produto (antes hardcoded no HTML)
  components/
    Header.jsx          -> cabeçalho reutilizado nas 3 páginas (varia por "variant")
    ProdutoCard.jsx      -> card de produto com <details> controlado
  pages/
    Index.jsx            -> antiga index.html (vitrine de produtos)
    Login.jsx             -> antiga login.html
    Cadastro.jsx          -> antiga cadastro.html
```

## O que mudou em relação ao projeto original

- **Roteamento**: as 3 páginas HTML viraram rotas do `react-router-dom` (`/`, `/login`, `/cadastro`),
  então os links usam `<Link>` em vez de `<a href="...html">`.
- **Interatividade do accordion de produtos** (`index.html`): a lógica que manipulava o DOM
  diretamente (`querySelectorAll`, `.open = false`) virou um único estado `abertoId` no componente
  `Index`, controlando qual card está aberto.
- **Toggle pessoa física / jurídica** (`cadastro.html`): a lógica de habilitar/desabilitar campos
  virou um estado `tipoPessoa` no componente `Cadastro`, e os atributos `disabled`/`required`/`hidden`
  são derivados desse estado.
- **Formulário de login**: os inputs viraram controlados (`useState`) como ponto de partida para
  integrar com uma API depois.
- O **CSS não foi alterado** — todas as classes (`.produto`, `.cabeca`, `.formulario-cadastro`, etc.)
  permanecem as mesmas, só trocando `class` por `className` e `for` por `htmlFor` no JSX.
- O `contador.js` original era um script solto de exemplo (`contarAura`, `soma`) sem uso nas páginas,
  então não foi incluído no app — se você precisar dele em algum componente, é só criar
  `src/utils/contador.js` com essas funções e importar.

## Como rodar

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

Para gerar a versão de produção:

```bash
npm run build
```

Os arquivos finais ficam em `dist/`.
