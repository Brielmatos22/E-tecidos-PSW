# Plano de Projeto — E-tecidos

**Versão:** 1.0  
**Data:** 05/10/2026  
**Patrocinador:** Prof. Diogo Mendonça  
**Gerência (GPTI — Grupo J):** Bernardo Monteiro Rodrigues Lima, Jose Luka de Miranda Goncalves, Thiago Athanasio Barreto da Rocha Petitinga  
**Produto (PSW — Grupo 10):** Lorenzo Silva da Torre, Gabriel de Matos Peixoto da Conceicao, Walter Henrique de Avila Goncalves

> Este documento contém a declaração do escopo, os requisitos, a matriz de rastreabilidade, a EAP, o cronograma, os recursos, os custos, os riscos e o engajamento. O aceite de cada pacote está no [dicionário da EAP](dicionario-eap.md). A divisão de tarefas por aluno de PSW é uma **proposta da gerência**, a confirmar com o Grupo 10.

**Números da linha de base**

| O quê | Valor | Onde |
|---|---:|---|
| Iniciação, ordem de grandeza | 390 h, R$ 7.350,00 (−25% a +75%) | Caso de negócio 12.1 |
| Capacidade dos calendários | 180 h PSW + 135 h GPTI = 315 h | 5.3 |
| Atividades niveladas | 162 h PSW + 108 h GPTI = 270 h, R$ 5.088,46 | 5.2, 6.2 |
| Segunda estimativa, pelo entregável | 232 h; PSW −4 h, GPTI −34 h | 6.2.1 |
| Contingência, por evento nomeado | 36 h = 16 h PSW + 20 h GPTI, R$ 678,46 | 6.3.3 |
| Linha de base de custos | 306 h, R$ 5.766,92 | 6.4 |
| Reserva gerencial, fora da linha de base | 7%, R$ 403,68 | 6.4 |
| Orçamento total simulado | R$ 6.170,61; desembolso R$ 0 | 6.4, termo 10 |
| Marcos | M1/AV1 na S8: GPTI 05/10 e PSW 06/10. M2 na S12: PSW 10/11; aceite GPTI 30/11 | 5.1 |

## 1. Objetivo da EAP

Decompor o trabalho e as entregas do protótipo em componentes gerenciáveis. A EAP é orientada a entregas; a numeração indica hierarquia, não ordem de execução. O pacote de trabalho é o terceiro nível (ex.: 1.4.2). Aceite e responsável estão no dicionário.

## 2. EAP / WBS

### 1.0 Projeto E-tecidos

- **1.1 Gestão e coordenação do projeto**
  - 1.1.1 Termo de abertura e plano mantidos
  - 1.1.2 Decisões, riscos e mudanças acompanhados
  - 1.1.3 Demonstrações e aceites dos marcos registrados
  - 1.1.4 Revisão técnica e pareamento organizados

- **1.2 Requisitos e desenho funcional**
  - 1.2.1 Escopo funcional proposto por PSW e validado por GPTI
  - 1.2.2 Perfis e permissões definidos (administrador, fornecedor PJ, cliente PF)
  - 1.2.3 Modelo de dados e contrato da API definidos (produtos, vendas, contas PF, contas PJ, usuários)
  - 1.2.4 Telas e navegação revisadas
  - 1.2.5 Hipóteses e limitações documentadas

- **1.3 Base técnica e ambientes**
  - 1.3.1 Aplicação React/Vite inicializada
  - 1.3.2 `json-server` com sementes de dados
  - 1.3.3 API Express inicializada
  - 1.3.4 MongoDB de desenvolvimento com sementes

- **1.4 Marco 1 — Frontend com `json-server`**
  - 1.4.1 Loja: catálogo e detalhe do produto
  - 1.4.2 Carrinho: incluir, alterar quantidade, remover e limpar
  - 1.4.3 Login, cadastro e sessão
  - 1.4.4 Guardas de rota por permissão
  - 1.4.5 Painel de vendas
  - 1.4.6 Gestão de produtos (administrador e fornecedor)
  - 1.4.7 Gestão de contas PF e PJ
  - 1.4.8 Layout responsivo (cabeçalho e rodapé)
  - 1.4.9 Demonstração do M1 e limitações do mock documentadas

- **1.5 Backend e regras de negócio**
  - 1.5.1 API de produtos
  - 1.5.2 API de contas PF e PJ
  - 1.5.3 API de vendas
  - 1.5.4 Autenticação na API com senha em hash
  - 1.5.5 Autorização por permissão nas rotas
  - 1.5.6 Finalização de compra que grava a venda
  - 1.5.7 Persistência no MongoDB

- **1.6 Marco 2 — Sistema integrado ao backend próprio**
  - 1.6.1 Frontend ligado à API Express
  - 1.6.2 Compra ponta a ponta
  - 1.6.3 Permissões verificadas ponta a ponta
  - 1.6.4 Erros dos fluxos prioritários tratados
  - 1.6.5 Demonstração final

- **1.7 Verificação e encerramento**
  - 1.7.1 Testes dos fluxos prioritários
  - 1.7.2 Defeitos tratados ou registrados como limitação
  - 1.7.3 Instruções de execução
  - 1.7.4 Termo de encerramento e lições aprendidas
  - 1.7.5 Pendências para uma operação real registradas

## 3. Regras de negócio do protótipo

Regras levantadas do repositório do Grupo 10 em 05/10/2026. São regras do protótipo, não de uma loja real.

