# Business Case — E-tecidos

**Versão:** 1.0 — iniciação; a seção 12.1 registra a revisão feita no planejamento  
**Data:** 05/10/2026  
**Patrocinador:** Prof. Diogo Mendonça  
**Equipe de gestão (GPTI — Grupo J):** Bernardo Monteiro Rodrigues Lima, Jose Luka de Miranda Goncalves, Thiago Athanasio Barreto da Rocha Petitinga  
**Equipe de produto (PSW — Grupo 10):** Lorenzo Silva da Torre, Gabriel de Matos Peixoto da Conceicao, Walter Henrique de Avila Goncalves

> A E-tecidos é uma loja **fictícia**, criada pela equipe de PSW como produto do projeto acadêmico. Não há cliente real. O problema, os números de venda e os benefícios abaixo são **hipóteses da equipe**, marcadas como tal, e devem ser revistos se o produto vier a ser usado por um negócio real.

## 1. Resumo executivo

Propõe-se desenvolver um protótipo acadêmico de loja virtual de tecidos, a E-tecidos, que permite ao cliente consultar o catálogo, montar um carrinho e finalizar uma compra simulada, e permite à administração e aos fornecedores parceiros gerir produtos, vendas e contas de clientes pessoa física (PF) e pessoa jurídica (PJ).

O cenário considerado é o de uma loja de tecidos de pequeno porte que hoje vende só no balcão e por mensagens (telefone e WhatsApp), com catálogo em fotos soltas e controle de pedidos e clientes em planilha e caderno. Esse modelo limita o alcance da loja, gera retrabalho no registro dos pedidos e dificulta saber o que foi vendido, para quem e por qual fornecedor.

Neste projeto, a primeira entrega usa `json-server` como API simulada, e a entrega final usa um backend próprio em Express com MongoDB. **Não há pagamento real, cálculo real de frete, emissão fiscal nem publicação em produção.** Os benefícios financeiros da seção 12 pressupõem uma implantação futura, fora deste projeto.

## 2. Problema e oportunidade

Hipótese da equipe sobre o processo atual de uma loja de tecidos de pequeno porte:

- O cliente precisa ir à loja ou pedir fotos e preços por mensagem, um a um.
- O pedido é anotado à mão ou em planilha e depois redigitado para separar, cobrar e entregar.
- Os fornecedores parceiros não têm visão própria das vendas dos seus produtos e dependem de relatório informal da loja.
- Clientes PF (consumidor final, costura) e PJ (lojas de decoração, confecções) são tratados no mesmo controle, sem distinção de cadastro.

A oportunidade é centralizar catálogo, pedido e cadastro em um canal digital, com perfis de acesso separados para cliente, fornecedor e administrador.

## 3. Objetivos

Estes são os objetivos da iniciativa. O protótipo de 12 semanas demonstra o caminho; os objetivos só se realizam em uma implantação futura, que não faz parte deste projeto. Os objetivos do protótipo estão no [termo de abertura](termo-de-abertura.md).

- Oferecer um catálogo online de tecidos com preço por metro e descrição.
- Permitir que o cliente monte o carrinho e registre o pedido sem intermediação manual.
- Dar ao fornecedor parceiro acesso às vendas e à manutenção dos seus próprios produtos.
- Dar à administração um painel de vendas, produtos e contas PF e PJ.
- Reduzir a redigitação de pedidos e os controles paralelos em papel e planilha.

## 4. Solução proposta

Uma aplicação web em React (Vite, React Router e Bootstrap), com três perfis de acesso:

| Perfil | O que faz |
|---|---|
| Cliente PF | Consulta o catálogo, usa o carrinho e finaliza a compra simulada. |
| Fornecedor PJ | Consulta as vendas e cria, edita e remove os próprios produtos. |
| Administrador | Consulta e gere vendas, produtos e contas PF e PJ. |

No primeiro marco, os dados vêm de um `json-server`. No marco final, o frontend passa a consumir uma API Express com persistência em MongoDB, e as senhas e permissões passam a ser verificadas no servidor. Pagamento e frete continuam simulados.

## 5. Escopo inicial

### Incluído

- Catálogo de tecidos e detalhe do produto.
- Carrinho: incluir, alterar quantidade, remover e limpar (exige login).
- Login, cadastro e perfis de acesso por permissão.
- Painel administrativo: vendas, produtos e contas PF e PJ.
- Finalização de compra simulada, que registra a venda.
- API simulada com `json-server` no marco 1; API Express com MongoDB no marco 2.

### Fora do escopo inicial

- Pagamento real (gateway, cartão, Pix) e emissão de nota fiscal.
- Cálculo real de frete e integração com transportadoras.
- Controle de estoque físico.
- Publicação em produção, domínio, hospedagem paga e uso de dados reais de clientes.

## 6. Benefícios esperados

