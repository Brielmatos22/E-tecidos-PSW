# Referência da API

A API HTTP do E-tecidos é servida pelo backend Express. Todas as rotas usam o prefixo `/api` e recebem e retornam JSON, salvo indicação em contrário.

## Endereço base

| Ambiente | URL base |
| --- | --- |
| Desenvolvimento local | `http://localhost:3000/api` (ou a porta configurada em `PORT`) |
| Docker Compose | `http://localhost:8080/api` |

Em desenvolvimento, o Vite encaminha `/api` ao backend. No Docker Compose, o Nginx do frontend encaminha `/api` ao serviço backend.

## Autenticação

As rotas protegidas recebem o JWT no cabeçalho:

```http
Authorization: Bearer <token>
```

O token é emitido no login ou cadastro, assinado com HS256 e válido por 8 horas. Em respostas autenticadas, quando falta no máximo 1 hora para a expiração, o backend pode emitir um novo token no cabeçalho `X-Access-Token`. O cliente deve substituir o token salvo pelo valor desse cabeçalho. A API expõe esse cabeçalho para clientes CORS.

A renovação é deslizante: ocorre apenas quando o usuário faz uma requisição autenticada durante a última hora de validade. Sem atividade por 8 horas, o token expira e o usuário precisa entrar novamente. Tokens expirados, sem expiração ou inválidos recebem `401`.

### Perfis e permissões

| Perfil | Permissões |
| --- | --- |
| `admin` | `vendas:read`, `vendas:write`, `produtos:write`, `contas:manage` |
| `juridica` | `vendas:read`, `produtos:write` |
| `fisica` | Nenhuma permissão administrativa |

O fornecedor `juridica` só consulta e altera produtos e vendas vinculados à própria conta. Ao criar ou substituir um produto ou venda, a API define `fornecedorId` a partir da sessão; no PATCH, o fornecedor informado no corpo é ignorado. O perfil `fisica` não pode consultar as rotas protegidas de vendas ou contas.

## Endpoints

### Saúde e estado do banco

| Método | Rota | Acesso | Resposta |
| --- | --- | --- | --- |
| `GET` | `/health` | Público | `200`, `{ "status": "ok" }` |
| `GET` | `/database` | Público | `200`, `{ "conectado": true, "status": "conectado" }` ou estado `desconectado` |

O endpoint `/database` informa a conectividade do MongoDB; uma falha de ping resulta em resposta `200` com `conectado: false`.

### Cadastro e login

| Método | Rota | Acesso | Sucesso |
| --- | --- | --- | --- |
| `POST` | `/auth/cadastrar` | Público | `201` |
| `POST` | `/auth/login` | Público | `200` |