1. **Perfis e permissões:** administrador tem `vendas:read`, `vendas:write`, `produtos:write` e `contas:manage`. Fornecedor PJ tem `vendas:read` e `produtos:write`. Cliente PF não tem permissão administrativa.
2. **Escopo do fornecedor:** o fornecedor vê e altera só os produtos ligados à sua conta (`fornecedorId`). Consulta vendas, mas não cria, edita nem exclui.
3. **Contas:** só o administrador gere contas PF e PJ.
4. **Carrinho:** exige login. O frete é um valor fixo simulado de R$ 25,00 quando há item no carrinho.
5. **Finalização de compra (M2):** grava uma venda com cliente, produto, metros, valor e fornecedor. O pagamento é simulado; nenhuma cobrança ocorre.
6. **Segurança (M2):** a senha é guardada com hash, e cada rota de escrita confere a permissão no servidor.
7. **Custo por metro:** é fictício e serve só para o lucro bruto demonstrativo do painel.

## 4. Linha de base do escopo

A linha de base do escopo é a declaração abaixo, a EAP da seção 2 e o [dicionário](dicionario-eap.md). Ela só muda por controle de mudanças.

### 4.1 Declaração do escopo

Entregar, em 12 semanas, um protótipo de loja virtual de tecidos em que um cliente fictício consulta o catálogo, monta o carrinho e finaliza uma compra simulada; o fornecedor mantém os próprios produtos e consulta vendas; e o administrador gere vendas, produtos e contas. No M2 os dados ficam no MongoDB, atrás de uma API Express com senha em hash e permissão verificada no servidor. A equipe GPTI entrega os artefatos de gestão no calendário da disciplina. Pagamento real, frete real, estoque e produção ficam fora.

Premissas: dados fictícios; três alunos de PSW programam e três de GPTI gerenciam; dedicação máxima de 5 h/semana.

Critério geral de aceite: na semana 12, a equipe GPTI aceita a demonstração, com ciência do patrocinador, se os casos do dicionário dos pacotes 1.4, 1.5 e 1.6 forem reproduzidos.

### 4.2 Necessidade e solução

| ID | Necessidade | Origem | Solução adotada |
|---|---|---|---|
| REQ-01 | Ver tecidos, preço e descrição sem ir à loja. | Hipótese do cenário. | Catálogo com cards e detalhe. |
| REQ-02 | Montar um pedido com vários tecidos e quantidades. | Hipótese do cenário. | Carrinho com quantidade e resumo. |
| REQ-03 | Registrar a compra sem redigitação manual. | Hipótese do cenário. | Finalização de compra que grava a venda. |
| REQ-04 | Separar o que cada perfil pode fazer. | Escopo proposto por PSW. | Permissões por perfil e guardas de rota. |
| REQ-05 | Fornecedor acompanhar vendas e manter os próprios produtos. | Escopo proposto por PSW. | Painel com escopo por `fornecedorId`. |
| REQ-06 | Gerir cadastro de clientes PF e PJ. | Escopo proposto por PSW. | Telas e API de contas, só para o administrador. |
| REQ-07 | Não expor senha nem confiar só na tela para permissão. | Limitação registrada no README do M1. | Hash de senha e autorização na API. |
| REQ-08 | Dados persistentes, independentes do navegador. | Plano de ensino de PSW. | API Express com MongoDB. |
| REQ-09 | Conduzir o projeto e registrar aceite, risco e encerramento. | Plano de ensino de GPTI. | Artefatos G01–G12. |

### 4.3 Matriz de rastreabilidade

| ID | Pacotes | Aceite observável |
|---|---|---|
| REQ-01 | 1.4.1 | O catálogo lista os produtos da API e abre o detalhe. |
| REQ-02 | 1.4.2 | Incluir, alterar, remover e limpar atualizam subtotal, frete e total. |
| REQ-03 | 1.5.6, 1.6.2 | A compra finalizada aparece no painel de vendas. |
| REQ-04 | 1.2.2, 1.4.4, 1.5.5, 1.6.3 | Cliente PF não abre `/admin`; fornecedor não abre contas. |
| REQ-05 | 1.4.5, 1.4.6, 1.5.1, 1.5.3 | Fornecedor vê só os próprios produtos e não altera vendas. |
| REQ-06 | 1.4.7, 1.5.2 | Administrador cria, edita, suspende e exclui contas PF e PJ. |
| REQ-07 | 1.5.4, 1.5.5 | Senha não aparece em texto no banco; chamada sem permissão é recusada pela API. |
| REQ-08 | 1.3.4, 1.5.7, 1.6.1 | Dado gravado continua lá depois de reiniciar a API. |
| REQ-09 | 1.1, 1.7 | AV1 na semana 8 e termo de encerramento na semana 12. |

## 5. Processo de elaboração do cronograma

### 5.1 Planejar o gerenciamento do cronograma

- **Unidade de planejamento:** semana letiva; acompanhamento em horas-pessoa.
- **Horizonte:** 12 semanas letivas. M1 e AV1 na semana 8. M2 na semana 12.
- **Calendários:** cada aluno tem até 5 h/semana. PSW trabalha nas semanas 1–12. GPTI estuda conceitos nas semanas 1–3 e trabalha no projeto nas semanas 4–12. GPTI tem aula às segundas e PSW às terças. Dias sem aula não contam, e a aula prática extra de 28 e 29/09 não conta como semana do projeto (calendário da disciplina).
- **Método de estimativa:** o calendário dos recursos vem primeiro e nivela as atividades; a seção 6.2.1 reestima pelo entregável e compara.
- **Regras de atualização:** progresso por esforço realizado, esforço restante e entrega aceita. A linha de base só muda por controle de mudanças.
- **Limites de controle:** variação acima de 10% do esforço de uma atividade, atraso que consuma a folga de um marco ou previsão acima de 306 h exige ação corretiva; mudança de escopo, prazo ou orçamento total exige decisão do patrocinador.