- Canal de venda disponível fora do horário da loja e sem deslocamento do cliente.
- Menos redigitação de pedidos e menos erros de anotação.
- Fornecedor acompanha as próprias vendas sem depender de relatório manual.
- Cadastro organizado de clientes PF e PJ.
- Base para evoluções futuras: pagamento online, frete, estoque.

Os benefícios são expectativas a validar com dados de uso real, que este protótipo não produz.

## 7. Alternativas consideradas

1. **Manter o processo atual:** sem custo de desenvolvimento, mas mantém o alcance limitado e o controle manual.
2. **Usar uma plataforma pronta de loja virtual (SaaS):** coloca uma loja no ar rapidamente, mas tem mensalidade e taxas, e não atende ao objetivo de aprendizagem da disciplina de PSW. O acesso próprio do fornecedor parceiro também dependeria dos recursos da plataforma escolhida.
3. **Desenvolver o protótipo proposto:** exige esforço de desenvolvimento acadêmico e demonstra o fluxo completo com perfis próprios. Não substitui a decisão nem o investimento futuro para operar uma loja real.

A recomendação nesta etapa é desenvolver o protótipo.

## 8. Custos e recursos

Há uma estimativa econômica simulada de mão de obra na seção 12, relativa ao protótipo. Não é orçamento aprovado nem custo de uma loja em operação. Uma implantação futura deverá considerar, no mínimo: hospedagem e banco de dados, domínio, certificado, gateway de pagamento e suas taxas, integração de frete, segurança e LGPD, suporte e manutenção.

## 9. Riscos e dependências

| Risco ou dependência | Possível impacto | Ação inicial |
|---|---|---|
| Hipóteses de negócio sem validação com uma loja real | Funcionalidades pouco úteis num uso real | Registrar as regras como hipóteses do protótipo |
| Segurança fraca na versão com `json-server` (senhas sem hash, permissão só no frontend) | Exposição de dados se usado fora da demonstração | Usar só dados fictícios; mover autenticação e autorização para o servidor no marco 2 |
| Curva de aprendizagem de Express e MongoDB | Atraso no marco 2 | Reservar tempo de estudo e priorizar o fluxo essencial |
| Expectativa de loja pronta para vender | Uso prematuro de software não aprovado | Comunicar que a entrega é demonstrativa, sem pagamento real |
| Contratos do `json-server` divergirem da API Express | Retrabalho na integração | Manter um contrato único de payloads desde o marco 1 |

## 10. Indicadores de sucesso

Para uma implantação futura, com metas a definir depois de medir a situação atual:

- Percentual dos pedidos feitos pelo site.
- Tempo entre o pedido e a separação.
- Número de pedidos corrigidos ou refeitos.
- Vendas por fornecedor consultadas sem relatório manual.
- Satisfação de clientes e fornecedores.

## 11. Recomendação e próximos passos

Recomenda-se autorizar o protótipo acadêmico, com prazo de 12 semanas e a ordem de grandeza da seção 12. O projeto deve:

1. Detalhar os fluxos de cliente, fornecedor e administrador.
2. Definir o contrato de dados usado pelo `json-server` e pela futura API Express.
3. Entregar o frontend com dados simulados no marco 1.
4. Entregar o backend Express/MongoDB com autenticação no servidor no marco 2.
5. Registrar o que falta para uma operação real (pagamento, frete, estoque, segurança, hospedagem).

**Decisão solicitada:** autorizar o protótipo descrito neste caso, formalizado no termo de abertura. Investir em uma loja em operação é outra decisão, posterior.

## 12. Análise econômica preliminar (24 meses)

### 12.1 Premissas e referências

Esta é uma **simulação ilustrativa de iniciação**, em reais nominais, de 24 meses. O ponto usado nos indicadores é **390 h** e **R$ 7.350,00**. A faixa de ordem de grandeza é **−25% a +75%**: de 292,5 h a 682,5 h, ou de R$ 5.512,50 a R$ 12.862,50.

O planejamento, em [plano-de-projeto.md](plano-de-projeto.md), revisou o esforço para **306 h** na linha de base e o orçamento total para **R$ 6.170,61**, incluída a reserva gerencial. Isso é **21,5% menos horas** e **16,0% menos custo** que o ponto da iniciação, dentro da faixa de −25%. Os indicadores abaixo continuam o cenário de iniciação e não foram recalculados.

