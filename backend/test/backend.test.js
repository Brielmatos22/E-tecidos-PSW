const assert = require("node:assert/strict");
const { test } = require("node:test");
const { startServer } = require("../test-support/server");

test("health endpoint responds without a database connection", async () => {
  const baseUrl = await startServer();
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("unknown routes return a JSON 404", async () => {
  const baseUrl = await startServer();
  const response = await fetch(`${baseUrl}/api/not-a-route`);
  assert.equal(response.status, 404);
  assert.equal((await response.json()).message, "Rota não encontrada.");
});

test("protected API routes reject requests without a JWT", async () => {
  const baseUrl = await startServer();
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
  const baseUrl = await startServer();
  const response = await fetch(`${baseUrl}/api/usuarios`);
  assert.equal(response.status, 404);
});