| Semana | GPTI | PSW |
|---:|---|---|
| 1 | 03/08 | 04/08 |
| 2 | 10/08 | 18/08 |
| 3 | 17/08 | 25/08 |
| 4 | 24/08 | 01/09 |
| 5 | 31/08 | 08/09 |
| 6 | 14/09 | 15/09 |
| 7 | 21/09 | 22/09 |
| 8 — M1 e AV1 | 05/10 | 06/10 |
| 9 | 26/10 | 13/10 |
| 10 | 09/11 | 27/10 |
| 11 | 16/11 | 03/11 |
| 12 — M2 | 30/11 | 10/11 |

### 5.2 Definir e sequenciar as atividades

**FS** = término–início; **SS** = início–início.

#### Atividades de produto — equipe PSW

| ID | Atividade/saída verificável | Predecessora | Janela | Esforço | Responsável principal | Custo simulado |
|---|---|---|---:|---:|---|---:|
| D01 | Detalhar escopo, perfis, fluxos e critérios de aceite | — | S1 | 13,5 h | PSW (3) | R$ 254,42 |
| D02 | Produzir telas e navegação em HTML/CSS | D01 (FS) | S2 | 13,5 h | PSW (3) | R$ 254,42 |
| D03 | Definir modelo de dados, sementes JSON e contrato da API | D02 (FS) | S3 | 13,5 h | PSW (3) | R$ 254,42 |
| D04 | Prototipar validações e regras em JavaScript | D03 (FS) | S4 | 13,5 h | PSW (3) | R$ 254,42 |
| D05 | Preparar aplicação React, rotas e componentes compartilhados | D04 (FS) | S5 | 4,5 h | PSW (3) | R$ 84,81 |
| D06 | Frontend da loja, carrinho e layout responsivo | D05 (SS) | S5–S7 | 12 h | Lorenzo | R$ 226,15 |
| D07 | Frontend de login, cadastro, sessão e guardas de rota | D05 (SS) | S5–S7 | 12 h | Gabriel | R$ 226,15 |
| D08 | Frontend do painel: vendas, produtos e contas | D05 (SS) | S5–S7 | 12 h | Walter | R$ 226,15 |
| D09 | Ligar ao `json-server`, testar e demonstrar o M1 | D06–D08 (FS) | S8 | 13,5 h | PSW (3) | R$ 254,42 |
| **M1** | **Frontend aceito com `json-server`** | D09 (FS) | **fim S8** | 0 h | Equipes e patrocinador | R$ 0,00 |
| D10 | Preparar Express, MongoDB e sementes | M1 (FS) | S9 | 4,5 h | PSW (3) | R$ 84,81 |
| D11 | APIs de produtos, contas e vendas | D10 (SS) | S9–S10 | 13,5 h | PSW (3); Walter na S10 | R$ 254,42 |
| D12 | Autenticação com hash e autorização nas rotas | D10 (FS) | S10–S11 | 7,5 h | Gabriel | R$ 141,35 |
| D13 | Finalização de compra que grava a venda | D11 (SS) | S10–S11 | 9 h | Lorenzo | R$ 169,62 |
| D14 | Painel de vendas e escopo do fornecedor sobre a API | D11, D12 (SS) | S11 | 6 h | Walter e Gabriel | R$ 113,08 |
| D15 | Integrar, testar, documentar e demonstrar | D11–D14 (FS) | S12 | 13,5 h | PSW (3) | R$ 254,42 |
| **M2** | **Sistema integrado ao backend próprio** | D15 (FS) | **fim S12** | 0 h | Equipes e patrocinador | R$ 0,00 |
| **Subtotal PSW** |  |  | **S1–S12** | **162 h** |  | **R$ 3.053,08** |

#### Atividades de gerenciamento — equipe GPTI

| ID | Atividade/saída verificável | Predecessora | Janela | Esforço | Responsável principal | Custo simulado |
|---|---|---|---:|---:|---|---:|
| G01 | Consolidar Business Case | — | S4 | 4 h | Bernardo | R$ 75,38 |
| G02 | Consolidar Termo de Abertura | G01 (SS) | S4 | 4 h | Jose Luka | R$ 75,38 |
| G03 | Identificar stakeholders, governança e riscos iniciais | G02 (SS) | S4 | 4 h | Thiago | R$ 75,38 |
| G04 | Detalhar escopo, EAP e dicionário | G02 (FS) | S5 | 8 h | Bernardo e Jose Luka | R$ 150,77 |
| G05 | Planejar requisitos, mudanças e responsabilidades | G03, G04 (SS) | S5 | 4 h | Thiago | R$ 75,38 |
| G06 | Atividades, precedências, estimativas e cronograma | G04 (FS) | S6 | 12 h | GPTI (3) | R$ 226,15 |
| G07 | Orçamento, riscos, qualidade e comunicações | G05, G06 (FS) | S7 | 12 h | GPTI (3) | R$ 226,15 |
| G08 | Integrar, revisar e entregar os artefatos da AV1 | G01–G07 (FS) | S8 | 12 h | GPTI (3) | R$ 226,15 |
| G09 | Controlar escopo e prazo; Status Report 1 | G08, M1 (FS) | S9 | 12 h | GPTI (3) | R$ 226,15 |
| G10 | Controlar custos e recursos; Status Report 2 | G09 (FS) | S10 | 12 h | GPTI (3) | R$ 226,15 |
| G11 | Monitorar stakeholders e riscos; Status Report 3 | G10 (FS) | S11 | 12 h | GPTI (3) | R$ 226,15 |
| G12 | Termo de encerramento e lições aprendidas | G11 (FS), D15 (SS) | S12 | 12 h | GPTI (3) | R$ 226,15 |
| **Subtotal GPTI** |  |  | **S4–S12** | **108 h** |  | **R$ 2.035,38** |

