# Correção da AV1 — PSW — E-tecidos

Repositório: https://github.com/Brielmatos22/E-tecidos-PSW

A nota de cada aluno é a parte comum do grupo mais a qualidade individual. Quem não tem commit no repositório recebe a parte comum do grupo, sem a parte individual. A parte comum vale 60 pontos: stack da disciplina (30) e escopo funcionando (30). Os 40 restantes avaliam a qualidade do que o próprio aluno fez.

| Aluno | Nota |
| --- | ---: |
| Walter Henrique de Avila Goncalves | 85 |
| Gabriel de Matos Peixoto da Conceicao | 81 |
| Lorenzo Silva da Torre | 45 |

## Parte comum — 45/60

A stack vale 15/30.

- 5 pontos. React com rotas de loja, carrinho, login, cadastro e painel.
- 0. React Hook Form não está no `package.json` nem no código. Os formulários usam `useState`.
- 0. Zod não está no projeto.
- 0. TanStack Query não está no projeto. As telas chamam a API com `fetch` dentro de `useEffect`.
- 5 pontos. O JSON Server sobe com `npm run server` na porta 3001, e o Vite encaminha `/api` para ele.
- 5 pontos. Bootstrap é o framework de interface.

O escopo vale 30/30. A régua são os pacotes 1.4.1 a 1.4.8 do dicionário da EAP. O README sobe os dois processos.

Conferido na tela, com os usuários do README:

- O catálogo lista os tecidos da API. "Saiba mais" abre o detalhe da seda.
- Sem login, `/carrinho` volta para o login. Com a cliente Marina, a seda entra no carrinho, a quantidade vai a 2 e o resumo fica em subtotal R$ 420,00, frete R$ 25,00 e total R$ 445,00. O item permanece no `localStorage` ao sair da página.
- O cliente Marina e o administrador entram. O cliente que abre `/admin` volta para a loja. O administrador cai no histórico de vendas, com status, edição e exclusão.
- O administrador cadastra um produto. "Linho de teste" foi gravado e continuou em `http://localhost:3001/produtos` como `linho-de-teste`.
- A tela de contas de pessoa física lista as seis contas, com editar, suspender e excluir.

O dicionário deixa a gravação de um cadastro novo para o marco 2. Isso não entra neste desconto.

## Walter Henrique de Avila Goncalves — 85

Há autoria dele na conversão do projeto para React e em dois ajustes que ficaram na entrega: o carrinho no cabeçalho da página inicial e os dados de cartão opcionais no cadastro. A nota reúne os 45 pontos do grupo e 40 de qualidade.

O painel de vendas, produtos e contas, que o plano atribui a ele, está no commit de Gabriel de Matos Peixoto da Conceicao, "Atualiza o projeto: carrinho, admin, JSON Server e README". O que o Walter entregou no código atual funciona.

## Gabriel de Matos Peixoto da Conceicao — 81

Os commits de login, cadastro, guardas de rota, carrinho, painel e JSON Server estão no nome dele. A nota reúne os 45 pontos do grupo e 36 de qualidade.

Desconto na parte individual:

- 4 pontos. Em `src/pages/Login.jsx`, "Continuar com o Google" aponta para `#login-google` e "Esqueci a senha" aponta para `#esqueci-senha`. Os dois links não realizam a ação que o texto anuncia.

O restante da parte dele está organizado: `src/utils/api.js` só segue em frente quando a resposta vem com sucesso, as rotas do painel exigem permissão, e as telas separam carregando e erro.

## Lorenzo Silva da Torre — 45

Não há commit, e-mail nem arquivo com o nome dele no repositório. O dicionário atribui a ele o catálogo, o carrinho e o layout. Essas telas existem, no histórico de Gabriel de Matos Peixoto da Conceicao e de Walter Henrique de Avila Goncalves. A nota é a parte comum do grupo, 45 pontos. Sem commit, não há parte individual a avaliar.
