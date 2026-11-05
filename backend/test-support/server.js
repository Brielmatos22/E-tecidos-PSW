const { after } = require("node:test");
const app = require("../src/app");

let server;
let baseUrl;

async function startServer() {
  if (!server) {
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  }
  return baseUrl;
}

after(async () => {
  if (server) await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

module.exports = { startServer };