### 5.3 Estimar recursos e durações

| Grupo | Pessoas | Calendário | Capacidade máxima | Planejado em atividades | Utilização | Livre |
|---|---:|---|---:|---:|---:|---:|
| PSW | 3 | 5 h/semana, S1–S12 | 180 h | 162 h | 90% | 18 h |
| GPTI | 3 | 5 h/semana, S4–S12 | 135 h | 108 h | 80% | 27 h |
| **Total** | **6** |  | **315 h** | **270 h** | **85,7%** | **45 h** |

O nivelamento deixa 0,5 h/semana por aluno de PSW e 1 h/semana por aluno de GPTI. Das 45 h livres, 36 h viram contingência (seção 6.3.3): 16 h PSW e 20 h GPTI. Sobram 2 h PSW e 7 h GPTI. Se um risco exigir mais de 16 h de programação adicional, será preciso reduzir escopo ou replanejar o marco.

### 5.4 Cronograma e caminho crítico

- **Início:** semana 1, 03/08. **Término:** aceite do M2 em 30/11.
- **Caminho crítico técnico:** D01 → D02 → D03 → D04 → D05 → D06/D07/D08 → D09 → M1 → D10 → D11 → D14 → D15 → M2.
- **Cadeia crítica de gestão até a AV1:** G01/G02/G03 → G04/G05 → G06 → G07 → G08.
- O risco se concentra nas semanas 10 e 11, quando autenticação no servidor e finalização de compra rodam em paralelo.

Gantt semanal (■ = semana com esforço planejado):

| ID | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 | S9 | S10 | S11 | S12 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| D01 | ■ |  |  |  |  |  |  |  |  |  |  |  |
| D02 |  | ■ |  |  |  |  |  |  |  |  |  |  |
| D03 |  |  | ■ |  |  |  |  |  |  |  |  |  |
| D04 |  |  |  | ■ |  |  |  |  |  |  |  |  |
| D05 |  |  |  |  | ■ |  |  |  |  |  |  |  |
| D06–D08 |  |  |  |  | ■ | ■ | ■ |  |  |  |  |  |
| D09 / M1 |  |  |  |  |  |  |  | ■ |  |  |  |  |
| D10 |  |  |  |  |  |  |  |  | ■ |  |  |  |
| D11 |  |  |  |  |  |  |  |  | ■ | ■ |  |  |
| D12 |  |  |  |  |  |  |  |  |  | ■ | ■ |  |
| D13 |  |  |  |  |  |  |  |  |  | ■ | ■ |  |
| D14 |  |  |  |  |  |  |  |  |  |  | ■ |  |
| D15 / M2 |  |  |  |  |  |  |  |  |  |  |  | ■ |
| G01–G03 |  |  |  | ■ |  |  |  |  |  |  |  |  |
| G04–G05 |  |  |  |  | ■ |  |  |  |  |  |  |  |
| G06 |  |  |  |  |  | ■ |  |  |  |  |  |  |
| G07 |  |  |  |  |  |  | ■ |  |  |  |  |  |
| G08 / AV1 |  |  |  |  |  |  |  | ■ |  |  |  |  |
| G09 |  |  |  |  |  |  |  |  | ■ |  |  |  |
| G10 |  |  |  |  |  |  |  |  |  | ■ |  |  |
| G11 |  |  |  |  |  |  |  |  |  |  | ■ |  |
| G12 |  |  |  |  |  |  |  |  |  |  |  | ■ |

### 5.4.1 Folga e técnicas de estimativa

Duas atividades foram conferidas por três pontos, $E=(O+4M+P)/6$:

| Atividade | Otimista | Mais provável | Pessimista | Esperança | Linha de base | Premissa |
|---|---:|---:|---:|---:|---:|---|
| D12 — autenticação e autorização | 5 h | 7,5 h | 12 h | 7,8 h | 7,5 h | Hash com biblioteca pronta; o pessimista cobre a sessão entre frontend e API. |
| D13 — finalização de compra | 6 h | 9 h | 14 h | 9,3 h | 9 h | Pagamento simulado; o pessimista cobre validação do carrinho no servidor. |

A diferença fica abaixo de 0,5 h em cada uma; a linha de base não mudou.

No nível semanal, as atividades de PSW têm folga nula: os marcos são fixos e cada semana já está nivelada em 4,5 h por aluno. A proteção do prazo vem da reserva de 16 h, não de folga. Em GPTI, G05 (S5) tem folga de **1 semana**: sua sucessora em término–início, G07, só começa na S7. Folga não autoriza escopo novo.

### 5.5 Alocação semanal individual — PSW (proposta)

Cada aluno recebe **4,5 h/semana**, totalizando **54 h** e 162 h para PSW.

