# E-tecidos — versão React

Tutorial para rodar o site no seu computador (ambiente local).

## Pré-requisitos

- **Git** instalado (para clonar o repositório)
- **Node.js** instalado (inclui o `npm`) — baixe em [nodejs.org](https://nodejs.org), versão LTS

Para conferir se já tem tudo instalado, rode no terminal:

```bash
git --version
node --version
npm --version
```

Se algum desses comandos der erro, instale a ferramenta que faltou antes de continuar.

## Passo 1 — Clonar o repositório

Escolha uma pasta no seu computador (ex: Área de Trabalho) e rode:

```bash
git clone https://github.com/Brielmatos22/E-tecidos-PSW.git
cd E-tecidos-PSW
```

## Passo 2 — Instalar as dependências

Ainda dentro da pasta do projeto, rode:

```bash
npm install
```

Isso baixa o React, o Vite e as demais bibliotecas usadas no projeto. Pode demorar um pouco na primeira vez.

## Passo 3 — Iniciar o servidor local

```bash
npm run dev
```

O terminal vai mostrar uma mensagem parecida com esta:

```
  VITE ready
  ➜  Local:   http://localhost:5173/
```

## Passo 4 — Abrir no navegador

Copie o endereço mostrado (geralmente `http://localhost:5173`) e cole na barra do navegador.

O site vai abrir na página inicial (vitrine de produtos). Pelo menu, você acessa:

- **Início** → página de produtos (`/`)
- **Login** → página de login (`/login`)
- **Cadastro** → página de cadastro (`/cadastro`)

Qualquer alteração que você fizer nos arquivos dentro de `src/` aparece automaticamente no navegador, sem precisar reiniciar o servidor.

## Passo 5 — Parar o servidor

Quando terminar de visualizar, volte ao terminal e aperte `Ctrl + C`.

## Gerar a versão de produção (opcional)

Se quiser gerar os arquivos finais otimizados para publicar em um servidor:

```bash
npm run build
```

Os arquivos ficam na pasta `dist/`. Para conferir como ficaram antes de publicar:

```bash
npm run preview
```

## Estrutura do projeto

```
src/
  main.jsx            -> ponto de entrada, monta o BrowserRouter
  App.jsx             -> define as rotas (/, /login, /cadastro)
  style.css           -> CSS do projeto
  data/
    produtos.js        -> dados dos cards de produto
  components/
    Header.jsx          -> cabeçalho reutilizado nas 3 páginas
    ProdutoCard.jsx      -> card de produto com accordion "Saiba mais"
  pages/
    Index.jsx            -> vitrine de produtos
    Login.jsx             -> página de login
    Cadastro.jsx          -> página de cadastro
```

## Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| `npm: command not found` / `não é reconhecido` | Node.js não instalado | Instale em nodejs.org e reabra o terminal |
| `git: command not found` | Git não instalado | Instale o Git for Windows / Xcode Command Line Tools (Mac) |
| Porta 5173 já em uso | Outro processo rodando na mesma porta | Feche o outro processo ou deixe o Vite sugerir outra porta automaticamente |
| Página em branco no navegador | Servidor ainda não terminou de subir | Espere a mensagem "Local: http://..." aparecer no terminal antes de abrir |