| Premissa | Valor adotado | Base e ressalvas |
|---|---:|---|
| Equipe de projeto | 6 alunos × 5 h/semana × 13 semanas | 390 h no total (65 h por aluno). Os alunos não são pagos; o valor é custo de oportunidade. |
| Taxa-sombra da hora | R$ 18,846/h | Mesma referência do exemplo da disciplina: bolsa média de estágio em TI de R$ 2.450/mês (Indeed, conforme consultado no exemplo do professor), normalizada para 30 h/semana. |
| Taxa de desconto | 13,75% ao ano | Mesma referência de Selic adotada no exemplo da disciplina. Equivale a cerca de 1,0794% ao mês. Não substitui uma taxa mínima de atratividade. |
| Lucro bruto por metro | R$ 81,67 | Média de (preço − custo por metro) dos três tecidos do protótipo (algodão, linho e trama). **Os custos por metro são fictícios**, segundo o próprio README do projeto. |
| Venda incremental pelo site | 10 metros/mês | **Hipótese da equipe**, sem base de mercado. A seção 12.6 mostra o efeito de 5 e de 20 metros/mês. |
| Início dos benefícios | Mês 7 | Pressupõe uma implantação real depois do protótipo, fora deste projeto. |

> Os valores de referência (bolsa de estágio e Selic) foram reaproveitados do exemplo da disciplina e não foram conferidos de novo pela equipe. Confirmar nas fontes antes de usar fora deste exercício.

### 12.2 Investimento estimado

$$
R\$\ 2.450 \div (30 \times 52/12) = R\$\ 18,846/\text{h}
$$

$$
6 \times 5\ \text{h/semana} \times 13\ \text{semanas} \times R\$\ 18,846/\text{h} = R\$\ 7.350,00
$$

O investimento é distribuído igualmente nos meses 1 a 3: **R$ 2.450,00 por mês**. A estimativa não inclui hospedagem, domínio, gateway de pagamento, taxas, segurança, suporte ou manutenção de uma loja em operação.

### 12.3 Benefícios estimados

**Lucro bruto incremental:** 10 metros/mês × R$ 81,67 = **R$ 816,67 por mês**, do mês 7 ao 24 (18 meses), ou **R$ 14.700,00** em 24 meses.

> **Distinção importante:** lucro bruto não é lucro líquido. A conta não desconta impostos, taxas de pagamento, frete, embalagem, hospedagem nem o custo de manter o site. Para uma decisão real, recalcular com esses custos.

**Benefícios não monetizados:** venda fora do horário da loja, menos redigitação de pedidos, visão própria para o fornecedor e cadastro organizado de clientes.

### 12.4 Fluxo de caixa-base

| Mês | Investimento | Benefício | Fluxo líquido |
|---|---:|---:|---:|
| 1, 2 e 3 (cada mês) | -R$ 2.450,00 | R$ 0,00 | -R$ 2.450,00 |
| 4 a 6 (cada mês) | R$ 0,00 | R$ 0,00 | R$ 0,00 |
| 7 a 24 (cada mês) | R$ 0,00 | R$ 816,67 | R$ 816,67 |
| **Total nominal em 24 meses** | **-R$ 7.350,00** | **R$ 14.700,00** | **R$ 7.350,00** |

### 12.5 Indicadores financeiros

| Indicador | Resultado-base | Interpretação |
|---|---:|---|
| VPL, à taxa mensal equivalente da Selic | **R$ 5.271,66** | Positivo no cenário-base. |
| TIR | **5,567% ao mês** (cerca de **91,57% ao ano**) | Acima da taxa de referência de 1,0794% ao mês. |
| ROI simples em 24 meses | **100,00%** | (benefícios − investimento) ÷ investimento, em valores nominais. |
| Payback simples | **Mês 15** | Mês em que o fluxo acumulado fica positivo. |
| Payback descontado | **Mês 16** | Com os fluxos trazidos a valor presente. |
| Índice benefício-custo | **1,733** | VP dos benefícios ÷ VP dos custos. |

$$
VPL = \sum_{t=1}^{24}\frac{FC_t}{(1+i_m)^t},\qquad i_m=(1+0,1375)^{1/12}-1 \approx 0,010794
$$

### 12.6 Sensibilidade e conclusão

O resultado depende quase todo da hipótese de venda incremental:

| Venda pelo site | Benefício mensal | VPL | TIR mensal | ROI 24 meses | Payback simples |
|---:|---:|---:|---:|---:|---:|
| 5 m/mês | R$ 408,33 | **-R$ 961,24** | 0,0% | 0% | só empata no mês 24 |
| **10 m/mês (base)** | **R$ 816,67** | **R$ 5.271,66** | **5,567%** | **100%** | **mês 15** |
| 20 m/mês | R$ 1.633,33 | R$ 17.737,47 | 12,202% | 300% | mês 11 |

Com 5 m/mês o VPL fica negativo; o projeto só se paga se o site vender, de fato, acima disso, e depois de descontados os custos de operação que a conta não inclui. Por isso, esses indicadores **não representam o retorno deste projeto acadêmico**: o protótipo não vende nada. Antes de qualquer investimento real, será preciso medir a demanda, orçar hospedagem, pagamento e manutenção, e refazer a conta.