| Semana | Lorenzo — loja e compra | Gabriel — acesso e contas | Walter — painel e base |
|---:|---|---|---|
| 1 | D01: jornada do cliente — 4,5 h | D01: perfis e permissões — 4,5 h | D01: painel administrativo — 4,5 h |
| 2 | D02: telas da loja e carrinho — 4,5 h | D02: telas de login e cadastro — 4,5 h | D02: telas do painel — 4,5 h |
| 3 | D03: produtos e carrinho — 4,5 h | D03: usuários e contas — 4,5 h | D03: vendas e sementes — 4,5 h |
| 4 | D04: cálculo do carrinho — 4,5 h | D04: validação de cadastro — 4,5 h | D04: filtros e totais de vendas — 4,5 h |
| 5 | D05 1,5 h + D06 3 h | D05 1,5 h + D07 3 h | D05 1,5 h + D08 3 h |
| 6 | D06: loja e carrinho — 4,5 h | D07: login e sessão — 4,5 h | D08: vendas e produtos — 4,5 h |
| 7 | D06: layout responsivo — 4,5 h | D07: guardas de rota — 4,5 h | D08: contas PF e PJ — 4,5 h |
| 8 | D09: testes da loja — 4,5 h | D09: testes de acesso — 4,5 h | D09: integração e demonstração — 4,5 h |
| 9 | D10 1,5 h + D11 produtos 3 h | D10 1,5 h + D11 contas 3 h | D10 1,5 h + D11 vendas 3 h |
| 10 | D13: finalização de compra — 4,5 h | D12: hash e login na API — 4,5 h | D11: APIs restantes — 4,5 h |
| 11 | D13: venda gravada — 4,5 h | D12 autorização 3 h + D14 1,5 h | D14: painel sobre a API — 4,5 h |
| 12 | D15: testes da compra — 4,5 h | D15: testes de permissão — 4,5 h | D15: integração e demo — 4,5 h |
| **Total** | **54 h** | **54 h** | **54 h** |

### 5.6 Alocação semanal individual — GPTI

Semanas 1–3: só aulas de conceitos, sem esforço de projeto. Semanas 4–12: **4 h/semana** por aluno, **36 h** cada e 108 h para GPTI.

| Semana | Bernardo | Jose Luka | Thiago |
|---:|---|---|---|
| 1–3 | Conceitos; 0 h | Conceitos; 0 h | Conceitos; 0 h |
| 4 | G01: Business Case — 4 h | G02: Termo de Abertura — 4 h | G03: stakeholders e riscos — 4 h |
| 5 | G04: EAP — 4 h | G04: dicionário e aceites — 4 h | G05: requisitos e RACI — 4 h |
| 6 | G06: atividades e rede — 4 h | G06: estimativas e capacidade — 4 h | G06: alocação e nivelamento — 4 h |
| 7 | G07: custos e linha de base — 4 h | G07: riscos e contingência — 4 h | G07: qualidade e comunicações — 4 h |
| 8 | G08: revisão do Business Case — 4 h | G08: revisão do Termo e do Plano — 4 h | G08: consistência e entrega da AV1 — 4 h |
| 9 | G09: medição de escopo — 4 h | G09: atualização do cronograma — 4 h | G09: Status Report 1 — 4 h |
| 10 | G10: custo realizado — 4 h | G10: recursos e projeções — 4 h | G10: Status Report 2 — 4 h |
| 11 | G11: stakeholders — 4 h | G11: riscos e respostas — 4 h | G11: Status Report 3 — 4 h |
| 12 | G12: aceite e encerramento — 4 h | G12: lições aprendidas — 4 h | G12: consolidação e arquivo — 4 h |
| **Total** | **36 h** | **36 h** | **36 h** |

### 5.7 Matriz de responsabilidades e fazer ou comprar

Cada pacote tem um responsável por prestar contas (A); os demais executam (R). O patrocinador aprova mudança, marco e cancelamento, sem A de pacote.

| Pacote | Presta contas (A) | Executa (R) |
|---|---|---|
| 1.1 Gestão | Bernardo | GPTI (3) |
| 1.2 Requisitos e desenho | Jose Luka | PSW propõe; GPTI valida |
| 1.3 Ambiente | Walter | PSW (3) |
| 1.4 Frontend do M1 | Lorenzo | PSW (3), cada um na sua área |
| 1.5 Backend e regras | Gabriel | PSW (3) |
| 1.6 Integração do M2 | Walter | PSW (3) |
| 1.7 Verificação e encerramento | Thiago | GPTI registra; PSW demonstra |

**Fazer ou comprar:** o protótipo é feito pela equipe. Uma plataforma SaaS de loja virtual foi descartada no caso de negócio: tira o objetivo de aprendizagem e teria mensalidade. React, Express, MongoDB e `json-server` são ferramentas gratuitas, não aquisições.

## 6. Orçamento por composição

### 6.1 Premissas

- Custo **econômico simulado**; os alunos não são pagos. Desembolso: **R$ 0,00**.
- Taxa-sombra igual à do caso de negócio: $R\$2.450/(30\times52/12)=R\$18,8461538$ por hora-pessoa, para PSW e GPTI.
- Custo da atividade = esforço × taxa-sombra.
- O uso de IA não reduz a estimativa: toda saída de IA exige revisão humana.
- Hospedagem, domínio, serviços pagos, pagamento real e operação estão excluídos.

### 6.2 Distribuição semanal da linha de base das atividades

