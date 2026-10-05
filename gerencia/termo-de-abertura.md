# Termo de Abertura do Projeto

## E-tecidos — loja virtual de tecidos

| Campo | Informação |
|---|---|
| **Versão** | 1.0 |
| **Data** | 05/10/2026 |
| **Patrocinador** | Prof. Diogo Mendonça |
| **Gerência do projeto** | Equipe GPTI — Grupo J, em gestão compartilhada: Bernardo Monteiro Rodrigues Lima, Jose Luka de Miranda Goncalves e Thiago Athanasio Barreto da Rocha Petitinga. A equipe presta contas do plano ao patrocinador. |
| **Equipe de produto** | PSW — Grupo 10: Lorenzo Silva da Torre, Gabriel de Matos Peixoto da Conceicao e Walter Henrique de Avila Goncalves |
| **Repositório** | [Brielmatos22/E-tecidos-PSW](https://github.com/Brielmatos22/E-tecidos-PSW) |
| **Duração estimada** | 3 meses (12 semanas letivas) |
| **Equipe prevista** | 6 alunos: 3 de PSW e 3 de GPTI; dedicação estimada de 5 horas semanais por pessoa |

## 1. Propósito e justificativa

Este termo autoriza um projeto acadêmico de desenvolvimento de um protótipo de loja virtual de tecidos, a E-tecidos. O cenário de referência, hipótese da equipe, é uma loja de pequeno porte que vende no balcão e por mensagens, com pedidos e clientes controlados em planilha e papel. O protótipo pretende demonstrar um canal digital com catálogo, carrinho, finalização de compra simulada e áreas separadas para cliente, fornecedor parceiro e administrador. A loja é fictícia; não há cliente real nem validação de mercado.

O projeto é também uma experiência de aprendizagem: os três alunos de PSW definem e desenvolvem o produto, e os três alunos de GPTI validam o escopo e conduzem a gestão. A equipe de PSW aplica **React e JavaScript no frontend**, hoje com Vite, React Router e Bootstrap, e **JavaScript, Express e MongoDB no backend** do marco final.

## 2. Objetivos do projeto

Os objetivos abaixo são do protótipo. Quem mede é a equipe GPTI, com ciência do patrocinador, nas demonstrações das semanas 8 e 12.

- Um cliente PF fictício consulta o catálogo, monta o carrinho, finaliza a compra simulada e a venda aparece no painel administrativo.
- Cada perfil só acessa o que lhe cabe: o cliente não abre o painel; o fornecedor consulta vendas e mantém só os próprios produtos; só o administrador gere contas.
- No marco 2, a senha não é guardada em texto puro e a permissão é verificada pela API, não apenas pela tela.
- A AV1, com caso de negócio, termo, plano e dicionário da EAP, é entregue na semana 8. O termo de encerramento e as lições aprendidas são aceitos na semana 12.

## 3. Escopo de alto nível

### Incluído

- Levantamento dos fluxos de cliente PF, fornecedor PJ e administrador.
- Frontend em React com catálogo, detalhe de produto, carrinho, login, cadastro e painel administrativo (vendas, produtos e contas PF e PJ).
- `json-server` como API simulada no marco 1.
- Backend em Express com MongoDB no marco 2, substituindo o `json-server`.
- Senhas com hash e autorização por perfil na API no marco 2.
- Finalização de compra simulada, que grava a venda.
- Testes dos fluxos prioritários, instruções de execução e demonstrações.

### Fora do escopo

- Pagamento real, gateway, Pix ou cartão, e emissão de nota fiscal.
- Cálculo real de frete e integração com transportadora.
- Controle de estoque físico.
- Publicação em produção, domínio e hospedagem paga.
- Uso de dados reais de clientes ou fornecedores.

## 4. Abordagem técnica e de aprendizagem

1. **Frontend:** React e JavaScript, consumindo o `json-server` no marco 1.
2. **Backend:** API Express com regras de acesso e persistência em MongoDB.
3. **Integração:** troca do `json-server` pela API própria, mantendo o mesmo contrato de dados, e testes dos fluxos completos.

Como a equipe está aprendendo as tecnologias, o plano reserva tempo para estudo, revisão de código e correção de defeitos. Funcionalidades secundárias podem ser reduzidas se o prazo apertar.

## 5. Marcos e entregas

| Marco | Prazo previsto | Entregáveis e critérios de aceite preliminares |
|---|---:|---|
| **M1 — Frontend completo com `json-server`** | Semana letiva 8: GPTI em 05/10/2026 e PSW em 06/10/2026 | Catálogo, carrinho, login, cadastro e painel administrativo funcionando sobre o `json-server`; perfis de acesso aplicados nas rotas; limitações do mock documentadas no README. Aceite registrado pela equipe GPTI com ciência do patrocinador. |
| **M2 — Sistema integrado ao backend próprio** | Semana letiva 12: PSW em 10/11/2026; aceite de GPTI em 30/11/2026 | Frontend ligado à API Express; dados no MongoDB; senha com hash; permissão verificada na API; finalização de compra grava a venda; testes, documentação e demonstração final. Aceite registrado pela equipe GPTI com ciência do patrocinador. |

As datas seguem o calendário letivo usado pela disciplina: aulas de GPTI às segundas e de PSW às terças, sem contar a aula prática extra de 28 e 29/09.

## 6. Requisitos de alto nível e critérios de sucesso

- O protótipo deve permitir demonstrar compra, gestão de produtos e gestão de contas com dados fictícios.
- No marco 2, o frontend não acessa o MongoDB diretamente; tudo passa pela API.
- O aceite de cada pacote está no [dicionário da EAP](dicionario-eap.md).
- O êxito é avaliado pela entrega dos marcos, pelos fluxos prioritários funcionando, pelo aceite interno da equipe GPTI e pelo aprendizado documentado.

### Critérios de encerramento e cancelamento

O projeto termina na semana 12, quando a equipe GPTI registra o aceite do M2, ou a lista do que não passou, e o patrocinador dá ciência.

O patrocinador pode cancelar ou encerrar antes do M2 se:

- a migração para Express/MongoDB não couber na reserva de desenvolvimento e ele não aprovar um corte de escopo;
- ele retirar a autorização;
- uma premissa essencial cair sem substituto no prazo, por exemplo a equipe ficar sem ambiente para executar o protótipo.

## 7. Premissas e restrições

### Premissas

- O patrocinador acompanha o projeto e recebe as demonstrações.
- Os participantes têm acesso ao repositório e ao ambiente de desenvolvimento.
- O escopo pode ser reduzido a um conjunto prioritário que caiba no prazo.
- Todos os dados são fictícios e criados pela equipe.

### Restrições

- Três meses e até 5 h semanais por participante.
- Equipe pequena: a ausência de uma pessoa reduz a capacidade em um terço do grupo.
- `json-server` é simulação; não é backend de produção. O próprio README do projeto registra que, nele, as senhas ficam sem hash e as permissões são só do frontend.
- Nenhum pagamento real, dado real ou publicação em produção é autorizado por este termo.

## 8. Governança e responsabilidades

### Stakeholders

| Stakeholder | Interesse ou responsabilidade | Participação nesta etapa |
|---|---|---|
| **Prof. Diogo Mendonça — patrocinador** | Acompanhar os marcos e decidir mudanças relevantes de escopo e prazo | Ativo: recebe as demonstrações e dá ciência dos aceites |
| **Equipe GPTI — Grupo J** | Planejar, acompanhar, validar o escopo e registrar decisões e aceites | Ativa: equipe de gestão |
| **Equipe PSW — Grupo 10** | Definir o escopo funcional e desenvolver o produto | Ativa: equipe de produto |
| **Clientes PF e PJ — usuários potenciais** | Comprar tecidos online | Representados por perfis fictícios; não consultados |
| **Fornecedores parceiros — usuários potenciais** | Acompanhar vendas e manter seus produtos | Representados por perfil fictício; não consultados |
| **Lojista — dono potencial do negócio** | Operar a loja e decidir investimento futuro | Não existe nesta etapa; hipótese para uma fase futura |

### Papéis e responsabilidades

| Papel | Responsabilidades principais | Designação |
|---|---|---|
| Patrocinador | Acompanhar demonstrações e decidir mudanças relevantes | Prof. Diogo Mendonça |
| Gerência do projeto (compartilhada) | Prestar contas do plano; conferir mudanças contra a EAP; coordenar a gestão | Bernardo, Jose Luka e Thiago (GPTI — Grupo J) |
| Equipe de produto | Propor o escopo funcional e implementar frontend, backend, testes e documentação | Lorenzo, Gabriel e Walter (PSW — Grupo 10) |

A gestão é compartilhada, mas cada pacote da EAP tem uma única pessoa que presta contas, conforme o dicionário. Mudanças relevantes são submetidas ao patrocinador.

## 9. Riscos iniciais e respostas

| Risco | Impacto potencial | Resposta inicial |
|---|---|---|
| Curva de aprendizagem de Express e MongoDB | Atraso do M2 | Estudo na semana 9, exemplos mínimos e revisão cruzada |
| Autenticação e autorização no servidor mais difíceis que o previsto | M2 sem segurança mínima | Priorizar hash de senha e checagem de permissão nas rotas de escrita |
| Contratos do `json-server` e da API divergirem | Retrabalho na integração | Manter um único exemplo de payload por coleção |
| Ausência de um integrante | Perda de um terço da capacidade do grupo | Tarefas pequenas, revisão cruzada e corte de escopo secundário |
| Pedidos fora do escopo (pagamento real, frete, estoque) | Atraso dos marcos | Registrar como trabalho futuro pelo controle de mudanças |
| Expectativa de loja pronta para vender | Uso de software não aprovado | Comunicar que é protótipo com dados fictícios |

## 10. Estimativa econômica e financiamento

Na iniciação, a ordem de grandeza foi **390 h** e **R$ 7.350,00** (faixa de −25% a +75%). O planejamento revisou para **R$ 6.170,61**: 270 h de atividades, 36 h de contingência e reserva gerencial de 7%. É 16,0% abaixo do ponto da iniciação, dentro da faixa. O detalhe está no [caso de negócio](business-case.md) e no [plano](plano-de-projeto.md). **Os alunos não são remunerados; o desembolso efetivo é R$ 0,00.**

| Marco e gatilho da parcela simulada | Prazo | Parcela simulada | Desembolso efetivo |
|---|---:|---:|---:|
| **M1** — após demonstração e aceite interno, com ciência do patrocinador | Semana 8 | **R$ 3.085,30 (50%)** | **R$ 0,00** |
| **M2** — após demonstração final e aceite interno, com ciência do patrocinador | Semana 12 | **R$ 3.085,31 (50%)** | **R$ 0,00** |
| **Total** | **3 meses** | **R$ 6.170,61 (100%)** | **R$ 0,00** |

O rateio de 50% por marco é convenção didática. Pelo calendário do plano, há 168 h até a semana 8 e 102 h nas semanas 9 a 12. Custos reais que surgirem precisam de autorização separada do patrocinador.

## 11. Autoridade e aprovação

A aprovação deste termo autoriza o planejamento detalhado e o desenvolvimento dentro das premissas acima. Não autoriza dados reais, pagamentos reais nem publicação em produção.

| Aprovação | Nome | Assinatura | Data |
|---|---|---|---|
| Patrocinador | Prof. Diogo Mendonça |  |  |
| Representante da equipe GPTI |  |  |  |
| Representante da equipe PSW |  |  |  |