Exemplo de login:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@e-tecidos.com.br",
  "senha": "Admin@123"
}
```

Resposta de login e cadastro:

```json
{
  "token": "<jwt>",
  "user": {
    "id": "USR-001",
    "nome": "Administrador",
    "email": "admin@e-tecidos.com.br",
    "tipo": "admin",
    "contaId": null,
    "permissoes": ["vendas:read", "vendas:write", "produtos:write", "contas:manage"]
  }
}
```

O campo `user` não inclui senha nem hash. O e-mail é removido de espaços nas extremidades e convertido para minúsculas.

#### Cadastro de pessoa física

`tipo`, `email` e `senha` são obrigatórios. A senha deve conter de 8 a 128 caracteres, pelo menos uma letra maiúscula e um caractere especial. Para `tipo: "fisica"`, também são obrigatórios `nome`, `cpf`, `nascimento` (ou `data_nascimento`) e `endereco`.

```json
{
  "tipo": "fisica",
  "email": "cliente@example.com",
  "senha": "SenhaForte@123",
  "nome": "Cliente",
  "cpf": "123.456.789-00",
  "nascimento": "1990-04-12",
  "endereco": "Rua de teste"
}
```

#### Cadastro de pessoa jurídica

`tipo`, `email` e `senha` são obrigatórios. Para `tipo: "juridica"`, também são obrigatórios `razaoSocial` (ou `razao_social`), `cnpj`, `localizacao` e `descricao`.

```json
{
  "tipo": "juridica",
  "email": "empresa@example.com",
  "senha": "SenhaForte@123",
  "razaoSocial": "Tecidos Ltda",
  "cnpj": "12.345.678/0001-90",
  "localizacao": "São Paulo",
  "descricao": "Fornecedor de tecidos"
}
```

CPF e CNPJ aceitam pontuação, mas devem conter, respectivamente, 11 e 14 dígitos. As datas devem ser datas reais no formato `AAAA-MM-DD`.

### Produtos

As leituras são públicas; quando enviadas com token, as respostas são filtradas conforme o perfil. Escritas exigem `produtos:write`.

| Método | Rota | Acesso | Resultado |
| --- | --- | --- | --- |
| `GET` | `/produtos` | Público ou autenticado | Lista em ordem crescente de `id` |
| `GET` | `/produtos/:id` | Público ou autenticado | Produto ou `404` |
| `POST` | `/produtos` | `produtos:write` | Cria e retorna o produto (`200`) |
| `PUT` | `/produtos/:id` | `produtos:write` | Substitui todos os campos (`200`) |
| `PATCH` | `/produtos/:id` | `produtos:write` | Atualiza os campos enviados (`200`) |
| `DELETE` | `/produtos/:id` | `produtos:write` | Exclui e retorna o produto excluído (`200`) |

Campos:

| Campo | Tipo | Obrigatório no POST/PUT | Regras |
| --- | --- | --- | --- |
| `id` | string | POST: sim; PUT/PATCH: não | No PUT/PATCH, o ID vem da URL |
| `titulo` | string | Sim | Não pode ser vazio |
| `resumo` | string | Sim | Não pode ser vazio |
| `detalhe` | string | Sim | Não pode ser vazio |
| `imagem` | string | Sim | URL válida |
| `alt` | string | Sim | Texto alternativo não vazio |
| `preco` | number | Sim | Finito e maior ou igual a zero |
| `custoPorMetro` | number | Não | Finito e maior ou igual a zero |
| `fornecedorId` | string | Sim | Não pode ser vazio; no perfil `juridica`, a API usa a conta autenticada |

Exemplo de criação:

```json
{
  "id": "algodao-azul",
  "titulo": "Algodão azul",
  "resumo": "Tecido de algodão",
  "detalhe": "Tecido 100% algodão.",
  "imagem": "https://example.com/algodao.jpg",
  "alt": "Tecido azul",
  "preco": 25.5,
  "custoPorMetro": 12,
  "fornecedorId": "PJ-001"
}
```

### Vendas

Todas as rotas exigem autenticação e `vendas:read`. A escrita exige também `vendas:write` — disponível para administradores. O perfil `juridica` só pode ler as vendas da própria conta.

| Método | Rota | Permissão adicional | Resultado |
| --- | --- | --- | --- |
| `GET` | `/vendas` | — | Lista em ordem crescente de `id` |
| `GET` | `/vendas/:id` | — | Venda ou `404` |
| `POST` | `/vendas` | `vendas:write` | Cria e retorna a venda (`200`) |
| `PUT` | `/vendas/:id` | `vendas:write` | Substitui os campos da venda (`200`) |
| `PATCH` | `/vendas/:id` | `vendas:write` | Atualiza os campos enviados (`200`) |
| `DELETE` | `/vendas/:id` | `vendas:write` | Exclui e retorna a venda excluída (`200`) |

Campos do POST/PUT: `data` (data real `AAAA-MM-DD`), `cliente` (texto), `tipo` (`fisica` ou `juridica`), `produto` (ID do produto), `metros` (número finito maior que zero), `status` (`Pago`, `Pendente` ou `Cancelado`), `pagamento` (texto), `valor` (número finito não negativo) e `fornecedorId` (texto). O POST também exige `id`; no PUT/PATCH, o ID vem da URL.

### Contas

Todas as operações exigem autenticação e `contas:manage` (administrador).

| Método | Rota | Resultado |
| --- | --- | --- |
| `GET` | `/contasPessoaFisica` | Lista contas PF em ordem crescente de `id` |
| `GET` | `/contasPessoaFisica/:id` | Conta PF ou `404` |
| `POST` | `/contasPessoaFisica` | Cria conta PF (`200`); exige `id` |
| `PUT` | `/contasPessoaFisica/:id` | Substitui campos da conta PF (`200`) |
| `PATCH` | `/contasPessoaFisica/:id` | Atualiza campos enviados (`200`) |
| `DELETE` | `/contasPessoaFisica/:id` | Exclui e retorna a conta PF (`200`) |
| `GET` | `/contasPessoaJuridica` | Lista contas PJ em ordem crescente de `id` |
| `GET` | `/contasPessoaJuridica/:id` | Conta PJ ou `404` |
| `POST` | `/contasPessoaJuridica` | Cria conta PJ (`200`); exige `id` |
| `PUT` | `/contasPessoaJuridica/:id` | Substitui campos da conta PJ (`200`) |
| `PATCH` | `/contasPessoaJuridica/:id` | Atualiza campos enviados (`200`) |
| `DELETE` | `/contasPessoaJuridica/:id` | Exclui e retorna a conta PJ (`200`) |

Campos PF do POST/PUT: `nome` (texto), `cpf` (11 dígitos; pontuação aceita), `email` (e-mail válido), `status` (`ativa` ou `suspensa`), `nascimento` (data `AAAA-MM-DD`, opcional) e `endereco` (texto, opcional).

Campos PJ do POST/PUT: `razaoSocial` (texto), `cnpj` (14 dígitos; pontuação aceita), `email` (e-mail válido), `status` (`ativa` ou `suspensa`), `localizacao` (texto, opcional) e `descricao` (texto, opcional). Ambos aceitam `criadoEm` como data opcional no formato `AAAA-MM-DD`.

### Regras de escrita comuns

- `POST` exige todos os campos obrigatórios do recurso e `id`.
- `PUT` exige todos os campos obrigatórios do recurso; o `id` é determinado pela URL.
- `PATCH` exige ao menos um campo. Os campos enviados ainda precisam satisfazer o tipo e as regras definidos para o recurso.
- Campos desconhecidos são descartados pela validação. Para contas e vendas, os campos permitidos são os descritos acima.
- As rotas de produtos e vendas retornam `404` ao buscar, alterar ou excluir registro inexistente. Listagens sem resultados retornam `200` com `[]`.

## Erros

As respostas de erro são JSON. O formato mais comum é:

```json
{
  "message": "Mensagem do erro"
}
```

Erros de validação incluem também detalhes por campo:

```json
{
  "message": "Informe um e-mail válido.",
  "errors": [
    {
      "field": "email",
      "message": "Informe um e-mail válido."
    }
  ]
}
```

| Status | Significado |
| --- | --- |
| `400` | JSON ou campos inválidos |
| `401` | Falta autenticação, credenciais inválidas ou token inválido/expirado |
| `403` | Conta suspensa/indisponível ou permissão insuficiente |
| `404` | Rota ou registro não encontrado |
| `409` | Conflito com registro existente, como e-mail, CPF, CNPJ ou ID duplicado |
| `503` | Banco de dados indisponível ou transação MongoDB não suportada |
| `500` | Erro interno inesperado |

Erros comuns de autenticação:

```json
{ "message": "Autenticação necessária." }
```

```json
{ "message": "Você não tem permissão para esta operação." }
```

```json
{ "message": "A conta está suspensa ou indisponível." }
```

## Exemplos com cURL

Login (salve o token retornado):

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@e-tecidos.com.br","senha":"Admin@123"}'
```

Consulta autenticada; confira o cabeçalho `X-Access-Token` e atualize o token salvo se ele for retornado:

```bash
curl -i http://localhost:3000/api/vendas \
  -H "Authorization: Bearer <token>"
```

Criar produto:

```bash
curl -X POST http://localhost:3000/api/produtos \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"id":"algodao-azul","titulo":"Algodão azul","resumo":"Tecido de algodão","detalhe":"Tecido 100% algodão.","imagem":"https://example.com/algodao.jpg","alt":"Tecido azul","preco":25.5,"fornecedorId":"PJ-001"}'
```
