# Dicionário da EAP — E-tecidos

**Versão:** 1.0  
**Data:** 05/10/2026  
**Linha de base do escopo:** este dicionário, a declaração do escopo e a EAP em [plano-de-projeto.md](plano-de-projeto.md)

Cada linha é um pacote de trabalho. **A** é quem presta contas do aceite. **R** é quem executa. Marco, recurso e custo não se repetem aqui; estão no cronograma e no orçamento do plano.

Equipes: **GPTI** = Bernardo, Jose Luka e Thiago. **PSW** = Lorenzo, Gabriel e Walter.

## 1.1 Gestão e coordenação

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.1.1 | Termo e plano mantidos | Bernardo | GPTI | A versão entregue na AV1 é a usada no controle das semanas 9 a 12, ou a mudança está registrada. |
| 1.1.2 | Decisões, riscos e mudanças | Jose Luka | GPTI | Cada mudança de escopo, prazo ou custo tem pedido, decisão e efeito nas três linhas de base. |
| 1.1.3 | Aceites dos marcos | Thiago | Thiago | Há registro de aceite ou recusa do M1 na semana 8 e do M2 na semana 12, com ciência do patrocinador. |
| 1.1.4 | Revisão técnica organizada | Walter | PSW | Nenhum incremento entra na demonstração sem revisão de outro aluno e sem o autor explicar o trecho. |

## 1.2 Requisitos e desenho

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.2.1 | Escopo funcional inicial | Jose Luka | PSW propõe; GPTI valida | A declaração da seção 4.1 do plano cabe em uma leitura e lista o que está fora. |
| 1.2.2 | Perfis e permissões | Jose Luka | PSW | Administrador, fornecedor PJ e cliente PF têm permissões escritas e distintas; nenhuma ação aparece em dois perfis sem motivo registrado. |
| 1.2.3 | Modelo de dados e contrato | Walter | PSW | O mesmo exemplo de payload de cada coleção serve ao `json-server` e à API Express. |
| 1.2.4 | Telas e navegação | Lorenzo | PSW | Um roteiro percorre catálogo, carrinho, login e painel sem passo que não esteja na tela. |
| 1.2.5 | Hipóteses e limitações | Jose Luka | GPTI | Cada regra sem validação de uma loja real está marcada como hipótese do protótipo. |

## 1.3 Base técnica e ambientes

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.3.1 | Aplicação React/Vite | Walter | PSW | Outro aluno executa `npm install` e `npm run dev` seguindo o README e abre a loja. |
| 1.3.2 | `json-server` com sementes | Walter | Walter | `npm run server` gera o banco a partir de `src/data` e responde `GET /api/produtos`. |
| 1.3.3 | API Express inicial | Gabriel | PSW | A API responde uma rota de verificação, e o frontend não acessa o MongoDB diretamente. |
| 1.3.4 | MongoDB de desenvolvimento | Walter | Walter | Um registro gravado é lido depois de reiniciar a API. |

## 1.4 Frontend do marco 1

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.4.1 | Catálogo e detalhe | Lorenzo | Lorenzo | Os produtos vêm da API simulada, e o detalhe de cada card abre e fecha. |
| 1.4.2 | Carrinho | Lorenzo | Lorenzo | Incluir, alterar quantidade, remover e limpar atualizam subtotal, frete (R$ 25,00) e total. Sem login, o carrinho redireciona para o login. |
| 1.4.3 | Login, cadastro e sessão | Gabriel | Gabriel | Os três usuários de demonstração entram; o formulário de cadastro alterna campos de PF e PJ. Gravar o cadastro novo fica para 1.5.4. |
| 1.4.4 | Guardas de rota | Gabriel | Gabriel | Cliente PF não abre `/admin`; fornecedor não abre `/admin/contas`; só o administrador abre todas. |
| 1.4.5 | Painel de vendas | Walter | Walter | As vendas das sementes aparecem com status; o fornecedor consulta, mas não cria, edita nem exclui. |
| 1.4.6 | Gestão de produtos | Walter | Walter | O administrador mantém todos os produtos; o fornecedor vê e altera só os de seu `fornecedorId`. |
| 1.4.7 | Gestão de contas PF e PJ | Walter | Gabriel e Walter | O administrador consulta, edita, suspende e exclui contas PF e PJ. |
| 1.4.8 | Layout responsivo | Lorenzo | Lorenzo | Cabeçalho, menu e rodapé funcionam em largura de celular e de desktop. |
| 1.4.9 | Demonstração do M1 | Thiago | PSW | A demonstração da semana 8 executa o roteiro de 1.4.1 a 1.4.8 e o README registra as limitações do `json-server`. |

