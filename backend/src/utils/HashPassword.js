const { promisify } = require("node:util");
const { randomBytes, scrypt: scryptCallback, timingSafeEqual } = require("node:crypto");

const scrypt = promisify(scryptCallback);

async function hashPassword(password) {
  const salt = randomBytes(16);
  const derivedKey = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${derivedKey.toString("hex")}`;
}

async function comparePassword(password, storedHash) {
  const [algorithm, saltHex, hashHex] = String(storedHash).split("$");
  if (
    algorithm !== "scrypt"
    || !/^[a-f0-9]{32}$/i.test(saltHex ?? "")
    || !/^[a-f0-9]{128}$/i.test(hashHex ?? "")
  ) return false;

  const expected = Buffer.from(hashHex, "hex");
  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

module.exports = { hashPassword, comparePassword };