| Semana | PSW | GPTI | Total | Custo simulado | Saída principal |
|---:|---:|---:|---:|---:|---|
| 1 | 13,5 h | 0 h | 13,5 h | R$ 254,42 | Escopo e perfis |
| 2 | 13,5 h | 0 h | 13,5 h | R$ 254,42 | Telas |
| 3 | 13,5 h | 0 h | 13,5 h | R$ 254,42 | Modelo e contrato |
| 4 | 13,5 h | 12 h | 25,5 h | R$ 480,58 | Validações; iniciação |
| 5 | 13,5 h | 12 h | 25,5 h | R$ 480,58 | React; EAP |
| 6 | 13,5 h | 12 h | 25,5 h | R$ 480,58 | Telas React; cronograma |
| 7 | 13,5 h | 12 h | 25,5 h | R$ 480,58 | Painel; custos e riscos |
| 8 | 13,5 h | 12 h | 25,5 h | R$ 480,58 | M1 e AV1 |
| 9 | 13,5 h | 12 h | 25,5 h | R$ 480,58 | Express/Mongo; Status 1 |
| 10 | 13,5 h | 12 h | 25,5 h | R$ 480,58 | APIs e acesso; Status 2 |
| 11 | 13,5 h | 12 h | 25,5 h | R$ 480,58 | Compra e painel; Status 3 |
| 12 | 13,5 h | 12 h | 25,5 h | R$ 480,58 | M2 e encerramento |
| **Total** | **162 h** | **108 h** | **270 h** | **R$ 5.088,46** |  |

### 6.2.1 Conferência: pacote contra o calendário

Agrupando as atividades do calendário por pacote (a soma dá 270 h por construção):

| Pacote | Atividades | Horas do calendário |
|---|---|---:|
| 1.1 Gestão | G01, G02, G03, G05, G06, G07, G08, G09, G10, G11 | 88 h |
| 1.2 Requisitos e desenho | D01, D02, D03, D04, G04 | 62 h |
| 1.3 Base técnica | D05, D10 | 9 h |
| 1.4 Frontend do M1 | D06, D07, D08, D09 | 49,5 h |
| 1.5 Backend e regras | D11, D12, D13, D14 | 36 h |
| 1.6 Integração do M2 | D15 | 13,5 h |
| 1.7 Verificação e encerramento | G12 | 12 h |
| **Total** |  | **270 h** |

Segunda técnica, estimando o entregável do dicionário sem olhar a semana:

| Pacote | Premissa | Horas | Diferença |
|---|---|---:|---:|
| 1.1 Gestão | Caso 6 h, termo 6 h, partes e riscos 4 h, cronograma 8 h, orçamento e riscos 8 h, revisão AV1 6 h, três status a 6 h | 56 h | −32 h |
| 1.2 Requisitos e desenho | Escopo, perfis e contrato 18 h; telas 12 h; validação GPTI 6 h | 36 h | −26 h |
| 1.3 Base técnica | Quatro itens a 4 h | 16 h | +7 h |
| 1.4 Frontend do M1 | Catálogo 6, carrinho 6, login/cadastro 8, guardas 4, vendas 6, produtos 8, contas 8, layout 4, demonstração 4 | 54 h | +4,5 h |
| 1.5 Backend e regras | Produtos 6, contas 6, vendas 4, autenticação 8, autorização 6, compra 8; persistência inclusa | 38 h | +2 h |
| 1.6 Integração do M2 | Troca do mock pela API 10 h; demonstração 4 h | 14 h | +0,5 h |
| 1.7 Verificação e encerramento | Testes e instruções 6 h (PSW); encerramento 12 h (GPTI) | 18 h | +6 h |
| **Total** |  | **232 h** | **−38 h** |

| Grupo | Calendário | Pelo entregável | Diferença |
|---|---:|---:|---:|
| PSW | 162 h | 158 h | **−4 h** (2,5%) |
| GPTI | 108 h | 74 h | **−34 h** (31,5%) |
| **Total** | **270 h** | **232 h** | **−38 h** (14,1%) |

A diferença não foi zerada. Requisitos ficam mais altos no calendário porque as semanas 1 a 4 carregam também aprendizagem. Base técnica e backend ficam mais baixos no calendário: o dicionário pede mais do que D05, D10 e D11 receberam, e essa diferença cabe na reserva técnica. Em GPTI, o calendário reserva 12 h por semana para três pessoas, e vários artefatos, sobretudo os status, não usam tudo isso. A linha de base continua a do calendário, 270 h e R$ 5.088,46. A hora de GPTI que sobrar não vira escopo novo.

Até o fim da semana 8 o calendário tem **168 h** (108 h PSW e 60 h GPTI), R$ 3.166,15. Nas semanas 9 a 12, **102 h** (54 h PSW e 48 h GPTI), R$ 1.922,31.

### 6.3 Análise qualitativa e reserva de contingência

#### 6.3.1 Escalas

- **Probabilidade:** baixa até 25%; média de 26% a 50%; alta acima de 50%.
- **Impacto:** baixo até 8 h; médio de 9 h a 16 h; alto 17 h ou mais.
- **Prioridade alta:** alta/alta, alta/média ou média/alta. **Média:** média/média, alta/baixa ou baixa/alta. **Baixa:** as demais.

#### 6.3.2 Registro e respostas aos riscos

