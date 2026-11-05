const { z } = require("zod");

const requiredText = (field) =>
  z.string({ required_error: `O campo ${field} é obrigatório.` })
    .trim()
    .min(1, `O campo ${field} é obrigatório.`);

const email = z.string({ required_error: "O campo e-mail é obrigatório." })
  .trim()
  .email("Informe um e-mail válido.")
  .max(254, "Informe um e-mail válido.")
  .transform((value) => value.toLowerCase());

const strongPassword = z.string({ required_error: "O campo senha é obrigatório." })
  .min(1, "O campo senha é obrigatório.")
  .max(128, "Use 8 ou mais caracteres, uma letra maiúscula e um caractere especial.")
  .regex(
    /(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}/,
    "Use 8 ou mais caracteres, uma letra maiúscula e um caractere especial."
  );

const isoDate = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
  }, "Informe uma data válida.");

const cpf = requiredText("CPF").refine(
  (value) => /^\d{11}$/.test(value.replace(/\D/g, "")),
  "Informe um CPF com 11 dígitos."
);

const cnpj = requiredText("CNPJ").refine(
  (value) => /^\d{14}$/.test(value.replace(/\D/g, "")),
  "Informe um CNPJ com 14 dígitos."
);

const loginSchema = z.object({
  email,
  senha: z.string({ required_error: "Informe e-mail e senha." })
    .min(1, "Informe e-mail e senha."),
});

const registrationSchema = z.object({
  tipo: z.enum(["fisica", "juridica"], {
    errorMap: () => ({ message: "Tipo de cadastro inválido." }),
  }),
  email,
  senha: strongPassword,
  nome: z.string().trim().optional(),
  cpf: z.string().trim().optional(),
  nascimento: z.string().trim().optional(),
  data_nascimento: z.string().trim().optional(),
  endereco: z.string().trim().optional(),
  razaoSocial: z.string().trim().optional(),
  razao_social: z.string().trim().optional(),
  cnpj: z.string().trim().optional(),
  localizacao: z.string().trim().optional(),
  descricao: z.string().trim().optional(),
}).superRefine((data, context) => {
  const requireField = (value, field, message) => {
    if (!value) context.addIssue({ code: z.ZodIssueCode.custom, path: [field], message });
  };

  if (data.tipo === "fisica") {
    requireField(data.nome, "nome", "O campo nome é obrigatório.");
    requireField(data.cpf, "cpf", "O campo CPF é obrigatório.");
    requireField(data.nascimento || data.data_nascimento, "nascimento", "O campo data de nascimento é obrigatório.");
    requireField(data.endereco, "endereco", "O campo endereço é obrigatório.");

    if (data.cpf && !/^\d{11}$/.test(data.cpf.replace(/\D/g, ""))) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cpf"],
        message: "Informe um CPF com 11 dígitos.",
      });
    }

    const birthDate = data.nascimento || data.data_nascimento;
    if (birthDate && !isoDate.safeParse(birthDate).success) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nascimento"],
        message: "Informe uma data válida.",
      });
    }
  }

  if (data.tipo === "juridica") {
    requireField(data.razaoSocial || data.razao_social, "razaoSocial", "O campo nome da empresa é obrigatório.");
    requireField(data.cnpj, "cnpj", "O campo CNPJ é obrigatório.");
    requireField(data.localizacao, "localizacao", "O campo localização é obrigatório.");
    requireField(data.descricao, "descricao", "O campo descrição é obrigatório.");

    if (data.cnpj && !/^\d{14}$/.test(data.cnpj.replace(/\D/g, ""))) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cnpj"],
        message: "Informe um CNPJ com 14 dígitos.",
      });
    }
  }
});

const productFields = {
  titulo: requiredText("nome do produto"),
  resumo: requiredText("resumo"),
  detalhe: requiredText("descrição"),
  imagem: z.string().trim().url("Informe uma URL de imagem válida."),
  alt: requiredText("descrição acessível da imagem"),
  preco: z.number({ invalid_type_error: "O preço deve ser um número." }).finite().nonnegative(),
  custoPorMetro: z.number({ invalid_type_error: "O custo por metro deve ser um número." })
    .finite()
    .nonnegative()
    .optional(),
  fornecedorId: requiredText("fornecedor"),
};

const saleFields = {
  data: isoDate,
  cliente: requiredText("cliente"),
  tipo: z.enum(["fisica", "juridica"], { errorMap: () => ({ message: "Tipo de cliente inválido." }) }),
  produto: requiredText("produto"),
  metros: z.number({ invalid_type_error: "A quantidade de metros deve ser um número." }).finite().positive(),
  status: z.enum(["Pago", "Pendente", "Cancelado"], {
    errorMap: () => ({ message: "Status de venda inválido." }),
  }),
  pagamento: requiredText("pagamento"),
  valor: z.number({ invalid_type_error: "O valor deve ser um número." }).finite().nonnegative(),
  fornecedorId: requiredText("fornecedor"),
};

const physicalAccountFields = {
  nome: requiredText("nome"),
  cpf,
  nascimento: isoDate.optional(),
  email,
  endereco: z.string().trim().optional(),
  status: z.enum(["ativa", "suspensa"], { errorMap: () => ({ message: "Status de conta inválido." }) }),
  criadoEm: isoDate.optional(),
};

const legalAccountFields = {
  razaoSocial: requiredText("nome da empresa"),
  cnpj,
  email,
  localizacao: z.string().trim().optional(),
  descricao: z.string().trim().optional(),
  status: z.enum(["ativa", "suspensa"], { errorMap: () => ({ message: "Status de conta inválido." }) }),
  criadoEm: isoDate.optional(),
};

function collectionSchemas(fields) {
  const complete = z.object(fields);
  return {
    create: complete.extend({ id: requiredText("id") }),
    replace: complete,
    update: complete.partial().refine(
      (data) => Object.keys(data).length > 0,
      "Informe ao menos um campo para atualizar."
    ),
  };
}

const collectionSchemasByName = {
  produtos: collectionSchemas(productFields),
  vendas: collectionSchemas(saleFields),
  contasPessoaFisica: collectionSchemas(physicalAccountFields),
  contasPessoaJuridica: collectionSchemas(legalAccountFields),
};

const seedSchemas = {
  "produtosdb.json": z.array(z.object({ id: requiredText("id"), ...productFields })),
  "vendasdb.json": z.array(z.object({ id: requiredText("id"), ...saleFields })),
  "contasPessoasFisicasdb.json": z.array(z.object({ id: requiredText("id"), ...physicalAccountFields })),
  "contasPessoasJuridicasdb.json": z.array(z.object({ id: requiredText("id"), ...legalAccountFields })),
  "usuariosdb.json": z.array(z.object({
    id: requiredText("id"),
    nome: requiredText("nome"),
    email,
    senha: strongPassword,
    tipo: z.enum(["admin", "fisica", "juridica"]),
    contaId: z.string().nullable(),
    permissoes: z.array(z.string()),
  })),
};

module.exports = {
  loginSchema,
  registrationSchema,
  collectionSchemasByName,
  seedSchemas,
};
