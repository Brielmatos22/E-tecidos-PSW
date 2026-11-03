# Correção da AV1 — GPTI — E-tecidos

Repositório: https://github.com/Brielmatos22/E-tecidos-PSW

Artefatos: `gerencia/business-case.md`, `gerencia/termo-de-abertura.md`, `gerencia/plano-de-projeto.md`, `gerencia/dicionario-eap.md`.

A nota é do Grupo J de GPTI e vale para cada aluno do grupo. Nesta etapa, a ausência de commit não zera ninguém. O nome na atividade do cronograma é o contrato da etapa seguinte. A especificação de referência é a loja já corrigida na AV1 de PSW: catálogo, carrinho, login, contas PF e PJ e painel, com `json-server` no marco 1 e Express no marco 2.

| Aluno | Nota |
| --- | ---: |
| Bernardo Monteiro Rodrigues Lima | 95 |
| Jose Luka de Miranda Goncalves | 95 |
| Thiago Athanasio Barreto da Rocha Petitinga | 95 |

## Parte comum — 95/100

| Parte | Nota |
| --- | ---: |
| Business case | 10/10 |
| Termo de abertura | 15/15 |
| Escopo e EAP | 15/15 |
| Cronograma com nomes | 23/25 |
| Custo, partes e riscos | 14/15 |
| Dicionário da EAP | 13/15 |
| Um projeto só | 5/5 |

### Business case — 10/10

O caso inclui catálogo, carrinho, perfis, painel e compra simulada, e diz na primeira página que não há pagamento real, frete real nem emissão fiscal. A seção 12 traz a análise de 24 meses sobre o ponto de iniciação de 390 h e R$ 7.350,00, com a frase de que os benefícios financeiros pressupõem uma implantação futura. O README de `gerencia/` repete que os indicadores são dessa implantação, e o protótipo é avaliado pela ordem de grandeza.

### Termo de abertura — 15/15

O termo nomeia o patrocinador, a equipe de gestão e a equipe de produto (Lorenzo, Gabriel e Walter), traz objetivos, marcos, premissas, riscos iniciais e a estimativa econômica. O dentro e o fora repetem o que o caso inclui e exclui.

### Escopo e EAP — 15/15

As regras de negócio foram levantadas do repositório do Grupo 10 em 05/10/2026. A declaração, a rastreabilidade e a EAP (1.4 frontend sobre `json-server`, 1.5 API Express, 1.6 frontend na API) são o mesmo recorte da loja.

### Cronograma com nomes — 23/25

A seção 5.5 põe Lorenzo na loja e compra, Gabriel no acesso e contas e Walter no painel e base, com a tarefa e as horas de cada semana. A seção 5.6 põe Bernardo, Jose Luka e Thiago em G01 a G10, com tarefa e horas. Caminho crítico e a folga de uma semana de G05 estão escritos.

Desconto:

- 2 pontos. O título da seção 5.5 é "Alocação semanal individual — PSW (proposta)", e o cabeçalho do plano diz que a divisão por aluno de PSW é proposta da gerência, a confirmar com o Grupo 10. A seção 8 lista essa confirmação como pendência antes de aprovar a linha de base. O nome está na célula, e o compromisso ainda não foi fechado com quem executa.

### Custo, partes e riscos — 14/15

Orçamento por composição, contingência ligada a evento e reserva gerencial separada. Os riscos RT01 a RT05 e RG01 a RG04 têm probabilidade, impacto em horas, mitigação, gatilho, contingência e responsável nominal (Walter, Gabriel, Lorenzo, Jose Luka, Bernardo, Thiago). Jose Luka anota o registro na reunião semanal.

Desconto:

- 1 ponto. Os nove riscos são ameaças. Não há uma oportunidade registrada com resposta.

### Dicionário da EAP — 13/15

O A de cada pacote é um nome: Bernardo em 1.1.1, Jose Luka em 1.1.2, Walter, Gabriel e Lorenzo nas folhas de produto, Thiago na verificação e no encerramento. O aceite é observável e é o da loja: frete de R$ 25,00 no carrinho, cliente PF que não abre `/admin`, fornecedor que vê só os produtos do seu `fornecedorId`, produtos e vendas que continuam depois de reiniciar a API.

Descontos:

- 1 ponto. A coluna R está escrita como "GPTI" ou "PSW" na maior parte dos pacotes, e o cronograma já tem a pessoa.
- 1 ponto. Em 1.4.9 e 1.6.5, a demonstração tem A Thiago e R "PSW", sem dizer quem, dos três, executa o roteiro.

### Um projeto só — 5/5

Caso, termo, plano e dicionário descrevem a mesma loja, com os mesmos códigos e as mesmas exclusões de pagamento real, frete real e estoque.

## O que esta nota deixa para a etapa seguinte

A seção 5.5 nomeia Lorenzo na loja, Gabriel no acesso e Walter no painel. A seção 5.6 nomeia Bernardo, Jose Luka e Thiago em G01 a G10. O plano chama a divisão de PSW de proposta a confirmar com o Grupo 10. A etapa seguinte cobra esses nomes, com essa ressalva.