| ID | Risco e impacto | Prob. | Impacto | Prioridade | Mitigação | Gatilho e contingência | Responsável |
|---|---|---:|---:|---|---|---|---|
| RT01 | Aprendizagem de Express e MongoDB atrasa o M2. | 45% — média | 16 h — médio | **Média** | Exemplo mínimo e pareamento na S9. | Gatilho: API sem rota funcionando ao fim da S9. Contingência: concentrar a equipe nas APIs de produtos e vendas e cortar acabamento. | Walter |
| RT02 | Autenticação com hash e autorização no servidor falham ou atrasam. | 35% — média | 12 h — médio | **Média** | Biblioteca pronta de hash; testar com os três usuários de demonstração. | Gatilho: login pela API não funciona no início da S11. Contingência: priorizar checagem nas rotas de escrita. | Gabriel |
| RT03 | Contrato do `json-server` diverge da API Express. | 35% — média | 8 h — baixo | **Baixa** | Um exemplo de payload por coleção, usado nos dois lados. | Gatilho: tela que funcionava no M1 quebra com a API. Contingência: ajustar a API ao contrato e rodar a regressão. | Walter |
| RT04 | Código apoiado por IA não é compreendido pela equipe. | 30% — média | 8 h — baixo | **Baixa** | Revisão por outro aluno; o autor explica o trecho. | Gatilho: código não explicável ou regressão. Contingência: reverter e refazer o mínimo. | Gabriel |
| RT05 | Finalização de compra grava venda errada (valor, fornecedor ou cliente). | 30% — média | 10 h — médio | **Média** | Casos de teste com os três tecidos e cliente PF e PJ. | Gatilho: venda gravada difere do carrinho. Contingência: corrigir e repetir os casos. | Lorenzo |
| RG01 | Ausência de um integrante tira um terço da capacidade do grupo. | 35% — média | 16 h — médio | **Média** | Confirmar disponibilidade; tarefas pequenas; revisão cruzada. | Gatilho: integrante abaixo da carga por duas semanas. Contingência: redistribuir, cortar escopo e informar o patrocinador. | Jose Luka |
| RG02 | Pedidos fora da EAP: pagamento real, frete calculado, estoque. | 30% — média | 12 h — médio | **Média** | Conferir todo pedido contra a EAP. | Gatilho: pedido acima de 4 h fora da EAP. Contingência: registrar como trabalho futuro ou trocar por item equivalente com aprovação. | Bernardo |
| RG03 | Artefatos de gestão não atendem aos critérios e precisam ser refeitos. | 30% — média | 8 h — baixo | **Baixa** | Seguir o modelo da disciplina e revisar antes de cada entrega. | Gatilho: artefato rejeitado. Contingência: corrigir itens obrigatórios primeiro. | Thiago |
| RG04 | Decisão ou aceite atrasa perto de um marco. | 25% — baixa | 8 h — baixo | **Baixa** | Pauta fechada uma semana antes de S8 e S12. | Gatilho: decisão aberta a 48 h do marco. Contingência: escalar ao patrocinador. | Thiago |

Na reunião semanal, o responsável diz se a mitigação ocorreu, se o gatilho disparou e se a probabilidade mudou. Jose Luka anota no registro. Os riscos são revistos por escrito nos Status Reports das semanas 9, 10 e 11.

#### 6.3.3 Exposição esperada e reserva

Exposição = probabilidade × impacto em horas.

| ID | Probabilidade | Impacto | Exposição |
|---|---:|---:|---:|
| RT01 | 45% | 16 h | 7,2 h |
| RT02 | 35% | 12 h | 4,2 h |
| RT03 | 35% | 8 h | 2,8 h |
| RT04 | 30% | 8 h | 2,4 h |
| RT05 | 30% | 10 h | 3,0 h |
| **Subtotal técnico** |  |  | **19,6 h** |
| RG01 | 35% | 16 h | 5,6 h |
| RG02 | 30% | 12 h | 3,6 h |
| RG03 | 30% | 8 h | 2,4 h |
| RG04 | 25% | 8 h | 2,0 h |
| **Subtotal gestão** |  |  | **13,6 h** |
| **Total** |  |  | **33,2 h** |

Arredondando cada categoria para o múltiplo de 4 h acima, a reserva é **36 h**: 20 h técnicas e 16 h de gestão, custo sombra de **R$ 678,46**. Cada fatia tem um evento nomeado:

| Evento | Fatia | Quem executa |
|---|---:|---|
| RT01 — aprendizagem estoura o backend | 6 h | PSW |
| RT02 — autenticação no servidor atrasa | 4 h | PSW |
| RT03 — contrato diverge | 2 h + 2 h | PSW corrige; GPTI confere o aceite |
| RT04 — código não explicável | 2 h | PSW |
| RT05 — venda gravada errada | 2 h + 2 h | PSW corrige; GPTI prepara os casos |
| RG01 — integrante abaixo da carga | 6 h | GPTI |
| RG02 — pedido fora da EAP | 4 h | GPTI |
| RG03 — artefato rejeitado | 3 h | GPTI |
| RG04 — decisão de marco atrasa | 3 h | GPTI |
| **Total** | **36 h** | **16 h PSW + 20 h GPTI** |

**Risco geral:** o pior caso de RT01 e RT02 juntos (28 h) não cabe nas 16 h de programação reservadas. A resposta é cortar acabamento de interface; se ainda assim o M2 não couber, o patrocinador decide entre cortar escopo e encerrar antes do M2.

Com a reserva, o plano compromete **178/180 h PSW** e **128/135 h GPTI**.

### 6.4 Linha de base de custos e orçamento

