const assert = require("node:assert/strict");
const { after, test } = require("node:test");
const app = require("../src/app");
const { hashPassword, comparePassword } = require("../src/utils/HashPassword");

let server;
let baseUrl;

async function startServer() {
  if (server) return;
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
}

after(async () => {
  if (server) await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

test("health endpoint responds without a database connection", async () => {
  await startServer();
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("unknown routes return a JSON 404", async () => {
  await startServer();
  const response = await fetch(`${baseUrl}/api/not-a-route`);
  assert.equal(response.status, 404);
  assert.equal((await response.json()).message, "Rota não encontrada.");
});

test("protected API routes reject requests without a JWT", async () => {
  await startServer();
  const response = await fetch(`${baseUrl}/api/vendas`);
  assert.equal(response.status, 401);
  assert.equal((await response.json()).message, "Autenticação necessária.");

  const protectedWrite = await fetch(`${baseUrl}/api/produtos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo: "Produto não autorizado" }),
  });
  assert.equal(protectedWrite.status, 401);
});

test("user credentials are never exposed through collection routes", async () => {
  await startServer();
  const response = await fetch(`${baseUrl}/api/usuarios`);
  assert.equal(response.status, 404);
});

test("registration validates account type before accessing the database", async () => {
  await startServer();
  const response = await fetch(`${baseUrl}/api/auth/cadastrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipo: "admin" }),
  });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).message, "Tipo de cadastro inválido.");
});

test("registration rejects invalid e-mail and weak passwords", async () => {
  await startServer();
  const invalidEmail = await fetch(`${baseUrl}/api/auth/cadastrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipo: "fisica", email: "inválido", senha: "Senha@123" }),
  });
  assert.equal(invalidEmail.status, 400);
  assert.equal((await invalidEmail.json()).message, "Informe um e-mail válido.");

  const weakPassword = await fetch(`${baseUrl}/api/auth/cadastrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipo: "fisica", email: "cliente@example.com", senha: "senhafraca" }),
  });
  assert.equal(weakPassword.status, 400);
  assert.match((await weakPassword.json()).message, /letra maiúscula/);
});

test("password hashes verify only the original password", async () => {
  const hash = await hashPassword("SenhaSegura@123");
  assert.notEqual(hash, "SenhaSegura@123");
  assert.equal(await comparePassword("SenhaSegura@123", hash), true);
  assert.equal(await comparePassword("senha-incorreta", hash), false);
  assert.equal(await comparePassword("qualquer", "malformed"), false);
});