1.4 aceita a tela sobre o `json-server`. 1.5 aceita a API no MongoDB. Um pacote não herda o aceite do outro.

## 1.5 Backend e regras de negócio

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.5.1 | API de produtos | Gabriel | Lorenzo e Walter | Criar, consultar, editar e excluir persistem no MongoDB; o fornecedor recebe recusa ao alterar produto de outro fornecedor. |
| 1.5.2 | API de contas PF e PJ | Gabriel | Gabriel | Só o administrador cria, edita, suspende ou exclui conta; os demais recebem recusa. |
| 1.5.3 | API de vendas | Gabriel | Walter | A consulta funciona para administrador e fornecedor; escrita só para o administrador. |
| 1.5.4 | Autenticação com hash | Gabriel | Gabriel | Um cadastro novo é gravado e consegue entrar em seguida; a senha não aparece em texto no banco; login com senha errada é recusado. |
| 1.5.5 | Autorização nas rotas | Gabriel | Gabriel | Uma chamada direta à API, sem a permissão exigida, é recusada mesmo sem passar pela tela. |
| 1.5.6 | Finalização de compra | Gabriel | Lorenzo | A compra grava uma venda com cliente, produto, metros, valor e fornecedor iguais aos do carrinho, e o carrinho é limpo. |
| 1.5.7 | Persistência | Gabriel | PSW | Produtos, contas e vendas continuam disponíveis depois de reiniciar a API. |

## 1.6 Integração do marco 2

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.6.1 | Frontend na API Express | Walter | PSW | Os fluxos do M1 executam contra a API Express, sem `json-server`. |
| 1.6.2 | Compra ponta a ponta | Walter | Lorenzo | Um cliente PF compra, e a venda aparece no painel do administrador e no do fornecedor do produto. |
| 1.6.3 | Permissões ponta a ponta | Walter | Gabriel | Os bloqueios de 1.4.4 valem também quando a chamada é feita direto na API. |
| 1.6.4 | Erros tratados | Walter | PSW | Login inválido, falta de permissão e API fora do ar mostram mensagem identificável, não tela em branco. |
| 1.6.5 | Demonstração final | Thiago | PSW | A semana 12 executa o roteiro de 1.6.1 a 1.6.4, ou registra o caso que falhou. |

## 1.7 Verificação e encerramento

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.7.1 | Testes dos fluxos prioritários | Thiago | PSW | Há resultado (passou ou falhou) para catálogo, carrinho, compra, login e cada perfil. |
| 1.7.2 | Defeitos tratados | Thiago | PSW | Defeito que viola aceite de pacote está corrigido ou listado como limitação da demonstração. |
| 1.7.3 | Instruções de execução | Thiago | Walter | Outro aluno sobe API, banco e frontend só com o texto do README. |
| 1.7.4 | Encerramento e lições | Thiago | GPTI | O termo de encerramento diz o que foi aceito, o que ficou de fora e o que a turma não repetiria. |
| 1.7.5 | Pendências para operação real | Thiago | GPTI | A lista separa pagamento, frete, estoque, segurança e hospedagem como trabalho futuro, sem dono neste projeto. |