| Componente | Cálculo | Valor simulado |
|---|---|---:|
| Atividades PSW | 162 h × R$ 18,8461538/h | R$ 3.053,08 |
| Atividades GPTI | 108 h × R$ 18,8461538/h | R$ 2.035,38 |
| **Custo das atividades** | 270 h | **R$ 5.088,46** |
| Contingência técnica | 20 h × R$ 18,8461538/h | R$ 376,92 |
| Contingência de gestão | 16 h × R$ 18,8461538/h | R$ 301,54 |
| **Linha de base de custos** | 306 h | **R$ 5.766,92** |
| Reserva gerencial | 7% × R$ 5.766,92 | R$ 403,68 |
| **Orçamento total simulado** | linha de base + reserva gerencial | **R$ 6.170,61** |

A contingência está dentro da linha de base e trata riscos identificados. A reserva gerencial fica fora e trata trabalho imprevisto; não autoriza aumento de escopo. Os valores usam a taxa não arredondada; somas visuais podem diferir em R$ 0,01.

## 7. Plano de engajamento das partes interessadas

### 7.1 Premissas e níveis

Linha de base conservadora: todos estão **neutros** hoje. Níveis: desinformado, resistente, neutro, apoiador e líder. **C** = situação corrente; **D** = desejada ao final.

### 7.2 Matriz de avaliação do engajamento

| Stakeholder | Desinformado | Resistente | Neutro | Apoiador | Líder |
|---|:---:|:---:|:---:|:---:|:---:|
| Prof. Diogo Mendonça — patrocinador |  |  | C |  | D |
| Equipe GPTI — Grupo J |  |  | C |  | D |
| Equipe PSW — Grupo 10 |  |  | C |  | D |
| Clientes e fornecedores potenciais |  |  | C | D |  |
| Lojista potencial |  |  | C/D |  |  |

### 7.2.1 Poder, interesse e estratégia

| Parte | Poder neste projeto | Interesse | Estratégia |
|---|---|---|---|
| Patrocinador | Alto: aprova marco, mudança e cancelamento | Alto | Gerenciar de perto |
| Equipe GPTI | Médio: controla o plano | Alto | Gerenciar de perto |
| Equipe PSW | Médio: constrói o produto | Alto | Gerenciar de perto |
| Clientes e fornecedores potenciais | Baixo | Médio | Manter informado, se houver demonstração |
| Lojista potencial | Baixo agora; alto numa implantação futura | Baixo nesta fase | Monitorar; sem contato |

### 7.3 Plano de engajamento

| Stakeholder | Objetivo | Ações, canal e frequência | Responsável | Evidência |
|---|---|---|---|---|
| Patrocinador | Decidir escopo, prazo, reserva e aceite dos marcos. | Resumo quinzenal; demonstrações em M1 e M2; pedido de decisão quando houver mudança. Canal: Teams e repositório. | Thiago | Decisões registradas; ciência dos marcos. |
| Equipe GPTI | Liderar planejamento, controle e integração dos artefatos. | Reunião semanal; atualização de cronograma, custos e riscos. | Bernardo coordena | Artefatos consistentes; Status Reports nas S9–S11. |
| Equipe PSW | Liderar a definição funcional e a execução técnica. | Planejamento semanal conjunto, revisão de código, aviso imediato de impedimento. Canal: repositório e grupo de mensagens. | Walter coordena | Tarefas atualizadas; M1 e M2 demonstráveis. |
| Clientes e fornecedores potenciais | Verificar se o fluxo é compreensível, sem prometer loja real. | Demonstração com dados fictícios, se autorizada. | Jose Luka e Lorenzo | Percepções separadas entre escopo atual e futuro. |

### 7.4 Cadência de comunicação

| Público | Conteúdo | Canal | Ritmo | Responsável |
|---|---|---|---|---|
| Patrocinador | Marco, decisão e risco geral | Teams e repositório | Quinzenal; fim das semanas 8 e 12 | Thiago |
| GPTI e PSW | Tarefa, impedimento, aceite e horas | Reunião conjunta e repositório | Semanal | Bernardo e Walter |
| Usuários potenciais | O que o protótipo faz e que não é loja real | Demonstração | Uma vez, no M2, se autorizada | Jose Luka |

### 7.5 Monitoramento do engajamento

- Thiago revisa a matriz nas semanas 8, 11 e 12.
- Expectativa de loja pronta, pedido fora da EAP ou decisão atrasada vira risco ou questão no controle de mudanças.
- Toda demonstração externa destaca: dados fictícios, pagamento simulado e ausência de produção.

## 8. Controlar o cronograma, os recursos e os custos

Mudança de linha de base começa por pedido escrito: o que muda, em qual pacote e o efeito no escopo, no prazo e no custo. A equipe GPTI confere o pedido contra a EAP; o patrocinador aprova; as três linhas de base são atualizadas juntas.

- Cada aluno informa semanalmente horas realizadas, esforço restante, impedimentos e entrega concluída por ID de atividade.
- GPTI atualiza previsão de término, uso dos recursos e custo sombra nas semanas 9–11.
- Uma atividade só recebe crédito integral quando atende ao aceite do dicionário.
- Variação acima de 10%, risco de perda de marco ou previsão acima de 306 h exige ação corretiva.
- Contingência só é consumida contra risco registrado; reserva gerencial exige autorização do patrocinador.
- Confirmar com o Grupo 10 a divisão individual da seção 5.5 antes de aprovar esta linha de base.
